import csv
from pathlib import Path

class MetricsLoader:
    def __init__(self):
        root = Path(__file__).resolve().parent.parent
        self.metrics = {}
        with open(root/"back-end"/"data"/"logisticRegressionMetrics.csv", newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                self.metrics[row["Metric"]] = float(row["Score"])
        
        self.confusion = {}
        with open(root/"back-end"/"data"/"logisticRegressionConfusionMatrix.csv", newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                self.confusion[row["Label"]] = int(row["Value"])
    
    def getMetrics(self):
        return self.metrics

    def getConfusion(self):
        return self.confusion

#used for testing
#metrics = MetricsLoader()
# metrics.getMetrics()