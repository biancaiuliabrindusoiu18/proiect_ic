from utils import pdf_to_text


# #print(pdf_to_text("..\\testfiles\\testfiles_false\\texttest.pdf"))


# #print(pdf_to_text(".\\backend\\testfiles\\testfiles_false\\imaginetest.pdf"))

# #print(pdf_to_text("..\\testfiles\\testfiles_true\\Buletin de analize nr 291705.pdf"))


# #print(pdf_to_text("..\\testfiles\\testfiles_true\\analizaLaura.pdf"))

#print(pdf_to_text(".\\backend\\testfiles\\testfiles_true\\Buletin de analize nr 291705.pdf"))

#print (pdf_to_text(".\\backend\\testfiles\\testfiles_true\\analysis_report(2).pdf"))

#print(pdf_to_text(".\\backend\\testfiles\\testfiles_true\\analizaLaura.pdf"))

from joblib import load

from pathlib import Path
#from extracts import extract_patient_data
from extracts import detect_document_type
from model_antr import extract_features

model = load("classifier.pkl")
text = pdf_to_text(".\\backend\\testfiles\\testfiles_true\\Buletin de analize nr 291705.pdf")

if model.predict([extract_features(text)])[0]:
    pacient = detect_document_type(text)
    print(pacient)
    print ("expected after")
    # print(len(pacient["analize"]))

else:
    print("PDF invalid – nu este un buletin de analize.")

text = pdf_to_text(".\\backend\\testfiles\\testfiles_true\\analysis_report(1).pdf")

if model.predict([extract_features(text)])[0]:
    pacient = detect_document_type(text)
    print(pacient)
    print ("expected before")
    #print(len(pacient["analize"]))
else:
    print("PDF invalid – nu este un buletin de analize.")

text = pdf_to_text(".\\backend\\testfiles\\testfiles_true\\analizaLaura.pdf")

if model.predict([extract_features(text)])[0]:
    pacient = detect_document_type(text)
    print(pacient)
    print ("expected after")
    #print(len(pacient["analize"]))
else:
    print("PDF invalid – nu este un buletin de analize.")

text = pdf_to_text(".\\backend\\testfiles\\testfiles_true\\analysis_report(2).pdf")

if model.predict([extract_features(text)])[0]:
    pacient = detect_document_type(text)
    print(pacient)
    print ("expected before")
    #print(len(pacient["analize"]))
else:
    print("PDF invalid – nu este un buletin de analize.")

text = pdf_to_text(".\\backend\\testfiles\\testfiles_true\\analysis_report(3).pdf")

if model.predict([extract_features(text)])[0]:
    pacient = detect_document_type(text)
    print(pacient)
    print ("expected before")
    #print(len(pacient["analize"]))
else:
    print("PDF invalid – nu este un buletin de analize.")


text_before = pdf_to_text(".\\backend\\testfiles\\testfiles_true\\analysis_report(1).pdf")

from extracts import parse_before_mode, parse_after_mode

lines = [line.strip() for line in text_before.splitlines() if line.strip()]
results = parse_before_mode(lines)

for res in results:
    print(res)
    
print(len(results))

# text_after = pdf_to_text(".\\backend\\testfiles\\testfiles_true\\Buletin de analize nr 291705.pdf")

# lines = [line.strip() for line in text_before.splitlines() if line.strip()]
# results = parse_after_mode(lines)

# for res in results:
#     print(res)
    
# print(len(results))