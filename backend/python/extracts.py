import re

# Regex pentru intervale
interval_pattern = r"(^[\[\( ]?[0-9]*([.,][0.-9]+)*\s*[-]\s*[0-9]*([.,][0.-9]+)*[\]\) ]?)|([<>][0-9]+([.,][0-9]+)*)|NEGATIV|POZITIV|negativ|pozitiv"

# Exemple de test
test_strings = [
    "(27,0 - 33,5)",
    "(42,00 - 77,00)%",
    "(1.100 - 4.500)/mm³",
    "11-15 g/dl",
    "100-400 x10^3/ul",
    "[4.49 - 12.68]",
    "F01 - PG22",
    "12.3 g/dL",
    "Silvia-Corina",
    "<35",
    ">100",
    "NEGATIV",
    "12. Cultura - Ex. faringian",
    "Distributia plachetelor(trombocitelor) (PDW-SD)"
]

# # Verificăm care se potrivesc
# for text in test_strings:
#     if re.search(interval_pattern, text):
#         print(f"Acceptat: {text}")
#     else:
#         print(f"Respins: {text}")


data_pattern=r"\b\d{1,2}[.\\\/]\d{1,2}[.\\\/]\d{2,4}\b|\b\d{1,2}\.?\s+(?:ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie|ian|feb|mar|apr|iun|iul|aug|sep|oct|nov|dec)\.?\s+\d{4}\b"
recolt_pattern =r"recoltat|recoltare|recoltarea|recoltarii"

def data_recoltare_detect(lines):
    data_recoltare=None
    found_data = False
    for line in lines:
        line = line.strip()  # Convertim linia la litere mici pentru a face căutarea insensibilă la caz
        if re.search(recolt_pattern, line.lower()):
            # Căutăm data în linia curentă
            #print(f"Linia curentă: {line}") 
            date=re.search(data_pattern, line.lower())
            #print(date)
            if date:
                found_data = True
                data_recoltare = date.group(0)
                break  # Opriți după ce am găsit prima dată validă
            else:
                #poate e pe urm rand
                if lines.index(line) + 1 < len(lines):
                    next_line = lines[lines.index(line) + 1].strip()
                    date=re.search(data_pattern, next_line.lower()) 
                    #print(date)
                    if date:
                        found_data = True
                        data_recoltare = date.group(0)
                        break


    return data_recoltare



# Pattern pentru intervale (cu sau fără paranteze)
interval_pattern = r"(^[\[\( ]?[0-9]*([.,][0.-9]+)*\s*[-]\s*[0-9]*([.,][0.-9]+)*[\]\) ]?)|([<>][0-9]+([.,][0-9]+)*)"  # Interval cu sau fără paranteze
interval_nonvalue=r"NEGATIV|NEGATIV|NEGATIVE|POZITIVE|negativ|pozitiv|negative|pozitive"

# Pattern pentru cuvintele cheie
keyword_pattern = r"(valori\sbiologice\sde\sreferință|unitate|interval\sbiologic)"

# Pattern pentru valoare 
value_pattern = r"[0-9]+([.,][0-9]+)*"  

# Pattern pentru unitate de măsură
unit_pattern=r"([a-zA-ZăâîșțĂÂÎȘȚ²³]*[\/][a-zA-ZăâîșțĂÂÎȘȚ²³]+)|[%]"


def detect_document_type(text):
    lines = text.splitlines()

    found_keyword = False
    found_interval = False
    previous_line = None
    last_value = None

    for i in range(len(lines)):
        line = lines[i].strip()


        # Căutăm cuvintele cheie
        if re.search(keyword_pattern, line):
            found_keyword = True
            #print(f"Găsit cuvânt cheie în linia {i + 1}: {line}")
            continue  # După găsirea cuvântului cheie, trecem la căutarea intervalului

        # Dacă am găsit cuvântul cheie, căutăm intervalul
            # Căutăm intervalul în linia curentă
        if re.match(interval_pattern, line):
            found_interval = True
            #print(f"Găsit interval în linia {i + 1}: {line}")
            # După găsirea intervalului, verificăm linia anterioară
            if previous_line and re.match(value_pattern, previous_line):
                #print(f"Găsit valoare în linia anterioară: {previous_line}")
                last_value = 'AFTER'  # Linia anterioară conține valoare
            elif previous_line and len(previous_line) >= 6:
                #print(f"Găsit text lung în linia anterioară: {previous_line}")
                last_value = 'BEFORE'  # Linia anterioară conține text lung
            break  # Opriți după ce am găsit primul interval valid
        if re.match(interval_nonvalue, line):
            found_interval = True
            next_line=lines[i+1].strip()
            #print(f"Găsit interval în linia {i + 1}: {line}")
            # După găsirea intervalului, verificăm linia anterioară
            if next_line and re.match(interval_nonvalue, next_line):
                #print(f"Găsit valoare în linia anterioară: {next_line}")
                last_value = 'AFTER'  # Linia anterioară conține valoare
            elif next_line and len(previous_line) >= 6:
                #print(f"Găsit text lung în linia anterioară: {next_line}")
                last_value = 'BEFORE'  # Linia anterioară conține text lung
            break  # Opriți după ce am găsit primul interval valid



        # Salvăm linia curentă pentru a o compara cu următoarea
        previous_line = line

    # Dacă am găsit un interval valid
    if last_value:
        return last_value
    else:
        return "Necunoscut"  # Dacă nu putem determina tipul documentului

def test_detect_document_type():
    # Exemplu de test:
    text_example = """
    VALORI BIOLOGICE DE REFERINȚĂ
    sunt mule nuj ce facem
    bff

    nck
    Hemoglobina (HGB)
    12.3 g/dL
    (11.9 - 14.6)
    """

    result = detect_document_type(text_example)
    print(result)  # Ar trebui să fie Caz 1

    text_example_2 = """
    Unitate
    bla bla bla
    Leucocite (WBC)
    8.87 x10^3/ul
    4 - 10 x10^3/ul
    Leucocite (WBC)
    8.87 x10^3/ul
    4 - 10 x10^3/ul
    """

    result_2 = detect_document_type(text_example_2)
    print(result_2)  # Ar trebui să fie Caz 1


    text_example_2 = """
    Unitate
    bla bla bla
    4 - 10 x10^3/ul
    Leucocite (WBC)
    8.87 x10^3/ul
    4 - 10 x10^3/ul
    Leucocite (WBC)
    8.87 x10^3/ul
    """

    result_2 = detect_document_type(text_example_2)
    print(result_2)  # Ar trebui să fie Caz 2


    text_example_2 = """
    Varsta:  57 ani, 5 luni
    Sex: F
    Cod pacient: 100186116
    Data - ora cerere: 17.03.2025 - 08:26
    Data - ora recoltare: 17.03.2025 - 08:35
    Buletin de analize medicale
    Denumire                                                                              
    Rezultate                UM           Interval biologic de
    f
    Id proba:
    32361354
    Valorile in afara limitelor admise pentru varsta si sexul respectiv sunt in chenar    
    *32361354*
    Recomandare generala: Rezultatele analizelor trebuie interpretate de catre medicul dumneavoastra curant in context clinic.
    Probele analizate: Toate probele procesate cu rezultate finale si fara comentarii aditionale sunt considerate conforme.
    Cod proba:
    332361354
    HEMATOLOGIE
    HEMOLEUCOGRAMA   CU FORMULA LEUCOCITARA,Hb,Ht, INDICI ERITROCITARI
                                                            [3.92 - 5.08]
    Numar de eritrocite (RBC)
    =   4.35
    mil./µL
                                                            [11.9 - 14.6]
    Hemoglobina (HGB)
    =   12.3
    g/dL
                                                            [36.6 - 44]
    Hematocrit (HCT)
    =   37.6
    %

    """

    result_2 = detect_document_type(text_example_2)
    print(result_2)  # Ar trebui să fie Caz 2

    text_example_2 = """
    Adresa:
    Unitate recoltare: TIMISOARA SAGULUI
    Telefon: 0743093115
    Brindusoiu Nelica Nuta
    Trimitator: RADA Ioana Madalina
    CNP: 2671015352636
    Varsta:  56 ani, 1 luna
    Sex: F
    Cod pacient: 100186116
    Data - ora cerere: 18.11.2023 - 12:03
    Data - ora recoltare: 18.11.2023 - 12:16
    Buletin de analize medicale
    Denumire                                                                          Rezultate               UM                 Interval biologic de
    f
    Id proba:
    29919149
    Valorile in afara limitelor admise pentru varsta si sexul respectiv sunt in chenar
    *29919149*
    Recomandare generala: Rezultatele analizelor trebuie interpretate de catre medicul dumneavoastra curant in context clinic.
    Probele analizate: Toate probele procesate cu rezultate finale si fara comentarii aditionale sunt considerate conforme.
    Cod proba:
    329919149
    IMUNOLOGIE SI SEROLOGIE
    SCOR ROMA
                                                            <35
    CA 125
    =   15.5
    U/mL

    < 70 pmol/L femei premenopauza
    < 140 pmol/L femei postmenopauza
    HE4 (Proteina epididimala umana 4)
    =   54.1
    pmol/L

    Femei premenopauza:
    valoare scor ROMA >= 11.4% - risc crescut de a avea cancer de
    ovar
    valoare scor ROMA < 11.4% - risc scazut de a avea cancer de ovar
    SCOR ROMA-premenopauza
    =   8.9
    %
    """

    result_2 = detect_document_type(text_example_2)
    print(result_2)  # Ar trebui să fie Caz 2





    text_example_2 = """
    Unitate
    Leucocite (WBC)
    NEGATIV WBC/ul
    negativ <25 WBC/ul
    Hematii (RBC)
    NEGATIV RBC/ul
    negativ <3 RBC/ul
    Nitriti
    NEGATIV
    negativ

    """
    result_2 = detect_document_type(text_example_2)
    print(result_2)  # Ar trebui să fie Caz 1

#test_detect_document_type()

# ok acum ca am stabilit daca intervalu e primu sau nu vom avea 2 cazuri
# format json ma gandesc
# {"analize":{
#     "nume":"",
#     "valoare":"",
#     "unitate":"",
#     "interval":""
#     "data_recoltare":""
#     }
# }

# valoare: numar(value) si intervalul poate fi interval/ nonvalue urmat de interval cu <> si neaparat are unitate de masura daca agsesc <> si rez e numar,
# valoare:nonvalue si intervalul e nonvalue urmat de interval cu <>, si aici avem unitate masura,
# valoare:nonvalue si interval nonvalue simplu, fara unitate de masura
# astea sunt cele 3 cazuri care trebuie tratate
 

def parse_before_mode(lines):
    data_recoltare=data_recoltare_detect(lines)
    analyses = []
    i = 0

    while i < len(lines):
        line = lines[i].strip()

        interval = None
        name = None
        value = None
        unit = None
        def is_comment(line):
            return re.search(r"^(Informatii|Metoda|Nota|Observatii|Ser|Adresa|Data|CNP|Pagina|TRIMIS DE|LUCRAT|GENERAT|VALORI BIOLOGICE|ANTECEDENT).*", line, re.IGNORECASE)



        # Primul pas: Căutăm o linie cu interval
        interval_match = re.match(interval_pattern, line)
        interval_nonvalue_match = re.match(interval_nonvalue, line)

        if interval_match or interval_nonvalue_match:
            interval = line.strip()

            # Următorul rând: numele analizei
                         # Sarim peste comentarii
            while i+1 < len(lines) and (lines[i].strip() == "" or is_comment(lines[i+1])):
                 i += 1
            if i + 1 < len(lines):
                i += 1
                name_line = lines[i].strip()

                

                if name_line and not re.search(r"^(Informatii|Metoda|Nota|Observatii|Ser|Adresa|Data|CNP|Pagina|TRIMIS DE|LUCRAT|GENERAT|VALORI BIOLOGICE|ANTECEDENT).*", name_line, re.IGNORECASE):
                    name = name_line

                    # Următorul rând: valoarea
                    if i + 1 < len(lines):
                        i += 1
                        value_line = lines[i].strip()

                        # Curățăm simbolurile inutile
                        if value_line == "=":
                            i += 1
                            if i < len(lines):
                                value_line = lines[i].strip()

                        if value_line.startswith("="):
                            value_line = value_line[1:].strip()

                        # Detectăm tipul valorii: numeric sau nonvalue
                        if re.match(value_pattern, value_line):
                            value = re.match(value_pattern, value_line).group(0).replace(',', '.')

                            # Dacă valoarea este numerică, căutăm unitatea
                            unit_match = re.search(unit_pattern, value_line)
                            if not unit_match and i + 1 < len(lines):
                                next_line = lines[i + 1].strip()
                                unit_match = re.search(unit_pattern, next_line)
                                if unit_match:
                                    unit = unit_match.group(0)
                                    i += 1
                            elif unit_match:
                                unit = unit_match.group(0)

                        elif re.match(interval_nonvalue, value_line):
                            value = value_line

                            # Dacă valoarea e NONVALUE, trebuie să decidem:
                            if re.match(interval_pattern, interval):  # interval cu <>
                                # Căutăm unitate
                                unit_match = re.search(unit_pattern, interval)
                                if not unit_match and i + 1 < len(lines):
                                    next_line = lines[i + 1].strip()
                                    unit_match = re.search(unit_pattern, next_line)
                                    if unit_match:
                                        unit = unit_match.group(0)
                                        i += 1
                                elif unit_match:
                                    unit = unit_match.group(0)
                            else:
                                # NU căutăm unitate (nonvalue simplu)
                                unit = None

        # Dacă am găsit toate câmpurile necesare
        if name and value and interval:
            analyses.append({
                "nume": name,
                "valoare": value,
                "unitate": unit,
                "interval": interval,
                "data_recoltare": data_recoltare
            })

        i += 1

    return analyses



def test_parse_before_mode():
    text_before = """
    data recoltare 25/03/2025
    [28 - 100]
    AMILAZA SERICA
    =   102
    U/L
    Ser, Metoda spectrofotometrica

    <0.9
    ANTICORPI ANTI-HELICOBACTER PYLORI IgG
    =   1.59
    U/mL
    Ser, Metoda chemiluminiscenta
    negativ <25 WBC/ul
    Leucocite (WBC)
    NEGATIV WBC/ul
    negativ <3 RBC/ul
    Hematii (RBC)
    NEGATIV RBC/ul
    negativ
    Nitriti
    NEGATIV
    negativ <5 mg/dl
    Corpi cetonici
    NEGATIV mg/dl
    negativ
    Bilirubina
    NEGATIV

    negativ <2.0 mg/dl
    Urobilinogen
    0,1 mg/dl
    <15 mg/dl
    Proteine
    NEGATIV mg/dl



    """

    lines = [line.strip() for line in text_before.splitlines() if line.strip()]
    results = parse_before_mode(lines)

    for res in results:
        print(res)

    print("ALTAAAAAAAAAAAAAAAAA")

    text_messy = """
    ba blabla uite data aici dar nu e buna
    haha
    uite ce faci
    data recoltare 25/03/2025



    [28 - 100]
    Informatii suplimentare: analiza efectuata la ora 9AM
    AMILAZA SERICA
    =
    102
    U/L
    Observatii: pacient născut în 1999

    <0.9
    Nota: rezultatul poate varia
    ANTICORPI ANTI-HELICOBACTER PYLORI IgG
    =   
    1.59
    U/mL
    Metoda: chemiluminiscenta

    [3.5 - 5.5]
    ALBUMINA
    =4.6
    g/dL
    """

    lines_messy = [line.strip() for line in text_messy.splitlines() if line.strip()]
    results_messy = parse_before_mode(lines_messy)

    for res in results_messy:
        print(res)
    print("ALTAAAAAAAAAAAAAAAAA")

#test_parse_before_mode()



def parse_after_mode(lines):
    data_recoltare=data_recoltare_detect(lines)
    analyses = []
    i = 0

    while i+1 < len(lines):
        line = lines[i]
        # print(i)
        # print(line)
                # Căutăm dacă linia are un nume valid de analiză
        name = None
        if line.strip() and  not re.search(r"^(Informatii|Metoda|Nota|Observatii|Ser|Adresa|Data|CNP|Pagina|TRIMIS DE|LUCRAT|GENERAT|VALORI BIOLOGICE|ANTECEDENT).*", line, re.IGNORECASE):
            name = line.strip()

            # Căutăm valoarea
            value = None
            unit = None
            interval = None

            while i + 1 < len(lines):
                i += 1
                value_line = lines[i].strip()

                if value_line == "=":
                    continue

                if re.match("=", value_line):
                    value_line = value_line[1:].strip()

                # Verificăm dacă value_line este o valoare validă
                value_match = re.match(value_pattern, value_line)
                if value_match:
                    value = value_match.group(0).replace(',', '.')
                    unit_match = re.search(unit_pattern, value_line)
                    if unit_match:
                        unit = unit_match.group(0)
                    else:
                        # Dacă nu găsim unitatea în aceeași linie, ne uităm pe linia următoare
                        if i + 1 < len(lines):
                            next_line = lines[i + 1].strip()
                            unit_match = re.search(unit_pattern, next_line)
                            if unit_match:
                                unit = unit_match.group(0)
                                i += 1  # consumăm linia de unitate


                    # După valoare, căutăm intervalul
                    if i + 1 < len(lines):
                        next_line = lines[i + 1].strip()
                        interval_match = re.search(interval_pattern, next_line)
                        if interval_match:
                            interval = interval_match.group(0).strip()
                            i += 1  # sărim și peste linia cu intervalul
                      


                elif re.match(interval_nonvalue, value_line):
                    # Caz 2 sau 3: NONVALUE
                    value = re.match(interval_nonvalue, value_line).group(0)
                    if i + 1 < len(lines):
                        next_line = lines[i + 1].strip()

                        if re.search(interval_pattern, next_line):
                            interval = next_line
                            i += 1
                            # Căutăm și unitatea la interval dacă există
                            unit_match = re.search(unit_pattern, interval)
                            if unit_match:
                                unit = unit_match.group(0)
                        else:
                            interval = next_line
                            i += 1

                break  # După ce am găsit valoare + interval

            if value is None:
                continue
            if interval==None:
                continue
            analyses.append({
                "nume": name,
                "valoare": value,
                "unitate": unit,
                "interval": interval,
                "data_recoltare": data_recoltare
            })

        i += 1

    return analyses


def test_parse_after_mode():
    text_after = """
    data recoltare 25/03/2025
    Hematii
    4.800.000 /mm³
    (3.900.000 - 5.200.000)

    Leucocite (WBC)
    NEGATIV WBC/ul
    negativ <25  WBC/ul

    Glucoză
    93 mg/dL
    (74 - 106)
    5,16 mmol/L
    (4,11 - 5,88)

    Densitate
    1,025
    1,001-1,035

    Leucocite (WBC)
    NEGATIV WBC/ul
    negativ <25 WBC/ul
    Hematii (RBC)
    NEGATIV RBC/ul
    negativ <3 RBC/ul
    Nitriti
    NEGATIV
    negativ
    Corpi cetonici
    NEGATIV mg/dl
    negativ <5 mg/dl
    Bilirubina
    NEGATIV
    negativ
    Urobilinogen
    0,1 mg/dl
    negativ <2.0 mg/dl
    Proteine
    NEGATIV mg/dl
    <15 mg/dl
    Rata de filtrare glomerulară estimată - eGFR (CKD-EPI 2009)*
    103,82 mL/min/1.73m²
    (> 60,0)
    Se utilizează numai când funcția renală și producția de creatinină sunt stabile (nu se aplică în insuficiența
    renală acută).
    Nu se utilizează în cazul pacienților cu masă musculară crescută (culturiști), masă musculară diminuată (boli
    degenerative musculare), a pacienților obezi, malnutriți, a celor care urmează o dieta strict vegetariană sau
    care își suplimentează dieta cu creatină.
    Nu se aplică sub 18 ani și peste 75 ani.
    Este influențat de: gentamicină, cisplatin, cefoxitin.
    (calcul)
    Creatinină serică
    0,81 mg/dL
    (0,50 - 0,80)
    72 µmol/L
    (44 - 71)
    (ser, spectrofotometrie)
    Feritină
    27,6 
    ng/mL
    (10,0 - 291,0)

    60,7 pmol/L
    (22,0 - 640,2)
    În funcție de contextul clinic (insuficiență cardiacă, boala inflamatorie intestinală, boală cronică renală,
    afecțiuni oncologice, sarcină, transfuzii în perioada perioperatorie), o valoare a feritinei mai mică de 100
    ng/mL poate fi considerată sugestivă pentru diagnosticul de deficit de fier. Conform indicațiilor din
    ghidurile clinice, pentru aprecierea corectă a nivelului de fier, se recomandă efectuarea unor teste
    suplimentare (ex: saturația transferinei). Valori fals crescute ale feritinei pot fi asociate unor procese
    inflamatorii.
    (ser, chemiluminiscență)
    Vitamina B12 (ciancobalamina)
    376 pg/mL
    (211 - 911)
    277 pmol/L
    (156 - 672)
    (ser, chemiluminiscență)
    Pagina 2 / 4
    BALUTI LAURA LOREDANA    F, 21 ani
    CNP
    6040113250947
    DATA NAȘTERII
    13.01.2004
    ADRESA
    STR Primăverii 14A, Strehaia, Mehedinți
    TRIMIS DE
    medic primar Popescu Silvia-Corina (C06815)
    00004 *Bioclinica Dumbrăvița
    Buletin de analize 25304T0283 din 04.03.2025
    RECOLTAT
    04.03.2025 08:00
    LUCRAT
    Bioclinica SA
    BLD Cetății 53B, Timișoara
    GENERAT
    04.03.2025 14:38
    VALORI BIOLOGICE DE REFERINȚĂ
    ANTECEDENT
    Rezultatele se referă numai la proba analizată. Reproducerea totală sau parțială a buletinului de analize se face numai cu acordul BIOCLINICA.
    bioclinica.ro
    F01 - PG22
    Ed.1, Rev.0
    Fier seric (sideremie)
    53 µg/dL
    (50 - 170)
    9,5 µmol/L
    (9,0 - 30,4)
    (ser, spectrofotometrie)
    Acid uric seric
    4,8 mg/dL
    (3,1 - 7,8)
    286 µmol/L
    (184 - 464)
    (ser, spectrofotometrie)
    Calciu ionic seric
    1,27 mmol/L
    (1,16 - 1,32)
    (ser, ISE)
    medic primar Gaiță Pîrvan Corina (D15815)
    Hemoleucogramă
    Hematii
    4.800.000 /mm³
    (3.900.000 - 5.200.000)
    Hemoglobină
    12,7 g/dL
    (12,0 - 15,6)


    """

    lines_after = [line.strip() for line in text_after.splitlines() if line.strip()]
    results_after = parse_after_mode(lines_after)

    for res in results_after:
        print(res)

#test_parse_after_mode()







#parsare la o forma si mai buna json
# {
#   "nume": "",
#   "valoare": "",
#   "unit": "",
#   "intv": {
#     "nonvalue": "",
#     "min": "",
#     "max": ""
#   },
#   "data": ""
# }


def parse_interval(interval_raw):
    interval_raw = interval_raw.strip().lower()

    # Format: 'negativ <5 mg/dl' → nonvalue='negativ', min=None, max='5'
    if 'negativ' in interval_raw and '<' in interval_raw:
        match = re.search(r'<\s*([\d\.,]+)', interval_raw)
        return {
            'nonvalue': 'negativ',
            'min': None,
            'max': match.group(1) if match else None
        }

    # Format: 'negativ' → nonvalue='negativ', min=None, max=None
    elif 'negativ' in interval_raw:
        return {
            'nonvalue': 'negativ',
            'min': None,
            'max': None
        }

    # Format: '<25 WBC/ul' → nonvalue=None, min=None, max='25'
    elif interval_raw.startswith('<'):
        match = re.search(r'<\s*([\d\.,]+)', interval_raw)
        return {
            'nonvalue': None,
            'min': None,
            'max': match.group(1) if match else None
        }

    # Format: '(3.9 - 5.2)' or '[3.5 - 5.5]' or '1,001-1,035'
    match = re.search(r'[\[\(]?\s*([\d\.,]+)\s*[-–]\s*([\d\.,]+)\s*[\]\)]?', interval_raw)
    if match:
        return {
            'nonvalue': None,
            'min': match.group(1).replace(',', '.'),
            'max': match.group(2).replace(',', '.')
        }

    # Format: '<2.0 mg/dl' or similar → max only
    match = re.search(r'<\s*([\d\.,]+)', interval_raw)
    if match:
        return {
            'nonvalue': None,
            'min': None,
            'max': match.group(1).replace(',', '.')
        }

    # Default: can't parse
    return {
        'nonvalue': interval_raw,
        'min': None,
        'max': None
    }


def transform_analysis_list(pacient):
    rezultat = []
    for a in pacient.get("analize", []):
        rezultat.append({
            'nume': a.get('nume'),
            'valoare': a.get('valoare'),
            'unit': a.get('unitate'),  
            'intv': parse_interval(a.get('interval', '')),
            'data': a.get('data_recoltare')
        })
    return rezultat


def extract_pacient_data(text):
    lines = text.splitlines()
    pacient = {}
    pacient["analize"] = []  # Inițializăm lista de analize
    #pacient["data_recoltare"] = data_recoltare_detect(text)
    type = detect_document_type(text)
    if(type=="BEFORE"):
        pacient["analize"] = parse_before_mode(lines)
        pacient_interval_parsed = transform_analysis_list(pacient)
    elif(type=="AFTER"):
        pacient["analize"] = parse_after_mode(lines)
        pacient_interval_parsed = transform_analysis_list(pacient)
    return pacient_interval_parsed



# check check check
# from utils import pdf_to_text
# text = pdf_to_text(".\\backend\\testfiles\\testfiles_true\\analizaLaura.pdf")

# pacient = extract_pacient_data(text)
# print(pacient)


