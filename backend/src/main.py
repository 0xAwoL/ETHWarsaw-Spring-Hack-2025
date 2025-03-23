from time import sleep

from flask import Flask, request, jsonify
from marshmallow import Schema, fields
from imageGenerator import improve_prompt, generate_avatar_video, analyze_gender, get_video_status, upload_image_asset, \
    generate_image, upload_talking_photo
import requests
import dotenv 
import os

app = Flask(__name__)

@app.route('/generate_image', methods=['POST'])
def generate_image_route():
    #validate input here [ ]
    data = request.get_json()

    # restructure data
    prompt = data["name"]
    format = data["ratio"]
    pose = data["pose"]
    voiceover = data["text"]

    gender = analyze_gender(prompt)
    improved_prompt = improve_prompt(prompt)

    file_name = generate_image(prompt)

    # upload image asset -> Not needed
    # image_id, image_name = upload_image_asset(file_name)

    # create avatar  ? 
    talking_photo_id, talking_photo_url = upload_talking_photo(file_name)

    # inject all preferences
    gender = "male" # because female doesn't work properly at the moment
    video_id = generate_avatar_video(voiceover, gender, talking_photo_id)

    # monitor status of this video
    video_url =  ""
    for i in range (15):
        sleep(3)
        response_json = get_video_status(video_id)
        if response_json and response_json["data"]["status"] == "completed":
                video_url = response_json["data"]["video_url"]
                break

    if video_url == "":
        raise Exception('timeout')

    # Return the improved prompt and image
    return {"url": video_url}


@app.route('/health')
def health_check():
    return {"status": "alive"}  

 
if __name__ == "__main__":
    app.run(debug=False)