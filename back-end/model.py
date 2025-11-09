import pandas as pd
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from pathlib import Path
from logger import logger

class SpamModel:
    def __init__(self):
        #using a logistic regression model so that we can display the confidence score
        self.model = LogisticRegression()
        self.scaler = StandardScaler()
        self.root = Path(__file__).resolve().parent.parent

    #should not have to run this unless the data in SpamEmailsScaledAllFeatures.csv is updated
    def train(self):
        scaledFile = self.root / "back-end"/ "data" / "SpamEmailsScaledAllFeatures.csv"
        #need to use unscaled data to fit standard scaler
        unscaledFile = self.root / "back-end" / "data" / "SpamEmailsAllFeatures.csv"
        #read in processed dataset
        spamDF = pd.read_csv(scaledFile)
        spamUnscaledDF = pd.read_csv(unscaledFile)

        #select the features as the independent variables and store in X
        X = spamDF.drop(["label"], axis=1)
        X_unscaled = spamUnscaledDF.drop(["label"], axis=1)
        #store in y the target variable (the label of whether it is spam/ham)
        y = spamDF["label"]

        #train the model
        self.model.fit(X.values, y)
        self.scaler.fit(X_unscaled)
    
        #save the model
        joblib.dump(self.model, self.root / "back-end" / "spam_model.pkl")
        #save the fitted scaler - this needs to happen so the input is scaled in relation to trained data
        joblib.dump(self.scaler, self.root/"back-end"/"scaler.pkl")
    
    #predict whether an email is spam/ham - input is unscaled
    #output: bool of whether it is spam/ham, float of probability that it is spam
    def predict(self, X):
        file_path = self.root / "back-end"
        model = joblib.load(file_path / "spam_model.pkl")
        scaler = joblib.load(file_path / "scaler.pkl")
        
        logger.info("unscaled input: " + str(X))

        #standardise the input
        scaledInput = scaler.transform(X)

        logger.info("scaled input: " + str(scaledInput))

        #return the predicted value and prediction probability
        return model.predict(scaledInput), model.predict_proba(scaledInput)

#train model
if __name__ == "__main__":
    model = SpamModel()
    model.train()


