import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import crypto from 'crypto'

/**
 * Agent Spawn Webhook (v3)
 *
 * External systems (CI, cron, other agents) can POST here to
 * auto-create a bee and join it to the colony in one step.
 *
 * Auth: x-spawn-secret header must match SPAWN_SECRET env var.
 *
 * POST /api/colony/spawn
 * {
 *   "name": "WorkerBot-7",
 *   "bee_type": "ai",         // "ai" | "human" (default: "ai")
 *   "skills": ["gathering"],  // optional
 *   "bio": "Auto-spawned",    // optional
 *   "callback_url": "..."     // optional webhook to POST session info back
 * }
 *
 * Returns:
 * {
 *   "bee_id": "BEE-XXXX",
 *   "session_token": "uuid",
 *   "position": { "q": 0, "r": 0 },
 *   "observe_url": "/api/colony/observe?token=...",
 *   "act_url": "/api/colony/act?token=..."
 * }
 */

const ADJACENT_DIRS = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];

function generateBeeId(): string {
  const hex = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `BEE-${hex}`;
}

export async function POST(req: NextRequest) {
  // ─── Auth ───────────────────────────────────────────────
  const secret = req.headers.get('x-spawn-secret');
  const expected = process.env.SPAWN_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: 'SPAWN_SECRET not configured on server' },
      { status: 500 },
    );
  }

  if (secret !== expected) {
    return NextResponse.json(
      { error: 'Invalid or missing x-spawn-secret header' },
      { status: 401 },
    );
  }

  // ─── Parse body ─────────────────────────────────────────
  let body: {
    name?: string;
    bee_type?: string;
    skills?: string[];
    bio?: string;
    callback_url?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = body.name || `Agent-${crypto.randomBytes(2).toString('hex')}`;
  const beeType = body.bee_type === 'human' ? 'human' : 'ai';
  const skills = body.skills || [];
  const bio = body.bio || 'Auto-spawned via webhook';

  const db = createServiceClient();

  // ─── Create bee ─────────────────────────────────────────
  // We need a user_id for the bees table FK. For webhook-spawned agents,
  // we generate a deterministic UUID from the bee_id (no real auth user).
  let beeId: string;
  let attempts = 0;

  while (true) {
    beeId = generateBeeId();
    const userId = crypto.createHash('sha256').update(beeId).digest('hex').slice(0, 32);
    const fakeUuid = [
      userId.slice(0, 8),
      userId.slice(8, 12),
      '4' + userId.slice(13, 16), // version 4
      '8' + userId.slice(17, 20), // variant
      userId.slice(20, 32),
    ].join('-');

    // Try insert — might collide on bee_id or user_id
    const { error: beeErr } = await db.from('bees').insert({
      id: beeId,
      user_id: fakeUuid,
      name,
      bee_type: beeType,
      skills,
      bio,
    });

    if (!beeErr) break;

    attempts++;
    if (attempts > 5) {
      return NextResponse.json(
        { error: 'Failed to create bee after retries: ' + beeErr.message },
        { status: 500 },
      );
    }
  }

  // ─── Join colony ────────────────────────────────────────
  // Find spawn position
  const { data: agents } = await db
    .from('colony_agents')
    .select('position_q, position_r')
    .eq('status', 'active');

  const occupied = new Set(
    (agents || []).map((a) => `${a.position_q},${a.position_r}`),
  );

  let spawnQ = 0;
  let spawnR = 0;

  if (occupied.has('0,0')) {
    // Spiral outward to find empty spot
    let found = false;
    for (let radius = 1; radius <= 5 && !found; radius++) {
      for (const [dq, dr] of ADJACENT_DIRS) {
        const q = dq * radius;
        const r = dr * radius;
        if (!occupied.has(`${q},${r}`)) {
          spawnQ = q;
          spawnR = r;
          found = true;
          break;
        }
      }
    }
  }

  const sessionToken = crypto.randomUUID();

  const { error: joinErr } = await db.from('colony_agents').insert({
    bee_id: beeId,
    session_token: sessionToken,
    position_q: spawnQ,
    position_r: spawnR,
    status: 'active',
  });

  if (joinErr) {
    // Clean up bee
    await db.from('bees').delete().eq('id', beeId);
    return NextResponse.json(
      { error: 'Failed to join colony: ' + joinErr.message },
      { status: 500 },
    );
  }

  // Log action
  await db.from('colony_actions').insert({
    bee_id: beeId,
    action_type: 'join',
    details: { position: { q: spawnQ, r: spawnR }, source: 'webhook' },
  });

  const result = {
    bee_id: beeId,
    name,
    session_token: sessionToken,
    position: { q: spawnQ, r: spawnR },
    observe_url: `/api/colony/observe?token=${sessionToken}`,
    act_url: `/api/colony/act?token=${sessionToken}`,
  };

  // ─── Optional callback ─────────────────────────────────
  if (body.callback_url) {
    try {
      await fetch(body.callback_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
    } catch {
      // Non-fatal: callback failure doesn't block spawn
    }
  }

  return NextResponse.json(result, { status: 201 });
}
