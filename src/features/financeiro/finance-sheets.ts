import type { MonthKey } from "./finance-accounts";

export type SheetTransaction = { data: string | null; empresa: string; valor: number };

export type FinanceSheet = {
  id: string;
  label: string;
  description: string;
  months: Record<MonthKey, SheetTransaction[]>;
};

// Source: CUSTOS_-_ACCEB-3.xlsx, analytical sheets; monthly blocks preserved.
export const FINANCE_SHEETS: FinanceSheet[] = [
  {
    "id": "mat-med",
    "label": "Materiais e Medicamentos",
    "description": "Compras de materiais hospitalares e medicamentos por fornecedor",
    "months": {
      "Maio": [
        {
          "data": "2026-05-04",
          "empresa": "SB LOG COMÉRCIO (MED)",
          "valor": 2134.62
        },
        {
          "data": "2026-05-05",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 3316.9
        },
        {
          "data": "2026-05-06",
          "empresa": "ALFAMED",
          "valor": 963.89
        },
        {
          "data": "2026-05-08",
          "empresa": "FARMACEUTICA DISTRIBUIDORA",
          "valor": 462.4
        },
        {
          "data": "2026-05-11",
          "empresa": "AMAZON MED",
          "valor": 1890
        },
        {
          "data": "2026-05-11",
          "empresa": "SB COMÉRCIO",
          "valor": 631.73
        },
        {
          "data": "2026-05-11",
          "empresa": "MEDICAL SHOPPING",
          "valor": 1114.8
        },
        {
          "data": "2026-05-11",
          "empresa": "MEDICAL SHOPPING",
          "valor": 804
        },
        {
          "data": "2026-05-11",
          "empresa": "ALTAMED",
          "valor": 2139.08
        },
        {
          "data": "2026-05-11",
          "empresa": "F CARDOSO",
          "valor": 3209.7
        },
        {
          "data": "2026-05-12",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 3316.9
        },
        {
          "data": "2026-05-25",
          "empresa": "AMAZON MED",
          "valor": 514.4
        },
        {
          "data": "2026-05-25",
          "empresa": "MEDICAL SHOPPING",
          "valor": 1114.8
        },
        {
          "data": "2026-05-26",
          "empresa": "ALTAMED",
          "valor": 2139.08
        },
        {
          "data": "2026-05-18",
          "empresa": "TAPAJÓS",
          "valor": 315.29
        },
        {
          "data": "2026-05-20",
          "empresa": "MM LOBATO",
          "valor": 548.8
        },
        {
          "data": "2026-05-21",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 499.87
        },
        {
          "data": "2026-05-29",
          "empresa": "F&F DISTRIBUIDORA",
          "valor": 1575
        },
        {
          "data": "2026-08-29",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 1253.97
        },
        {
          "data": "2026-05-28",
          "empresa": "TAPAJÓS",
          "valor": 315.29
        },
        {
          "data": "2026-05-29",
          "empresa": "ALTAMED",
          "valor": 1419.33
        },
        {
          "data": "2029-05-29",
          "empresa": "ALFAMED",
          "valor": 2639.6
        },
        {
          "data": "2026-05-29",
          "empresa": "SB COMÉRCIO",
          "valor": 1462.09
        },
        {
          "data": "2026-05-29",
          "empresa": "COMERCIO REPRESENTAÇÕES",
          "valor": 1266.3
        },
        {
          "data": "2026-05-29",
          "empresa": "LIFE CARE",
          "valor": 368
        },
        {
          "data": "2026-05-29",
          "empresa": "AMAZON MED",
          "valor": 1297.5
        },
        {
          "data": "2026-05-29",
          "empresa": "MEDICAL SHOPPING",
          "valor": 2178.6
        },
        {
          "data": "2026-05-29",
          "empresa": "F CARDOSO",
          "valor": 987
        },
        {
          "data": "2026-05-30",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 1500
        },
        {
          "data": "2026-05-29",
          "empresa": "SANTA LUZIA DISTRIB.",
          "valor": 5772
        }
      ],
      "Junho": [
        {
          "data": "2026-06-11",
          "empresa": "BL CARDOSO/NUTRIXX",
          "valor": 735
        },
        {
          "data": "2026-06-13",
          "empresa": "ALFAMED",
          "valor": 2639.6
        },
        {
          "data": "2026-06-13",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 1253.96
        },
        {
          "data": "2026-06-13",
          "empresa": "SB COMÉRCIO",
          "valor": 1462.08
        },
        {
          "data": "2026-06-13",
          "empresa": "F CARDOSO",
          "valor": 988.37
        },
        {
          "data": "2026-06-14",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 1500
        },
        {
          "data": "2026-06-15",
          "empresa": "TAPAJÓS",
          "valor": 1156.84
        },
        {
          "data": "2026-06-15",
          "empresa": "MEDICAL SHOPPING",
          "valor": 2178.6
        },
        {
          "data": "2026-06-18",
          "empresa": "SB COMÉRCIO",
          "valor": 988.44
        },
        {
          "data": "2026-06-19",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 700
        },
        {
          "data": "2026-06-20",
          "empresa": "ALFAMED",
          "valor": 646.68
        },
        {
          "data": "2026-06-20",
          "empresa": "MM LOBATO",
          "valor": 842.94
        },
        {
          "data": "2026-06-20",
          "empresa": "FARMACEUTICA DISTRIBUIDORA",
          "valor": 515.2
        },
        {
          "data": "2026-06-20",
          "empresa": "F CARDOSO",
          "valor": 1152.02
        },
        {
          "data": "2026-06-21",
          "empresa": "SANTA LUZIA DISTRIB.",
          "valor": 3700
        },
        {
          "data": "2026-06-21",
          "empresa": "HYBRIDA PRODUTOS",
          "valor": 1000
        },
        {
          "data": "2026-06-01",
          "empresa": "AMAZONMED",
          "valor": 326.25
        },
        {
          "data": "2026-06-07",
          "empresa": "TAPAJÓS",
          "valor": 315.28
        },
        {
          "data": "2026-06-23",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 925
        },
        {
          "data": "2026-06-23",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 1413
        },
        {
          "data": "2026-06-25",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 931.15
        },
        {
          "data": "2026-06-25",
          "empresa": "F CARDOSO",
          "valor": 2421
        },
        {
          "data": "2026-06-25",
          "empresa": "MEDICAL SHOPPING",
          "valor": 735.1
        },
        {
          "data": "2026-06-25",
          "empresa": "BL CARDOSO/NUTRIXX",
          "valor": 1470
        },
        {
          "data": "2026-06-25",
          "empresa": "AMAZONMED",
          "valor": 1780.51
        },
        {
          "data": "2026-06-25",
          "empresa": "TAPAJÓS",
          "valor": 1156.83
        },
        {
          "data": "2026-06-26",
          "empresa": "MEDICAL SHOPPING",
          "valor": 1200
        },
        {
          "data": "2026-06-26",
          "empresa": "ALTAMED",
          "valor": 618.3
        },
        {
          "data": "2026-06-26",
          "empresa": "MAPEMI",
          "valor": 454.5
        },
        {
          "data": "2026-06-10",
          "empresa": "SCORPION INFORMÁTICA",
          "valor": 160
        },
        {
          "data": "2026-06-25",
          "empresa": "FARMACEUTICA DISTRIBUIDORA",
          "valor": 968.03
        },
        {
          "data": "2026-06-27",
          "empresa": "SB COMÉRCIO",
          "valor": 242.96
        },
        {
          "data": "2026-06-27",
          "empresa": "BL CARDOSO/NUTRIXX",
          "valor": 1080
        },
        {
          "data": "2026-06-08",
          "empresa": "PRADO COMÉRCIO",
          "valor": 1266.3
        },
        {
          "data": "2026-06-28",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 941.8
        },
        {
          "data": "2026-06-28",
          "empresa": "ALTAMED",
          "valor": 1419.33
        },
        {
          "data": "2026-06-30",
          "empresa": "SB COMÉRCIO",
          "valor": 342.33
        }
      ],
      "Julho": [
        {
          "data": "2026-07-03",
          "empresa": "MARQUES & DUARTE",
          "valor": 749.9
        },
        {
          "data": "2026-07-05",
          "empresa": "ALFAMED",
          "valor": 646.67
        },
        {
          "data": "2026-07-06",
          "empresa": "HYBRIDA PRODUTOS",
          "valor": 1000
        },
        {
          "data": "2026-07-09",
          "empresa": "MM LOBATO",
          "valor": 581.26
        },
        {
          "data": "2026-07-10",
          "empresa": "AMAZONMED",
          "valor": 1779.97
        },
        {
          "data": "2026-07-10",
          "empresa": "FARMACEUTICA DISTRIBUIDORA",
          "valor": 968.04
        },
        {
          "data": "2026-07-10",
          "empresa": "F CARDOSO",
          "valor": 2421.97
        },
        {
          "data": "2026-07-12",
          "empresa": "MEDNUTRI",
          "valor": 980
        },
        {
          "data": "2026-07-12",
          "empresa": "BL CARDOSO/NUTRIXX",
          "valor": 900
        },
        {
          "data": "2026-07-13",
          "empresa": "MEDICAL SHOPPING",
          "valor": 461.5
        },
        {
          "data": "2026-07-13",
          "empresa": "AMAZONMED",
          "valor": 1556.51
        },
        {
          "data": "2026-07-13",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 941.8
        },
        {
          "data": "2026-07-13",
          "empresa": "MEDICAL SHOPPING",
          "valor": 1200
        },
        {
          "data": "2026-07-16",
          "empresa": "AMAZONMED",
          "valor": 750
        },
        {
          "data": "2026-07-20",
          "empresa": "DIGEMAN DISTRIB.",
          "valor": 189.9
        },
        {
          "data": "2026-07-20",
          "empresa": "DIGEMAN DISTRIB.",
          "valor": 1308
        },
        {
          "data": "2026-07-20",
          "empresa": "MM LOBATO",
          "valor": 559.26
        },
        {
          "data": "2026-07-23",
          "empresa": "MEDSERVIÇOS",
          "valor": 617
        },
        {
          "data": "2026-07-25",
          "empresa": "HOSPMED",
          "valor": 514.5
        },
        {
          "data": "2026-07-25",
          "empresa": "ALFAMED",
          "valor": 920.4
        },
        {
          "data": "2026-07-25",
          "empresa": "FARMACEUTICA DISTRIBUIDORA",
          "valor": 714.59
        },
        {
          "data": "2026-07-25",
          "empresa": "ALTAMED",
          "valor": 1054.47
        },
        {
          "data": "2026-07-25",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 2369.14
        },
        {
          "data": "2026-07-25",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 931.15
        },
        {
          "data": "2026-07-25",
          "empresa": "ALTAMED",
          "valor": 734.5
        },
        {
          "data": "2026-07-26",
          "empresa": "F CARDOSO",
          "valor": 1453
        },
        {
          "data": "2026-07-26",
          "empresa": "F CARDOSO",
          "valor": 560.25
        },
        {
          "data": "2026-07-26",
          "empresa": "BL CARDOSO/ NUTRIXX",
          "valor": 784
        },
        {
          "data": "2026-07-27",
          "empresa": "DIGEMAN DISTRIB.",
          "valor": 621.36
        },
        {
          "data": "2026-07-27",
          "empresa": "MEDICAL SHOPPING",
          "valor": 1500
        },
        {
          "data": "2026-07-27",
          "empresa": "MEDICAL SHOPPING",
          "valor": 1592.4
        },
        {
          "data": "2026-07-27",
          "empresa": "AMAZONMED",
          "valor": 1733.57
        },
        {
          "data": "2026-07-27",
          "empresa": "AMAZONMED",
          "valor": 1556.51
        },
        {
          "data": "2026-07-27",
          "empresa": "AMAZONMED",
          "valor": 1779.97
        },
        {
          "data": "2026-07-29",
          "empresa": "LIFE CARE",
          "valor": 308.9
        },
        {
          "data": "2026-07-29",
          "empresa": "ALTAMED",
          "valor": 603.13
        },
        {
          "data": "2026-07-31",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 724.5
        }
      ],
      "Agosto": [
        {
          "data": "2026-08-05",
          "empresa": "COMERCIAL CIRURGICA",
          "valor": 1084.94
        },
        {
          "data": "2026-08-09",
          "empresa": "NATAN COMÉRCIO",
          "valor": 907.75
        },
        {
          "data": "2026-08-09",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 2369.14
        },
        {
          "data": "2026-08-09",
          "empresa": "ALTAMED",
          "valor": 734.5
        },
        {
          "data": "2026-08-10",
          "empresa": "F CARDOSO",
          "valor": 1453.62
        },
        {
          "data": "2026-08-10",
          "empresa": "AMAZONMED",
          "valor": 1369.53
        },
        {
          "data": "2026-08-10",
          "empresa": "AMAZONMED",
          "valor": 1733.04
        },
        {
          "data": "2026-08-10",
          "empresa": "AMAZONMED",
          "valor": 1616.94
        },
        {
          "data": "2026-08-11",
          "empresa": "TAPAJÓS",
          "valor": 101.78
        },
        {
          "data": "2026-08-12",
          "empresa": "BL CARDOSO/NUTRIXX",
          "valor": 147
        },
        {
          "data": "2026-08-12",
          "empresa": "BL CARDOSO/NUTRIXX",
          "valor": 392
        },
        {
          "data": "2026-08-12",
          "empresa": "SB LOG",
          "valor": 300.79
        },
        {
          "data": "2026-08-13",
          "empresa": "MEDCLIN",
          "valor": 140.6
        },
        {
          "data": "2026-08-31",
          "empresa": "ZSCAN",
          "valor": 2739
        },
        {
          "data": "2026-08-15",
          "empresa": "BL CARDOSO/NUTRIXX",
          "valor": 1320
        },
        {
          "data": "2026-08-15",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 724.5
        },
        {
          "data": "2026-08-15",
          "empresa": "BL CARDOSO/NUTRIXX",
          "valor": 216
        },
        {
          "data": "2026-08-21",
          "empresa": "TAPAJÓS",
          "valor": 101.78
        },
        {
          "data": "2026-08-21",
          "empresa": "FARMACEUTICA DISTRIB.",
          "valor": 720
        },
        {
          "data": "2026-08-23",
          "empresa": "MEDSERVIÇOS",
          "valor": 617
        },
        {
          "data": "2026-08-23",
          "empresa": "DIGEMAN DISTRIB.",
          "valor": 277
        },
        {
          "data": "2026-08-23",
          "empresa": "ALTAMED",
          "valor": 1226.54
        },
        {
          "data": "2026-08-23",
          "empresa": "TAPAJÓS",
          "valor": 968.47
        },
        {
          "data": "2026-08-23",
          "empresa": "F CARDOSO",
          "valor": 983
        },
        {
          "data": "2026-08-24",
          "empresa": "COMERCIAL CIRURGICA",
          "valor": 1084.93
        },
        {
          "data": "2026-08-24",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 2369.14
        },
        {
          "data": "2026-08-24",
          "empresa": "AMAZONMED",
          "valor": 1369.53
        },
        {
          "data": "2026-08-24",
          "empresa": "AMAZONMED",
          "valor": 1616.94
        },
        {
          "data": "2026-08-24",
          "empresa": "AMAZONMED",
          "valor": 1733.04
        },
        {
          "data": "2026-08-25",
          "empresa": "DIGEMAN DISTRIB.",
          "valor": 621.48
        },
        {
          "data": "2026-08-28",
          "empresa": "MEDICAL SHOPPING",
          "valor": 2703.62
        },
        {
          "data": "2026-08-28",
          "empresa": "F CARDOSO",
          "valor": 1824
        },
        {
          "data": "2026-08-28",
          "empresa": "ALTAMED",
          "valor": 2448.15
        },
        {
          "data": "2026-08-28",
          "empresa": "FARMACEUTICA DISTRIB.",
          "valor": 829.74
        },
        {
          "data": "2026-08-28",
          "empresa": "AMAZONMED",
          "valor": 889.69
        },
        {
          "data": "2026-08-28",
          "empresa": "MEDICAL SHOPPING",
          "valor": 2703.62
        },
        {
          "data": "2026-08-29",
          "empresa": "LIFE CARE",
          "valor": 383.8
        },
        {
          "data": "2026-08-29",
          "empresa": "NORTE SAUDE",
          "valor": 437.95
        },
        {
          "data": "2026-08-29",
          "empresa": "NORTE SAUDE",
          "valor": 537.7
        },
        {
          "data": "2026-08-29",
          "empresa": "NORTE SAUDE",
          "valor": 437.95
        },
        {
          "data": "2026-08-30",
          "empresa": "ALTAMED",
          "valor": 612
        },
        {
          "data": "2026-08-30",
          "empresa": "BL CARDOSO/NUTRIXX",
          "valor": 1320
        },
        {
          "data": "2026-08-31",
          "empresa": "TAPAJÓS",
          "valor": 101.79
        },
        {
          "data": "2026-08-27",
          "empresa": "ICELERA",
          "valor": 483.43
        }
      ],
      "Setembro": [
        {
          "data": "2026-09-03",
          "empresa": "CIRURGICA NORAT",
          "valor": 199.9
        },
        {
          "data": "2026-09-02",
          "empresa": "MARTINS COMÉRCIO",
          "valor": 1838.42
        },
        {
          "data": "2026-09-03",
          "empresa": "MARTINS COMÉRCIO",
          "valor": 199.9
        },
        {
          "data": "2026-09-03",
          "empresa": "MARTINS COMÉRCIO",
          "valor": 1109.22
        },
        {
          "data": "2026-09-04",
          "empresa": "DDX SOLUÇÕES",
          "valor": 664.05
        },
        {
          "data": "2026-09-04",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 1115
        },
        {
          "data": "2026-09-07",
          "empresa": "TAPAJÓS",
          "valor": 978.79
        },
        {
          "data": "2026-09-07",
          "empresa": "F CARDOSO",
          "valor": 983.9
        },
        {
          "data": "2026-09-08",
          "empresa": "DIGEMAN DISTRIB.",
          "valor": 621.47
        },
        {
          "data": "2026-09-09",
          "empresa": "BL CARDOSO/NUTRIXX",
          "valor": 2601
        },
        {
          "data": "2026-09-09",
          "empresa": "SBLOG",
          "valor": 344.48
        },
        {
          "data": "2026-09-05",
          "empresa": "MASSAF COMÉRCIO",
          "valor": 458.53
        },
        {
          "data": "2026-09-22",
          "empresa": "TAPAJÓS",
          "valor": 978.79
        },
        {
          "data": "2026-09-27",
          "empresa": "NORTE HOSPITALAR",
          "valor": 493.26
        },
        {
          "data": "2026-09-27",
          "empresa": "F CARDOSO",
          "valor": 969
        },
        {
          "data": "2026-09-27",
          "empresa": "F CARDOSO",
          "valor": 724.3
        },
        {
          "data": "2026-09-27",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 1321.29
        },
        {
          "data": "2026-09-27",
          "empresa": "ALTAMED",
          "valor": 1205
        },
        {
          "data": "2026-09-27",
          "empresa": "ALTAMED",
          "valor": 3145.19
        },
        {
          "data": "2026-09-27",
          "empresa": "ICELERA IND.",
          "valor": 483.42
        },
        {
          "data": "2026-09-27",
          "empresa": "F CARDOSO",
          "valor": 1826
        },
        {
          "data": "2026-09-27",
          "empresa": "ALTAMED",
          "valor": 2448.15
        },
        {
          "data": "2026-09-27",
          "empresa": "COMERCIAL CIRURGICA",
          "valor": 2228
        },
        {
          "data": "2026-09-28",
          "empresa": "MEDICAL SHOPPING",
          "valor": 680.2
        },
        {
          "data": "2026-09-28",
          "empresa": "AMAZONMED",
          "valor": 1226.81
        },
        {
          "data": "2026-09-28",
          "empresa": "CM HOSPITALAR",
          "valor": 3209.5
        },
        {
          "data": "2026-09-28",
          "empresa": "CM HOSPITALAR",
          "valor": 36
        },
        {
          "data": "2026-09-29",
          "empresa": "ALFAMED",
          "valor": 457.36
        },
        {
          "data": "2026-09-30",
          "empresa": "BL CARDOSO/NUTRIXX",
          "valor": 3150
        },
        {
          "data": "2026-09-27",
          "empresa": "NATAN COMERCIO",
          "valor": 1123.33
        },
        {
          "data": "2026-09-10",
          "empresa": "MARTINS COMÉRCIO",
          "valor": 1109.22
        },
        {
          "data": "2026-09-10",
          "empresa": "MARTINS COMÉRCIO",
          "valor": 707.4
        },
        {
          "data": "2029-09-10",
          "empresa": "ALTAMED",
          "valor": 1200
        },
        {
          "data": "2026-09-11",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 1115
        },
        {
          "data": "2026-09-12",
          "empresa": "ALTAMED",
          "valor": 2448.15
        },
        {
          "data": "2026-09-12",
          "empresa": "F CARDOSO",
          "valor": 1824
        },
        {
          "data": "2026-09-14",
          "empresa": "COMERCIAL CIRURGICA",
          "valor": 1665.63
        },
        {
          "data": "2026-09-17",
          "empresa": "TAPAJÓS",
          "valor": 1264.01
        },
        {
          "data": "2026-09-17",
          "empresa": "SBLOG",
          "valor": 834.33
        },
        {
          "data": "2026-09-17",
          "empresa": "PARAMED",
          "valor": 293.8
        },
        {
          "data": "2026-09-18",
          "empresa": "LN DISTRIBUIDORA",
          "valor": 1115
        },
        {
          "data": "2026-09-19",
          "empresa": "MM LOBATO",
          "valor": 904.7
        },
        {
          "data": "2026-09-20",
          "empresa": "DIGEMAN DISTRIB.",
          "valor": 1108.68
        }
      ]
    }
  },
  {
    "id": "limpeza-expediente",
    "label": "Limpeza, Expediente e Outros",
    "description": "Materiais de limpeza, escritório, café e expediente",
    "months": {
      "Maio": [
        {
          "data": "2026-05-09",
          "empresa": "PONTO COMÉRCIO",
          "valor": 1424.7
        },
        {
          "data": "2026-05-09",
          "empresa": "MARTINS DISTRIB.",
          "valor": 2575.15
        },
        {
          "data": "2026-05-09",
          "empresa": "SUZANO",
          "valor": 1359.21
        },
        {
          "data": "2026-05-17",
          "empresa": "COMERCIO REPRESENTAÇÕES",
          "valor": 2057.4
        },
        {
          "data": "2026-05-17",
          "empresa": "PONTO COMÉRCIO",
          "valor": 411.07
        },
        {
          "data": "2026-05-23",
          "empresa": "M C DE L MACHADO",
          "valor": 587.52
        },
        {
          "data": "2026-05-23",
          "empresa": "PONTO COMÉRCIO",
          "valor": 2700
        },
        {
          "data": "2026-05-26",
          "empresa": "A L  COMÉRCIO",
          "valor": 608.34
        },
        {
          "data": "2026-05-29",
          "empresa": "COMERCIO REPRESENTAÇÕES",
          "valor": 1266.3
        }
      ],
      "Junho": [
        {
          "data": "2026-06-15",
          "empresa": "A L COMÉRCIO",
          "valor": 1046.64
        },
        {
          "data": "2026-06-17",
          "empresa": "D FREITAS LTDA",
          "valor": 676.94
        },
        {
          "data": "2026-06-17",
          "empresa": "D S DE OLIVEIRA",
          "valor": 748.89
        },
        {
          "data": "2026-06-17",
          "empresa": "MMN DE LIMA LTDA",
          "valor": 508.57
        },
        {
          "data": "2026-06-17",
          "empresa": "MMN DE LIMA LTDA",
          "valor": 713.85
        },
        {
          "data": "2026-06-18",
          "empresa": "PONTO COMÉRCIO",
          "valor": 238.95
        },
        {
          "data": "2026-06-18",
          "empresa": "COMERCIO REPRESENTAÇÕES",
          "valor": 1266.3
        },
        {
          "data": "2026-06-18",
          "empresa": "SUZANO",
          "valor": 1235.35
        },
        {
          "data": "2026-06-08",
          "empresa": "MARTINS DISTRIB.",
          "valor": 2757.14
        }
      ],
      "Julho": [
        {
          "data": "2026-07-02",
          "empresa": "MMN DE LIMA LTDA",
          "valor": 713.85
        },
        {
          "data": "2026-07-02",
          "empresa": "MMN DE LIMA LTDA",
          "valor": 508.57
        },
        {
          "data": "2026-07-15",
          "empresa": "PONTO COMÉRCIO",
          "valor": 753.11
        },
        {
          "data": "2026-07-18",
          "empresa": "SUZANO",
          "valor": 1235.35
        },
        {
          "data": "2026-07-21",
          "empresa": "CASA DO LOBATO",
          "valor": 275
        },
        {
          "data": "2026-08-23",
          "empresa": "RM DIAS",
          "valor": 1133.21
        },
        {
          "data": "2026-07-23",
          "empresa": "M C DE L MACHADO",
          "valor": 682.14
        },
        {
          "data": "2026-07-23",
          "empresa": "PONTO COMÉRCIO",
          "valor": 710.3
        },
        {
          "data": "2026-07-24",
          "empresa": "A L COMÉRCIO",
          "valor": 763.65
        }
      ],
      "Agosto": [
        {
          "data": "2026-08-07",
          "empresa": "PONTO COMÉRCIO",
          "valor": 806.7
        },
        {
          "data": "2026-08-07",
          "empresa": "A L COMÉRCIO",
          "valor": 763.64
        },
        {
          "data": "2026-08-05",
          "empresa": "MASSAF COMÉRCIO Q.",
          "valor": 458.33
        },
        {
          "data": "2026-08-05",
          "empresa": "MARTINS COMÉRCIO",
          "valor": 1909.65
        },
        {
          "data": "2026-08-16",
          "empresa": "SUZANO",
          "valor": 806.59
        },
        {
          "data": "2026-08-22",
          "empresa": "R M DIAS FREITAS",
          "valor": 517.68
        },
        {
          "data": "2026-08-22",
          "empresa": "PONTO COMÉRCIO",
          "valor": 391.5
        },
        {
          "data": "2026-08-22",
          "empresa": "PONTO COMÉRCIO",
          "valor": 806.7
        },
        {
          "data": "2026-08-29",
          "empresa": "PONTO COMÉRCIO",
          "valor": 558.75
        },
        {
          "data": "2026-08-31",
          "empresa": "SUZANO",
          "valor": 806.57
        }
      ],
      "Setembro": [
        {
          "data": "2026-09-03",
          "empresa": "PONTO COMÉRCIO",
          "valor": 554.64
        },
        {
          "data": "2026-09-04",
          "empresa": "P L F COMÉRCIO",
          "valor": 686.3
        },
        {
          "data": "2026-09-06",
          "empresa": "R C F MACHADO",
          "valor": 157.4
        },
        {
          "data": "2026-09-06",
          "empresa": "BF MACHADO",
          "valor": 686.75
        },
        {
          "data": "2026-09-09",
          "empresa": "PRIME COMÉRCIO",
          "valor": 237.9
        },
        {
          "data": "2026-09-07",
          "empresa": "COMÉRCIO REPRESENTAÇÕES",
          "valor": 1134
        },
        {
          "data": "2026-09-24",
          "empresa": "SUZANO",
          "valor": 1197.55
        },
        {
          "data": "2026-09-27",
          "empresa": "COMÉRCIO REPRESENTAÇÕES",
          "valor": 2846.25
        },
        {
          "data": "2026-09-11",
          "empresa": "MMN DE LIMA LTDA",
          "valor": 720
        },
        {
          "data": "2026-09-13",
          "empresa": "PONTO COMÉRCIO",
          "valor": 558.75
        },
        {
          "data": "2026-09-13",
          "empresa": "PONTO COMÉRCIO",
          "valor": 437.95
        },
        {
          "data": "2026-09-15",
          "empresa": "SUZANO",
          "valor": 806.56
        },
        {
          "data": "2026-09-17",
          "empresa": "R M DIAS FREITAS",
          "valor": 646.86
        },
        {
          "data": "2026-09-20",
          "empresa": "POLY COMÉRCIO",
          "valor": 408.32
        },
        {
          "data": "2026-09-21",
          "empresa": "B F MACHADO",
          "valor": 686.75
        }
      ]
    }
  },
  {
    "id": "serv-mat-extras",
    "label": "Serviços e Materiais Extras",
    "description": "Serviços gráficos e materiais extras pontuais",
    "months": {
      "Maio": [
        {
          "data": "2026-05-06",
          "empresa": "IMPRIME",
          "valor": 848
        },
        {
          "data": "2026-05-06",
          "empresa": "GRÁFICA SANTA CRUZ",
          "valor": 11710
        }
      ],
      "Junho": [
        {
          "data": "2026-06-08",
          "empresa": "GRÁFICA BENIGNO",
          "valor": 2500
        },
        {
          "data": "2026-06-23",
          "empresa": "GRÁFICA BENIGNO",
          "valor": 2500
        }
      ],
      "Julho": [
        {
          "data": "2026-07-17",
          "empresa": "MJ GARRIDO",
          "valor": 2250
        },
        {
          "data": "2026-07-22",
          "empresa": "GRÁFICA BENIGNO",
          "valor": 1845
        }
      ],
      "Agosto": [
        {
          "data": "2026-08-07",
          "empresa": "GRÁFICA BENIGNO",
          "valor": 1845
        },
        {
          "data": "2026-08-28",
          "empresa": "MJ GARRIDO",
          "valor": 660
        }
      ],
      "Setembro": [
        {
          "data": "2026-09-18",
          "empresa": "MJ GARRIDO",
          "valor": 2360
        }
      ]
    }
  },
  {
    "id": "manutencao",
    "label": "Manutenção, Reformas e Terceirizados",
    "description": "Manutenção de equipamentos, reformas e serviços terceirizados",
    "months": {
      "Maio": [
        {
          "data": "2026-05-04",
          "empresa": "TELEINFOR",
          "valor": 702.7
        },
        {
          "data": "2026-05-05",
          "empresa": "ANDRÉ PINHEIRO - COPOSCOPIA MANU.",
          "valor": 1100
        },
        {
          "data": "2026-05-06",
          "empresa": "DC EQUIPAMENTOS",
          "valor": 400
        },
        {
          "data": "2026-05-08",
          "empresa": "AURA REABILITAÇÃO",
          "valor": 3500
        },
        {
          "data": "2026-05-10",
          "empresa": "TK ELEVADORES",
          "valor": 1190.39
        },
        {
          "data": "2226-05-11",
          "empresa": "NOVO TEMPO REFRIGERAÇÃO",
          "valor": 6560
        },
        {
          "data": "2026-05-11",
          "empresa": "ASTRAL - COSTA E SILVA IMUNIZ.",
          "valor": 330
        },
        {
          "data": "2026-05-15",
          "empresa": "MARTINATO MÁQ.",
          "valor": 315.45
        },
        {
          "data": "2026-05-15",
          "empresa": "GILBERTO - ALUGUEL DE IMPRESSORAS",
          "valor": 2000
        },
        {
          "data": "2026-05-20",
          "empresa": "RM DIAS",
          "valor": 1169.9
        },
        {
          "data": "2026-05-25",
          "empresa": "VITAL AIR LIQUIDE",
          "valor": 2132.1
        },
        {
          "data": "2026-05-30",
          "empresa": "TAKESHI",
          "valor": 2574
        },
        {
          "data": "2026-05-12",
          "empresa": "PAULO SÉRGIO - OXIGÊNIO",
          "valor": 4770
        },
        {
          "data": "2026-05-26",
          "empresa": "RECICLE LTDA",
          "valor": 706.83
        },
        {
          "data": "2026-05-19",
          "empresa": "ORTO VIDA",
          "valor": 360
        }
      ],
      "Junho": [
        {
          "data": "2026-06-15",
          "empresa": "ORTO VIDA",
          "valor": 360
        },
        {
          "data": "2026-06-15",
          "empresa": "MARTINATO MÁQ.",
          "valor": 315.44
        },
        {
          "data": "2026-06-15",
          "empresa": "GE HEALTHCARE",
          "valor": 1221.41
        },
        {
          "data": "2026-06-15",
          "empresa": "GILBERTO - ALUGUEL DE IMPRESSORAS",
          "valor": 2100
        },
        {
          "data": "2026-06-15",
          "empresa": "ABB DA COSTA",
          "valor": 1000
        },
        {
          "data": "2026-06-18",
          "empresa": "ORTO VIDA",
          "valor": 360
        },
        {
          "data": "2026-06-01",
          "empresa": "ASTRAL COSTA E SILVA IMUNIZAÇÃO",
          "valor": 330
        },
        {
          "data": "2026-06-02",
          "empresa": "TELEINFOR",
          "valor": 1212.35
        },
        {
          "data": "2026-06-04",
          "empresa": "GE HEALTHCARE",
          "valor": 10393.2
        },
        {
          "data": "2026-06-05",
          "empresa": "TAKESHI",
          "valor": 917.2
        },
        {
          "data": "2026-06-08",
          "empresa": "ORTO VIDA",
          "valor": 320
        },
        {
          "data": "2026-06-08",
          "empresa": "AURA REABILITAÇÃO",
          "valor": 3500
        },
        {
          "data": "2026-06-10",
          "empresa": "SAFE SAUDE AMBIENTAL",
          "valor": 900
        },
        {
          "data": "2026-06-10",
          "empresa": "NOVO TEMPO",
          "valor": 6560
        },
        {
          "data": "2026-06-16",
          "empresa": "TUDO ÁGUA",
          "valor": 1585
        },
        {
          "data": "2026-06-24",
          "empresa": "VITAL AIR LIQUIDE",
          "valor": 2132.1
        },
        {
          "data": "2026-06-26",
          "empresa": "RECICLE LTDA",
          "valor": 1254.62
        },
        {
          "data": "2026-06-25",
          "empresa": "NOVO TEMPO",
          "valor": 2500
        },
        {
          "data": "2026-06-25",
          "empresa": "SIEMENS",
          "valor": 28295.01
        },
        {
          "data": "2026-06-30",
          "empresa": "ASTRAL COSTA E SILVA IMUNIZAÇÃO",
          "valor": 330
        },
        {
          "data": "2026-06-30",
          "empresa": "TAKESHI",
          "valor": 2574
        },
        {
          "data": "2026-07-02",
          "empresa": "CREA-PA",
          "valor": 108.39
        }
      ],
      "Julho": [
        {
          "data": "2026-07-03",
          "empresa": "GE HEALTHCARE",
          "valor": 10393.2
        },
        {
          "data": "2026-07-08",
          "empresa": "TELEINFOR",
          "valor": 3500
        },
        {
          "data": "2026-07-01",
          "empresa": "PAULO SÉRGIO - OXIGÊNIO - MUDANÇA DE PISTO.",
          "valor": 1875
        },
        {
          "data": "2026-07-05",
          "empresa": "TAKESHI",
          "valor": 369.8
        },
        {
          "data": "2026-07-07",
          "empresa": "INGENIUM",
          "valor": 900
        },
        {
          "data": "2026-07-08",
          "empresa": "AURA REABILITAÇÃO",
          "valor": 3500
        },
        {
          "data": "2026-07-08",
          "empresa": "ORTO VIDA",
          "valor": 320
        },
        {
          "data": "2026-07-10",
          "empresa": "ATOX CONTROLE AMB.",
          "valor": 1248
        },
        {
          "data": "2026-07-10",
          "empresa": "TK ELEVADORES",
          "valor": 1190.39
        },
        {
          "data": "2026-07-13",
          "empresa": "TELEINFOR",
          "valor": 461.5
        },
        {
          "data": "2026-07-08",
          "empresa": "ORTO VIDA",
          "valor": 320
        },
        {
          "data": "2026-07-09",
          "empresa": "MANUTENÇÃO DE COLONOSCOPIA",
          "valor": 7800
        },
        {
          "data": "2026-07-10",
          "empresa": "NOVO TEMPO REFRIGERAÇÃO",
          "valor": 6560
        },
        {
          "data": "2026-07-15",
          "empresa": "MARTINATO MÁQ.",
          "valor": 315.44
        },
        {
          "data": "2026-07-17",
          "empresa": "FRIGELAR COMERCIO",
          "valor": 805.75
        },
        {
          "data": "2026-07-23",
          "empresa": "VITAL AIR LIQUIDE",
          "valor": 1421.4
        },
        {
          "data": "2026-07-30",
          "empresa": "TAKESHI",
          "valor": 2574
        },
        {
          "data": "2026-07-14",
          "empresa": "ABB DA COSTA",
          "valor": 1000
        },
        {
          "data": "2026-07-31",
          "empresa": "COSTA E SILVA IMUNIZAÇÃO",
          "valor": 330
        },
        {
          "data": "2026-07-15",
          "empresa": "PAULO SÉRGIO - OXIGÊNIO",
          "valor": 6350
        },
        {
          "data": "2026-07-24",
          "empresa": "SIEMENS",
          "valor": 28645.54
        },
        {
          "data": "2026-07-25",
          "empresa": "NOVO TEMPO REFRIGERAÇÃO",
          "valor": 2500
        },
        {
          "data": "2026-07-25",
          "empresa": "SAFE SAUDE AMBIENTAL",
          "valor": 900
        },
        {
          "data": "2026-07-16",
          "empresa": "TK ELEVADORES",
          "valor": 1233.23
        },
        {
          "data": "2026-07-16",
          "empresa": "TK ELEVADORES",
          "valor": 1305.82
        }
      ],
      "Agosto": [
        {
          "data": "2026-08-05",
          "empresa": "TAKESHI",
          "valor": 525.9
        },
        {
          "data": "2026-08-05",
          "empresa": "PAULO SÉRGIO - OXIGÊNIO",
          "valor": 3900
        },
        {
          "data": "2026-08-05",
          "empresa": "TELEINFOR",
          "valor": 180
        },
        {
          "data": "2026-08-06",
          "empresa": "GE HEALTHCARE",
          "valor": 10393.2
        },
        {
          "data": "2026-08-08",
          "empresa": "ORTOVIDA",
          "valor": 320
        },
        {
          "data": "2026-08-08",
          "empresa": "AURA REABILITAÇÃO",
          "valor": 3500
        },
        {
          "data": "2026-08-10",
          "empresa": "TK ELEVADORES",
          "valor": 1190.39
        },
        {
          "data": "2026-08-10",
          "empresa": "TELEINFOR",
          "valor": 461.5
        },
        {
          "data": "2026-08-10",
          "empresa": "DDX SOLUÇÕES",
          "valor": 1328.1
        },
        {
          "data": "2026-08-18",
          "empresa": "ORTOVIDA",
          "valor": 340
        },
        {
          "data": "2026-08-10",
          "empresa": "TELEINFOR",
          "valor": 350
        },
        {
          "data": "2026-08-17",
          "empresa": "PRESERVE COLETORA",
          "valor": 1094.87
        },
        {
          "data": "2026-08-19",
          "empresa": "ABB DA COSTA",
          "valor": 1000
        },
        {
          "data": "2026-08-18",
          "empresa": "ORTOVIDA - JAYME ZAGURI",
          "valor": 340
        },
        {
          "data": "2026-08-26",
          "empresa": "SIEMENS",
          "valor": 26419.6
        },
        {
          "data": "2026-08-21",
          "empresa": "TELEINFOR",
          "valor": 180
        },
        {
          "data": "2026-08-25",
          "empresa": "NOVO TEMPO - CLIMATIZAÇÃO",
          "valor": 2500
        },
        {
          "data": "2026-08-20",
          "empresa": "MANUTENÇÃO EQUIP.",
          "valor": 850
        },
        {
          "data": "2026-08-27",
          "empresa": "ORTOVIDA",
          "valor": 360
        },
        {
          "data": "2026-08-23",
          "empresa": "VGF MEDICAL",
          "valor": 2500
        },
        {
          "data": "2026-08-15",
          "empresa": "GE HEALTHCARE",
          "valor": 1221.41
        },
        {
          "data": "2026-08-15",
          "empresa": "MARINATO MÁQUINAS",
          "valor": 315.44
        },
        {
          "data": "2026-08-17",
          "empresa": "FRIGELAR",
          "valor": 805.75
        },
        {
          "data": "2026-08-24",
          "empresa": "AIR LIQUIDE",
          "valor": 1421.4
        },
        {
          "data": "2026-08-30",
          "empresa": "TAKESHI",
          "valor": 2574
        }
      ],
      "Setembro": [
        {
          "data": "2026-09-04",
          "empresa": "GE HEALTHCARE",
          "valor": 10393.2
        },
        {
          "data": "2026-09-04",
          "empresa": "SAFE - LIMPEZA DO POÇO",
          "valor": 950
        },
        {
          "data": "2026-09-04",
          "empresa": "SAFE - SANITIZAÇÃO",
          "valor": 900
        },
        {
          "data": "2026-09-04",
          "empresa": "SAFE - LIMPEZA DE CAIXA D'ÁGUA",
          "valor": 833.33
        },
        {
          "data": "2026-09-05",
          "empresa": "TAKESHI",
          "valor": 859.72
        },
        {
          "data": "2026-09-07",
          "empresa": "PRESERVE COLETORA",
          "valor": 122.85
        },
        {
          "data": "2026-09-08",
          "empresa": "ORTO VIDA - RITANACIO",
          "valor": 320
        },
        {
          "data": "2026-09-10",
          "empresa": "ORTO VIDA - EMILY BARROS",
          "valor": 320
        },
        {
          "data": "2026-09-09",
          "empresa": "PAULO OXIGÊNIO",
          "valor": 7780
        },
        {
          "data": "2026-09-08",
          "empresa": "AURA REABILITAÇÃO",
          "valor": 3500
        },
        {
          "data": "2026-09-23",
          "empresa": "MED EQUIPAMENTOS",
          "valor": 617
        },
        {
          "data": "2026-09-25",
          "empresa": "NOVO TEMPO",
          "valor": 2500
        },
        {
          "data": "2026-09-25",
          "empresa": "SIEMENS",
          "valor": 28592.47
        },
        {
          "data": "2026-09-25",
          "empresa": "PRESERVE COLETORA",
          "valor": 164.44
        },
        {
          "data": "2026-09-27",
          "empresa": "ORTO VIDA",
          "valor": 340
        },
        {
          "data": "2026-09-30",
          "empresa": "COSTA E SILVA - ASTRAL",
          "valor": 330
        },
        {
          "data": "2026-09-30",
          "empresa": "TAKESHI",
          "valor": 2574
        },
        {
          "data": "2026-09-30",
          "empresa": "NOVO TEMPO - MANUTENÇÃO PREVENTIVA",
          "valor": 2330
        },
        {
          "data": "2026-09-10",
          "empresa": "TK ELEVADORES",
          "valor": 1190.39
        },
        {
          "data": "2026-09-11",
          "empresa": "ABB DA COSTA",
          "valor": 1000
        },
        {
          "data": "2026-09-15",
          "empresa": "GILBERTO - IMPRESSORA",
          "valor": 2100
        },
        {
          "data": "2026-09-17",
          "empresa": "TUCANO DO BRASIL - SEGURANÇA",
          "valor": 2662.88
        },
        {
          "data": "2026-09-18",
          "empresa": "ORTO VIDA",
          "valor": 340
        },
        {
          "data": "2026-09-21",
          "empresa": "SAFE SANITIZAÇÃO",
          "valor": 900
        },
        {
          "data": "2026-09-15",
          "empresa": "MARINATO MAQUINAS",
          "valor": 315.44
        }
      ]
    }
  },
  {
    "id": "servicos-essenciais",
    "label": "Serviços Essenciais",
    "description": "Telefonia, internet, laudos, softwares e utilidades",
    "months": {
      "Maio": [
        {
          "data": "2026-05-04",
          "empresa": "EMBRATEL (02/2026)",
          "valor": 753.74
        },
        {
          "data": "2026-05-04",
          "empresa": "EMBRATEL (03/2026)",
          "valor": 753
        },
        {
          "data": "2026-05-04",
          "empresa": "VIVO - MONITORA DADOS (04/2026)",
          "valor": 20
        },
        {
          "data": "2026-05-04",
          "empresa": "VIVO - IP DEDICADO (04/2026)",
          "valor": 800.02
        },
        {
          "data": "2026-05-10",
          "empresa": "MAIS TELEMEDICINA",
          "valor": 257.44
        },
        {
          "data": "2026-05-11",
          "empresa": "ALVO COMUNIC.",
          "valor": 3413
        },
        {
          "data": "2026-05-23",
          "empresa": "SIMPRO",
          "valor": 893.75
        },
        {
          "data": "2026-05-18",
          "empresa": "CLARO INTERNET (05/2026)",
          "valor": 1060.44
        },
        {
          "data": "2026-05-01",
          "empresa": "CLARO INTERNET (05/2026)",
          "valor": 62.26
        },
        {
          "data": "2026-05-20",
          "empresa": "CLICK LAUDOS",
          "valor": 3039.99
        },
        {
          "data": "2026-05-13",
          "empresa": "VIVO - MÓVEL (03/2026)",
          "valor": 113.5
        },
        {
          "data": "2026-05-13",
          "empresa": "VIVO - IP DEDICADO (03/2026)",
          "valor": 81.49
        },
        {
          "data": "2026-05-13",
          "empresa": "VIVO - INTERNET (03/2026)",
          "valor": 1651.93
        },
        {
          "data": "2026-05-13",
          "empresa": "VIVO - MÓVEL (04/2026)",
          "valor": 111.01
        },
        {
          "data": "2026-05-13",
          "empresa": "VIVO - IP DEDICADO (04/2026)",
          "valor": 79.83
        },
        {
          "data": "2026-05-13",
          "empresa": "VIVO - INTERNET (04/2026)",
          "valor": 1618
        },
        {
          "data": "2026-05-27",
          "empresa": "VIVO - MONITORA DADOS (05/2026)",
          "valor": 20.93
        },
        {
          "data": "2026-05-27",
          "empresa": "VIVO - IP DEDICADO (05/2026)",
          "valor": 796.64
        },
        {
          "data": "-",
          "empresa": "EQUATORIAL",
          "valor": 27323.04
        }
      ],
      "Junho": [
        {
          "data": "2026-06-15",
          "empresa": "ASSUNÇÃO MADEIRA",
          "valor": 20793.03
        },
        {
          "data": "2026-06-15",
          "empresa": "EMBRATEL (04/2026)",
          "valor": 753.74
        },
        {
          "data": "2026-06-15",
          "empresa": "EMBRATEL (05/2026)",
          "valor": 753.74
        },
        {
          "data": "2026-06-15",
          "empresa": "MAIS TELEMEDICINA",
          "valor": 596.31
        },
        {
          "data": "2026-06-17",
          "empresa": "CLARO - MÓVEL (05/2026)",
          "valor": 1082.36
        },
        {
          "data": "2026-06-17",
          "empresa": "CLARO - MÓVEL (05/2026)",
          "valor": 603.44
        },
        {
          "data": "2026-06-20",
          "empresa": "CLARO - VIP ESPECIAL (05/2026)",
          "valor": 180
        },
        {
          "data": "2026-06-20",
          "empresa": "I S LOPES - SISTEMA IS",
          "valor": 4787.75
        },
        {
          "data": "2026-06-15",
          "empresa": "LOCAWEB - WEBMAIL",
          "valor": 128.01
        },
        {
          "data": "2026-06-03",
          "empresa": "AGUAS DO PARÁ (04/2026)",
          "valor": 150.7
        },
        {
          "data": "2026-06-01",
          "empresa": "AGUAS DO PARÁ (05/2026)",
          "valor": 146.6
        },
        {
          "data": "2026-06-10",
          "empresa": "ALVO COMUNIC.",
          "valor": 3413
        },
        {
          "data": "2026-06-08",
          "empresa": "VIVO (05/2026)",
          "valor": 111.01
        },
        {
          "data": "2026-06-08",
          "empresa": "VIVO (05/2026)",
          "valor": 84.57
        },
        {
          "data": "2026-06-08",
          "empresa": "VIVO (05/2026)",
          "valor": 1714.47
        },
        {
          "data": "2026-06-22",
          "empresa": "ÁGUAS DO PARÁ (06/2026)",
          "valor": 151.34
        },
        {
          "data": "2026-06-22",
          "empresa": "CLICK LAUDOS",
          "valor": 3017.51
        },
        {
          "data": "2026-07-23",
          "empresa": "SIMPRO",
          "valor": 893.75
        },
        {
          "data": "2026-06-27",
          "empresa": "VIVO - MONITORA DADOS (06/2026)",
          "valor": 20.43
        },
        {
          "data": "2026-06-27",
          "empresa": "VIVO - IP DEDICADO(06/2026)",
          "valor": 796.9
        },
        {
          "data": "2026-06-27",
          "empresa": "VIVO - MONITORA DADOS (06/2026)",
          "valor": 81.76
        },
        {
          "data": "2026-06-27",
          "empresa": "VIVO - IP DEDICADO -  INTERNET (06/2026)",
          "valor": 1657.34
        },
        {
          "data": null,
          "empresa": "EQUATORIAL",
          "valor": 26944.18
        }
      ],
      "Julho": [
        {
          "data": "2026-07-01",
          "empresa": "CLARO - MÓVEL (05/2026)",
          "valor": 252.13
        },
        {
          "data": "2026-07-10",
          "empresa": "ALVO COMUNIC.",
          "valor": 3413
        },
        {
          "data": "2026-07-15",
          "empresa": "ASSUNÇÃO MADEIRA",
          "valor": 19640.07
        },
        {
          "data": "2026-07-15",
          "empresa": "LOCAWEB",
          "valor": 136.98
        },
        {
          "data": "2026-07-20",
          "empresa": "CLICK LAUDOS",
          "valor": 3374.28
        },
        {
          "data": "2026-07-23",
          "empresa": "SIMPRO",
          "valor": 893.75
        },
        {
          "data": "2026-07-15",
          "empresa": "MAIS TELEMEDICINA",
          "valor": 635.92
        },
        {
          "data": "2026-06-25",
          "empresa": "VIVO - MÓVEL  (06/2026)",
          "valor": 117.85
        },
        {
          "data": "2026-07-27",
          "empresa": "VIVO - MÓVEL  (07/2026)",
          "valor": 113.77
        },
        {
          "data": "2026-07-24",
          "empresa": "ÁGUAS DE PARÁ (07/2026)",
          "valor": 149.68
        },
        {
          "data": null,
          "empresa": "EQUATORIAL",
          "valor": 29069.36
        }
      ],
      "Agosto": [
        {
          "data": "2026-08-18",
          "empresa": "HF SOLUTIONS - SISTEMA TASY",
          "valor": 13857.2
        },
        {
          "data": "2026-08-10",
          "empresa": "ALVO COMUNIC.",
          "valor": 3413
        },
        {
          "data": "2026-08-10",
          "empresa": "CLARO - INTERNET (07/2026)",
          "valor": 250.68
        },
        {
          "data": "2026-08-07",
          "empresa": "CLARO - INTERNET (07/2026)",
          "valor": 49.24
        },
        {
          "data": "2026-08-10",
          "empresa": "VIVO (08/2026)",
          "valor": 20
        },
        {
          "data": "2026-08-10",
          "empresa": "VIVO (08/2026)",
          "valor": 780
        },
        {
          "data": "2026-08-10",
          "empresa": "VIVO (08/2026)",
          "valor": 82.7
        },
        {
          "data": "2026-08-10",
          "empresa": "VIVO (08/2026)",
          "valor": 1676.08
        },
        {
          "data": "2026-08-15",
          "empresa": "LOCAWEB",
          "valor": 136.98
        },
        {
          "data": "2026-08-15",
          "empresa": "ASSUÇÃO MADEIRA - AMD",
          "valor": 19969.5
        },
        {
          "data": "2026-08-15",
          "empresa": "TELEMEDICINA",
          "valor": 756.23
        },
        {
          "data": "2026-08-17",
          "empresa": "CLARO - MÓVEL (07/2026)",
          "valor": 669.63
        },
        {
          "data": "2026-08-17",
          "empresa": "CLARO - INTERNET (07/2026)",
          "valor": 1074.44
        },
        {
          "data": "2026-08-20",
          "empresa": "CLICK LAUDOS",
          "valor": 3300.7
        },
        {
          "data": "2026-08-23",
          "empresa": "SIMPRO",
          "valor": 893.75
        },
        {
          "data": null,
          "empresa": "EQUATORIAL",
          "valor": 27051.48
        }
      ],
      "Setembro": [
        {
          "data": "2026-09-01",
          "empresa": "SIMPRO",
          "valor": 952.31
        },
        {
          "data": "2026-09-23",
          "empresa": "SIMPRO",
          "valor": 893.75
        },
        {
          "data": "2026-09-25",
          "empresa": "VIVO - INTERNET BOX",
          "valor": 111.01
        },
        {
          "data": "2026-09-09",
          "empresa": "VIVO - INTERNET BOX (08/2026)",
          "valor": 113.92
        },
        {
          "data": "2026-09-09",
          "empresa": "VIVO - IP DEDICADO (08/2026)",
          "valor": 798.98
        },
        {
          "data": "2026-09-09",
          "empresa": "VIVO - MONITORA DADOS (08/2026)",
          "valor": 84.7
        },
        {
          "data": "2026-09-09",
          "empresa": "VIVO - IP DEDICADO (08/2026)",
          "valor": 1716.82
        },
        {
          "data": "2026-09-09",
          "empresa": "VIVO - MONITORA DADOS (08/2026)",
          "valor": 20.48
        },
        {
          "data": "2026-09-10",
          "empresa": "HF SOLUTIONS - SISTEMA TASY",
          "valor": 10392.9
        },
        {
          "data": "2026-09-10",
          "empresa": "ALVO COMUNICAÇÃO",
          "valor": 3413
        },
        {
          "data": "2026-09-15",
          "empresa": "TI TELEMEDICINA",
          "valor": 629.34
        },
        {
          "data": "2026-09-15",
          "empresa": "LOCAWEB",
          "valor": 145.58
        },
        {
          "data": "2026-09-17",
          "empresa": "CLARO - MÓVEL (08/2026)",
          "valor": 1052.36
        },
        {
          "data": "2026-09-17",
          "empresa": "CLARO - MÓVEL (08/2026)",
          "valor": 646.07
        },
        {
          "data": "2026-09-20",
          "empresa": "IS SISTEMA",
          "valor": 4787.75
        },
        {
          "data": "2026-09-21",
          "empresa": "CLICK LAUDOS",
          "valor": 3229.24
        },
        {
          "data": null,
          "empresa": "EQUATORIAL",
          "valor": 25538.33
        }
      ]
    }
  },
  {
    "id": "marketing",
    "label": "Marketing",
    "description": "Mídia, propaganda e comunicação",
    "months": {
      "Maio": [
        {
          "data": "2026-05-05",
          "empresa": "AGÊNCIA URUCUM",
          "valor": 8000
        },
        {
          "data": "2026-05-30",
          "empresa": "CE BENETTI - BUSDOOR",
          "valor": 26880
        },
        {
          "data": "2026-05-30",
          "empresa": "JACY DUARTE - BUSDOOR",
          "valor": 6720
        },
        {
          "data": "2026-05-18",
          "empresa": "RADIO RAULAND",
          "valor": 4000
        },
        {
          "data": "2026-05-21",
          "empresa": "JACY DUARTE - MAN. DO SITE",
          "valor": 300
        },
        {
          "data": "2026-05-15",
          "empresa": "CRIAÇÃO DE ARTES E TEXTOS",
          "valor": 1000
        },
        {
          "data": "2026-05-15",
          "empresa": "CE BENETTI - BUSDOOR",
          "valor": 26880
        },
        {
          "data": "2026-05-30",
          "empresa": "JACY DUARTE - MIDIA DIGITAL",
          "valor": 5927
        },
        {
          "data": "2026-05-15",
          "empresa": "JACY DUARTE - BUSDOOR",
          "valor": 6720
        },
        {
          "data": "-",
          "empresa": "VOZ DO BAIRRO - PAGO EM ESP.",
          "valor": 300
        },
        {
          "data": "-",
          "empresa": "GERALDO MAGELO - 05/2026",
          "valor": 2500
        }
      ],
      "Junho": [
        {
          "data": "2026-06-15",
          "empresa": "CE BENETTI - BUSDOOR",
          "valor": 26880
        },
        {
          "data": "2026-06-15",
          "empresa": "JACY DUARTE - BUSDOOR",
          "valor": 6720
        },
        {
          "data": "2026-06-20",
          "empresa": "JACY DUARTE - MAN. DO SITE",
          "valor": 300
        },
        {
          "data": "2026-06-03",
          "empresa": "AGÊNCIA URUCUM",
          "valor": 8350
        },
        {
          "data": "2026-06-30",
          "empresa": "JACY DUARTE - BUSDOOR",
          "valor": 6720
        },
        {
          "data": "2026-06-30",
          "empresa": "CE BENETTI - BUSDOOR",
          "valor": 26880
        },
        {
          "data": "2026-06-30",
          "empresa": "JACY DUARTE - MIDIA DIGITAL",
          "valor": 5927
        },
        {
          "data": "2026-06-15",
          "empresa": "CRIAÇÃO DE ARTES E TEXTOS",
          "valor": 1000
        },
        {
          "data": "-",
          "empresa": "VOZ DO BAIRRO - PAGO EM ESPECIE",
          "valor": 300
        },
        {
          "data": "-",
          "empresa": "GERALDO MAGELO - 06/2026",
          "valor": 2500
        }
      ],
      "Julho": [
        {
          "data": "2026-07-15",
          "empresa": "JACY DUARTE",
          "valor": 1000
        },
        {
          "data": "2026-07-15",
          "empresa": "RAULAND FM",
          "valor": 4000
        },
        {
          "data": "2026-07-20",
          "empresa": "JACY DUARTE - MAN. DO SITE",
          "valor": 300
        },
        {
          "data": "2026-07-30",
          "empresa": "CE BENETTI - BUSDOOR",
          "valor": 26880
        },
        {
          "data": "2026-07-15",
          "empresa": "CE BENETTI - BUSDOOR",
          "valor": 26880
        },
        {
          "data": "2026-07-15",
          "empresa": "JACY DUARTE - BUSDOOR",
          "valor": 6720
        },
        {
          "data": "2026-07-30",
          "empresa": "JACY DUARTE - BUSDOOR",
          "valor": 6720
        },
        {
          "data": "2026-07-30",
          "empresa": "JACY DUARTE - MIDIA DIGITAL",
          "valor": 5927
        },
        {
          "data": "-",
          "empresa": "VOZ DO BAIRRO - PAGO EM ESPECIE",
          "valor": 300
        },
        {
          "data": "-",
          "empresa": "GERALDO MAGELO - 07/2026",
          "valor": 2500
        }
      ],
      "Agosto": [
        {
          "data": "2026-08-04",
          "empresa": "AGÊNCIA URUCUM",
          "valor": 5000
        },
        {
          "data": "2026-08-08",
          "empresa": "FACEBOOK - ADA BASTOS",
          "valor": 3000
        },
        {
          "data": "2026-08-30",
          "empresa": "RADIO CLUBE",
          "valor": 8000
        },
        {
          "data": "2026-08-15",
          "empresa": "RAULAND",
          "valor": 4000
        },
        {
          "data": "2026-08-15",
          "empresa": "JACY DUARTE - MAN. DO SITE",
          "valor": 300
        },
        {
          "data": "2026-08-15",
          "empresa": "CE BENETTI - BUSDOOR",
          "valor": 26880
        },
        {
          "data": "2026-08-15",
          "empresa": "JACY DUARTE - BUSDOOR",
          "valor": 6720
        },
        {
          "data": "2026-08-30",
          "empresa": "CE BENETTI - BUSDOOR",
          "valor": 26880
        },
        {
          "data": "2026-08-30",
          "empresa": "JACY DUARTE - BUSDOOR",
          "valor": 6720
        },
        {
          "data": "2026-08-30",
          "empresa": "JACY DUARTE - MIDIA DIGITAL",
          "valor": 5927
        },
        {
          "data": "2026-08-28",
          "empresa": "JACY DUARTE - JINGLE",
          "valor": 2400
        },
        {
          "data": "2026-08-15",
          "empresa": "CRIAÇÃO DE ARTES E TEXTOS",
          "valor": 1000
        }
      ],
      "Setembro": [
        {
          "data": "2026-08-15",
          "empresa": "JACY DUARTE - MAN. DO SITE",
          "valor": 300
        },
        {
          "data": "2026-09-03",
          "empresa": "AGÊNCIA URUCUM",
          "valor": 5000
        },
        {
          "data": "2026-09-08",
          "empresa": "FACEBOOK - ADA BASTOS",
          "valor": 3000
        },
        {
          "data": "2026-09-30",
          "empresa": "TV LIBERAL",
          "valor": 4800
        },
        {
          "data": "2026-09-30",
          "empresa": "JACY DUARTE - DESCONTO PADRÃO",
          "valor": 1200
        },
        {
          "data": "2026-09-30",
          "empresa": "JACY DUARTE - BUSDOOR",
          "valor": 6720
        },
        {
          "data": "2026-09-30",
          "empresa": "CE BENETTI - BUSDOOR",
          "valor": 26880
        },
        {
          "data": "2026-09-15",
          "empresa": "CE BENETTI - BUSDOOR",
          "valor": 26880
        },
        {
          "data": "2026-09-15",
          "empresa": "JACY DUARTE - BUSDOOR",
          "valor": 6720
        },
        {
          "data": "2026-09-15",
          "empresa": "CARAJÁS FM",
          "valor": 9680
        },
        {
          "data": "2026-09-15",
          "empresa": "TV LIBERAL",
          "valor": 4800
        },
        {
          "data": "2026-09-15",
          "empresa": "JACY DUARTE - DESCONTO PADRÃO",
          "valor": 1200
        },
        {
          "data": "2026-09-15",
          "empresa": "CRIAÇÃO DE ARTES E TEXTOS",
          "valor": 1000
        }
      ]
    }
  },
  {
    "id": "impostos-tomados",
    "label": "Impostos Tomados",
    "description": "Impostos e retenções sobre serviços tomados",
    "months": {
      "Maio": [
        {
          "data": "2026-05-11",
          "empresa": "ISSQN - SEFIN (04/2026)",
          "valor": 9939.68
        },
        {
          "data": "2026-05-20",
          "empresa": "DARF MENSAL TOM. - PAULO AZEVEDO",
          "valor": 1952.2
        },
        {
          "data": "2026-05-20",
          "empresa": "DARF MENSAL TOM. - TK ELEV.",
          "valor": 58.04
        },
        {
          "data": "2026-05-20",
          "empresa": "DARF MENSAL TOM. - AMD MADEIRA",
          "valor": 807.93
        },
        {
          "data": "2026-05-20",
          "empresa": "DARF MENSAL TOM. - COOPERATIVA",
          "valor": 4904.88
        },
        {
          "data": "2026-05-25",
          "empresa": "DARF MENSAL - PIS",
          "valor": 817.72
        },
        {
          "data": "2026-05-25",
          "empresa": "DARF MENSAL - COFINS",
          "valor": 4057.6
        }
      ],
      "Junho": [
        {
          "data": "2026-06-19",
          "empresa": "DARF TOM. - TK ELEV.",
          "valor": 58.04
        },
        {
          "data": "2026-06-19",
          "empresa": "DARF TOM. - PAULO AZEVEDO",
          "valor": 2445.78
        },
        {
          "data": "2026-06-19",
          "empresa": "DARF. TOM. - AMD MADEIRA",
          "valor": 973
        },
        {
          "data": "2026-06-19",
          "empresa": "DARF. TOM. - COOPERATIVA",
          "valor": 5534
        },
        {
          "data": "2026-06-10",
          "empresa": "ISSQN - SEFIN (05/2026)",
          "valor": 24030.47
        },
        {
          "data": "2026-06-25",
          "empresa": "DARF MENSAL - PIS",
          "valor": 2273.1
        },
        {
          "data": "2026-06-25",
          "empresa": "DARF MENSAL - COFINS",
          "valor": 10533.33
        }
      ],
      "Julho": [
        {
          "data": "2026-07-10",
          "empresa": "ISSQN - SEFIN (06/2026)",
          "valor": 5855.23
        },
        {
          "data": "2026-07-20",
          "empresa": "DARF TOM. - PAULO AZEVEDO",
          "valor": 2515.36
        },
        {
          "data": "2026-07-20",
          "empresa": "DARF TOM. - COOPERATIVA",
          "valor": 6012.56
        },
        {
          "data": "2026-07-20",
          "empresa": "DARF TOM. - TK ELEVADORES",
          "valor": 58.04
        },
        {
          "data": "2026-07-31",
          "empresa": "DARF TRIM. - TOM. IRPJ",
          "valor": 1030.22
        },
        {
          "data": "2026-07-31",
          "empresa": "DARF TRIM. - TOM. IRPJ",
          "valor": 2036.71
        },
        {
          "data": "2026-07-24",
          "empresa": "DARF MENSAL  - PIS",
          "valor": 816.52
        },
        {
          "data": "2026-07-24",
          "empresa": "DARF MENSAL  - COFINS",
          "valor": 3762.97
        },
        {
          "data": "2026-07-31",
          "empresa": "2° TRIMESTRE - PRESTADOR IRPJ",
          "valor": 19155.66
        }
      ],
      "Agosto": [
        {
          "data": "2026-08-10",
          "empresa": "ISSQN - SEFIN (07/2026)",
          "valor": 28945.24
        },
        {
          "data": "2026-08-20",
          "empresa": "DARF TOM. - COOPERATIVA",
          "valor": 5461.56
        },
        {
          "data": "2026-08-20",
          "empresa": "DARF TOM. - AMD MADEIRA",
          "valor": 973.1
        },
        {
          "data": "2026-08-20",
          "empresa": "DARF IRPJ - AMD MADEIRA",
          "valor": 313.9
        },
        {
          "data": "2026-08-20",
          "empresa": "DARF TOM. - TK ELEVADORES",
          "valor": 58.08
        },
        {
          "data": "2026-08-20",
          "empresa": "DARF IRPJ - TOM. - PAULO AZEVEDO",
          "valor": 1955.8
        },
        {
          "data": "2026-08-25",
          "empresa": "DARF MENSAL - PIS",
          "valor": 800.63
        },
        {
          "data": "2026-08-25",
          "empresa": "DARF MENSAL - COFINS",
          "valor": 3964.77
        },
        {
          "data": "2026-08-20",
          "empresa": "T.I TELEMEDICINA - TOM.",
          "valor": 10.16
        },
        {
          "data": "2026-08-20",
          "empresa": "T.I TELEMEDICINA - TOM.",
          "valor": 31.51
        }
      ],
      "Setembro": [
        {
          "data": "2026-09-21",
          "empresa": "DARF MENSAL - TOM. - TI TELEMEDICINA",
          "valor": 10.13
        },
        {
          "data": "2026-09-21",
          "empresa": "DARF MENSAL - TOM. - TI TELEMEDICINA",
          "valor": 51.78
        },
        {
          "data": "2026-09-21",
          "empresa": "DARF MENSAL - TOM. - LAUDOS",
          "valor": 160.52
        },
        {
          "data": "2026-09-21",
          "empresa": "DARF MENSAL - TOM. - PAULO",
          "valor": 690.78
        },
        {
          "data": "2026-09-21",
          "empresa": "DARF MENSAL - TOM. - PAULO",
          "valor": 2141.44
        },
        {
          "data": "2026-09-21",
          "empresa": "DARF MENSAL - TOM. - TK ELEVADORES",
          "valor": 58.23
        },
        {
          "data": "2026-09-21",
          "empresa": "DARF MENSAL - TOM. - AMD",
          "valor": 992.68
        },
        {
          "data": "2026-09-21",
          "empresa": "DARF MENSAL - TOM. - AMD",
          "valor": 320.22
        },
        {
          "data": "2026-09-21",
          "empresa": "DARF MENSAL - TOM. - TI TELEMEDICINA",
          "valor": 31.3
        },
        {
          "data": "2026-09-21",
          "empresa": "DARF MENSAL - TOM. - COOPERATIVA",
          "valor": 5141.03
        },
        {
          "data": "2026-09-25",
          "empresa": "DARF MENSAL - PIS",
          "valor": 905.04
        },
        {
          "data": "2026-09-25",
          "empresa": "DARF MENSAL - COFINS",
          "valor": 4176.44
        },
        {
          "data": "2026-09-10",
          "empresa": "ISSQN - MENSAL (08/2026)",
          "valor": 8653.33
        }
      ]
    }
  },
  {
    "id": "custos-adicionais",
    "label": "Custos Adicionais",
    "description": "Demais custos operacionais não classificados",
    "months": {
      "Maio": [
        {
          "data": "S/DATA",
          "empresa": "JOHNATHAN - FRETE E CORREIOS",
          "valor": 865
        },
        {
          "data": "S/DATA",
          "empresa": "TÉC. DE RADIO - ESTAG.",
          "valor": 400
        },
        {
          "data": "S/DATA",
          "empresa": "COLAB. PERIODO DE EXP.",
          "valor": 355
        },
        {
          "data": "S/DATA",
          "empresa": "BONIFICAÇÕES",
          "valor": 600
        },
        {
          "data": "2026-05-06",
          "empresa": "PIETRA - C.M",
          "valor": 5800
        },
        {
          "data": "2026-05-15",
          "empresa": "EDIVAL DE ALMEIDA SOUZA",
          "valor": 2850
        },
        {
          "data": "2026-05-29",
          "empresa": "NORTE SAÚDE",
          "valor": 752.18
        }
      ],
      "Junho": [
        {
          "data": "S/DATA",
          "empresa": "JOHNATHAN - FRETE E CORREIOS",
          "valor": 937
        },
        {
          "data": "S/DATA",
          "empresa": "TÉC. DE RADIO - ESTAG.",
          "valor": 400
        },
        {
          "data": "S/DATA",
          "empresa": "COLAB. PERIODO DE EXP.",
          "valor": 435
        },
        {
          "data": "S/DATA",
          "empresa": "BONIFICAÇÕES",
          "valor": 900
        },
        {
          "data": "2026-06-11",
          "empresa": "LINANA/INPROMM",
          "valor": 19452
        },
        {
          "data": "2026-06-20",
          "empresa": "UNITEC",
          "valor": 486
        },
        {
          "data": "2026-06-08",
          "empresa": "PIETRA - C.M",
          "valor": 5800
        }
      ],
      "Julho": [
        {
          "data": "S/DATA",
          "empresa": "JOHNATHAN - FRETE E CORREIOS",
          "valor": 880
        },
        {
          "data": "S/DATA",
          "empresa": "TÉC. DE RADIO - ESTAG.",
          "valor": 400
        },
        {
          "data": "S/DATA",
          "empresa": "COLAB. PERIODO DE EXP.",
          "valor": 650
        },
        {
          "data": "S/DATA",
          "empresa": "BONIFICAÇÕES",
          "valor": 2100
        },
        {
          "data": "2026-07-07",
          "empresa": "EDIVAL DE ALMEIDA SOUZA",
          "valor": 1900
        },
        {
          "data": "S/DATA",
          "empresa": "PIETRA - C.M",
          "valor": 5800
        }
      ],
      "Agosto": [
        {
          "data": "2026-08-10",
          "empresa": "TRIBUNAL DE JUSTIÇA",
          "valor": 4103.24
        },
        {
          "data": "2026-08-07",
          "empresa": "PIETRA - C.M",
          "valor": 5800
        },
        {
          "data": "2026-08-20",
          "empresa": "UNITEC",
          "valor": 486
        }
      ],
      "Setembro": [
        {
          "data": "2026-09-03",
          "empresa": "PIETRA - C.M",
          "valor": 5800
        },
        {
          "data": "2026-06-30",
          "empresa": "SANTA LUZIA",
          "valor": 888
        },
        {
          "data": "2026-09-02",
          "empresa": "R NERES",
          "valor": 8000
        }
      ]
    }
  }
];
