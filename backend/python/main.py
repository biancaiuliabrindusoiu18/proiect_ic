from utils import pdf_to_text
from joblib import load
from fastapi import FastAPI, HTTPException, UploadFile, File

from pathlib import Path
from extracts import extract_pacient_data
from model_antr import extract_features

import os

model = load("classifier.pkl")

app = FastAPI()

@app.post("/analyze")
async def analyze_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files supported")

    file_location = f"temp_files/{file.filename}"
    os.makedirs("temp_files", exist_ok=True)

    with open(file_location, "wb") as f:
        f.write(await file.read())

    content = await file.read()

    text = pdf_to_text(file_location)

    if not text:
        os.remove(file_location)
        return {"error": "Could not extract text from PDF."}

    if model.predict([extract_features(text)])[0]:
        pacient = extract_pacient_data(text)
        os.remove(file_location)
        return pacient
    else:
        os.remove(file_location)
        return {"error": "Invalid or unsupported PDF."}
    

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

