# LLM Verantwoording

## Architectuur

Het systeem maakt gebruik van twee verschillende LLM's, elk geoptimaliseerd voor een specifieke taak:

| Taak | Model | Reden |
|---|---|---|
| **Triage** | xiaomi/mimo-v2-flash | Hoge intelligentie, lage kosten; ideaal voor classificatie en routering |
| **Historische chatbot** | deepseek/deepseek-v3-0324 | Sterke roleplay-adherentie, natuurlijk Nederlands, rijke narratieve generatie tegen lage kosten |

## Onderbouwing Triage-model

Vergeleken modellen, beide in de 'Most Attractive Quadrant' van de Intelligence vs. Cost to Run Artificial Analysis Intelligence Index (https://artificialanalysis.ai/):

- **xiaomi/mimo-v2-flash**
    - PROS: Hoge intelligentie, goedkoop
    - CONS: Hogere latency (Avg. 0.7s), non-EU provider, hoge verbosity
- **openai/gpt-oss-120b**
    - PROS: Snel (Avg. 0.4s), goedkoop
    - CONS: Lagere intelligentie dan mimo-v2-flash, hoge verbosity

We kiezen voor mimo-v2-flash om de kwaliteit van de triage te waarborgen in de proof of concept, aangezien dit model een aanzienlijk hogere intelligentie heeft en binnen ons budget past.

In een productie-setting wordt een Mistral LLM aangeraden, omdat dit model EU-gebaseerd is en een goede balans biedt tussen intelligentie en kosten.

## Onderbouwing Chatbot-model

Het chatbot-model moet voldoen aan eisen die fundamenteel anders zijn dan triage:
- Aanhouden van een complex historisch persona over meerdere beurten
- Natuurlijk, vloeiend Nederlands met periodetypisch taalgebruik
- Rijke, narratieve antwoorden die educatief en immersief zijn
- Strikte naleving van een uitgebreide system prompt (~2.500 tokens)

Vergeleken modellen:

- **xiaomi/mimo-v2-flash**
    - Getest als chatbot-model. Resultaat: te vermijdend, te kort, niet in staat om het persona consistent vast te houden. Ongeschikt voor deze taak.
- **xiaomi/mimo-v2-pro**
    - Uitstekende kwaliteit: rijke vertelstijl, sterke persona-adherentie, natuurlijk Nederlands. Te duur voor structureel gebruik.
- **deepseek/deepseek-v3-0324**
    - Vergelijkbare kwaliteit als mimo-v2-pro: authentieke, emotioneel geladen antwoorden, sterk persona-behoud, natuurlijk Nederlands. Aanzienlijk goedkoper (~$0.27/1M input tokens, ~$1.10/1M output tokens). Gekozen als chatbot-model.

**Opmerking:** DeepSeek is een non-EU provider (China). In een productie-setting dient een DPIA te worden uitgevoerd en moet worden beoordeeld of de verwerkte gegevens persoonsgegevens bevatten. Voor de proof of concept is dit risico aanvaardbaar aangezien er geen echte persoonsgegevens worden verwerkt.