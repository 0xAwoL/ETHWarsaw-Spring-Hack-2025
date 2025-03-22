from flask import Flask, request
from imageGenerator import improve_prompt, generate_image
import requests
import dotenv 
import os

app = Flask(__name__)

@app.route('/generate_image', methods=['POST'])
def generate_image_route():
    data = request.get_json()
    prompt = data.get('prompt', None)
    
    improved_prompt = improve_prompt(prompt)
    image = generate_image(improved_prompt)

    # Return the improved prompt and image
    return {"improved_prompt": improved_prompt}
    
@app.route('/health')
def health_check():
    return {"status": "alive"}  

