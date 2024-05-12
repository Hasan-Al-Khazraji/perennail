# Welcome to [PerennAI.l](https://drive.google.com/file/d/1Ql_9tgLplD0mfIDXz2Jc5YI31Y0Gt1jQ/view?usp=drive_link) 🌱!
A **GDSC Hacks** Project By:
Hasan Al-Khazraji
Timothy Khan
Daniela Ramirez

## Inspiration 💡
During COVID, all 3 of our team members had plants in their rooms that slowly withered away over time as our mental health declined during quarantine. **PerennAI.L** aims to solve this problem and allow you to not only keep your plants healthy but your mental at the same time!

## What it does 🧐

**PerennAI.L** is a web application that has 2 modes. The first mode takes a **picture** of your plant as input, then it **diagnoses** it, and provides you with tips on how to keep it healthy, whilst also fitting your routine and schedule. The secondary mode asks you **general questions** about your daily life and mental health and **pairs you with a specific plant** that suits your needs and allows you to flourish together. This is done by chatting with our mascot ***Plumi!***

## How we built it 🔨

This application was built on several technologies. Starting with the front end we utilized **React** and **Tailwind CSS**. Combining these two technologies together we were able to build a stunning website, that is both accessible and interesting. After that, we built our back-end processes using **Flask API** and **Python**. This allowed us to process the user input and then delve further into our backend by using AI. The AI technologies we used were **Tensorflow**, **Google's Teachable Machine**, as well as **Gemini** in order to process user input and provide a comprehensive and reasonable answer to the user's questions and preferences. We then wrapped the whole project together using **Node.JS** and allowed for user interface. Finally, we used **Google's Firebase** in order to store the pictures uploaded, authenticate the user using **Google's Ouath 2.0**, and store the messages for POST and GET requests.

## Challenges we ran into ✋

There were many problems we ran into so we'll highlight the main 3. The first was finding the *"right"* data to train our model. With limited time we obviously could not download thousands of pictures to train our model so we had to be selective and smart with our choices. We overcame this goal by sitting down as a team, and going through hundreds of potential data to train our model on. The next problem we ran into was interfacing the frontend and back-end. We started by purely using Firebase but that did not work entirely as it was way to slow. Then we introduced Flask API to act as an intermediary step, which made it much more responsive and quicker. The last problem we ran into was going through documentation as this was our first hackathon. We are used to going through documentation, but not at a rate of a hackathon. Additionally, python support in Firebase was not fantastic, but this issue was simply solved with time.

## Accomplishments that we're proud of 🏅

There are many accomplishments we are proud of. First is our responsive and clean UI. Although we encountered difficulties, we finished with a result we were proud of. The next accomplishment we were proud of, was our ability to adapt to any and all problems that occurred allowing us to achieve all our goals at the end.

## What we learned 📚

We learned so much throughout this whole process. From technologies such as React, Tailwind CSS, Tensorflow, Google's Teachable Machine, and Firebase. But the most **important** thing we learned is how to **work effectively in a team**, with new people, and in such a short amount of time.

## What's next for PerennAIl ⏭

Future developments of **PerennAI.L** include further user login features. Such features include the ability to store past plant treatment data as well as provide follow up feedback to the model regarding plant treatment. This would allow the model to learn and better assist users. Furthermore, a useful feature would be an open forum where users could communicate with plant owners alike to share experiences and provide further feedback. Overall, there is much which could be done to expand and improve the user experience. Still, the program is overall complete and functional in matching users to a plant as well as assissting them in its caretaking.


## Built With 👷‍♂️👷‍♀️

- Javascript
- Python
- React
- Tailwind
- FlaskAPI
- Tensorflow and Keras
- Python NLTK
- Google Cloud
- Gemini
- Google's Teachable Machine
- Google Auth
- Firebase
- Firestore
- HTML
- CSS

## Links

- [**Demo**](https://drive.google.com/file/d/1Ql_9tgLplD0mfIDXz2Jc5YI31Y0Gt1jQ/view?usp=drive_link)
- [**Devpost**](https://devpost.com/software/perennail)
- [**GitHub Repo**](https://github.com/Hasan-Al-Khazraji/perennail)

## Sample Screenshots:
![Landing Page](https://cdn.discordapp.com/attachments/656957416297988096/1239349914799177829/image.png?ex=66429a0d&is=6641488d&hm=36dac2aa99ab4676cc71bde8114129dcf90e389f23aa515c14038cd0df52596c&)

![Plumi Question Mode](https://cdn.discordapp.com/attachments/656957416297988096/1239350005563916329/image.png?ex=66429a23&is=664148a3&hm=e65e1b50166520f572d0c4070b4ad643b881d12eea757a9df37d5dff38d9526e&)
![Plumi Plant Analysis Mode](https://cdn.discordapp.com/attachments/656957416297988096/1239350085045981315/image.png?ex=66429a36&is=664148b6&hm=49706dd61893865ffd6e73d8379347d115ffcc2bef64908e387a7b7b84532966&)
