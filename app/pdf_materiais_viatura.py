"""Geração de PDF — conferência de materiais da viatura."""

import base64
import os
import re
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Image, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from app.materiais_viatura import (
    abastecimento_viatura_conferencia,
    data_extenso,
    km_viatura_conferencia,
    qtd_label,
    texto_viatura_cadastro,
)
from app.pdf_report import LOGO_BBA_PATH


def _table_style_materiais(font_size=9):
    return TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2d6a4f")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("FONTSIZE", (0, 0), (-1, -1), font_size),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f6f9f7")]),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]
    )


def _imagem_data_url(data_url: str, max_w=5 * cm, max_h=2.2 * cm):
    if not data_url or not str(data_url).startswith("data:image"):
        return None
    match = re.match(r"data:image/(png|jpeg|jpg);base64,(.+)", data_url, re.I)
    if not match:
        return None
    try:
        raw = base64.b64decode(match.group(2))
        return Image(BytesIO(raw), width=max_w, height=max_h, kind="proportional")
    except Exception:
        return None


def gerar_pdf_conferencia_materiais(conferencia: dict) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
    )

    styles = getSampleStyleSheet()
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
    heading_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontSize=11,
        textColor=colors.HexColor("#2d6a4f"),
        spaceBefore=10,
        spaceAfter=6,
    )
    body_style = styles["Normal"]
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=9,
        textColor=colors.grey,
        spaceAfter=8,
    )

    story = []
    data_label = data_extenso(conferencia.get("data_servico") or "")

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

    story.append(Paragraph("CONFERÊNCIA DE MATERIAIS DA VIATURA", title_line))

    resumo = [
        [Paragraph("<b>Data do serviço</b>", body_style), data_label],
        [Paragraph("<b>Dia da semana</b>", body_style), conferencia.get("dia_semana") or "—"],
        [Paragraph("<b>Chefe de socorro</b>", body_style), conferencia.get("chefe_socorro") or "—"],
    ]
    for rotulo, chave in (
        ("Contato funcional", "contato"),
        ("Motorista", "condutor"),
        ("Comandante de guarnição", "comandante"),
        ("Oficial de dia", "oficial_dia"),
    ):
        valor = (conferencia.get(chave) or "").strip()
        if valor:
            resumo.append([Paragraph(f"<b>{rotulo}</b>", body_style), valor])

    tipo = (conferencia.get("tipo_checklist") or "").strip()
    if tipo:
        label_tipo = "Checklist com Foto" if tipo == "foto" else "Checklist Manual"
        resumo.append([Paragraph("<b>Tipo de checklist</b>", body_style), label_tipo])

    t_resumo = Table(resumo, colWidths=[5.5 * cm, 10.5 * cm])
    t_resumo.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f6f9f7")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#2d6a4f")),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#c8e6c9")),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    story.append(t_resumo)
    story.append(Spacer(1, 0.35 * cm))

    viaturas = conferencia.get("viaturas") or []
    if viaturas:
        story.append(Paragraph("Viaturas", heading_style))
        linhas = [["Viatura", "KM inicial", "Abastecimento"]]
        for v in viaturas:
            linhas.append(
                [
                    texto_viatura_cadastro(v),
                    km_viatura_conferencia(v),
                    abastecimento_viatura_conferencia(v),
                ]
            )
        t_vtr = Table(linhas, colWidths=[8 * cm, 4 * cm, 4 * cm])
        t_vtr.setStyle(_table_style_materiais())
        story.append(t_vtr)
        story.append(Spacer(1, 0.25 * cm))

    for secao in conferencia.get("secoes") or []:
        story.append(Paragraph(secao.get("titulo") or "Materiais", heading_style))
        linhas = [["Qtd", "Material", "Status", "Observação"]]
        for item in secao.get("itens") or []:
            qtd = item.get("qtd_nova") if item.get("status") == "alterado" and item.get("qtd_nova") else item.get("qtd")
            obs_parts = []
            if item.get("obs"):
                obs_parts.append(item["obs"])
            if item.get("status") == "alterado" and item.get("obs_nova"):
                obs_parts.append(item["obs_nova"])
            linhas.append(
                [
                    qtd_label(qtd),
                    item.get("nome") or "—",
                    (item.get("status") or "pronto").capitalize(),
                    " · ".join(obs_parts) or "—",
                ]
            )
        t = Table(linhas, colWidths=[1.4 * cm, 7.2 * cm, 2.4 * cm, 5 * cm])
        t.setStyle(_table_style_materiais(8))
        story.append(t)
        story.append(Spacer(1, 0.15 * cm))

    assinaturas = conferencia.get("assinaturas") or {}
    if assinaturas.get("saindo") or assinaturas.get("entrando"):
        story.append(Paragraph("Passagem de serviço", heading_style))
        blocos = []
        for rotulo, chave in (("Militar saindo", "saindo"), ("Militar entrando", "entrando")):
            dados = assinaturas.get(chave)
            if not dados:
                continue
            img = _imagem_data_url(dados.get("imagem") or "")
            celulas = [[Paragraph(f"<b>{rotulo}</b><br/>{dados.get('nome') or '—'}", body_style)]]
            if img:
                celulas.append([img])
            blocos.append(celulas)

        if blocos:
            cols = len(blocos)
            row_nome = [bloco[0][0] for bloco in blocos]
            rows = [row_nome]
            if any(len(b) > 1 for b in blocos):
                rows.append([bloco[1][0] if len(bloco) > 1 else "" for bloco in blocos])
            col_w = 16 * cm / cols
            t_assin = Table(rows, colWidths=[col_w] * cols)
            t_assin.setStyle(
                TableStyle(
                    [
                        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#2d6a4f")),
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f6f9f7")),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                        ("TOPPADDING", (0, 0), (-1, -1), 8),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                    ]
                )
            )
            story.append(t_assin)

    fotos = conferencia.get("fotos") or []
    if fotos:
        story.append(Spacer(1, 0.3 * cm))
        story.append(Paragraph("Fotos da conferência", heading_style))
        for idx, src in enumerate(fotos[:3], start=1):
            img = _imagem_data_url(src, max_w=12 * cm, max_h=8 * cm)
            if img:
                story.append(Paragraph(f"Foto {idx}", subtitle_style))
                story.append(img)
                story.append(Spacer(1, 0.2 * cm))

    story.append(Spacer(1, 0.5 * cm))
    story.append(
        Paragraph(
            "<i>Documento gerado automaticamente — Sistema BBA/CBMMA.</i>",
            subtitle_style,
        )
    )

    doc.build(story)
    buffer.seek(0)
    return buffer.read()
