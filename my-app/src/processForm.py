from flask import Flask, request, render_template 
import json
import os
import nltk
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer 
from nltk.corpus import wordnet

print(os.getcwd())

os.chdir("./OneDrive/Documents/Uni/Guelph/Hackathon/perennail")

total_score = 0

f = open("form_data.json", "r")

data = json.load(f)

f.close()

#35%
r_info = data["routine"]
#36%
b_info = data["backyard"]
#15%
ex_info = data["exp"]
#14%
f_info = data["funds"]


#routine processing 

sentimentAnalyser = SentimentIntensityAnalyzer()

senlist = r_info.split(".")

totalsentiment = 0

for item in senlist: 
    score = sentimentAnalyser.polarity_scores(item)
    comp = score['compound']
    totalsentiment = totalsentiment + comp

average = totalsentiment / len(senlist)

if average >= 0.5:
    #very positive
    total_score += 35
elif average >= 0.05:
    #positive
    total_score += 24
elif average >= -0.05:
    #neutral
    total_score += 17
elif average >= -0.5:
    #negative
    total_score += 6

#very negative scores don't get any points added

#backyard processing 

space = 0
light = 0

listw = b_info.split()

tagged_words = nltk.pos_tag(listw)

for item in tagged_words:

    tag = item[1]

    if "JJ" in tag:
        
        adj = item[0]

        if (adj == "large"):

            space = 1

        elif (adj == "sunny"):

            light = 1

        syns = wordnet.synonyms(adj)

        for list in syns:
             
            for word in list:
            
                if word == "large" and space != 1:

                    space = 1
                
                if word == "sunny" and light != 1:

                    light = 1

total_score = total_score + (16 * space) + (16 * light)

#ex_info processing 

ex_info_l = ex_info.lower()

if "yes" in ex_info_l:
    total_score += 15
if "no" in ex_info_l:
    total_score += 5

#f_info processing

f_info_l = f_info.lower()

if "yes" in f_info_l:
    total_score += 16
elif "no" in f_info_l:
    total_score += 8

plant_name = ""

if total_score > 80 and total_score <= 100:
    plant_name = "apple tree"
elif total_score > 60 and total_score <= 80:
    plant_name = "tomato plant"
elif total_score > 40 and total_score <= 60:
    plant_name = "peace lily"
elif total_score > 20 and total_score <= 40:
    plant_name = "succulent"
elif total_score >= 0 and total_score <= 20:
    plant_name = "snake plant"

dict_plant = {'plant_suggest' : plant_name}

with open('form.json', 'w') as file:

    json.dump(dict_plant, file)