"""Casos reais que a leitura antiga errava. Rodar:  python testes/test_dados.py"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from preparar_dados import marca_do_titulo, chave_foto  # noqa: E402
from gerar_paginas_individuais import slugify  # noqa: E402


def test_marca_por_palavra_inteira():
    assert marca_do_titulo("Coletor Admissao Ford New Fiesta Ka Focus Ecosport Sigma 1.5") == "Ford"
    assert marca_do_titulo("Biela Motor Gm Captiva 3.6 V6 08/17 12608432") == "Chevrolet"
    assert marca_do_titulo("Lanterna Traseira Esquerda Citoen C3 11/16 9687871880") == "Citroën"
    assert marca_do_titulo("Acabamento Porta Copos Mercedes Gla 200 2019") == "Mercedes-Benz"
    assert marca_do_titulo("Chave Farol Range Rover Sport 09/13 E0201043") == "Land Rover"
    assert marca_do_titulo("Sirene Alarme Vw Jetta Golf Passat 06/16") == "Volkswagen"


def test_foto_vira_chave():
    u = "https://http2.mlstatic.com/D_957636-MLB110353255009_042026-O.webp"
    assert chave_foto(u) == "957636-MLB110353255009_042026"


def test_slug_identico_ao_gerador_antigo():
    t = "Antena Teto Shark Volvo S60 Xc60 V60 18/24 31346765 Preto"
    assert slugify(t) == "antena-teto-shark-volvo-s60-xc60-v60-18-24-31346765-preto"


def test_dados_gerados():
    pecas = ROOT / "site" / "src" / "data" / "pecas.json"
    if not pecas.exists():
        return
    by = {x["id"]: x for x in json.loads(pecas.read_text(encoding="utf-8"))}
    casos = {
        "MLB4779038537": ("Volvo", "XC60", [2018, 2024]),   # "Xc 60" separado
    }
    for mlb, (b, m, y) in casos.items():
        if mlb in by:
            x = by[mlb]
            assert (x["b"], x["m"], x["y"]) == (b, m, y), (mlb, x["b"], x["m"], x["y"])
    sem_modelo = sum(1 for x in by.values() if not x["m"])
    assert sem_modelo / len(by) < 0.04, f"{sem_modelo} pecas sem modelo"
    assert all("SELLER_SKU" not in json.dumps(x) for x in list(by.values())[:200])


if __name__ == "__main__":
    for nome, f in list(globals().items()):
        if nome.startswith("test_"):
            f()
            print("ok", nome)
