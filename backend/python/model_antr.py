import os
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.feature_extraction.text import TfidfVectorizer
import re
from utils import pdf_to_text
from sklearn.utils import shuffle

import joblib

# Definirea cuvintelor cheie pentru analiza medicală
keywords_optional = [
    "hematologie", "biochimie serica", "exudat faringian", "markeri endocrini", "biochimie urinara", 
    "Biochimie sange", "Imunologie", "Markeri endocrini", "Biotoxicologie", "Histologie", "Biochimie urini", 
    "Virusologie", "Hematologie", "Markeri virali", "Boli autoimune", "Parazitologie", "Serologie", 
    "Biochimie alte lichide", "Coagulare", "Biologie moleculara", "Markeri tumorali", "Bacteriologie", 
    "Biochimie LCR", "Alergologie", "Imunohistochimie", "Micologie", "Citogenetica", "Teste genetice", 
    "Citologie conventionala", "Citologie in mediu lichid", "Control sterilitate", "Fertilitate si sarcina",
    "Hemoleucograma", "Colesterol total", "Trigliceride", "Glucoza", "Uree", "Creatinină", "Transaminaze", 
    "Bilirubina", "Proteine totale", "Albumină", "VSH", "TGO/TGP", "Ionogramă", "Fier seric", 
    "Hemoglobina glicozilată", "Calciu seric", "Magneziu seric", "Fosfatază alcalină", "Vitamina D", 
    "Vitamina B12", "Folati serici", "TSH", "FT3", "FT4", "CRP", "Anticorpi pentru hepatită", 
    "Timpul de coagulare", "Albumina urinară", "Eritrocite sedimentate", "Leucocite", "Plachete"
]

keywords_optional = [keyword.lower() for keyword in keywords_optional]

# Preprocesare text pentru extragerea trăsăturilor
def extract_features(text: str):
    text_lower = text.lower()
    features = {}

    features["nr_total_cuvinte"] = len(text_lower.split())
    features["contine_buletin"] = int("buletin de analize" in text_lower or "buletin de rezultate" in text_lower)
    features["contine_date_personale"] = int("nume" in text_lower and "prenume" in text_lower or "varsta" in text_lower 
                                             or "adresa" in text_lower or "telefon" in text_lower
                                             or "cod numeric personal" in text_lower or "cnp" in text_lower
                                             or "sex" in text_lower or "data nasterii" in text_lower)
    features["aparitie_denumire"] = int ("denumire analiza" in text_lower or "denumire" in text_lower)
    features["aparitie_interval"] = int ("valori de referinta" in text_lower or "valori biologice de referinta" in text_lower)
    features["recoltat"] = int("recoltat" in text_lower or "recoltare" in text_lower)
    features["are_data"] = int(bool(re.search(r"\b\d{1,2}[./\\]?\d{1,2}[./\\]?\d{2,4}\b|"
                                                r"\b\d{1,2}\s+(?:ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie|"
                                                r"ian|feb|mar|apr|iun|iul|aug|sep|oct|nov|dec)\.?\s+\d{4}\b",
                                                text_lower
                                            )))


    features["analize-denumiri"] = int(any(keyword in text_lower for keyword in keywords_optional))

    unitati = ["mg/dl", "g/dl", "u/l", "µg/dl", "mmol/l", "ng/ml"]
    features["nr_unitati_medicale"] = sum(text_lower.count(unit) for unit in unitati)
    features["procent_unitati_medicale"] = features["nr_unitati_medicale"] / (features["nr_total_cuvinte"] + 1)

    return list(features.values())


# Încărcăm dataset-ul
dataset = []

# Adăugăm fișierele valide (analize corecte)
folder_path_valid = Path(".\\backend\\testfiles\\testfiles_true")
for file_name in folder_path_valid.iterdir():
    if file_name.is_file():
        text = pdf_to_text(file_name)
        dataset.append({"file_name": file_name.name, "content": text, "class": True})

# Adăugăm fișierele invalide (analize greșite)
folder_path_invalid = Path(".\\backend\\testfiles\\testfiles_false")
for file_name in folder_path_invalid.iterdir():
    if file_name.is_file():
        text = pdf_to_text(file_name)
        dataset.append({"file_name": file_name.name, "content": text, "class": False})

# Împărțim dataset-ul în trăsături (X) și etichete (y)
X = [extract_features(item['content']) for item in dataset]
y = [item['class'] for item in dataset]

# Împărțim în seturi de antrenament și testare
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.7, random_state=42)

# Creăm un model de regresie logistică 0 sau 1 ptr clase 
model = LogisticRegression()

# Antrenăm modelul
model.fit(X_train, y_train)

# Predicții pe setul de testare
y_pred = model.predict(X_test)

# Evaluarea modelului
accuracy = accuracy_score(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)
class_report = classification_report(y_test, y_pred)

print(f"Acuratețea: {accuracy}")
print("Matricea de confuzie:")
print(conf_matrix)
print("Raportul de clasificare:")
print(class_report)

joblib.dump(model, "classifier.pkl")
print("Modelul a fost salvat în classifier.pkl")
