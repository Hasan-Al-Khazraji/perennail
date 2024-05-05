from keras.models import load_model  # TensorFlow is required for Keras to work
from PIL import Image, ImageOps  # Install pillow instead of PIL
import numpy as np
import firebase_admin
from firebase_admin import credentials, storage, firestore
import json
import os
import google.generativeai as genai
import random

# Path to your service account key file
cred_path = 'serviceAccount.json'

# Initialize the app with a service account, granting admin privileges
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'perennail-data.appspot.com'
})

# Define function to recieve and parse image through trained model
def tim():

    # Download file from firebase server to sibling directory
    def download_file_from_firebase(bucket_filename, local_filename):
        bucket = storage.bucket()
        blob = bucket.blob(bucket_filename)

        # Download the file
        blob.download_to_filename(local_filename)
        print(f"Downloaded {bucket_filename} to {local_filename}")

    # Call function to overwrite and store desired image
    download_file_from_firebase('files/theImage.jpg', '../userInput/file.jpg') # need to change to theImage.jpg to get correct image  

    ########################################################## MODEL ##########################################################

    # Disable scientific notation for clarity
    np.set_printoptions(suppress=True)

    # Load the model
    model = load_model("keras_Model.h5", compile=False)

    # Load the labels
    class_names = open("labels.txt", "r").readlines()

    # Create the array of the right shape to feed into the keras model
    # The 'length' or number of images you can put into the array is
    # determined by the first position in the shape tuple, in this case 1
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)

    # Replace this with the path to your image
    image = Image.open("../userInput/file.jpg").convert("RGB")

    # resizing the image to be at least 224x224 and then cropping from the center
    size = (224, 224)
    image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)

    # turn the image into a numpy array
    image_array = np.asarray(image)

    # Normalize the image
    normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1

    # Load the image into the array
    data[0] = normalized_image_array

    # Predicts the model
    prediction = model.predict(data)
    index = np.argmax(prediction)
    class_name = class_names[index]
    confidence_score = prediction[0][index]

    # Print prediction and confidence score
    print("Class:", class_name[2:], end="")
    print("Confidence Score:", confidence_score)

    ########################################################## JSON ##########################################################
    
    # Check if data.json file exists to prevent errors
    if (os.path.exists("./data.json")):
        os.remove("data.json")

    # Store and format model data for plant illness
    illness = str(class_name[2:])
    illness = illness.replace("\n","")

    # Store model data for plant illness and confidence 
    data = {
    "Class": illness,
    "Confidence": str(confidence_score),
    }

    # Write model data to data.json file
    with open('data.json', 'w') as file:
        # convert into JSON:
        json.dump(data, file)

########################################################## GEMINI ##########################################################

    # Initialize API configuration files for Googles Gemini
    config = json.load(open("./config.json"))
    api_key: str = config["gemini"]["api_key"]

    # Configure Gemini options
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-pro")
    chat = model.start_chat(history=[])

    # Provide Gemini with trained model data
    print(str(data))
    modelData = str(data)
    # Instructions to recieve Gemini response
    instructions = "{I got this data from my ai model, wilt lily means wilting peace lily, yellow lily means my peace lily is yellowing, tips lily means my peace lily tips are turning brown, rot succ means my succulent plant is rotting, mildew succ means my succulent plant has mildew growing, yellow snake means my snake plant is yellowing, hole snake means my snake plant has holes and cuts, yellow tomato means my tomato leaves are yellowing, mold tomato means my tomato leaves are molding, blight tomato means my tomato leaves have blight, rot apple means my apple leaves are rotting, rust apple means my apple leaves are rusting please recommend how to help my plant"
    format = "Please tell me how confident you are in this condition using words not numbers (likely or highly likely if above or below 0.5 respectively), the condition itself in formal terms not just the ai models words, how i can be sure, and how to resolve the condition if possible. please also tell me the next steps on how to take care of this plant, in that order specifically"
    question = modelData + instructions + format

    # Gemini generates and stores response to string
    response = chat.send_message(question)
    response = str(f"{response.text}")
    print("\n")
    print(response)
    print("\n")

########################################################## WRITER ##########################################################
    
    # Initialize firestore API 
    db = firestore.client()
    messages = db.collection('messages')

    # Initialize characters to generate unique message ID
    alpha = "abcdefghijklmnopqrstuvwxyz"
    ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    nums = "0123456789"

    # Randomly generate message ID
    rand = random.choice(alpha) + random.choice(ALPHA) + random.choice(nums) + random.choice(nums)
    print(rand)

    # Send Gemini response to Firestore database
    messages.document(rand).set({
        'createdAt' : firestore.SERVER_TIMESTAMP,
        'text' : response
    })


########################################################## Listener ##########################################################

# Retrieve and print the current file size from Firebase Storage.
def check_file_size(file_path):
    bucket = storage.bucket()
    blob = bucket.blob(file_path)
    blob.reload()  # Load the latest metadata
    current_size = blob.size
    print(f"The current size of {file_path} is: {current_size} bytes")
    return current_size

# Monitor and react to changes in file size.
def monitor_file_size(file_path, last_known_size):
    current_size = check_file_size(file_path)
    if current_size != last_known_size:
        print(f"File size changed from {last_known_size} to {current_size}")
        tim() # Since image changed rerun image through model
    return current_size

# Read the last known size from a local file.
def read_last_known_size():
    try:
        with open('last_size.json', 'r') as f:
            return json.load(f).get('last_known_size', 0)
    except FileNotFoundError:
        return 0
    
# Write the last known size to a local file.
def write_last_known_size(size):
    with open('last_size.json', 'w') as f:
        json.dump({'last_known_size': size}, f)


########################################################## Invoke ##########################################################

def main():
    tim()

    while (True): 
        last_known_size = read_last_known_size()
        last_known_size = monitor_file_size("files/theImage.jpg", last_known_size)
        write_last_known_size(last_known_size)

if __name__ == '__main__':
    main()


########################################################## DANI TESTING ##########################################################

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
   
   # call writing function passing plumiResponse

