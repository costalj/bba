from datetime import datetime


def formatar_data_hora_br(valor) -> str:
    if not valor:
        return "—"
    texto = str(valor).strip()
    if not texto:
        return "—"

    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%d/%m/%Y %H:%M:%S"):
        try:
            dt = datetime.strptime(texto[:19], fmt)
            return dt.strftime("%d/%m/%Y %H:%M")
        except ValueError:
            continue

    if "," in texto and "/" in texto:
        return texto.replace(",", "").strip()

    return texto


def texto_viatura(vistoria_row) -> str:
    try:
        placa = (vistoria_row["placa"] or "").strip()
        tipo = (vistoria_row["tipo_viatura"] or "").strip()
    except (KeyError, TypeError, AttributeError):
        return "—"
    if placa and tipo:
        return f"{placa} · {tipo}"
    return placa or tipo or "—"


def status_viatura(vistoria_row) -> str:
    try:
        status = vistoria_row["status"]
        if status:
            return str(status).strip()
    except (KeyError, IndexError):
        pass
    try:
        return (vistoria_row["recomendacao"] or "—").strip()
    except (KeyError, IndexError):
        return "—"
