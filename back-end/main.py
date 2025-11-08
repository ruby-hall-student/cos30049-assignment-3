import pandas as pd
from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model import SpamModel
from model_input import InputExtractor
from pydantic import BaseModel, Field
from logger import logger

#defines a pydantic model for input to predict spam
class PredictionInput(BaseModel):
    subject: str
    body: str

class PredictionOutput(BaseModel):
    subject: str
    body: str
    features: dict #the features extracted from the email - used for prediction and visualisations
    label: bool #label of whether it is ham/spam (spam = true)
    probability: float = Field(..., ge=0, le=1) #the probability that the email is spam (1.0 = certain it is spam)
    subjectSupiciousText: list[dict]
    bodySuspiciousText: list[dict]

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
#returns predicted email object
@app.post("/predict/")
def predict_input(spamInput: PredictionInput) -> PredictionOutput:
    try:
        #extract features into dataframe from subject and body text
        input_features = inputExtractor.extractFeatures(spamInput.subject, spamInput.body)

        prediction, prediction_probability = model.predict(input_features)

        #used for testing
        logger.info("Probability that it is spam: " + str(prediction_probability[0][1]))

        subjectHighlights = inputExtractor.getSuspiciousText(spamInput.subject)
        bodyHighlights = inputExtractor.getSuspiciousText(spamInput.body)

        #prepare an output object
        spamOutput = PredictionOutput(
            subject = spamInput.subject,
            body = spamInput.body,
            features = input_features.iloc[0].to_dict(),
            label = bool(prediction[0]),
            probability = round(float(prediction_probability[0][1]), 3),
            subjectSupiciousText=subjectHighlights,
            bodySuspiciousText=bodyHighlights
        )

        return spamOutput
    #display any errors that occur
    except Exception as e:
        logger.error("Error trying to predict: " + str(e))
        raise HTTPException(status_code=500, detail="Internal error: " + str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

