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

# Definirea cuvintelor cheie pentru analiza medicală
keywords_optional = [
    "inregsitrat la", "recoltat la", "denumire analiza", "rezultat", "valori biologice de referinta",
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

# Preprocesare text pentru extragerea trăsăturilor
def extract_features(text):
    features = []
    
    # Căutăm numărul de cuvinte-cheie
    optional_count = sum(1 for word in keywords_optional if word.lower() in text.lower())
    features.append(optional_count)
    
    # Căutăm numerele urmate de unități de măsură (ex: 154 mg/dL)
    pattern = r'\d+([\.,]?\d+)?\s*(mg/dL|mmol/L|U/L|ng/dL|mL|pg/mL|µmol/L|\%|\s*/mm³)'
    numere = re.findall(pattern, text)
    features.append(len(numere))  # Adăugăm câte numere cu unități de măsură sunt în text
    
    return features

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

# Creăm un model de regresie logistică
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
