import pandas as pd
import re
from spellchecker import SpellChecker

#a class used to extract features from inputs
class InputExtractor:
    #set up variables that will be used repeatedly when extracting features
    def __init__(self):
        spamWords = []

        #get list of spam words from spamWords.txt
        #this file was made from using frequently used words in spam emails and research
        with open("../data/spamWords.txt", newline='') as spamWordsFile:
            for line in spamWordsFile:
                spamWords += line.split(", ")

        #get a regex pattern to use to find num occurrences of all suspicious words
        self.spamWordsPattern = '|'.join(spamWords)

        #regex pattern to find URLs
        self.urlPattern = "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)"
        
        #get spellchecker object to find misspelled words
        self.spelling = SpellChecker()

        #array of the words most correlated with spam emails
        self.correlatedSpamWords = ["settings", "privacy", "cnn", "video", "crime"]
    
    #returns a dataframe of all the features of the email text, unscaled (for data visualisation purposes)
    def extractFeatures(self, subject, body):
        #create an empty dictionary to fill with extracted features
        data = {}

        text = subject + body

        #get the frequency of specific highly suspicious words
        for word in self.correlatedSpamWords:
            data["numOfWord" + word] = len(re.findall(word, text, flags=re.IGNORECASE))
        
        #get number of capital letters
        data["numCapitalLetters"] = len(re.findall("[A-Z]", text))

        #get number of digits
        data["numDigits"] = len(re.findall("[0-9]", text))

        #get number of misspelled words
        data["numMisspelledWords"] = len(self.spelling.unknown(text.split()))

        #get number of special characters
        data["numSpecialCharacters"] = len(re.findall("[^A-Za-z0-9 ]", text))

        #get number of suspicious words
        data["numSuspiciousWords"] = len(re.findall(self.spamWordsPattern, text, flags=re.IGNORECASE))

        #get number of URLs
        data["numURLs"] = len(re.findall(self.urlPattern, text))

        #get length of text (number of characters)
        data["textLength"] = len(text)
        
        #create dataframe from dictionary
        dataDF = pd.DataFrame(data, index=[0])

        #used for testing
        #print(dataDF)

        return dataDF
    
    #returns a list of dictionaries in form {text, isHighlighted, category} that sections the text into suspicious/unsuspicious words
    def getSuspiciousText(self, text):
        segments = []
        lastIndex = 0

        matches = re.finditer(self.spamWordsPattern, text, flags=re.IGNORECASE)
        for match in matches:
            #add the not highlighted text before a match
            if(match.start() > lastIndex):
                segments.append({"text": text[lastIndex: match.start()], "isHighlighted": False})

            segments.append({"text": match.group(), "isHighlighted": True})
            lastIndex = match.end()

        if lastIndex < len(text) - 1:
            segments.append({"text": text[lastIndex: len(text) - 1], "isHighlighted": False})
        
        return segments

#testing   
#inputExtractor = InputExtractor()
#inputExtractor.extractFeatures("Hello 15 @@ hello.com YYY mispelled wurds money money investment now quick cnn")