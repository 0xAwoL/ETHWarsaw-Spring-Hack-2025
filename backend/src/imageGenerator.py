import os
import json
import uuid

from groq import Groq  
from huggingface_hub import InferenceClient
            

# Initialize the Groq client
def get_groq_client(api_key=None):
    try:
        api_key = api_key or os.environ.get("GROQ_API_KEY")
        return Groq(api_key=api_key)
    except Exception as e:
        print(f"Error initializing Groq client: {e}")
        return None

def improve_prompt(prompt=None, api_key=None) -> str:
    if prompt is None:
        return "Please enter a prompt for image generation"
        
    # Get client
    client = get_groq_client(api_key)
    
    # Load image preferences from JSON file
    try:
        with open('./image_preference.json', 'r') as f:
            image_preferences = json.load(f)
    except Exception as e:
        # Throw an error if image preferences can't be loaded
        error_message = f"Failed to load image preferences: {e}"
        print(error_message)
        raise FileNotFoundError(error_message)
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert prompt engineer. Your task is to improve image generation prompts by making them more detailed, descriptive, and effective. Add specific details about style, lighting, composition, mood, and other relevant elements. Maintain the original intent but enhance clarity and specificity."
                },
                {
                    "role": "user",
                    "content": f"Please improve this image generation prompt while preserving its core intent. Original prompt: '{prompt}'. Make it more detailed and effective for image generation by adding specifics about visual style, composition, lighting, and other relevant details. Use these style preferences as a guide: {json.dumps(image_preferences, indent=2)}, return long string no newlines!"
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        return chat_completion.choices[0].message.content

    except Exception as e:
        print(f"Error improving prompt with Groq: {e}")
        raise RuntimeError(f"Failed to improve prompt: {e}")

def generate_image(prompt):
    try:
        if prompt is None:
            return "Please enter a prompt for image generation"

        api_key =os.environ.get("HUGGING_FACE_API_KEY")
        # api call 
        client = InferenceClient(
            provider="hf-inference",
            api_key = api_key
        )
        print(api_key)

        # output is a PIL.Image object
        image = client.text_to_image(
            prompt,  # Use the provided prompt instead of hardcoded text
            model="black-forest-labs/FLUX.1-dev"
        )
        
        try:
            # Create a directory for images if it doesn't exist
            os.makedirs("./generated_images", exist_ok=True)
            
            # Generate a unique filename using UUID
            filename = f"./generated_images/image_{uuid.uuid4()}.png"
            
            # Save the PIL image to file
            image.save(filename)
            
            # Return both the image object and the file path
            return {"image": image, "filepath": filename}
        except Exception as e:
            print(f"Error saving generated image: {e}")
            return {"image": image, "error": f"Failed to save image: {str(e)}"}
        

    except Exception as e:
        print(f"Error generating image: {e}")
        return f"Error generating image: {str(e)}"
    
    
    
    
    
    