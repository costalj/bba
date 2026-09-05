import os
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Image,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from app.config_loader import (
    get_cabecalho_laudo,
    get_criterios,
    get_nota_range,
    get_questionario_secoes,
    total_perguntas_risco,
)
from app.database import (
    get_assinatura_vistoria,
    get_notas_vistoria,
    get_questionario_vistoria,
    get_rubrica_solicitante,
    numero_laudo_vistoria,
)

LOGO_BBA_PATH = os.path.join(os.path.dirname(__file__), "static", "img", "logo-bba.png")

FOTO_CAIXA_LARGURA = 12 * cm
FOTO_CAIXA_ALTURA = 9 * cm
FOTO_CAIXA_ESPACO = 0.35 * cm
PDF_LARGURA_UTIL = 17 * cm


def gerar_pdf(vistoria, fotos, upload_folder: str) -> bytes:
    buffer = BytesIO()
    criterios = get_criterios()
    nota_min, nota_max = get_nota_range()
    notas = get_notas_vistoria(vistoria)
    questionario = get_questionario_vistoria(vistoria)
    max_sim = total_perguntas_risco() if questionario else len(get_criterios()) * nota_max

    res = None
    if questionario:
        from app.scoring import calcular_resultado

        res = calcular_resultado(questionario)

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
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=12,
    )
    heading_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontSize=12,
        textColor=colors.HexColor("#2d6a4f"),
        spaceBefore=12,
        spaceAfter=6,
    )
    body_style = styles["Normal"]

    story = []
    _append_cabecalho(story, vistoria, styles)
    _append_dados_ocorrencia(story, vistoria, heading_style)

    if questionario:
        for secao in get_questionario_secoes():
            _append_secao_questionario(story, secao, questionario, heading_style, body_style)
    else:
        _append_notas_legado(story, criterios, notas, nota_max, heading_style)

    if vistoria["observacoes"]:
        story.append(Paragraph("Observações adicionais", heading_style))
        story.append(Paragraph(vistoria["observacoes"], body_style))

    if res:
        _append_secao6_somatorio(story, res, heading_style, body_style)
        _append_quadro_resultado(story, vistoria, res, max_sim, body_style)
    else:
        _append_quadro_resultado(story, vistoria, res, max_sim, body_style)

    _append_legislacao(story, vistoria, heading_style, body_style)

    _append_rubrica_e_assinatura(story, vistoria, heading_style, body_style)

    if fotos:
        _append_registro_fotografico(story, fotos, upload_folder, heading_style, body_style)

    story.append(Spacer(1, 1 * cm))
    story.append(
        Paragraph(
            "<i>Documento gerado automaticamente pelo Sistema de Vistoria Arbórea — BBA/CBMMA.</i>",
            subtitle_style,
        )
    )

    doc.build(story)
    buffer.seek(0)
    return buffer.read()


def _append_quadro_resultado(story, vistoria, res, max_sim, body_style):
    rec_color = _cor_recomendacao(vistoria["recomendacao"])
    rows = [
        [Paragraph(f"<b>Nível de risco:</b> {vistoria['recomendacao']}", body_style)],
        [
            Paragraph(
                f"<b>Respostas SIM (itens 3 e 4):</b> {vistoria['pontuacao_total']} / {max_sim}",
                body_style,
            )
        ],
        [Paragraph(vistoria["justificativa"], body_style)],
    ]
    if res and res.get("orientacao_conduta"):
        rows.append(
            [Paragraph("<b>O que deve ser feito com a árvore:</b>", body_style)]
        )
        for item in res["orientacao_conduta"]:
            rows.append([Paragraph(f"• {item}", body_style)])

    t = Table(rows, colWidths=[16 * cm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), rec_color),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#2d6a4f")),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    story.append(t)
    story.append(Spacer(1, 0.5 * cm))


def _valor_coluna(vistoria, chave):
    try:
        val = vistoria[chave]
    except (KeyError, IndexError):
        return None
    return val


def _append_dados_ocorrencia(story, vistoria, heading_style):
    from app.auth_utils import formatar_cpf, formatar_telefone

    story.append(Paragraph("1. Dados da ocorrência", heading_style))
    cpf = _valor_coluna(vistoria, "cpf_solicitante")
    cpf_exib = formatar_cpf(cpf) if cpf else "—"
    contato = _valor_coluna(vistoria, "contato_telefonico")
    contato_exib = formatar_telefone(contato) if contato else "—"
    dados = [
        ["Campo", "Valor"],
        ["Nº do Laudo", numero_laudo_vistoria(vistoria)],
        ["Data", vistoria["created_at"]],
        ["Solicitante", _valor_coluna(vistoria, "solicitante") or "—"],
        ["CPF do Solicitante", cpf_exib],
        ["Endereço", vistoria["endereco"]],
        ["Contato", contato_exib],
        ["Forma de Acionamento", _valor_coluna(vistoria, "forma_acionamento") or "—"],
        ["Protocolo CIOPS/Portaria/OS", _valor_coluna(vistoria, "protocolo") or "—"],
        ["Natureza da ocorrência", _valor_coluna(vistoria, "natureza_ocorrencia") or "—"],
        ["Descrição da ocorrência", _valor_coluna(vistoria, "descricao_ocorrencia") or "—"],
        ["Espécie", vistoria["especie"] or "—"],
    ]
    if vistoria["latitude"] and vistoria["longitude"]:
        lat = vistoria["latitude"]
        lng = vistoria["longitude"]
        dados.append(["Coordenadas GPS", f"{lat:.6f}, {lng:.6f}"])

    t = Table(dados, colWidths=[5 * cm, 11 * cm])
    t.setStyle(_table_style_padrao())
    story.append(t)
    story.append(Spacer(1, 0.3 * cm))


def _append_secao_questionario(story, secao, questionario, heading_style, body_style):
    story.append(Paragraph(secao["titulo"], heading_style))
    blocos = []
    if secao.get("perguntas"):
        blocos.append(("", secao["perguntas"]))
    for grupo in secao.get("grupos", []):
        blocos.append((grupo["titulo"], grupo["perguntas"]))
    for titulo_grupo, perguntas in blocos:
        if titulo_grupo:
            story.append(Paragraph(titulo_grupo, body_style))
        q_data = [["Item", "Pergunta", "Resposta"]]
        for p in perguntas:
            val = questionario.get(p["id"], "nao")
            texto = p["texto"][:80] + ("…" if len(p["texto"]) > 80 else "")
            q_data.append([p["numero"], texto, val.upper()])
        q_table = Table(q_data, colWidths=[1.5 * cm, 11 * cm, 2 * cm])
        q_table.setStyle(_table_style_padrao(font_size=8))
        story.append(q_table)
        story.append(Spacer(1, 0.2 * cm))


def _append_notas_legado(story, criterios, notas, nota_max, heading_style):
    story.append(Paragraph("Avaliação de Risco (formato anterior)", heading_style))
    notas_data = [["Critério", f"Nota (0–{nota_max})"]]
    for c in criterios:
        valor = notas.get(c["id"], "—")
        notas_data.append([c["label"], str(valor)])
    notas_table = Table(notas_data, colWidths=[12 * cm, 4 * cm])
    notas_table.setStyle(_table_style_padrao())
    story.append(notas_table)


def _append_secao6_somatorio(story, res, heading_style, body_style):
    s = res.get("somatorio") or {}
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph("6. Resultado da avaliação de risco", heading_style))
    soma_data = [
        ["Nível", "Respostas SIM (itens 3 e 4)"],
        ["ALTO", "42 a 54"],
        ["MÉDIO", "23 a 41"],
        ["BAIXO", "0 a 22"],
        ["Item 3 (Nível I)", f"{s.get('secao_3_sim', 0)} SIM / {s.get('secao_3_total', 12)}"],
        ["Item 4 (Níveis II e III)", f"{s.get('secao_4_sim', 0)} SIM / {s.get('secao_4_total', 42)}"],
        ["Total itens 3 e 4", f"{s.get('total_3_4_sim', 0)} SIM / {s.get('total_3_4_max', 54)}"],
        ["Classificação", f"{s.get('nivel', '')} (faixa {s.get('faixa', '')})"],
    ]
    soma_table = Table(soma_data, colWidths=[6 * cm, 10 * cm])
    soma_table.setStyle(_table_style_padrao())
    story.append(soma_table)


def _imagem_em_caixa_pdf(path):
    img = Image(
        path,
        width=FOTO_CAIXA_LARGURA,
        height=FOTO_CAIXA_ALTURA,
        kind="proportional",
    )
    caixa = Table([[img]], colWidths=[FOTO_CAIXA_LARGURA], rowHeights=[FOTO_CAIXA_ALTURA])
    caixa.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cccccc")),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8f8f8")),
            ]
        )
    )
    wrapper = Table([[caixa]], colWidths=[PDF_LARGURA_UTIL])
    wrapper.setStyle(TableStyle([("ALIGN", (0, 0), (-1, -1), "CENTER")]))
    return wrapper


def _append_registro_fotografico(story, fotos, upload_folder, heading_style, body_style):
    story.append(Paragraph("Registro Fotográfico", heading_style))
    legenda_style = ParagraphStyle(
        "FotoLegenda",
        parent=body_style,
        alignment=TA_CENTER,
        fontSize=9,
        textColor=colors.HexColor("#555555"),
        spaceAfter=4,
    )
    for idx, foto in enumerate(fotos, start=1):
        path = os.path.join(upload_folder, foto["filename"])
        story.append(Paragraph(f"Foto {idx}", legenda_style))
        if os.path.exists(path):
            try:
                story.append(_imagem_em_caixa_pdf(path))
            except Exception:
                story.append(
                    Paragraph(f"[Foto indisponível: {foto['filename']}]", body_style)
                )
        else:
            story.append(
                Paragraph(f"[Foto indisponível: {foto['filename']}]", body_style)
            )
        story.append(Spacer(1, FOTO_CAIXA_ESPACO))


def _append_rubrica_e_assinatura(story, vistoria, heading_style, body_style):
    bloco = []
    _montar_recursos_adicionais(bloco, vistoria, heading_style, body_style)
    _montar_rubrica(bloco, vistoria, heading_style, body_style)
    _montar_assinatura_chefe(bloco, vistoria, heading_style, body_style)
    story.append(KeepTogether(bloco))


def _montar_recursos_adicionais(bloco, vistoria, heading_style, body_style):
    texto = (_valor_coluna(vistoria, "recursos_adicionais") or "").strip()
    if not texto:
        return
    bloco.append(Spacer(1, 0.3 * cm))
    bloco.append(Paragraph("Recursos adicionais", heading_style))
    bloco.append(Paragraph(texto.replace("\n", "<br/>"), body_style))
    bloco.append(Spacer(1, 0.2 * cm))


def _montar_rubrica(bloco, vistoria, heading_style, body_style):
    rubrica = get_rubrica_solicitante(vistoria)
    bloco.append(Spacer(1, 0.3 * cm))
    bloco.append(Paragraph("Rubrica do solicitante", heading_style))
    if rubrica and rubrica.get("imagem"):
        if rubrica.get("nome"):
            bloco.append(Paragraph(f"<b>{rubrica['nome']}</b>", body_style))
        if rubrica.get("data_hora"):
            bloco.append(Paragraph(rubrica["data_hora"], body_style))
        try:
            import base64
            from io import BytesIO as Bio

            img_data = rubrica["imagem"]
            if "," in img_data:
                img_data = img_data.split(",", 1)[1]
            img_bytes = Bio(base64.b64decode(img_data))
            rub_img = Image(img_bytes, width=8 * cm, height=3 * cm, kind="proportional")
            bloco.append(rub_img)
        except Exception:
            bloco.append(Paragraph("[Rubrica registrada]", body_style))
    else:
        bloco.append(Paragraph("Não rubricado (opcional).", body_style))
    bloco.append(Spacer(1, 0.3 * cm))


def _montar_assinatura_chefe(bloco, vistoria, heading_style, body_style):
    assinatura = get_assinatura_vistoria(vistoria)
    bloco.append(Paragraph("Assinatura do Chefe de Socorro", heading_style))

    box_center = ParagraphStyle(
        "AssinaturaBoxCenter",
        parent=body_style,
        alignment=TA_CENTER,
        fontSize=10,
        leading=14,
        spaceAfter=2,
        spaceBefore=2,
    )
    nome_style = ParagraphStyle(
        "AssinaturaNomePdf",
        parent=box_center,
        fontSize=12,
        fontName="Helvetica-BoldOblique",
        textColor=colors.HexColor("#1b4332"),
        spaceBefore=8,
        spaceAfter=4,
    )
    hint_style = ParagraphStyle(
        "AssinaturaHintPdf",
        parent=box_center,
        fontSize=8,
        textColor=colors.grey,
        spaceBefore=6,
    )

    if assinatura:
        matricula = assinatura.get("matricula") or "—"
        linhas = [
            Paragraph("<b>Documento assinado eletronicamente</b>", box_center),
            Paragraph(assinatura.get("assinado_por", ""), nome_style),
            Paragraph(
                f'{assinatura.get("cargo", "Chefe de Socorro")} · Mat. {matricula}',
                box_center,
            ),
            Paragraph(f'<b>{assinatura.get("data_hora", "")}</b>', box_center),
            Paragraph(
                f'<i>{assinatura.get("tipo", "Assinatura eletrônica")} — BBA/CBMMA</i>',
                hint_style,
            ),
        ]
        border_color = colors.HexColor("#2d6a4f")
        bg_color = colors.HexColor("#f6f9f7")
        border_width = 1.2
    else:
        linhas = [
            Paragraph("<b>Pendente de assinatura eletrônica</b>", box_center),
            Paragraph("Chefe de Socorro", box_center),
        ]
        border_color = colors.HexColor("#b0b0b0")
        bg_color = colors.white
        border_width = 0.8

    inner_rows = [[p] for p in linhas]
    inner = Table(inner_rows, colWidths=[14 * cm])
    inner.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    outer = Table([[inner]], colWidths=[16 * cm])
    outer.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), border_width, border_color),
                ("BACKGROUND", (0, 0), (-1, -1), bg_color),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    bloco.append(outer)
    bloco.append(Spacer(1, 0.3 * cm))


def _table_style_padrao(font_size=10):
    cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2d6a4f")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    if font_size != 10:
        cmds.append(("FONTSIZE", (0, 0), (-1, -1), font_size))
    else:
        cmds.append(("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f6f9f7")]))
    return TableStyle(cmds)


def _agrupar_artigos_esfera(artigos):
    ordem = [
        ("federal", "Federal"),
        ("estadual", "Estadual (MA)"),
        ("municipal", "Municipal (São Luís)"),
    ]
    grupos = {}
    for art in artigos or []:
        esfera = (art.get("esfera") or "").lower()
        trecho = f"{art.get('norma', '')}, {art.get('artigo', '')}"
        if art.get("texto"):
            trecho = f"{trecho} ({art['texto']})"
        grupos.setdefault(esfera, []).append(trecho)
    return [(rotulo, "; ".join(grupos[chave])) for chave, rotulo in ordem if chave in grupos]


def _parse_resultado_especie(texto):
    linhas = [ln.strip() for ln in (texto or "").splitlines() if ln.strip()]
    if not linhas:
        return None
    titulo = linhas[0]
    descricao = []
    citacoes = []
    prefixos = ("Lei federal:", "Lei/dec. estadual (MA):", "Lei municipal (São Luís):", "Referência:")
    for linha in linhas[1:]:
        if any(linha.startswith(p) for p in prefixos):
            citacoes.append(linha)
        elif not citacoes:
            descricao.append(linha)
    tabela = []
    mapa = {
        "Lei federal:": "Federal",
        "Lei/dec. estadual (MA):": "Estadual (MA)",
        "Lei municipal (São Luís):": "Municipal (São Luís)",
    }
    for linha in citacoes:
        for prefixo, rotulo in mapa.items():
            if linha.startswith(prefixo):
                tabela.append((rotulo, linha[len(prefixo) :].strip()))
                break
    return {
        "titulo": titulo,
        "descricao": " ".join(descricao),
        "citacoes": tabela,
    }


def _info_legislacao(vistoria):
    from app.especies_protegidas_data import STATUS_LABEL, get_especie

    especie_id = _valor_coluna(vistoria, "especie_catalogo_id")
    especie = get_especie(especie_id) if especie_id else None
    if especie and especie.get("status") in ("ameacada", "tombada", "protegida", "imune"):
        label = STATUS_LABEL.get(especie["status"], especie["status"].upper())
        esfera = (especie.get("esfera") or "").upper()
        return {
            "titulo": f"{label} ({esfera})",
            "descricao": (
                f"{especie['nome_popular']} ({especie['nome_cientifico']}). {especie['conduta']}"
            ),
            "citacoes": _agrupar_artigos_esfera(especie.get("artigos")),
        }

    resultado = (_valor_coluna(vistoria, "resultado_especie") or "").strip()
    if not resultado:
        return None
    parsed = _parse_resultado_especie(resultado)
    if not parsed:
        return None
    protegido = any(
        termo in parsed["titulo"].upper()
        for termo in ("AMEAÇADA", "TOMBADA", "PROTEGIDA", "IMUNE")
    )
    if not protegido and not parsed["citacoes"]:
        return None
    return parsed


def _append_legislacao(story, vistoria, heading_style, body_style):
    info = _info_legislacao(vistoria)
    if not info:
        return

    leg_style = ParagraphStyle(
        "LegislacaoCorpo",
        parent=body_style,
        fontSize=8,
        leading=10,
        spaceAfter=2,
    )
    leg_bold = ParagraphStyle(
        "LegislacaoBold",
        parent=leg_style,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#1b4332"),
    )

    bloco = [
        Spacer(1, 0.25 * cm),
        Paragraph("7. Legislação", heading_style),
        Paragraph(f"<b>{info['titulo']}</b>", leg_bold),
        Paragraph(info["descricao"], leg_style),
    ]

    citacoes = info.get("citacoes") or []
    if citacoes:
        rows = [[Paragraph("<b>Esfera</b>", leg_bold), Paragraph("<b>Dispositivo legal</b>", leg_bold)]]
        for esfera, texto in citacoes:
            rows.append(
                [
                    Paragraph(esfera, leg_bold),
                    Paragraph(texto, leg_style),
                ]
            )
        tabela = Table(rows, colWidths=[3.2 * cm, 12.8 * cm])
        tabela.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e8f5e9")),
                    ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#2d6a4f")),
                    ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#c8e6c9")),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )
        bloco.append(Spacer(1, 0.15 * cm))
        bloco.append(tabela)

    story.append(KeepTogether(bloco))
    story.append(Spacer(1, 0.25 * cm))


def _cor_recomendacao(recomendacao: str):
    mapa = {
        "ALTO": colors.HexColor("#fde8e8"),
        "MÉDIO": colors.HexColor("#fff8e7"),
        "BAIXO": colors.HexColor("#d8f3dc"),
        "SUPRESSÃO": colors.HexColor("#fde8e8"),
        "INTERVENÇÃO URGENTE": colors.HexColor("#fff0eb"),
        "PODAS / ACOMPANHAMENTO": colors.HexColor("#fff8e7"),
        "MANUTENÇÃO": colors.HexColor("#d8f3dc"),
    }
    return mapa.get(recomendacao, colors.white)


def _append_cabecalho(story, vistoria, styles):
    cab = get_cabecalho_laudo()
    numero = numero_laudo_vistoria(vistoria)

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
        story.append(Spacer(1, 0.15 * cm))

    for linha in cab.get("linhas", []):
        story.append(Paragraph(linha, header_line))

    titulo = cab.get("titulo", "RELATÓRIO DE VISTORIA DE ÁRVORE")
    story.append(Paragraph(f"{titulo} Nº {numero}", title_line))

    rule = Table([[""]], colWidths=[16 * cm], rowHeights=[2])
    rule.setStyle(
        TableStyle(
            [
                ("LINEABOVE", (0, 0), (-1, -1), 1.2, colors.HexColor("#2d6a4f")),
            ]
        )
    )
    story.append(rule)
    story.append(Spacer(1, 0.45 * cm))
