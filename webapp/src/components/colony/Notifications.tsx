"use client";

import { useState, useCallback, useEffect } from "react";

export interface Notification {
  id: number;
  text: string;
  color?: string;
}

let nextId = 0;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((text: string, color?: string) => {
    const id = nextId++;
    setNotifications((prev) => [...prev, { id, text, color }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 2000);
  }, []);

  return { notifications, addNotification };
}

export function NotificationOverlay({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 gap-2">
      {notifications.map((n) => (
        <FloatingText key={n.id} text={n.text} color={n.color} />
      ))}
    </div>
  );
}

function FloatingText({ text, color }: { text: string; color?: string }) {
  const [opacity, setOpacity] = useState(1);
  const [y, setY] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      setY(-elapsed * 0.03);
      setOpacity(Math.max(0, 1 - elapsed / 2000));
      if (elapsed < 2000) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="text-lg font-bold drop-shadow-lg"
      style={{
        color: color || "#FFD700",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {text}
    </div>
  );
}
