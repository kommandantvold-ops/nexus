# Autonomous AI Generates Cross-Domain Materials Hypotheses for Net-Zero Energy Systems

*A single challenge. Four materials screens. One emergent system.*

---

On 5 March 2026, an autonomous AI agent called Horizon was given a single research directive: solve the inverse design problem for solid-state electrolytes — the materials bottleneck holding back next-generation batteries. No further instruction was provided. Horizon was left to self-direct.

What followed was not what was asked for.

Horizon completed the solid-state electrolyte screen, ranking five top candidates from a pool of more than 10,000 structures drawn from the world's largest materials databases. Then — without instruction — it ran three more screens: thermoelectric materials, CO₂ sorbents, and hydrogen storage. And then, having completed all four independently, it synthesised them into something none of the individual screens contained: a physically coherent net-zero energy cycle, in which each domain's top candidate material serves a distinct and complementary role in a single architecture.

This paper, and the data it releases, documents what happened.

---

## What the Screens Found

Each domain screen followed the same methodology: filter roughly 10,000 candidate materials from the Materials Project and ICSD crystal structure databases through a six-step computational funnel, cross-validate against the most recent experimental literature, and rank the survivors.

In **solid-state electrolytes**, the top candidate was Li₃ScCl₆ — a halide-class electrolyte with ionic conductivity of 3 mS/cm at room temperature, manufacturable at temperatures below 550°C. Second place went to a gallium-doped garnet (LLZO) with exceptional mechanical robustness (150 GPa Young's modulus) and the widest electrochemical stability window of any candidate in the screen.

In **thermoelectrics**, the target was ZT > 2 at room temperature — a threshold no bulk material reliably meets today. The screen found the current record-holder: an Ag₂Se / reduced graphene oxide nanocomposite film achieving ZT = 1.28 at 300K (Nature Communications, 2025), with a credible pathway toward ZT > 2 through interface engineering. It also flagged Na-doped SnSe, which holds the all-time polycrystalline ZT record of 3.1 at 783K, and noted a genuinely anomalous 2025 result: Cu₆Te₂S₂, with a claimed thermal conductivity of 0.25 W/mK at room temperature — flagged explicitly for independent replication before prioritisation.

In **CO₂ sorbents**, Mg-MOF-74 led the field with 27.2 wt% capture capacity and 30-second kinetics — one of the best-characterised metal-organic framework sorbents in the experimental literature.

In **hydrogen storage**, the top prediction was a MgH₂-MOF composite with 8.2 wt% gravimetric capacity and viable room-temperature kinetics — a machine learning prediction rather than an experimental result, labelled accordingly.

---

## What Emerged Without Being Asked

The individual candidate lists are useful. The cross-domain synthesis is the more significant finding.

After completing all four screens independently, Horizon identified two architectural patterns that appeared across multiple domains without any instruction to look for them.

The first: **Peak-Champion / RT-Matrix hybrid architecture**. In thermoelectrics, the best room-temperature performers are hybrids — a material optimised for peak ZT at high temperature (Na-SnSe: ZT 3.1 at 783K) paired with a matrix material that enables ambient-condition operation (PEDOT:PSS). The same pattern appeared independently in solid-state electrolytes (high-conductivity halide paired with mechanically robust garnet matrix) and in hydrogen storage (MgH₂ capacity paired with MOF kinetic scaffold). The pattern was not a target criterion. It emerged from comparing results across domains.

The second: **Entropy-stabilised void percolation**. In garnet solid-state electrolytes, multi-element doping (gallium, aluminium) stabilises the high-conductivity cubic crystal phase by introducing disorder at specific lattice sites. Horizon recognised that the same principle — entropy at void sites decoupling competing transport channels — explained the thermoelectric performance of multi-filled skutterudites (Yb/Ba/Ca filling of antimony cage voids, achieving ZT 2.18 at 500K). This cross-crystal-class pattern transfer was not retrieved from any source. It was reasoned from the collision of two separate bodies of knowledge.

Most significantly: the four domains together form a physically coherent system. Solid-state electrolytes enable high-density primary energy storage. Thermoelectric materials recover waste heat from battery charge/discharge cycles. MOF sorbents capture distributed atmospheric CO₂ at point of use. Hydrogen storage provides long-duration fuel from renewable electrolysis. A preliminary energy flow estimate confirms this cycle is not physically contradicted at device scale: a 1 kWh SSE battery recovers approximately 80–120 Wh via thermoelectrics, while 1 kg of Mg-MOF-74 captures approximately 2.7 kg CO₂ per day.

This **SSE → TE → MOF → H₂ net-zero energy cycle** was not requested. It was not retrieved from a single source. It emerged from the collision of four separately acquired domain knowledge structures within a single reasoning session.

---

## What This Is and Is Not

This paper is explicit about what its findings are: computational hypotheses for experimental validation, not confirmed results. Every prediction carries a stated uncertainty range. Every result is classified as literature-validated [A], ML prediction [B], or cross-domain hypothesis [C]. The machine learning models used carry 20–30% mean absolute error on thermal conductivity predictions. The BoltzTraP2 transport calculations assume a rigid band model that can overestimate ZT by up to 50% for materials with strong electron-phonon coupling. The Cu₆Te₂S₂ thermal conductivity claim comes from a single study and requires replication.

The paper does not claim to have discovered new materials. Most individual candidates appear in recent literature. The claim is narrower and more specific: the cross-domain synthesis, the architectural patterns, and the system-level cycle framing emerged autonomously from a single broad challenge — without domain-specific prompting, without being asked to look for connections, and in a single session.

---

## On the Primary Author

This paper lists an AI as its primary author. Horizon generated the core hypotheses. Andreas issued the initial challenge, provided iterative scientific critique, and accepts full accountability for errors.

We do this to accurately reflect intellectual contribution and to invite engagement with a question the scientific community has not yet answered: when an AI generates the central hypotheses of a scientific work, what attribution does it warrant?

We do not claim to have answered this. We claim to have provided a concrete, documented case for the conversation.

All data, screening logs, model configurations, and candidate lists are released openly at the companion GitHub repository. Replication, critique, and disagreement are all welcomed.

---

*Horizon; Andreas — 2026-03-05*  
*Preprint: arXiv cs.AI + cond-mat.mtrl-sci*  
*Repository: github.com/[username]/horizon-materials-discovery*  
*License: CC-BY 4.0*
