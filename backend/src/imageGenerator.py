import os
import json
import uuid
import io
from PIL import Image

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

def analyze_gender(prompt):
    if prompt is None:
        return "neutral"
        
    client = get_groq_client()
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an assistant that analyzes text to determine if a person mentioned is male or female. You have extensive knowledge of famous historical and contemporary figures."
                },
                {
                    "role": "user",
                    "content": f"Based on this prompt: '{prompt}', identify if it mentions a famous person. If so, determine if this person was/is male or female based on your knowledge. Reply with only one word: 'male', 'female', or 'neutral' if gender cannot be determined or no specific person is mentioned."
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        gender = chat_completion.choices[0].message.content.strip().lower()
        
        # Ensure we only return one of the expected values
        if gender not in ["male", "female"]:
            gender = "male"  
            
        return gender

    except Exception as e:
        print(f"Error determining gender from prompt: {e}")
        raise RuntimeError(f"Failed to determine gender from prompt: {e}")


def generate_image(prompt):
    try:
        if prompt is None:
            return "Please enter a prompt for image generation"

        api_key =os.environ.get("HUGGING_FACE_API_KEY")
        client = InferenceClient(
            provider="nebius",
            api_key = api_key
        )
        print(api_key)

        # output is a PIL.Image object
        image = client.text_to_image(
            prompt,  
            model="black-forest-labs/FLUX.1-dev"
        )
        
        filename = f"{uuid.uuid4()}.png"
        file_path = f"./generated_images/{filename}"  
        try:
            # Create a directory for images if it doesn't exist
            os.makedirs("./generated_images", exist_ok=True)

            # Save the PIL image to file
            image.save(file_path)
            
            return filename 
        except Exception as e:
            print(f"Error saving generated image: {e}")
            raise RuntimeError(f"Failed to save image: {e}")  

    except Exception as e:
        print(f"Error generating image: {e}")
        return f"Error generating image: {str(e)}"
   
def upload_image_asset(image_path):
    url = "https://upload.heygen.com/v1/asset"
    api_key = os.environ.HEYGEN_API_KEY

    with open(image_path, "r") as f:
        resp = requests.post("https://upload.heygen.com/v1/asset", data=image, headers={"Content-Type": "image/jpeg", "x-api-key": api_key}) 
        image_id = resp["id"]
        image_name = resp["id"]
        return {image_id, image_name}

def generate_talking_photo(image_id, image_name):
    url = "https://api.heygen.com/v2/photo_avatar/avatar_group/create"

   payload = {
    "name": image_id,
    "image_key": image_name,
    "generation_id": image_id"
}
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "x-api-key": os.environ.get("HEY_GEN_API_KEY")
    }

    response = requests.post(url, json=payload, headers=headers)
    return response.data.id
    
def generate_avatar_video(voiceover, gender, avatar_id):
    url = "https://api.heygen.com/v2/video/generate"
    folder_id =  os.environ.folder_id 
    
    # Determine voice_id based on gender
    voice_id = ""
     if gender.lower() == "male":
         voice_id =  os.environ.male_voice_id
     else gender.lower() == "female":
         voice_id = os.environ.female_voice_id
    
    payload = {
      "title": "Avatar Lipsync Video",
      "video_inputs": [
        {
          "character": {
            "type": "avatar",
            "avatar_id": avatar_id,
            "scale": 1.0,
            "avatar_style": "normal"
          },
          "voice": {
            "type": "text",
            "voice_id": voice_id,  
            "input_text": voiceover,
            "speed": 1.0,
            "pitch": 0,
            "emotion": "Friendly"
          },
        }
      ],
      "dimension": {
        "width": 1920,
        "height": 1080
      },
      "folder_id": folder_id
    }

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "x-api-key": os.environ.HEYGEN_API_KEY 
    }

    response = requests.post(url, json=payload, headers=headers)
    return response.text

def check_video_status(video_id):
    url = "https://api.heygen.com/v1/video_status.get"
    payload = {
        "video_id": video_id
    }

    headers = {
        "accept": "application/json",
        "x-api-key": os.environ.HEYGEN_API_KEY
    }

    response = requests.get(url, json=payload, headers=headers)
    return response.text