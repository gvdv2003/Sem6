import sys
import os
import chainlit as cl
from pydantic_ai.messages import ModelMessage

# Fix path to import modules from parent directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from agents.chatbot import chatbot_agent
from core.llm import get_model

@cl.on_chat_start
async def start():
    """
    Initialize the chat session and send a welcome message.
    Avatar is loaded automatically from public/avatars/piet-hein.jpg
    (Chainlit convention: /public/avatars/<author-name-lowercase-hyphenated>.<ext>)
    """
    # Initialize empty message history for conversation memory
    cl.user_session.set("message_history", [])
    
    welcome_msg = """
**Welkom**

Ik ben **Piet Hein**, admiraal van de West-Indische Compagnie. Mijn Zilvervloot is binnen, en nu sta ik klaar om jou te helpen navigeren door de woelige baren van jouw vragen.

Hoe kan ik je vandaag bijstaan?
    """
    await cl.Message(content=welcome_msg, author="Piet Hein").send()

@cl.on_message
async def main(message: cl.Message):
    """
    Execute the main chat loop for incoming messages.
    """
    user_input = message.content or ""
    
    # --- MAIN AGENT ---
    msg = cl.Message(content="", author="Piet Hein")
    
    async with cl.Step(name="Antwoord genereren...") as thinking_step:
        message_history: list[ModelMessage] = cl.user_session.get("message_history", [])
        
        response_text = ""
        async with chatbot_agent.run_stream(
            user_input,
            message_history=message_history
        ) as result:
            first_chunk = True
            async for chunk in result.stream_text(delta=True):
                if first_chunk:
                    thinking_step.output = "Antwoord verzonden."
                    await msg.send()
                    first_chunk = False
                
                response_text += chunk
                await msg.stream_token(chunk)
            
            # Update history
            cl.user_session.set("message_history", result.all_messages())

    msg.content = response_text
    await msg.update()
