import pandas as pd
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

class SpamModel:
    def __init__(self):
        #using a logistic regression model so that we can display the confidence score
        self.model = LogisticRegression()
        self.scaler = StandardScaler()

    #should not have to run this unless the data in SpamEmailsScaledAllFeatures.csv is updated
    def train(self):
        #read in processed dataset
        spamDF = pd.read_csv("../data/SpamEmailsScaledAllFeatures.csv")

        #select the features as the independent variables and store in X
        X = spamDF.iloc[:, :-1]
        #store in y the target variable (the label of whether it is spam/ham)
        y = spamDF["label"]

        #train the model
        self.model.fit(X, y)
    
        #save the model
        joblib.dump(self.model, "spam_model.pkl")
    
    #predict whether an email is spam/ham - input is unscaled
    #output: bool of whether it is spam/ham, float of probability that it is spam
    def predict(self, X):
        model = joblib.load("spam_model.pkl")

        #standardise the input
        scaledInput = pd.DataFrame(self.scaler.fit_transform(X))

        #return the predicted value and prediction probability
        return model.predict(scaledInput), model.predict_proba(scaledInput)

#train model
if __name__ == "__main__":
    model = SpamModel()
    model.train()




