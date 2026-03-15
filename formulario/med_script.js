const STORAGE_THEME_KEY = 'horus_med_theme';

const MEDICAMENTOS = [
    {
        "codigo": "BR0348807",
        "nome": "ABAIXADOR DE LÍNGUA, MADEIRA, 14 CM",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0397513",
        "nome": "AGULHA HIPODÉRMICA 13 X 0,45",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0397510",
        "nome": "AGULHA HIPODÉRMICA 20 X 0,55",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0397505",
        "nome": "AGULHA HIPODÉRMICA 25 X 0,7",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0397502",
        "nome": "AGULHA HIPODÉRMICA 25 X 0,8",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0279629",
        "nome": "AGULHA HIPODÉRMICA 25 X 6",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0269628",
        "nome": "ALBENDAZOL 200 MG COMPRIMIDO",
        "categoria": "Anti-helmíntico / Antiparasitário",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267507U0063",
        "nome": "ALBENDAZOL 40 MG/ML SUSPENSÃO ORAL 10 ML",
        "categoria": "Anti-helmíntico / Antiparasitário",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267506U0042",
        "nome": "ALBENDAZOL 400 MG COMPRIMIDO MASTIGÁVEL",
        "categoria": "Anti-helmíntico / Antiparasitário",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0320817",
        "nome": "ALGODÃO HIDRÓFILO 500 G",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0271356",
        "nome": "ALPRAZOLAM 1 MG COMPRIMIDO",
        "categoria": "Saúde Mental",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0284465",
        "nome": "ALPRAZOLAM 2 MG COMPRIMIDO",
        "categoria": "Saúde Mental",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0271660-1",
        "nome": "AMBROXOL, CLORIDRATO 3 MG/ML XAROPE 100 ML",
        "categoria": "Antialérgico / Expectorante",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0271659-1",
        "nome": "AMBROXOL, CLORIDRATO 6 MG/ML XAROPE  100 ML",
        "categoria": "Antialérgico / Expectorante",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267512U0042",
        "nome": "AMITRIPTILINA, CLORIDRATO 25 MG COMPRIMIDO",
        "categoria": "Saúde Mental",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0271111U0110",
        "nome": "AMOXICILINA 50 MG/ML PÓ PARA SUSPENSÃO 60 ML",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0271089U0042",
        "nome": "AMOXICILINA 500 MG COMPRIMIDO",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0271089U0041",
        "nome": "AMOXICILINA 500 MG CÁPSULA",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "CÁPSULA"
    },
    {
        "codigo": "BR0271092",
        "nome": "AMOXICILINA 80 MG/ML PÓ PARA SUSPENSÃO 100 ML",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267139",
        "nome": "AMPICILINA 50 MG/ML SUSPENSÃO ORAL 60 ML",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0268896U0042",
        "nome": "ANLODIPINO, BESILATO 10 MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0272434U0042",
        "nome": "ANLODIPINO, BESILATO 5 MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0207893",
        "nome": "ATADURA ALGODÃO 15 CM",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0316084",
        "nome": "ATADURA, CREPOM 15 CM",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0267516",
        "nome": "ATENOLOL 25 MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267517U0042",
        "nome": "ATENOLOL 50 MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0268080",
        "nome": "ATORVASTATINA CÁLCICA 10 MG COMPRIMIDO",
        "categoria": "Hipolipemiante",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0375041",
        "nome": "AVENTAL DESCARTÁVEL 30 G/M2",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR026895U0042",
        "nome": "AZITROMICINA 1 G COMPRIMIDO",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR031451700155",
        "nome": "AZITROMICINA 40 MG/ML (1200 MG) PÓ PARA SUSPENSÃO 30 ML",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0314517U0108",
        "nome": "AZITROMICINA 40 MG/ML (600 MG) PÓ PARA SUSPENSÃO 15 ML",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0314517U0155",
        "nome": "AZITROMICINA 40 MG/ML 1200 MG PÓ PARA SUSPENSÃO 30 ML",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267140U0042",
        "nome": "AZITROMICINA 500 MG COMPRIMIDO",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0270612U0118",
        "nome": "BENZILPENICILINA BENZATINA 1.200.000 UI PÓ PARA SUSPENSÃO INJETÁVEL",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO-AMPOLA"
    },
    {
        "codigo": "BR0270613U0118",
        "nome": "BENZILPENICILINA BENZATINA 600.000 UI PÓ PARA SUSPENSÃO INJETÁVEL",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO-AMPOLA"
    },
    {
        "codigo": "BR0270140U0042",
        "nome": "BIPERIDENO, CLORIDRATO  2 MG COMPRIMIDO ELENCO ESTADUAL",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR027014000042",
        "nome": "BIPERIDENO, CLORIDRATO 2 MG COMPRIMIDO",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0268352-1",
        "nome": "BRIMONIDINA, TARTARATO 0,2% SOLUÇÃO OFTÁLMICA 5 ML",
        "categoria": "Oftalmológico",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0271773",
        "nome": "BROMAZEPAM 3 MG COMPRIMIDO",
        "categoria": "Saúde Mental",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0272454U0062",
        "nome": "CARBAMAZEPINA 20 MG/ML SUSPENSÃO ORAL 100 ML",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0392264",
        "nome": "CARBAMAZEPINA 20 MG/ML XAROPE 100 ML",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267618U0042",
        "nome": "CARBAMAZEPINA 200 MG COMPRIMIDO",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267617U0042",
        "nome": "CARBAMAZEPINA 400 MG COMPRIMIDO",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0270895U0042",
        "nome": "CARBONATO DE CÁLCIO 500 MG COMPRIMIDO",
        "categoria": "Suplemento / Vitamina",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0327792-1",
        "nome": "CEFALEXINA 25 MG/ML SUSPENSÃO ORAL 100 ML",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0327792",
        "nome": "CEFALEXINA 25 MG/ML SUSPENSÃO ORAL 60 ML",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267625U0042",
        "nome": "CEFALEXINA 500 MG COMPRIMIDO",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0308736-2",
        "nome": "CETOCONAZOL 2% CREME 30 G",
        "categoria": "Antifúngico",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0267151",
        "nome": "CETOCONAZOL 200 MG COMPRIMIDO",
        "categoria": "Antifúngico",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267632U0042",
        "nome": "CIPROFLOXACINO, CLORIDRATO 500 MG COMPRIMIDO",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0270118",
        "nome": "CLONAZEPAM 0,5 MG COMPRIMIDO",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0270119",
        "nome": "CLONAZEPAM 2 MG COMPRIMIDO",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0270120U0086",
        "nome": "CLONAZEPAM 2,5 MG/ML SOLUÇÃO ORAL 20 ML",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0268236U0039",
        "nome": "CLORETO DE SÓDIO 0,9 % SOLUÇÃO INJETÁVEL 500 ML (SISTEMA FECHADO)",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0448699",
        "nome": "CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL 100 ML",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0268236U0034",
        "nome": "CLORETO DE SÓDIO 0,9% SOLUÇÃO INJETÁVEL 100 ML (SISTEMA FECHADO)",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0419399",
        "nome": "COLETOR DE URINA (SISTEMA ABERTO, NÃO ESTÉRIL)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0363485",
        "nome": "COLETOR MATERIAL PERFURO-CORTANTE 20 L",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0269973",
        "nome": "COMPRESSA GAZE 7,50 X 7,50 CM (9 FIOS, 8 CAMADAS)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0269976",
        "nome": "COMPRESSA GAZE, TECIDO 100% ALGODÃO, 9 FIOS/CM2, COR BRANCA,ISENTA DE IMPUREZAS, 8 CAMADAS, 10 CM, 10 CM, 5 DOBRAS, DESCARTÁVEL",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0268243U0062",
        "nome": "DEXAMETASONA 0,1 MG/ML ELIXIR 100 ML",
        "categoria": "Corticosteroide",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267643U0015",
        "nome": "DEXAMETASONA 0,1% CREME 10 G",
        "categoria": "Corticosteroide",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0267643-1",
        "nome": "DEXAMETASONA 1% CREME 20 G",
        "categoria": "Corticosteroide",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0267197U0042",
        "nome": "DIAZEPAM 10 MG COMPRIMIDO",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267195U0042",
        "nome": "DIAZEPAM 5 MG COMPRIMIDO",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267647U0042",
        "nome": "DIGOXINA 0,25 MG COMPRIMIDO",
        "categoria": "Assistência Farmacêutica Básica",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267203U0042",
        "nome": "DIPIRONA SÓDICA 500 MG COMPRIMIDO",
        "categoria": "Analgésico e Antitérmico",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267205U0063",
        "nome": "DIPIRONA SÓDICA 500 MG/ML SOLUÇÃO ORAL 10 ML",
        "categoria": "Analgésico e Antitérmico",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267651U0042",
        "nome": "ENALAPRIL, MALEATO 10 MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267652U0042",
        "nome": "ENALAPRIL, MALEATO 20 MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0442205",
        "nome": "EQUIPO MACROGOTAS (COM BURETA 150 ML)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0374985",
        "nome": "ESCALPE, 21 G",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0279515",
        "nome": "ESCALPE, 23 G, TUBO PVC, ASAS LEVES,FLEXÍVEIS,CONECTOR LUER CÔNICO RÍGIDO, COLETA SANGUE VÁCUO,ADAPTADOR LUER COLETA MÚLTIPLA, ESTÉRIL, DESCARTÁVEL",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0291770",
        "nome": "ESCITALOPRAM, OXALATO 10 MG COMPRIMIDO",
        "categoria": "Saúde Mental",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0291771",
        "nome": "ESCITALOPRAM, OXALATO 20 MG COMPRIMIDO",
        "categoria": "Saúde Mental",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0286038",
        "nome": "ESCOVA ENDOCERVICAL",
        "categoria": "Assistência Farmacêutica Básica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0278500",
        "nome": "ESPARADRAPO 10 CM X 4,50 M (IMPERMEÁVEL)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0267653U0042",
        "nome": "ESPIRONOLACTONA 25 MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0244715",
        "nome": "ESPÁTULA AYRES (18 CM, DESCARTÁVEL)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0275471",
        "nome": "ESPÉCULO VAGINAL, GRANDE",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0275472",
        "nome": "ESPÉCULO VAGINAL, MÉDIO",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0275473",
        "nome": "ESPÉCULO VAGINAL, PEQUENO",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0267657U0042",
        "nome": "FENITOÍNA SÓDICA 100 MG COMPRIMIDO",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267660U0042",
        "nome": "FENOBARBITAL 100 MG COMPRIMIDO",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0300723U0086",
        "nome": "FENOBARBITAL 40 MG/ML SOLUÇÃO ORAL 20 ML",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0230812",
        "nome": "FITA AUTOCLAVE (30 M, 19 MM)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0373715",
        "nome": "FIXADOR CITOLÓGICO (SPRAY 100 ML)",
        "categoria": "Assistência Farmacêutica Básica",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267662U0041",
        "nome": "FLUCONAZOL 150 MG CÁPSULA",
        "categoria": "Antifúngico",
        "apresentacao": "CÁPSULA"
    },
    {
        "codigo": "BR0279893",
        "nome": "FRASCO TIPO ALMOTOLIA 250 ML (BICO RETO, TRANSPARENTE)",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0279889",
        "nome": "FRASCO TIPO ALMOTOLIA 500 ML (BICO RETO, AMBAR)",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0267663U0042",
        "nome": "FUROSEMIDA 40 MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0275238-5",
        "nome": "GEL CONDUTOR PARA ULTRASSONOGRAFIA 5 KG",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0325424U0541",
        "nome": "GEL LUBRIFICANTE, ÍNTIMO, INCOLOR, INODORO, SOLÚVEL EM ÁGUA, TRANSPARENTE E NÃO GORDUROSO, SACHÊ 5 G",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0267671U0042",
        "nome": "GLIBENCLAMIDA 5 MG COMPRIMIDO",
        "categoria": "Antidiabético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0270092U0039",
        "nome": "GLICOSE 5 % SOLUÇÃO INJETÁVEL 500 ML SISTEMA FECHADO",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR027009200039",
        "nome": "GLICOSE 5% SOLUÇÃO INJETÁVEL 500 ML (SISTEMA FECHADO)",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0267541U0004",
        "nome": "GLICOSE 50% SOLUÇÃO INJETÁVEL 10 ML",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "AMPOLA"
    },
    {
        "codigo": "BR0267674U0042",
        "nome": "HIDROCLOROTIAZIDA  25MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0433257-1",
        "nome": "HIDRÓXIDO DE ALUMÍNIO 60 MG/ML SOLUÇÃO ORAL 100 ML",
        "categoria": "Antiácido / Protetor Gástrico",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0433257U0062",
        "nome": "HIDRÓXIDO DE ALUMÍNIO 60 MG/ML SUSPENSÃO ORAL 100 ML",
        "categoria": "Antiácido / Protetor Gástrico",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0340783U0062",
        "nome": "HIDRÓXIDO DE ALUMÍNIO 61,5 MG/ML SUSPENSÃO ORAL 100 ML",
        "categoria": "Antiácido / Protetor Gástrico",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0437156U0105",
        "nome": "HIPOCLORITO DE SÓDIO 2,0 A 2,5 % SOLUÇÃO 50 ML",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0332755U0097",
        "nome": "IBUPROFENO 100 MG/ML SUSPENSÃO ORAL 30 ML",
        "categoria": "Anti-inflamatório",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267677U0042",
        "nome": "IBUPROFENO 300 MG COMPRIMIDO",
        "categoria": "Anti-inflamatório",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0294643U0097",
        "nome": "IBUPROFENO 50 MG/ML SUSPENSÃO ORAL 30 ML",
        "categoria": "Anti-inflamatório",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267676U0042",
        "nome": "IBUPROFENO 600 MG COMPRIMIDO",
        "categoria": "Anti-inflamatório",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0398704",
        "nome": "IODOPOVIDONA (PVPI) 10% SOLUÇÃO ALCÓOLICA 1 L",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0268331U0075",
        "nome": "IPRATRÓPIO, BROMETO 0,25 MG/ML SOLUÇÃO PARA INALAÇÃO 15 ML",
        "categoria": "Broncodilatador",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0268331U0086",
        "nome": "IPRATRÓPIO, BROMETO 0,25 MG/ML SOLUÇÃO PARA INALAÇÃO 20 ML",
        "categoria": "Broncodilatador",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0246812",
        "nome": "LANCETA AÇO (TESTE SANGUÍNEO)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0268855",
        "nome": "LENÇOL DESCARTÁVEL (PAPEL, ROLO 0,50 X 50 M)",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0272789U0042",
        "nome": "LEVONORGESTREL + ETINILESTRADIOL 0,15 + 0,03 MG COMPRIMIDO",
        "categoria": "Hormonal / Contraceptivo",
        "apresentacao": "CARTELA"
    },
    {
        "codigo": "BR0268956U0042",
        "nome": "LEVONORGESTREL 0,75 MG COMPRIMIDO",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0268856U0042",
        "nome": "LOSARTANA POTÁSSICA 50 MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0269892",
        "nome": "LUVA PARA PROCEDIMENTO NÃO CIRÚRGICO, GRANDE",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0269893",
        "nome": "LUVA PARA PROCEDIMENTO NÃO CIRÚRGICO, MÉDIA",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0269894",
        "nome": "LUVA PARA PROCEDIMENTO NÃO CIRÚRGICO, PEQUENA, LÁTEX NATURAL, COM PÓ BIOABSORVÍVEL",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0325098",
        "nome": "LÂMINA VIDRO (BORDA FOSCA, 76,2 X 25,4 MM)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0267692",
        "nome": "MEBENDAZOL 100 MG COMPRIMIDO",
        "categoria": "Anti-helmíntico / Antiparasitário",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267694",
        "nome": "MEBENDAZOL 20 MG/ML SUSPENSÃO ORAL 30 ML",
        "categoria": "Anti-helmíntico / Antiparasitário",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0292228U0005",
        "nome": "MEDROXIPROGESTERONA, ACETATO 150 MG/ML SOLUÇÃO INJETÁVEL 1 ML",
        "categoria": "Hormonal / Contraceptivo",
        "apresentacao": "AMPOLA"
    },
    {
        "codigo": "BR0398702U0005",
        "nome": "MEDROXIPROGESTERONA, ACETATO 150 MG/ML SUSPENSÃO INJETÁVEL 1 ML",
        "categoria": "Hormonal / Contraceptivo",
        "apresentacao": "AMPOLA"
    },
    {
        "codigo": "BR0267690U0042",
        "nome": "METFORMINA, CLORIDRATO 500 MG COMPRIMIDO",
        "categoria": "Antidiabético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267689U0042",
        "nome": "METILDOPA 250 MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0394856U0062",
        "nome": "METRONIDAZOL (BENZOILMETRONIDAZOL) 40 MG/ML SUSPENSÃO ORAL 100 ML",
        "categoria": "Anti-helmíntico / Antiparasitário",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0266863U0067",
        "nome": "METRONIDAZOL (BENZOILMETRONIDAZOL) 40 MG/ML SUSPENSÃO ORAL 120 ML",
        "categoria": "Anti-helmíntico / Antiparasitário",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0345300",
        "nome": "METRONIDAZOL 100 MG/G CREME VAGINAL 50 G",
        "categoria": "Anti-helmíntico / Antiparasitário",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0338591U0030",
        "nome": "METRONIDAZOL 100 MG/G GEL 50 G",
        "categoria": "Anti-helmíntico / Antiparasitário",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0267717U0042",
        "nome": "METRONIDAZOL 250 MG COMPRIMIDO",
        "categoria": "Anti-helmíntico / Antiparasitário",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0268286U0031",
        "nome": "MICONAZOL, NITRATO 2% CREME 80 G",
        "categoria": "Antifúngico",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0268162U0020",
        "nome": "MICONAZOL, NITRATO 2% CREME VAGINAL 28 G",
        "categoria": "Antifúngico",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0341923",
        "nome": "MÁSCARA CIRÚRGICA (3 CAMADAS)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0385112",
        "nome": "MÁSCARA DESCARTÁVEL USO GERAL",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0273167-1",
        "nome": "NEOMICINA + BACITRACINA POMADA 10 G",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0267378U0105",
        "nome": "NISTATINA 100.000 UI/ML SUSPENSÃO ORAL  50  ML",
        "categoria": "Antifúngico",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267378U0097",
        "nome": "NISTATINA 100.000 UI/ML SUSPENSÃO ORAL 30 ML",
        "categoria": "Antifúngico",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267378U0110",
        "nome": "NISTATINA 100.000 UI/ML SUSPENSÃO ORAL 60 ML",
        "categoria": "Antifúngico",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0266788-1",
        "nome": "NISTATINA 25.000 UI/G CREME VAGINAL  50 G",
        "categoria": "Antifúngico",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0267733U0042",
        "nome": "NORETISTERONA 0,35 MG COMPRIMIDO",
        "categoria": "Hormonal / Contraceptivo",
        "apresentacao": "CARTELA"
    },
    {
        "codigo": "BR0270846U0005",
        "nome": "NORETISTERONA, ENANTATO + ESTRADIOL, VALERATO 50 + 5 MG/ML INJETÁVEL 1 ML",
        "categoria": "Hormonal / Contraceptivo",
        "apresentacao": "AMPOLA"
    },
    {
        "codigo": "BR0271621",
        "nome": "OLANZAPINA 10 MG COMPRIMIDO",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267712U0041",
        "nome": "OMEPRAZOL 20 MG CÁPSULA",
        "categoria": "Antiácido / Protetor Gástrico",
        "apresentacao": "CÁPSULA (CPS.)"
    },
    {
        "codigo": "BR0274396",
        "nome": "PAPEL GRAU CIRÚRGICO (20 CM X 100 M)",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0438072",
        "nome": "PAPEL GRAU CIRÚRGICO CERCA DE 50 CM, 100 M",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0267776-1",
        "nome": "PARACETAMOL 100 MG/ML SOLUÇÃO ORAL 10 ML",
        "categoria": "Analgésico e Antitérmico",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267777U0063",
        "nome": "PARACETAMOL 200 MG/ML SOLUÇÃO ORAL 10 ML",
        "categoria": "Analgésico e Antitérmico",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267778U0042",
        "nome": "PARACETAMOL 500 MG COMPRIMIDO",
        "categoria": "Analgésico e Antitérmico",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267779",
        "nome": "PARACETAMOL 750 MG COMPRIMIDO",
        "categoria": "Analgésico e Antitérmico",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0412639",
        "nome": "PORTA LÂMINA (POLIPROPILENO, ATÉ 3 LÂMINAS)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0268151U0110",
        "nome": "PREDNISOLONA 1 MG/ML SOLUÇÃO ORAL 60 ML",
        "categoria": "Corticosteroide",
        "apresentacao": "FRASCO (FR)"
    },
    {
        "codigo": "BR0448595U0110",
        "nome": "PREDNISOLONA 3 MG/ML SOLUÇÃO ORAL 60 ML",
        "categoria": "Corticosteroide",
        "apresentacao": "FRASCO (FR)"
    },
    {
        "codigo": "BR0267743U0042",
        "nome": "PREDNISONA 20 MG COMPRIMIDO",
        "categoria": "Corticosteroide",
        "apresentacao": "COMPRIMIDO (COMP)"
    },
    {
        "codigo": "BR0267768U0042",
        "nome": "PROMETAZINA, CLORIDRATO 25 MG COMPRIMIDO",
        "categoria": "Antialérgico / Expectorante",
        "apresentacao": "COMPRIMIDO (COMP)"
    },
    {
        "codigo": "BR0267772U0042",
        "nome": "PROPRANOLOL, CLORIDRATO 40 MG COMPRIMIDO",
        "categoria": "Anti-hipertensivo / Diurético",
        "apresentacao": "COMPRIMIDO (COMP)"
    },
    {
        "codigo": "BR0268390U0052",
        "nome": "SAIS PARA REIDRATAÇÃO ORAL (27,9 G PÓ)",
        "categoria": "Assistência Farmacêutica Básica",
        "apresentacao": "ENVELOPE (ENV.)"
    },
    {
        "codigo": "BR0293839U0052",
        "nome": "SAIS PARA REIDRATAÇÃO ORAL (8,5 G PÓ)",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "ENVELOPE (ENV.)"
    },
    {
        "codigo": "BR0268390",
        "nome": "SAIS PARA REIDRATAÇÃO ORAL (PÓ CONTENDO 27,9 G)",
        "categoria": "Assistência Farmacêutica Básica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0259680",
        "nome": "SAIS PARA REIDRATAÇÃO ORAL (SACHÊ 26 G)",
        "categoria": "Assistência Farmacêutica Básica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0292331-1",
        "nome": "SALBUTAMOL, SULFATO 0,4 MG/ML XAROPE 100 ML",
        "categoria": "Broncodilatador",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0292331-2",
        "nome": "SALBUTAMOL, SULFATO 0,4 MG/ML XAROPE 120 ML",
        "categoria": "Broncodilatador",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0268299",
        "nome": "SECNIDAZOL 1.000 MG COMPRIMIDO",
        "categoria": "Anti-helmíntico / Antiparasitário",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0298557",
        "nome": "SERINGA 10 ML (+ AGULHA 25 MM X 7 MM)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0292119",
        "nome": "SERINGA 20 ML (+ AGULHA 25 MM X 7 MM)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0291012",
        "nome": "SERINGA 3 ML (+ AGULHA 25 MM X 7 MM)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0292118",
        "nome": "SERINGA 5 ML (+ AGULHA 25 X 7 MM)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR028504000140",
        "nome": "SERINGA PARA INSULINA 1 ML (COM AGULHA 13 X 3,8)",
        "categoria": "Antidiabético",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0285040U0140",
        "nome": "SERINGA PARA INSULINA, 1 ML, APIROGÊNICA E ATÓXICA, 100 UI COM BOA VISUALIZAÇÃO, DESCARTÁVEL, ESTÉRIL, AGULHA 13 X 3,8",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR041296600063",
        "nome": "SIMETICONA 75 MG/ML EMULSÃO ORAL 10 ML",
        "categoria": "Assistência Farmacêutica / Assistência Farmacêutica Básica",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0412966U0063",
        "nome": "SIMETICONA 75 MG/ML EMULSÃO ORAL, 10 ML",
        "categoria": "Antiácido / Protetor Gástrico",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0412965-1",
        "nome": "SIMETICONA 75 MG/ML SUSPENSÃO ORAL 10 ML",
        "categoria": "Assistência Farmacêutica Básica",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267747U0042",
        "nome": "SINVASTATINA 20 MG COMPRIMIDO",
        "categoria": "Hipolipemiante",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0267745U0042",
        "nome": "SINVASTATINA 40 MG COMPRIMIDO",
        "categoria": "Hipolipemiante",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0277016",
        "nome": "SONDA FOLEY Nº 12 (2 VIAS, BALÃO 30 ML)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0277019",
        "nome": "SONDA FOLEY Nº 18 (2 VIAS, BALÃO 30 ML)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0282375",
        "nome": "SONDA URETRAL Nº 12 (SILICONE, ESTÉRIL)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0272089U0023",
        "nome": "SULFADIAZINA DE PRATA 1% CREME 30 G",
        "categoria": "Assistência Farmacêutica Básica",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0272089-7",
        "nome": "SULFADIAZINA DE PRATA 1% CREME 400 G",
        "categoria": "Assistência Farmacêutica Básica",
        "apresentacao": "POTE (PTE.)"
    },
    {
        "codigo": "BR0308884U0062",
        "nome": "SULFAMETOXAZOL + TRIMETOPRIMA 40 + 8 MG/ML SUSPENSÃO ORAL 100 ML",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0308884U0067",
        "nome": "SULFAMETOXAZOL + TRIMETOPRIMA 40 MG/ML + 8 MG/ML SUSPENSÃO ORAL 120 ML",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0308882U0042",
        "nome": "SULFAMETOXAZOL + TRIMETOPRIMA 400 + 80 MG COMPRIMIDO",
        "categoria": "Antibiótico / Antimicrobiano",
        "apresentacao": "COMPRIMIDO (COMP.)"
    },
    {
        "codigo": "BR0292344U0042",
        "nome": "SULFATO FERROSO (40 MG FERRO ELEMENTAR) COMPRIMIDO",
        "categoria": "Suplemento / Vitamina",
        "apresentacao": "COMPRIMIDO (COMP.)"
    },
    {
        "codigo": "BR0396947",
        "nome": "SULFATO FERROSO 10 MG/ML XAROPE 100 ML",
        "categoria": "Suplemento / Vitamina",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0292345U0097",
        "nome": "SULFATO FERROSO 125 MG/ML SOLUÇÃO ORAL 30 ML",
        "categoria": "Suplemento / Vitamina",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0332468U0110",
        "nome": "SULFATO FERROSO 25 MG/ML XAROPE 60 ML",
        "categoria": "Suplemento / Vitamina",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0406799",
        "nome": "SULFATO FERROSO 68 MG/ML SOLUÇÃO ORAL 30 ML",
        "categoria": "Suplemento / Vitamina",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0414674-1",
        "nome": "TERMO HIGRÔMETRO DIGITAL",
        "categoria": "Assistência Farmacêutica Básica",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0339565U0140",
        "nome": "TIRA REAGENTE PARA MEDIR GLICEMIA CAPILAR",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0332930",
        "nome": "TOUCA DESCARTÁVEL (TAMANHO ÚNICO)",
        "categoria": "Material Médico / Hospitalar",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0267502U0042",
        "nome": "ÁCIDO ACETILSALICÍLICO 100 MG COMPRIMIDO",
        "categoria": "Analgésico e Antitérmico",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0278489U0097",
        "nome": "ÁCIDO FÓLICO 0,2 MG/ML SOLUÇÃO ORAL 30 ML",
        "categoria": "Suplemento / Vitamina",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267503U0042",
        "nome": "ÁCIDO FÓLICO 5 MG COMPRIMIDO",
        "categoria": "Suplemento / Vitamina",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0308732U0062",
        "nome": "ÁCIDO VALPRÓICO (VALPROATO DE SÓDIO)  50 MG/ML XAROPE  100 ML ELENCO ESTADUAL",
        "categoria": "Assistência Farmacêutica",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267504U0041",
        "nome": "ÁCIDO VALPRÓICO (VALPROATO DE SÓDIO) 250 MG CÁPSULA",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "CÁPSULA"
    },
    {
        "codigo": "BR030873200062",
        "nome": "ÁCIDO VALPRÓICO (VALPROATO DE SÓDIO) 50 MG/ML XAROPE 100 ML",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0267505U0042",
        "nome": "ÁCIDO VALPRÓICO (VALPROATO DE SÓDIO) 500 MG COMPRIMIDO",
        "categoria": "Anticonvulsivante / Controlado",
        "apresentacao": "COMPRIMIDO"
    },
    {
        "codigo": "BR0276839U0063",
        "nome": "ÁGUA DESTILADA SOLUÇÃO INJETÁVEL 10 ML",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "AMPOLA"
    },
    {
        "codigo": "BR026994300171",
        "nome": "ÁLCOOL ETÍLICO 70% GEL 500 G",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "UNIDADE"
    },
    {
        "codigo": "BR0269943U0103",
        "nome": "ÁLCOOL ETÍLICO 70% GEL 500 ML",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0269943U0171",
        "nome": "ÁLCOOL ETÍLICO 70% GEL 500G",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "BISNAGA (BS.)"
    },
    {
        "codigo": "BR0269941U0060",
        "nome": "ÁLCOOL ETÍLICO 70% SOLUÇÃO 1 L",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "FRASCO"
    },
    {
        "codigo": "BR0233632U0062",
        "nome": "ÓLEO MINERAL (PETROLATO) SOLUÇÃO ORAL 100 ML",
        "categoria": "Soluções / Antissépticos",
        "apresentacao": "FRASCO"
    }
];

const RESUMOS_POR_CATEGORIA = {
    'Analgésico e Antitérmico': 'Auxilia no controle de dor e febre conforme prescrição profissional.',
    'Anti-helmíntico / Antiparasitário': 'Usado no tratamento de helmintíases e outras parasitoses conforme avaliação clínica.',
    'Anti-hipertensivo / Diurético': 'Apoia o controle da pressão arterial e/ou da retenção hídrica.',
    'Anti-inflamatório': 'Alívio de dor e inflamação conforme indicação médica.',
    'Antiácido / Protetor Gástrico': 'Ajuda no controle de acidez gástrica e sintomas digestivos.',
    'Antialérgico / Expectorante': 'Alívio de sintomas respiratórios e alérgicos conforme prescrição.',
    'Antibiótico / Antimicrobiano': 'Tratamento de infecções bacterianas sensíveis ao fármaco.',
    'Anticonvulsivante / Controlado': 'Uso em condições neurológicas/psiquiátricas específicas com acompanhamento profissional.',
    'Antidiabético': 'Contribui para controle glicêmico em pacientes com diabetes.',
    'Antifúngico': 'Tratamento de infecções fúngicas conforme localização e avaliação clínica.',
    'Assistência Farmacêutica': 'Insumo ou medicamento de apoio à assistência farmacêutica.',
    'Assistência Farmacêutica / Assistência Farmacêutica Básica': 'Item utilizado em rotinas da assistência farmacêutica básica.',
    'Assistência Farmacêutica Básica': 'Componente da atenção farmacêutica básica.',
    'Broncodilatador': 'Alívio de broncoespasmo e sintomas respiratórios obstrutivos.',
    'Corticosteroide': 'Ação anti-inflamatória e imunomoduladora conforme indicação clínica.',
    'Hipolipemiante': 'Auxilia no controle de colesterol e risco cardiovascular.',
    'Hormonal / Contraceptivo': 'Uso hormonal ou contraceptivo conforme protocolo assistencial.',
    'Material Médico / Hospitalar': 'Insumo para apoio a procedimentos e cuidados assistenciais.',
    'Oftalmológico': 'Uso ocular conforme orientação e avaliação profissional.',
    'Saúde Mental': 'Uso em transtornos de saúde mental sob acompanhamento profissional.',
    'Soluções / Antissépticos': 'Solução para higiene, antissepsia ou suporte terapêutico conforme protocolo.',
    'Suplemento / Vitamina': 'Suplementação de micronutrientes conforme necessidade clínica.',
};

const RESUMOS_USO = {
    BR0267507U0063: 'Tratamento antiparasitário em formulação oral pediátrica.',
    BR0271089U0042: 'Antibiótico de uso oral para infecções bacterianas sensíveis.',
    BR0267203U0042: 'Analgésico e antitérmico de uso oral.',
    BR0267778U0042: 'Analgésico e antitérmico para dor leve a moderada e febre.',
    BR0268856U0042: 'Auxilia no controle da hipertensão arterial.',
    BR0267690U0042: 'Antidiabético oral para controle glicêmico.',
    BR0267712U0041: 'Redutor da acidez gástrica e protetor gástrico.',
    'BR0292331-1': 'Broncodilatador em xarope para sintomas respiratórios.',
    BR0320817: 'Insumo para limpeza e curativos em procedimentos assistenciais.',
};

const RESUMO_PADRAO = 'Uso conforme protocolo da unidade e prescrição profissional.';

const NOMES_EXATOS = {};

const BULAS_COMPLETAS = {
    BR0267507U0063: {
        indicacoes: 'Antiparasitário indicado para helmintíases conforme avaliação clínica.',
        posologia: 'Administrar por via oral na dose e duração prescritas, sem interromper por conta própria.',
        contraindicacoes: 'Contraindicado em hipersensibilidade ao princípio ativo ou componentes da fórmula.',
        reacoes: 'Pode causar desconforto gastrointestinal, cefaleia ou tontura em alguns pacientes.',
        advertencias: 'Seguir orientação profissional e considerar tratamento dos contactantes quando indicado.',
    },
    BR0271089U0042: {
        indicacoes: 'Antibiótico para infecções bacterianas sensíveis.',
        posologia: 'Usar nos intervalos corretos e pelo tempo completo da prescrição.',
        contraindicacoes: 'Contraindicado em alergia a penicilinas e derivados.',
        reacoes: 'Pode ocorrer náusea, diarreia, dor abdominal e reações alérgicas.',
        advertencias: 'Uso inadequado favorece resistência bacteriana.',
    },
    BR0267778U0042: {
        indicacoes: 'Analgésico e antitérmico para dor e febre.',
        posologia: 'Respeitar dose máxima diária e intervalo entre tomadas.',
        contraindicacoes: 'Contraindicado em hipersensibilidade ao paracetamol e doença hepática grave.',
        reacoes: 'Pode ocorrer náusea, dor abdominal e reações cutâneas.',
        advertencias: 'Evitar associação com álcool e outros produtos contendo paracetamol.',
    },
};

const state = {
    search: '',
    category: '',
    sort: 'relevancia',
};

let toastTimer = null;
let lastFocusedBeforeModal = null;

const byId = (id) => document.getElementById(id);

function normalizeText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getResumoUso(codigo, categoria = '') {
    return RESUMOS_USO[codigo] || RESUMOS_POR_CATEGORIA[categoria] || RESUMO_PADRAO;
}

function getNomeExato(medicamento) {
    if (!medicamento) return '';
    if (NOMES_EXATOS[medicamento.codigo]) return NOMES_EXATOS[medicamento.codigo];
    return String(medicamento.nome || '').trim();
}

function getNomeFiltravel(medicamento) {
    return normalizeText(getNomeExato(medicamento));
}

function buildDefaultBula(medicamento) {
    const resumo = getResumoUso(medicamento.codigo, medicamento.categoria);
    const normalizedCategoria = normalizeText(medicamento.categoria);
    const isInsumo = normalizedCategoria.includes('assistencia farmaceutica')
        || normalizedCategoria.includes('material medico');

    if (isInsumo) {
        return {
            indicacoes: resumo,
            posologia: 'Aplicação técnica conforme rotina institucional e protocolo local.',
            contraindicacoes: 'Não se aplica como medicamento. Substituir item em caso de integridade comprometida.',
            reacoes: 'Não se aplica reação farmacológica.',
            advertencias: 'Utilizar com boas práticas de biossegurança e descarte adequado.',
        };
    }

    return {
        indicacoes: resumo,
        posologia: 'Uso conforme prescrição profissional, respeitando dose, intervalo e duração do tratamento.',
        contraindicacoes: 'Hipersensibilidade ao princípio ativo ou componentes da fórmula.',
        reacoes: 'Podem ocorrer reações adversas como desconforto gastrointestinal, cefaleia ou alergia.',
        advertencias: 'Não utilizar sem orientação profissional. Manter fora do alcance de crianças.',
    };
}

function getBulaCompleta(medicamento) {
    if (!medicamento) return buildDefaultBula({ codigo: '', categoria: '' });
    const base = buildDefaultBula(medicamento);
    const detalhes = BULAS_COMPLETAS[medicamento.codigo] || {};
    return { ...base, ...detalhes };
}

function getBulaSearchText(medicamento) {
    const bula = getBulaCompleta(medicamento);
    return [
        bula.indicacoes,
        bula.posologia,
        bula.contraindicacoes,
        bula.reacoes,
        bula.advertencias,
    ].join(' ');
}

function getCategories() {
    return [...new Set(MEDICAMENTOS.map((item) => item.categoria))]
        .sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function populateCategoryFilter() {
    const select = byId('categoryFilter');
    const options = getCategories()
        .map((categoria) => `<option value="${escapeHtml(categoria)}">${escapeHtml(categoria)}</option>`)
        .join('');

    select.insertAdjacentHTML('beforeend', options);
}

function filterMedicamentos() {
    const normalizedSearch = normalizeText(state.search);
    const normalizedCategory = normalizeText(state.category);

    const filtered = MEDICAMENTOS.filter((medicamento) => {
        const categoryMatch = !normalizedCategory || normalizeText(medicamento.categoria) === normalizedCategory;

        if (!categoryMatch) return false;
        if (!normalizedSearch) return true;

        const searchableContent = normalizeText([
            getNomeExato(medicamento),
            medicamento.nome,
            medicamento.codigo,
            medicamento.categoria,
            medicamento.apresentacao,
            getResumoUso(medicamento.codigo, medicamento.categoria),
            getBulaSearchText(medicamento),
        ].join(' '));

        return searchableContent.includes(normalizedSearch);
    });

    if (!normalizedSearch) return filtered;

    return filtered.sort((a, b) => {
        const aNome = getNomeFiltravel(a);
        const bNome = getNomeFiltravel(b);

        const score = (nome) => {
            if (nome === normalizedSearch) return 300;
            if (nome.startsWith(normalizedSearch)) return 200;
            if (nome.includes(` ${normalizedSearch}`)) return 120;
            if (nome.includes(normalizedSearch)) return 60;
            return 0;
        };

        return score(bNome) - score(aNome);
    });
}

function sortMedicamentos(items) {
    const ordered = [...items];

    if (state.sort === 'relevancia') {
        const hasSearch = Boolean(normalizeText(state.search));
        if (hasSearch) return ordered;
        return ordered.sort((a, b) => getNomeExato(a).localeCompare(getNomeExato(b), 'pt-BR'));
    }

    if (state.sort === 'nome_asc') {
        return ordered.sort((a, b) => getNomeExato(a).localeCompare(getNomeExato(b), 'pt-BR'));
    }

    if (state.sort === 'nome_desc') {
        return ordered.sort((a, b) => getNomeExato(b).localeCompare(getNomeExato(a), 'pt-BR'));
    }

    if (state.sort === 'categoria_asc') {
        return ordered.sort((a, b) => {
            const categoriaCompare = a.categoria.localeCompare(b.categoria, 'pt-BR');
            if (categoriaCompare !== 0) return categoriaCompare;
            return getNomeExato(a).localeCompare(getNomeExato(b), 'pt-BR');
        });
    }

    return ordered;
}

function buildCard(medicamento) {
    const nomeExato = getNomeExato(medicamento);

    return `
        <article class="med-card" aria-label="Medicamento ${escapeHtml(nomeExato)}">
            <header class="med-card-top">
                <h3 class="med-name">${escapeHtml(nomeExato)}</h3>
                <span class="med-code-pill">${escapeHtml(medicamento.codigo)}</span>
            </header>

            <div class="med-body">
                <div class="med-line">
                    <p class="med-label">Categoria</p>
                    <p class="med-value">${escapeHtml(medicamento.categoria)}</p>
                </div>
                <div class="med-line">
                    <p class="med-label">Apresentação</p>
                    <p class="med-value">${escapeHtml(medicamento.apresentacao)}</p>
                </div>
            </div>

            <div class="med-actions">
                <button type="button" class="btn-bula" data-bula="${escapeHtml(medicamento.codigo)}">
                    <span class="btn-icon" aria-hidden="true">📄</span>
                    <span class="btn-label">Ver bula completa</span>
                </button>
                <button type="button" class="btn-copy" data-code="${escapeHtml(medicamento.codigo)}">
                    <span class="btn-icon btn-icon-copy" aria-hidden="true">
                        <svg class="icon-copy-default" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <svg class="icon-copy-success" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </span>
                    <span class="btn-label">Copiar código</span>
                </button>
            </div>
        </article>
    `;
}

function buildBulaSection(title, content) {
    return `
        <section class="bula-section">
            <h4>${escapeHtml(title)}</h4>
            <p>${escapeHtml(content)}</p>
        </section>
    `;
}

function openBulaModal(code) {
    const medicamento = MEDICAMENTOS.find((item) => item.codigo === code);
    if (!medicamento) return;

    const bula = getBulaCompleta(medicamento);
    byId('bulaModalTitle').textContent = getNomeExato(medicamento);
    byId('bulaModalCode').textContent = `Código: ${medicamento.codigo}`;

    byId('bulaModalBody').innerHTML = [
        buildBulaSection('Indicações', bula.indicacoes),
        buildBulaSection('Posologia e modo de uso', bula.posologia),
        buildBulaSection('Contraindicações', bula.contraindicacoes),
        buildBulaSection('Possíveis reações', bula.reacoes),
        buildBulaSection('Advertências e cuidados', bula.advertencias),
        '<p class="bula-warning">Bula informativa para apoio rápido. A conduta final deve seguir avaliação clínica e protocolo oficial da unidade.</p>',
    ].join('');

    lastFocusedBeforeModal = document.activeElement;

    byId('bulaModal').classList.remove('hidden');
    document.body.classList.add('modal-open');
    byId('bulaCloseBtn').focus();
}

function closeBulaModal() {
    const modal = byId('bulaModal');
    if (!modal || modal.classList.contains('hidden')) return;

    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');

    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
        lastFocusedBeforeModal.focus();
    }
    lastFocusedBeforeModal = null;
}

function handleBulaModalKeydown(event) {
    if (event.key !== 'Tab') return;

    const modal = byId('bulaModal');
    if (!modal || modal.classList.contains('hidden')) return;

    const focusableElements = modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (!focusableElements.length) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
    }

    if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function renderMedicamentos(items) {
    const container = byId('medicamentosContainer');
    const noResults = byId('noResults');

    if (!items.length) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');
    container.innerHTML = items.map(buildCard).join('');
}

function updateStats(filteredItems) {
    byId('totalMedicamentos').textContent = String(MEDICAMENTOS.length);
    byId('categoriaAtual').textContent = state.category || 'Todas';
    byId('resultadosExibidos').textContent = String(filteredItems.length);

    const summary = filteredItems.length === MEDICAMENTOS.length
        ? `Exibindo todos os ${MEDICAMENTOS.length} medicamentos.`
        : `Exibindo ${filteredItems.length} de ${MEDICAMENTOS.length} medicamentos.`;

    byId('resultsSummary').textContent = summary;
}

function showToast(title, message) {
    const toast = byId('notification');
    byId('toastTitle').textContent = title;
    byId('toastMessage').textContent = message;

    toast.classList.remove('hidden');
    toast.classList.add('show');

    if (toastTimer) {
        clearTimeout(toastTimer);
    }

    toastTimer = window.setTimeout(() => {
        toast.classList.remove('show');
        window.setTimeout(() => toast.classList.add('hidden'), 280);
    }, 1800);
}

function indicateCopySuccess(button) {
    if (!button || button.dataset.copyLocked === '1') return;

    const label = button.querySelector('.btn-label');
    if (!label) return;

    const originalLabel = label.textContent;

    button.dataset.copyLocked = '1';
    button.classList.add('is-copied');
    label.textContent = 'Copiado';

    window.setTimeout(() => {
        label.textContent = originalLabel;
        button.classList.remove('is-copied');
        delete button.dataset.copyLocked;
    }, 1200);
}

async function copyCodeToClipboard(code, triggerButton = null) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(code);
        } else {
            const input = document.createElement('input');
            input.value = code;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            input.remove();
        }

        indicateCopySuccess(triggerButton);
        showToast('Código copiado', `${code} pronto para colar no sistema.`);
    } catch {
        showToast('Falha ao copiar', 'Não foi possível copiar automaticamente.');
    }
}

function applyFilters() {
    const filtered = filterMedicamentos();
    const ordered = sortMedicamentos(filtered);
    renderMedicamentos(ordered);
    updateStats(ordered);
}

function clearFilters() {
    state.search = '';
    state.category = '';
    state.sort = 'relevancia';
    byId('searchInput').value = '';
    byId('categoryFilter').value = '';
    byId('sortFilter').value = 'relevancia';
    applyFilters();
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function initTheme() {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    applyTheme(saved === 'dark' ? 'dark' : 'light');
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
}

function initEvents() {
    byId('searchInput').addEventListener('input', (event) => {
        state.search = event.target.value;
        applyFilters();
    });

    byId('categoryFilter').addEventListener('change', (event) => {
        state.category = event.target.value;
        applyFilters();
    });

    byId('sortFilter').addEventListener('change', (event) => {
        state.sort = event.target.value || 'relevancia';
        applyFilters();
    });

    byId('clearSearch').addEventListener('click', clearFilters);
    byId('resetNoResults').addEventListener('click', clearFilters);

    byId('themeToggle').addEventListener('click', toggleTheme);

    byId('bulaCloseBtn').addEventListener('click', closeBulaModal);
    byId('bulaModal').addEventListener('click', (event) => {
        if (event.target.closest('[data-close-bula="true"]')) {
            closeBulaModal();
        }
    });
    byId('bulaModal').addEventListener('keydown', handleBulaModalKeydown);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeBulaModal();
    });

    byId('medicamentosContainer').addEventListener('click', async (event) => {
        const bulaButton = event.target.closest('.btn-bula');
        if (bulaButton) {
            const codeBula = bulaButton.dataset.bula;
            if (codeBula) openBulaModal(codeBula);
            return;
        }

        const copyButton = event.target.closest('.btn-copy');
        if (!copyButton) return;

        const code = copyButton.dataset.code;
        if (!code) return;

        await copyCodeToClipboard(code, copyButton);
    });
}

function init() {
    populateCategoryFilter();
    initTheme();
    initEvents();
    applyFilters();
}

document.addEventListener('DOMContentLoaded', init);
