import asyncio
import os
from dotenv import load_dotenv
from src.agents.chatbot import chatbot_agent

# Load .env variables
load_dotenv()

async def main():
    print("--- Piet Hein (Terminal Mode) ---")
    print("Type 'exit' om te stoppen.\n")

    while True:
        user_input = input("Gebruiker: ")
        if user_input.lower() in ["exit", "stop", "quit"]:
            print("Piet Hein: Tot ziens, maat!")
            break

        if not user_input.strip():
            continue

        # Run agent
        result = await chatbot_agent.run(user_input)
        print(f"Piet Hein: {result.output}\n")

if __name__ == "__main__":
    asyncio.run(main())