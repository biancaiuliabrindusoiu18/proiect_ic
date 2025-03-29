import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_path

def pdf_has_text(pdf_path):  # Verifică dacă PDF-ul conține text
    doc = fitz.open(pdf_path)
    for page in doc:
        if page.get_text("text").strip():
            return True
    return False

def extract_text_from_pdf_text(pdf_path): # Extrage textul dintr-un PDF care conține text
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text")
    return text


def extract_text_from_pdf_image(pdf_path): # Extrage textul dintr-un PDF care conține imagini
    images = convert_from_path(pdf_path)
    text = "\n".join([pytesseract.image_to_string(img) for img in images])
    return text

def pdf_to_text(pdf_path):  # Extrage textul dintr-un PDF
    if pdf_has_text(pdf_path):
        return extract_text_from_pdf_text(pdf_path)
    else:
        return extract_text_from_pdf_image(pdf_path)