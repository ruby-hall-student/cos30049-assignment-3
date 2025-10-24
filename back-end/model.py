import pandas as pd
import joblib
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

class SpamModel:
    def __init__(self):
        self.model = LogisticRegression()
    
    def train(self):
        #read in processed dataset
        spamDF = pd.read_csv("../data/SpamEmailsScaledAllFeatures.csv")

        #select the features as the independent variables and store in X
        X = spamDF.iloc[:, :-1]
        #store in y the target variable (the label of whether it is spam/ham)
        y = spamDF["label"]

        # #perform data splitting
        # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

        #train the model
        self.model.fit(X, y)
    
        #save the model
        joblib.dump(self.load, "log_reg_model.pkl")
    
    def predict(self, X):
        model = joblib.load("log_reg_model.pkl")




