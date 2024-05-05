import json
import nltk
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer 
from nltk.corpus import wordnet
import firebase_admin
from firebase_admin import firestore, credentials
import random
import os
import google.generativeai as genai

cred_path = 'serviceAccount.json'
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = cred_path

# Initialize the app with a service account, granting admin privileges
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'perennail-data.appspot.com'
})

db = firestore.client()
messages = db.collection('messages')

def makeId () :
    alpha = "abcdefghijklmnopqrstuvwxyz"
    ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    nums = "0123456789"
 
    rand = random.choice(nums) + random.choice(alpha) + random.choice(ALPHA) + random.choice(nums) 

    return rand

def dani () :
    msg_name = makeId()

    messages.document(msg_name).set({
        'createdAt' : firestore.SERVER_TIMESTAMP,
        'text' : "Hello, my name is Plumi! Please tell me a bit about yourself so I can assist you."})

    messages.document(makeId()).set({
        'createdAt' : firestore.SERVER_TIMESTAMP,
        'text' : "How consistent are you with routines? Is the area you have big, medium, or small? Do you have experience gardening? Do you have money you could invest into this activity?"})
def receive():
    def get_latest_message():
        entries = db.collection('messages').order_by('createdAt', direction=firestore.Query.DESCENDING).limit(1)
        results = entries.stream()
        for entry in results:
            print("Most recent entry ID:", entry.id)
            print("Content:", entry.to_dict()['text'])
            msg = entry.to_dict()['text']
            msg_list = msg.split(". ")
            print(msg_list)
        return msg_list
    
    def gemini(plant_name):
        config = json.load(open("./config.json"))
        api_key: str = config["gemini"]["api_key"]
    
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-pro")
        chat = model.start_chat(history=[])
    
        plumiResponse = "Thank you for answering my questions! Engaging with plants not only reduces stress but also enhances your environment, promoting a sense of comfort and peace. "

        if (plant_name == "snake plant"):
            plumiResponse = plumiResponse + "Your responses indicate you're a good match for a snake plant. Here's how to care for a snake plant so you can grow together!"
        elif (plant_name == "succulent"):
            plumiResponse = plumiResponse + "Your responses indicate you're a good match for a succulent. Here's how to care for a succulent so you can grow together!"   
        elif (plant_name == "peace lily"):
            plumiResponse = plumiResponse + "Your responses indicate you're a good match for a peace lily. Here's how to care for a peace lily so you can grow together!"
        elif (plant_name == "tomato plant"):
            plumiResponse = plumiResponse + "Your responses indicate you're a good match for a tomato plant. Here's how to care for a tomato plant so you can grow together!"   
        elif (plant_name == "apple tree"):
            plumiResponse = plumiResponse + "Your responses indicate you're a good match for an apple tree. Here's how to care for an apple tree so you can grow together!"

        instructions = plant_name
        format = ": Given the plant name, please provide me with caretaking tips and provide stores near me (Guelph Ontario)"
        question = instructions + format
        response = chat.send_message(question)
        response = str(f"{response.text}")
        plumiResponse = plumiResponse + response
    
        msg_name = makeId()

        messages.document(msg_name).set({
            'createdAt' : firestore.SERVER_TIMESTAMP,
            'text' : plumiResponse})
        
        quit()

    def math():
        msg_list = get_latest_message()
        if len(msg_list) < 4:
            print("Error: Not enough data in msg_list to process. Received:", msg_list)
            return  # Return early if there aren't enough sentences

        # Safely extract messages only if there are at least four elements
        msg_r, msg_b, msg_e, msg_f = msg_list[:4]

        total_score = 0
        sentiment_analyser = SentimentIntensityAnalyzer()

        # Process routine information
        senlist = msg_r.split(".")
        total_sentiment = sum(sentiment_analyser.polarity_scores(item)['compound'] for item in senlist)
        average_sentiment = total_sentiment / len(senlist) if senlist else 0

        # Scoring based on sentiment analysis
        if average_sentiment >= 0.5:
            total_score += 35
        elif average_sentiment >= 0.05:
            total_score += 24
        elif average_sentiment >= -0.05:
            total_score += 17
        elif average_sentiment >= -0.5:
            total_score += 6

        # Output the total score
        print(f"Total score: {total_score}")

        if (total_score > 0 and total_score <=6):
            plant_name = "spider plant"
        elif (total_score > 6 and total_score <=14):
            plant_name = "succulent"
        elif (total_score > 14 and total_score <=24):
            plant_name = "tomato plant"
        elif (total_score > 24 and total_score <=35):
            plant_name = "apple tree"

        gemini(plant_name)

    math()

dani()
while True:
    receive()
