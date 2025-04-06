import os
from pathlib import Path
import numpy as np
#import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report


from utils import pdf_to_text
from sklearn.utils import shuffle


keywords_must_have = ["Nume", "CNP", "Varsta", "Sex", "Adresa",
                       "inregsitrat la", "recoltat la", 
                       "denumire analiza", "rezultat", "valori biologice de referinta"]

keywords_optional = ["hematologie", 
                     "biochimie serica",
                     "exudat faringian",
                     "markeri endocrini",
                     "biochimie urinara"]
#de adaugat mai mult denumiri
#ptr fiecare daca exista trb adaygat s afie macar o analiza din acel set
#de luat de pe site-uri gen bioclinica cv vedem

#de scos diacritice overall sau adaugat la analize citite de pe poze wwe will See 

dataset=[]

folder_path_valid=Path("..\\testfiles\\testfiles_true")

for file_name in folder_path_valid.iterdir():   
    if file_name.is_file():
        text = pdf_to_text(file_name)
        dataset.append({"file_name":file_name.name, "content": text, "class":True})

folder_path_invalid=Path("..\\testfiles\\testfiles_false")

for file_name in folder_path_invalid.iterdir():
    if file_name.is_file():
        text = pdf_to_text(file_name)
        dataset.append({"file_name":file_name.name, "content": text, "class":False})


dataset_suffled=shuffle(dataset)

print(dataset_suffled)


#def classify_docuemnt()



