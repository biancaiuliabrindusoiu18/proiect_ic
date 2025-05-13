from utils import pdf_to_text
from joblib import load
from fastapi import FastAPI, UploadFile, File

from pathlib import Path
from extracts import extract_pacient_data
from model_antr import extract_features

model = load("classifier.pkl")

# text_before = pdf_to_text(".\\backend\\testfiles\\testfiles_true\\analysis_report(1).pdf")

# text_after = pdf_to_text(".\\backend\\testfiles\\testfiles_true\\Buletin de analize nr 291705.pdf")


# if model.predict([extract_features(text_after)])[0]:
#     pacient = extract_pacient_data(text_after)
#     print(pacient["data_recoltare"])
#     for analiza in pacient["analize"]:
#         print(analiza)
#     #print(len(pacient["analize"]))
# else:
#     print("PDF invalid – nu este un buletin de analize.")
# print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

# if model.predict([extract_features(text_before)])[0]:
#     pacient = extract_pacient_data(text_before)
#     print(pacient["data_recoltare"])
#     for analiza in pacient["analize"]:
#         print(analiza)
#     #print(len(pacient["analize"]))
# else:
#     print("PDF invalid – nu este un buletin de analize.")

# random_text = pdf_to_text(".\\backend\\testfiles\\testfiles_false\\imaginetest.pdf")
# print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

# if model.predict([extract_features(random_text)])[0]:
#     pacient = extract_pacient_data(random_text)
#     print(pacient["data_recoltare"])
#     for analiza in pacient["analize"]:
#         print(analiza)
#     #print(len(pacient["analize"]))
# else:
#     print("PDF invalid – nu este un buletin de analize.")



app = FastAPI()

@app.post("/analyze")
async def analyze_pdf(file: UploadFile = File(...)):
    #content = await file.read()

    text=pdf_to_text(file.file)

    if not text:  # Verifică dacă s-a extras text din fișier
            return {"error": "Nu s-a putut extrage textul din PDF."}

    if model.predict([extract_features(text)])[0]:
        pacient = extract_pacient_data(text)
        return pacient
    else:
        return {"error": "PDF invalid sau nesuportat."}
    

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}
