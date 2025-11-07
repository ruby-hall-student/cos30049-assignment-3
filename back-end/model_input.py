import pandas as pd
import re
from spellchecker import SpellChecker

def extractFeatures(text):
    textLength = len(text)
    numCapitalLetters = len(re.findall("[A-Z]", text))
    numSpecialCharacters = len(re.findall("[^A-Za-z0-9 ]", text))
    numDigits = len(re.findall("[0-9]", text))

    urlPattern = "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)"
    numURLs = len(re.findall(urlPattern, text))

    spelling = SpellChecker()
    numMisspelledWords = len(spelling.unknown(text.split()))



    #test print statements
    print(textLength)
    print(numCapitalLetters)
    print(numURLs)
    print(numMisspelledWords)

#a class used to extract features from inputs
class InputExtracter:
    spelling = SpellChecker()
    spamWordsPattern = ""

    def __init__(self):
        spamWords = []

        #get list of spam words from spamWords.txt
        #this file was made from using frequently used words in spam emails and research
        with open("../data/spamWords.txt", newline='') as spamWordsFile:
            for line in spamWordsFile:
                spamWords += line.split(", ")

        #get a regex pattern to use to find num occurrences of all suspicious words
        self.spamWordsPattern = '|'.join(spamWords)


#stores a dataframe of inputs for the ML model
class ModelInput:
    #a list of inputs for the ML model, ordered in the same way as SpamEmailsScaledAllFeatures
    data = pd.DataFrame()

    def __init__(self, text):
        #data = self.extractFeatures(text)
        extractFeatures(text)

    

modelInput = ModelInput("Hello https://hello.com mispelled wurds")