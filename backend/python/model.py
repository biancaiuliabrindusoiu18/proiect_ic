import os
from pathlib import Path
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import re

from utils import pdf_to_text
from sklearn.utils import shuffle


# keywords_must_have = ["Nume", "CNP", "Varsta", "Sex", "Adresa",
#                        "inregsitrat la", "recoltat la", 
#                       "denumire analiza", "rezultat", "valori biologice de referinta"]

keywords_must_have = [
                       "inregsitrat la", "recoltat la", 
                       "denumire analiza", "rezultat", "valori biologice de referinta"]



keywords_optional = ["Nume", "CNP", "Varsta", "Sex", "Adresa"
                    "inregsitrat la", "recoltat la", "test", "analiza",
                       "denumire analiza", "rezultat", "valori biologice de referinta"
                    "hematologie", 
                     "biochimie serica",
                     "exudat faringian",
                     "markeri endocrini",
                     "biochimie urinara",
                     "Biochimie sange",
                    "Imunologie",
                    "Markeri endocrini",
                    "Biotoxicologie",
                    "Histologie",
                    "Biochimie urini",
                    "Virusologie",
                    "Hematologie",
                    "Markeri virali",
                    "Boli autoimune",
                    "Parazitologie",
                    "Serologie",
                    "Biochimie alte lichide",
                    "Coagulare",
                    "Biologie moleculara",
                    "Markeri tumorali",
                    "Bacteriologie",
                    "Biochimie LCR",
                    "Alergologie",
                    "Imunohistochimie",
                    "Micologie",
                    "Citogenetica",
                    "Teste genetice",
                    "Citologie conventionala",
                    "Citologie in mediu lichid",
                    "Control sterilitate",
                    "Fertilitate si sarcina"
                    "Hemoleucograma",
                    "Colesterol total",
                    "Trigliceride",
                    "Glucoza",
                    "Uree",
                    "Creatinină",
                    "Transaminaze",
                    "Bilirubina",
                    "Proteine totale",
                    "Albumină",
                    "VSH",
                    "TGO/TGP",
                    "Ionogramă",
                    "Fier seric",
                    "Hemoglobina glicozilată",
                    "Calciu seric",
                    "Magneziu seric",
                    "Fosfatază alcalină",
                    "Vitamina D",
                    "Vitamina B12",
                    "Folati serici",
                    "TSH",
                    "FT3",
                    "FT4",
                    "CRP",
                    "Anticorpi pentru hepatită",
                    "Timpul de coagulare",
                    "Albumina urinară",
                    "Eritrocite sedimentate",
                    "Leucocite",
                    "Plachete"

                     ]

dataset=[]

folder_path_valid=Path(".\\backend\\testfiles\\testfiles_true")

for file_name in folder_path_valid.iterdir():   
    if file_name.is_file():
        text = pdf_to_text(file_name)
        dataset.append({"file_name":file_name.name, "content": text, "class":True})

folder_path_invalid=Path(".\\backend\\testfiles\\testfiles_false")

for file_name in folder_path_invalid.iterdir():
    if file_name.is_file():
        text = pdf_to_text(file_name)
        dataset.append({"file_name":file_name.name, "content": text, "class":False})


dataset_suffled=shuffle(dataset)

#print(dataset_suffled)


def check_medical_analysis(text):
   
    # if not all(word.lower() in text.lower() for word in keywords_must_have):
    #     return "❌ Nu este o analiză medicală (lipsesc cuvinte esențiale)."
    
    # Numărăm câte cuvinte opționale apar în text
    optional_count = sum(1 for word in keywords_optional if word.lower() in text.lower())

    # Dacă avem destule cuvinte din lista opțională, clasificăm ca analiză medicală
    if optional_count >= 3:  
        return True
    else:
        return False

corect_classified=0
total=len(dataset_suffled)

# for item in dataset_suffled:
#     # Verificăm dacă funcția a clasificat corect
#     predicted = check_medical_analysis(item['content'])
#     actual = item['class']
    
#     if predicted == actual:
#         corect_classified += 1
#     print(f"File: {item['file_name']}")
#     print(f"Predicted: {predicted}, Actual: {actual}")




def check_analiza(dataset_suffled):
    for item in dataset_suffled:
        # Căutăm numerele urmate de unități de măsură (ex: 154 mg/dL)
        pattern = r'\d+(\,\d+)?\s*(mg/dL|mmol/L|U/L|ng/dL|mL|pg/mL|µmol/L|\%|\s*/mm³)'
        rezultate = re.findall(pattern, text)

    for item in dataset_suffled:
        # Verificăm dacă funcția a clasificat corect
        predicted = check_medical_analysis(item['content'])
        actual = item['class']
    
    if predicted == actual and len(rezultate) > 0:
        corect_classified += 1
    print(f"File: {item['file_name']}")
    print(f"Predicted: {predicted}, Actual: {actual}")
    print(f"Numerele găsite: {rezultate}")

check_analiza(dataset_suffled)
print(f"Numărul de clasificări corecte: {corect_classified} din {total}")



