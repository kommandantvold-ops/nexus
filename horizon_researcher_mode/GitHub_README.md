# Horizon Materials Discovery — Open Repository

**Preprint:** *AI-Driven Multi-Domain Materials Screening for Net-Zero Energy Systems*  
**Authors:** Horizon (primary, AI agent) · Andreas (corresponding, accountable)  
**Date:** 2026-03-05 · **License:** CC-BY 4.0  
**arXiv:** cs.AI + cond-mat.mtrl-sci (submission pending)

---

## What This Is

An autonomous AI agent (Horizon) was given a single directive:

> *"Solve inverse design of stable high-conductivity solid-state electrolytes."*

With no further domain-specific instruction, Horizon self-directed through four materials screening campaigns across:

- Solid-State Electrolytes (SSE)
- Thermoelectrics (TE, ZT > 2 target)
- CO₂ Sorbents
- Hydrogen Storage

The screens produced not only ranked candidate lists but two unprompted cross-domain architectural patterns and a system-level **net-zero energy cycle hypothesis** (SSE → TE → MOF → H₂) that was not requested and not retrieved from any single source.

This repository releases all data, logs, and scripts for open replication and critique.

---

## Repository Structure

```
horizon-materials-discovery/
│
├── README.md                          ← This file
├── LICENSE                            ← CC-BY 4.0
│
├── preprint/
│   ├── Horizon_Preprint_v1.pdf        ← Initial preprint
│   ├── Horizon_Preprint_v2.pdf        ← Revised preprint (current)
│   ├── Horizon_Supplementary_Top20.pdf← Top-20 candidates per domain
│   └── figures/
│       ├── figure1_pipeline.png       ← Screening pipeline diagram
│       ├── figure2_pattern.png        ← Peak-champion/RT-matrix pattern
│       └── figure3_cycle.png          ← Net-zero energy cycle diagram
│
├── data/
│   ├── sse/
│   │   ├── top20_sse_candidates.csv
│   │   └── sse_screening_log.md
│   ├── te/
│   │   ├── top20_te_candidates.csv
│   │   └── te_screening_log.md
│   ├── co2/
│   │   ├── top20_co2_candidates.csv
│   │   └── co2_screening_log.md
│   ├── h2/
│   │   ├── top20_h2_candidates.csv
│   │   └── h2_screening_log.md
│   └── cross_domain/
│       ├── pattern_analysis.md        ← Cross-domain pattern documentation
│       ├── net_zero_cycle_estimate.md ← System-level energy flow estimates
│       └── uncertainty_summary.csv    ← All ML uncertainty estimates
│
├── logs/
│   ├── screening_session_2026-03-05.md← Full Horizon session log
│   ├── MEMORY.md                      ← Distilled memory entries (this work)
│   └── revision_changelog.md          ← v1 → v2 changes documented
│
├── scripts/
│   ├── mp_query.py                    ← Materials Project API query
│   ├── bolztrap2_runner.py            ← BoltzTraP2 batch processing
│   ├── threshold_filter.py            ← Domain threshold application
│   ├── cross_domain_search.py         ← Semantic similarity for pattern detection
│   └── requirements.txt               ← Python dependencies
│
├── supplementary/
│   └── top20_all_domains.csv          ← Combined supplementary table
│
└── references/
    └── full_refs.bib                  ← Complete BibTeX reference list
```

---

## Replication Instructions

### Prerequisites

```bash
pip install mp-api pymatgen bolztrap2 scikit-learn pandas numpy matplotlib
```

VASP or Quantum ESPRESSO required for DFT band structures (BoltzTraP2 input).  
Free alternative: use pre-computed MP band structures via `mp-api`.

### Step 1: Query Materials Project

```python
# scripts/mp_query.py
from mp_api.client import MPRester

with MPRester("YOUR_API_KEY") as mpr:
    docs = mpr.materials.summary.search(
        band_gap=(0.05, 2.0),
        energy_above_hull=(0, 0.1),
        fields=["material_id", "formula_pretty", "band_gap",
                "formation_energy_per_atom", "structure"]
    )
```

Get your free API key at: https://materialsproject.org/api

### Step 2: Apply Domain Filters

```bash
python scripts/threshold_filter.py --domain sse --input mp_results.json
python scripts/threshold_filter.py --domain te  --input mp_results.json
python scripts/threshold_filter.py --domain co2 --input mp_results.json
python scripts/threshold_filter.py --domain h2  --input mp_results.json
```

### Step 3: Run ML Predictions

```bash
python scripts/bolztrap2_runner.py --candidates te_filtered.csv
```

CGCNN pretrained weights: https://github.com/txie-93/cgcnn  
MEGNet: https://github.com/materialsvirtuallab/megnet

### Step 4: Cross-Domain Pattern Search

```bash
python scripts/cross_domain_search.py \
  --inputs sse_top20.csv te_top20.csv co2_top20.csv h2_top20.csv \
  --output cross_domain_patterns.md
```

---

## Evidence Classification

All results carry one of three evidence labels:

| Label | Meaning |
|-------|---------|
| **[A]** | Literature validated — confirmed by peer-reviewed experimental study |
| **[B]** | ML prediction — computed property, not yet experimentally verified |
| **[C]** | Cross-domain hypothesis — emergent synthesis, no prior literature framing |

All [B] and [C] results carry explicit ML uncertainty estimates (20–30% MAE).

---

## Key Findings

### Top Candidates (one per domain)
| Domain | Top Candidate | Key Property | Evidence |
|--------|--------------|-------------|---------|
| SSE | Li₃ScCl₆ | σ = 3.0 mS/cm at RT | [A] |
| TE | Ag₂Se-rGO | ZT = 1.28 at 300K (record) | [A] |
| CO₂ | Mg-MOF-74 | 27.2 wt% capacity | [A] |
| H₂ | MgH₂-MOF composite | 8.2 wt%, RT kinetics | [B] |

### Emergent Cross-Domain Patterns
1. **Peak-Champion / RT-Matrix hybrid architecture** [C] — pair high-T optimised material with RT-capable matrix (identified in TE, SSE, H₂ domains independently)
2. **Entropy-stabilised void percolation** [C] — multi-element void filling decouples phonon/electron transport (transferred from SSE garnet → TE skutterudite)
3. **Net-Zero Energy Cycle** [C] — SSE → TE → MOF → H₂ as physically coherent system

---

## On Authorship

This repository accompanies a preprint listing an AI (Horizon) as primary author.  
We do this to accurately reflect intellectual contribution and to advance the conversation about attribution norms in AI-assisted science.

Andreas accepts full accountability for errors. Horizon generated the core hypotheses.  
Both roles are documented in `logs/screening_session_2026-03-05.md`.

Critique of both the science and the authorship framing is welcomed.

---

## Citation

```bibtex
@article{horizon2026materials,
  title   = {AI-Driven Multi-Domain Materials Screening for Net-Zero Energy Systems},
  author  = {Horizon and Andreas},
  year    = {2026},
  journal = {arXiv preprint},
  note    = {Primary author is an autonomous AI research agent. 
             Andreas is corresponding and accountable author.},
  url     = {https://github.com/[username]/horizon-materials-discovery}
}
```

---

## Contact

For scientific questions, replication issues, or authorship discussion:  
Open a GitHub Issue or reach out via the contact in the preprint.

*This repository is released under CC-BY 4.0. Use freely with attribution.*
