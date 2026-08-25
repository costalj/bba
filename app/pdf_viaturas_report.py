"""Geração de PDF — checklist de vistoria de viaturas."""

import os
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Image,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from app.database import get_assinatura_viatura, get_checklist_viatura, numero_vistoria_viatura
from app.pdf_report import LOGO_BBA_PATH, _table_style_padrao
from app.viaturas_checklist import CHECKLIST_SECOES, calcular_resultado_viatura, total_itens_checklist


def _cor_status(recomendacao: str):
    mapa = {
        "APROVADA": colors.HexColor("#d8f3dc"),
        "APROVADA COM RESTRIÇÕES": colors.HexColor("#fff8e7"),
        "IMPEDIDA": colors.HexColor("#fde8e8"),
    }
    return mapa.get(recomendacao, colors.white)


def _texto_viatura(row) -> str:
    placa = (row["placa"] or "").strip()
    tipo = (row["tipo_viatura"] or "").strip()
    if placa and tipo:
        return f"{placa} · {tipo}"
    return placa or tipo or "—"


def gerar_pdf_viatura(vistoria) -> bytes:
    checklist = get_checklist_viatura(vistoria)
    assinatura = get_assinatura_viatura(vistoria)
    resultado = calcular_resultado_viatura(checklist) if checklist else None
    max_itens = total_itens_checklist()

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=9,
        textColor=colors.grey,
        spaceAfter=10,
    )
    heading_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontSize=12,
        textColor=colors.HexColor("#c62828"),
        spaceBefore=10,
        spaceAfter=6,
    )
    body_style = styles["Normal"]
    header_line = ParagraphStyle(
        "CabLine",
        parent=styles["Normal"],
        fontSize=10,
        alignment=TA_CENTER,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#1b4332"),
        spaceAfter=3,
        leading=12,
    )
    title_line = ParagraphStyle(
        "CabTitle",
        parent=header_line,
        fontSize=11,
        spaceBefore=6,
        spaceAfter=10,
    )

    story = []
    numero = numero_vistoria_viatura(vistoria)

    if os.path.exists(LOGO_BBA_PATH):
        logo = Image(LOGO_BBA_PATH, width=2.8 * cm, height=2.8 * cm, kind="proportional")
        logo_table = Table([[logo]], colWidths=[16 * cm])
        logo_table.setStyle(
            TableStyle(
                [
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        story.append(logo_table)

    for linha in (
        "SECRETARIA DE SEGURANÇA PÚBLICA",
        "CORPO DE BOMBEIROS MILITAR DO MARANHÃO",
        "BATALHÃO DE BOMBEIROS AMBIENTAL",
    ):
        story.append(Paragraph(linha, header_line))

    story.append(
        Paragraph(f"CHECKLIST DE VISTORIA DE VIATURA Nº {numero}", title_line)
    )

    status = vistoria["recomendacao"]
    rows_status = [
        [Paragraph(f"<b>Status:</b> {status}", body_style)],
        [
            Paragraph(
                f"<b>Itens não conformes:</b> {vistoria['pontuacao_total']} / {max_itens}",
                body_style,
            )
        ],
        [Paragraph(vistoria["justificativa"] or "—", body_style)],
    ]
    t_status = Table(rows_status, colWidths=[16 * cm])
    t_status.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), _cor_status(status)),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#c62828")),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    story.append(t_status)
    story.append(Spacer(1, 0.4 * cm))

    story.append(Paragraph("1. Identificação", heading_style))
    dados = [
        ["Campo", "Valor"],
        ["Nº da vistoria", numero],
        ["Data", vistoria["created_at"]],
        ["Condutor", (vistoria["condutor"] or "—")],
        ["Viatura", _texto_viatura(vistoria)],
        ["Quilometragem", (vistoria["km"] or "—")],
        ["Status", status],
    ]
    t_dados = Table(dados, colWidths=[5 * cm, 11 * cm])
    t_dados.setStyle(_table_style_padrao())
    story.append(t_dados)
    story.append(Spacer(1, 0.3 * cm))

    for secao in CHECKLIST_SECOES:
        story.append(Paragraph(secao["titulo"], heading_style))
        linhas = [["Item", "Descrição", "Conforme"]]
        for p in secao["perguntas"]:
            val = checklist.get(p["id"], "nao")
            conforme = "SIM" if val == "sim" else "NÃO"
            texto = p["texto"]
            if p.get("critico"):
                texto += " ⚠"
            linhas.append([p["numero"], texto, conforme])
        t = Table(linhas, colWidths=[1.5 * cm, 11.5 * cm, 3 * cm])
        t.setStyle(_table_style_padrao(font_size=9))
        story.append(t)
        story.append(Spacer(1, 0.2 * cm))

    if vistoria["observacoes"]:
        story.append(Paragraph("Observações", heading_style))
        story.append(Paragraph(vistoria["observacoes"], body_style))
        story.append(Spacer(1, 0.3 * cm))

    story.append(Paragraph("Assinatura do Condutor de viatura", heading_style))
    if assinatura:
        assin_rows = [
            [Paragraph(f"<b>{assinatura.get('assinado_por', '—')}</b>", body_style)],
            [Paragraph(assinatura.get("cargo", "Condutor de viatura"), body_style)],
            [Paragraph(assinatura.get("data_hora", ""), body_style)],
            [
                Paragraph(
                    assinatura.get("tipo", "Assinatura eletrônica") + " registrada",
                    subtitle_style,
                )
            ],
        ]
    else:
        assin_rows = [[Paragraph("Aguardando assinatura do Condutor de viatura.", body_style)]]

    t_assin = Table(assin_rows, colWidths=[16 * cm])
    t_assin.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#c62828")),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f6f9f7")),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    story.append(t_assin)

    story.append(Spacer(1, 0.8 * cm))
    story.append(
        Paragraph(
            "<i>Documento gerado automaticamente — Sistema BBA/CBMMA.</i>",
            subtitle_style,
        )
    )

    doc.build(story)
    buffer.seek(0)
    return buffer.read()
