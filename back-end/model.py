import pandas as pd
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression

class SpamModel:
    def __init__(self):
        #using a logistic regression model so that we can display the confidence score
        self.model = LogisticRegression()
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
    
    def predict(self, X):
        model = joblib.load("spam_model.pkl")
        #return the predicted value
        return model.predict(X)

#train model
if __name__ == "__main__":
    model = SpamModel()
    model.train()




