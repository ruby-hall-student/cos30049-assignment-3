import pandas as pd
from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model import SpamModel
from model_input import InputExtractor
from pydantic import BaseModel, Field
from logger import logger

#defines a pydantic model for input to predict spam
class PredictedEmail(BaseModel):
    subject: str
    body: str
    features: dict | None = None #the features extracted from the email - used for prediction and visualisations
    label: bool | None = None #label of whether it is ham/spam (spam = true)
    probability: float | None = None #the probability that the email is spam (1.0 = certain it is spam)

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:3000"], # URL of React application
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#initialise ML model
model = SpamModel()

#initialise input extractor - this will be used to extract features from email input
inputExtractor = InputExtractor()

@app.get("/")
async def root():
    return {"message": "This is a test message"}

#predict whether an email is spam/ham - input requires subject and body text as string
@app.post("/predict/")
def predict_input(spamInput: PredictedEmail) -> PredictedEmail:
    #extract features into dataframe from subject and body text
    input_features = inputExtractor.extractFeatures(spamInput.subject, spamInput.body)

    #store extracted features - for data visualisations
    spamInput.features = input_features.iloc[0].to_dict()

    prediction, prediction_probability = model.predict(input_features)

    #store label of whether it is spam/ham
    spamInput.label = bool(prediction[0])

    #store how likely the email is spam, rounded to 3 decimal places
    spamInput.probability = round(float(prediction_probability[0][0]), 3)

    #used for testing
    #logger.info("Probability that it is spam: " + str(prediction_probability[0][1]))

    return spamInput

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

