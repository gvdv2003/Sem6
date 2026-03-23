# LLM Verantwoording
## Onderbouwing
Vergeleken modellen, beide in de 'Most attractive quadrant' van Intelligence vs. Cost to Run Artificial Analysis Intelligence Index (https://artificialanalysis.ai/):
- xiaomi/mimo-v2-flash
    - PROS: Hoge intelligentie, goedkoop
    - CONS: Hogere latency (Avg. 0.7s), non-EU provider, hoge verbosity
- openai/gpt-oss-120b
    - PROS: Snel (Avg. 0.4s), goedkoop
    - CONS: Lagere intelligentie dan mimo-v2-flash, hoge verbosity

In productie-setting wordt een Mistral LLM aangeraden, omdat dit model EU-gebaseerd is en een goede balans biedt tussen intelligentie en kosten. We kiezen voor mimo-v2-flash om de kwaliteit van de triage te waarborgen in de proof of concept aangezien dit een aanzienlijk hogere intelligentie heeft en binnen ons budget past.

