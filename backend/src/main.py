from flask import Flask, request, jsonify
from marshmallow import Schema, fields
from imageGenerator import improve_prompt, generate_image
import requests
import dotenv 
import os

app = Flask(__name__)

@app.route('/generate_image', methods=['POST'])
def generate_image_route():
    #validate input here [ ]

    data = request.get_json()

    # restructure data
    prompt = data.prompt    
    format = data.preferences.format
    pose = data.preferences.pose
    voiceover = data.preferences.voiceover

    gender = analyze_gender(prompt)
    improved_prompt = improve_prompt(prompt, gender)

    talking_photo = generate_talking_photo(image)

    # upload image asset
    image_id = upload_avatar_image(file_name)

    # create avatar  ? 
    
    # inject all preferences
    video_id = generate_avatar_video(voiceover, avatar_id, gender)

    # monitor status of this video
    video_url =  
    for i in range (10):
        r = check_video_status(video_id)
        sleep(3)
        if r:
            if r.get("status") == "completed":
                video_url = r.get("video_url")
                break  

    # Return the improved prompt and image
    return {"video_url": video_url}
    
@app.route('/health')
def health_check():
    return {"status": "alive"}  

 
if __name__ == "__main__":
    app.run(debug=True)