import json
import os
import uuid
from werkzeug.utils import secure_filename

from flask import (
    Blueprint,
    Response,
    abort,
    current_app,
    jsonify,
    render_template,
    request,
    send_from_directory,
    redirect,
    url_for,
    session,
)

from app.config_loader import (
    get_criterios,
    get_fotos_config,
    get_limiares,
    get_limiares_risco,
    get_niveis,
    get_nota_range,
    get_questionario_secoes,
    iter_todas_perguntas,
    pontuacao_maxima,
    total_perguntas_risco,
)
from app.auth_utils import (
    POSTOS,
    PERFIS,
    PERFIS_CADASTRO,
    formatar_cpf,
    hash_senha,
    limpar_cpf,
    nome_completo_militar,
    nome_exibicao,
    nome_posto_guerra,
)
from app.database import (
    get_db,
    get_fotos_vistoria,
    get_notas_vistoria,
    get_questionario_vistoria,
    get_assinatura_vistoria,
    get_rubrica_solicitante,
    get_checklist_viatura,
    get_assinatura_viatura,
    atribuir_numero_laudo,
    atribuir_numero_vistoria_viatura,
    numero_laudo_vistoria,
    numero_vistoria_viatura,
)
from app.pdf_report import gerar_pdf
from app.scoring import calcular_resultado, calcular_resultado_legado, resultado_de_vistoria

_USUARIOS_SELECT = (
    "SELECT id, nome, nome_guerra, matricula, cpf, posto, perfil, ativo "
    "FROM usuarios WHERE ativo = 1"
)


def _usuario_sessao(row) -> dict:
    return {
        "id": row["id"],
        "nome": row["nome"],
        "nome_guerra": row["nome_guerra"] or "",
        "matricula": row["matricula"],
        "cpf": formatar_cpf(row["cpf"]),
        "posto": row["posto"],
        "perfil": row["perfil"],
    }

PUBLIC_ENDPOINTS = {"main.login_page", "main.manifest"}

bp = Blueprint("main", __name__)


def _cloud_sync(entity_type: str, row_id: int, *, deleted: bool = False):
    try:
        from app.cloud_sync import push_sqlite_row

        push_sqlite_row(get_db(), entity_type, row_id, deleted=deleted)
    except Exception:
        pass


@bp.before_request
def require_login():
    if request.endpoint in PUBLIC_ENDPOINTS:
        return
    if request.endpoint and request.endpoint.startswith("static"):
        return
    if "usuario" not in session:
        return redirect(url_for("main.login_page", next=request.path))


@bp.route("/manifest.json")
def manifest():
    return send_from_directory(
        os.path.join(bp.root_path, "static"),
        "manifest.json",
        mimetype="application/manifest+json",
    )


@bp.route("/")
def index():
    return render_template("index.html", usuario=session.get("usuario"))


@bp.route("/login", methods=["GET", "POST"])
def login_page():
    if request.method == "GET":
        if session.get("usuario"):
            return redirect(url_for("main.index"))
        return render_template("login.html")

    cpf = limpar_cpf(request.form.get("cpf", ""))
    senha = request.form.get("senha", "")
    db = get_db()
    user = db.execute(
        "SELECT * FROM usuarios WHERE cpf = ? AND ativo = 1", (cpf,)
    ).fetchone()
    if not user or user["senha_hash"] != hash_senha(senha):
        return render_template("login.html", erro="CPF ou senha inválidos.")

    session["usuario"] = _usuario_sessao(user)
    session["bem_vindo"] = True
    next_url = request.form.get("next") or url_for("main.index")
    return redirect(next_url)


@bp.route("/logout")
def logout():
    session.pop("usuario", None)
    return redirect(url_for("main.login_page"))


@bp.route("/perfil")
def perfil():
    return render_template("perfil.html", usuario=session.get("usuario"))


@bp.route("/admin")
def admin():
    usuario = session.get("usuario")
    if not usuario or usuario.get("perfil") != "Administrador":
        return redirect(url_for("main.index"))
    db = get_db()
    users = db.execute(f"{_USUARIOS_SELECT} ORDER BY nome").fetchall()
    viaturas = db.execute(
        "SELECT id, ar, placa, marca, modelo FROM cadastro_viaturas ORDER BY ar"
    ).fetchall()
    return render_template(
        "admin.html",
        usuarios=users,
        viaturas=viaturas,
        postos=POSTOS,
        perfis=PERFIS_CADASTRO,
        perfis_todos=PERFIS,
    )


@bp.route("/admin/usuarios", methods=["POST"])
def admin_criar_usuario():
    usuario = session.get("usuario")
    if not usuario or usuario.get("perfil") != "Administrador":
        return redirect(url_for("main.index"))

    cpf = limpar_cpf(request.form.get("cpf", ""))
    senha = request.form.get("senha", "")
    db = get_db()
    try:
        cursor = db.execute(
            """
            INSERT INTO usuarios (nome, nome_guerra, matricula, cpf, posto, perfil, senha_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                request.form.get("nome", "").strip(),
                request.form.get("nome_guerra", "").strip(),
                request.form.get("matricula", "").strip(),
                cpf,
                request.form.get("posto", "").strip(),
                request.form.get("perfil", "").strip(),
                hash_senha(senha),
            ),
        )
        user_id = cursor.lastrowid
        db.commit()
        _cloud_sync("usuarios", user_id)
    except Exception:
        return render_template(
            "admin.html",
            erro="CPF já cadastrado ou dados inválidos.",
            postos=POSTOS,
            perfis=PERFIS_CADASTRO,
            perfis_todos=PERFIS,
            usuarios=db.execute(f"{_USUARIOS_SELECT}").fetchall(),
            viaturas=db.execute(
                "SELECT id, ar, placa, marca, modelo FROM cadastro_viaturas ORDER BY ar"
            ).fetchall(),
        )
    return redirect(url_for("main.admin") + "#usuarios")


@bp.route("/admin/usuarios/<int:user_id>/desativar", methods=["POST"])
def admin_desativar_usuario(user_id):
    usuario = session.get("usuario")
    if not usuario or usuario.get("perfil") != "Administrador":
        return redirect(url_for("main.index"))
    db = get_db()
    target = db.execute("SELECT perfil FROM usuarios WHERE id = ?", (user_id,)).fetchone()
    if target and target["perfil"] == "Administrador":
        admins = db.execute(
            "SELECT COUNT(*) as n FROM usuarios WHERE perfil = 'Administrador' AND ativo = 1"
        ).fetchone()
        if admins["n"] <= 1:
            return redirect(url_for("main.admin"))
    db.execute("UPDATE usuarios SET ativo = 0 WHERE id = ?", (user_id,))
    db.commit()
    _cloud_sync("usuarios", user_id, deleted=True)
    return redirect(url_for("main.admin") + "#usuarios")


@bp.route("/admin/usuarios/<int:user_id>/editar", methods=["POST"])
def admin_editar_usuario(user_id):
    usuario = session.get("usuario")
    if not usuario or usuario.get("perfil") != "Administrador":
        return redirect(url_for("main.index"))

    db = get_db()
    target = db.execute(
        "SELECT * FROM usuarios WHERE id = ? AND ativo = 1", (user_id,)
    ).fetchone()
    if target is None:
        return redirect(url_for("main.admin"))

    nome = (request.form.get("nome") or "").strip()
    nome_guerra = (request.form.get("nome_guerra") or "").strip()
    matricula = (request.form.get("matricula") or "").strip()
    cpf = limpar_cpf(request.form.get("cpf", ""))
    posto = (request.form.get("posto") or "").strip()
    perfil = (request.form.get("perfil") or "").strip()

    if not nome or not nome_guerra or not matricula or len(cpf) != 11 or not posto or perfil not in PERFIS:
        return _admin_com_erro("Preencha todos os campos corretamente.")

    duplicado = db.execute(
        "SELECT id FROM usuarios WHERE cpf = ? AND id != ? AND ativo = 1",
        (cpf, user_id),
    ).fetchone()
    if duplicado:
        return _admin_com_erro("CPF já cadastrado para outro usuário.")

    if target["perfil"] == "Administrador" and perfil != "Administrador":
        admins = db.execute(
            "SELECT COUNT(*) as n FROM usuarios WHERE perfil = 'Administrador' AND ativo = 1"
        ).fetchone()
        if admins["n"] <= 1:
            return _admin_com_erro("Não é possível alterar o perfil do último administrador.")

    db.execute(
        """
        UPDATE usuarios
        SET nome = ?, nome_guerra = ?, matricula = ?, cpf = ?, posto = ?, perfil = ?
        WHERE id = ?
        """,
        (nome, nome_guerra, matricula, cpf, posto, perfil, user_id),
    )
    db.commit()
    _cloud_sync("usuarios", user_id)

    sessao = session.get("usuario")
    if sessao and sessao.get("id") == user_id:
        session["usuario"] = {
            "id": user_id,
            "nome": nome,
            "nome_guerra": nome_guerra,
            "matricula": matricula,
            "cpf": formatar_cpf(cpf),
            "posto": posto,
            "perfil": perfil,
        }

    return redirect(url_for("main.admin") + "#usuarios")


def _admin_com_erro(mensagem: str):
    db = get_db()
    users = db.execute(f"{_USUARIOS_SELECT} ORDER BY nome").fetchall()
    viaturas = db.execute(
        "SELECT id, ar, placa, marca, modelo FROM cadastro_viaturas ORDER BY ar"
    ).fetchall()
    return render_template(
        "admin.html",
        erro=mensagem,
        postos=POSTOS,
        perfis=PERFIS_CADASTRO,
        perfis_todos=PERFIS,
        usuarios=users,
        viaturas=viaturas,
    )


def _dados_cadastro_viatura(form):
    ar = (form.get("ar") or "").strip().upper()
    placa = (form.get("placa") or "").strip().upper().replace("-", "")
    marca = (form.get("marca") or "").strip()
    modelo = (form.get("modelo") or "").strip()
    return ar, placa, marca, modelo


@bp.route("/admin/viaturas", methods=["POST"])
def admin_criar_viatura():
    usuario = session.get("usuario")
    if not usuario or usuario.get("perfil") != "Administrador":
        return redirect(url_for("main.index"))

    ar, placa, marca, modelo = _dados_cadastro_viatura(request.form)
    if not ar or not placa or not marca or not modelo:
        return _admin_com_erro("Preencha AR, placa, marca e modelo da viatura.")

    db = get_db()
    try:
        cursor = db.execute(
            "INSERT INTO cadastro_viaturas (ar, placa, marca, modelo) VALUES (?, ?, ?, ?)",
            (ar, placa, marca, modelo),
        )
        viatura_id = cursor.lastrowid
        db.commit()
        _cloud_sync("cadastro_viaturas", viatura_id)
    except Exception:
        return _admin_com_erro("AR ou placa já cadastrada.")
    return redirect(url_for("main.admin") + "#viaturas")


@bp.route("/admin/viaturas/<int:viatura_id>/editar", methods=["POST"])
def admin_editar_viatura(viatura_id):
    usuario = session.get("usuario")
    if not usuario or usuario.get("perfil") != "Administrador":
        return redirect(url_for("main.index"))

    ar, placa, marca, modelo = _dados_cadastro_viatura(request.form)
    if not ar or not placa or not marca or not modelo:
        return _admin_com_erro("Preencha AR, placa, marca e modelo da viatura.")

    db = get_db()
    try:
        db.execute(
            """
            UPDATE cadastro_viaturas
            SET ar = ?, placa = ?, marca = ?, modelo = ?
            WHERE id = ?
            """,
            (ar, placa, marca, modelo, viatura_id),
        )
        db.commit()
        _cloud_sync("cadastro_viaturas", viatura_id)
    except Exception:
        return _admin_com_erro("AR ou placa já cadastrada em outra viatura.")
    return redirect(url_for("main.admin") + "#viaturas")


@bp.route("/admin/viaturas/<int:viatura_id>/excluir", methods=["POST"])
def admin_excluir_viatura(viatura_id):
    usuario = session.get("usuario")
    if not usuario or usuario.get("perfil") != "Administrador":
        return redirect(url_for("main.index"))
    db = get_db()
    db.execute("DELETE FROM cadastro_viaturas WHERE id = ?", (viatura_id,))
    db.commit()
    _cloud_sync("cadastro_viaturas", viatura_id, deleted=True)
    return redirect(url_for("main.admin") + "#viaturas")


@bp.route("/admin/usuarios/<int:user_id>/resetar-senha", methods=["POST"])
def admin_resetar_senha(user_id):
    usuario = session.get("usuario")
    if not usuario or usuario.get("perfil") != "Administrador":
        return redirect(url_for("main.index"))

    senha = (request.form.get("senha") or "").strip()
    if len(senha) < 4:
        db = get_db()
        users = db.execute(f"{_USUARIOS_SELECT} ORDER BY nome").fetchall()
        return render_template(
            "admin.html",
            erro="A nova senha deve ter no mínimo 4 caracteres.",
            postos=POSTOS,
            perfis=PERFIS_CADASTRO,
            perfis_todos=PERFIS,
            usuarios=users,
            viaturas=db.execute(
                "SELECT id, ar, placa, marca, modelo FROM cadastro_viaturas ORDER BY ar"
            ).fetchall(),
        )

    db = get_db()
    row = db.execute(
        "SELECT id FROM usuarios WHERE id = ? AND ativo = 1", (user_id,)
    ).fetchone()
    if row is None:
        return redirect(url_for("main.admin"))

    db.execute(
        "UPDATE usuarios SET senha_hash = ? WHERE id = ?",
        (hash_senha(senha), user_id),
    )
    db.commit()
    _cloud_sync("usuarios", user_id)
    return redirect(url_for("main.admin"))


@bp.route("/arvores/")
def arvores_home():
    lim = get_limiares_risco()
    return render_template(
        "arvores/home.html",
        limiares_risco=lim,
        max_perguntas_risco=total_perguntas_risco(),
        show_back=True,
        back_url=url_for("main.index"),
        modulo="arvores",
    )


@bp.route("/arvores/nova")
def nova_vistoria():
    return render_template(
        "formulario.html",
        secoes=get_questionario_secoes(),
        max_fotos=get_fotos_config()["max_por_vistoria"],
        max_perguntas_risco=total_perguntas_risco(),
        limiares_risco=get_limiares_risco(),
        usuario=session.get("usuario"),
        show_back=True,
        back_url=url_for("main.arvores_home"),
        modulo="arvores",
    )


@bp.route("/arvores/vistorias")
def listar_vistorias():
    db = get_db()
    rows = db.execute(
        "SELECT id, created_at, codigo, solicitante, endereco, especie, pontuacao_total, recomendacao, "
        "questionario_json FROM vistorias ORDER BY created_at DESC"
    ).fetchall()
    salva_id = request.args.get("salva", type=int)
    return render_template(
        "lista.html",
        vistorias=rows,
        max_pontos=total_perguntas_risco(),
        salva_id=salva_id,
        show_back=True,
        back_url=url_for("main.arvores_home"),
        modulo="arvores",
    )


@bp.route("/arvores/vistorias/<int:vistoria_id>")
def detalhe_vistoria(vistoria_id):
    db = get_db()
    row = db.execute(
        "SELECT * FROM vistorias WHERE id = ?", (vistoria_id,)
    ).fetchone()
    if row is None:
        return render_template("404.html"), 404

    fotos = get_fotos_vistoria(vistoria_id)
    questionario = get_questionario_vistoria(row)
    notas = get_notas_vistoria(row)
    assinatura = get_assinatura_vistoria(row)
    rubrica = get_rubrica_solicitante(row)
    usuario = session.get("usuario")
    max_pts = total_perguntas_risco() if questionario else pontuacao_maxima()
    resultado_calc = calcular_resultado(questionario) if questionario else None
    numero_laudo = numero_laudo_vistoria(row)

    return render_template(
        "resultado.html",
        vistoria=row,
        numero_laudo=numero_laudo,
        resultado_calc=resultado_calc,
        secoes=get_questionario_secoes() if questionario else [],
        questionario=questionario,
        criterios=get_criterios(),
        notas=notas,
        fotos=fotos,
        assinatura=assinatura,
        rubrica=rubrica,
        usuario=usuario,
        max_pontos=max_pts,
        nota_max=get_nota_range()[1],
        show_back=True,
        back_url=url_for("main.arvores_home"),
        modulo="arvores",
    )


@bp.route("/arvores/vistorias/<int:vistoria_id>/assinar", methods=["POST"])
def assinar_vistoria(vistoria_id):
    usuario = session.get("usuario")
    if not usuario:
        return jsonify({"erro": "Faça login para assinar."}), 401
    if usuario.get("perfil") != "Chefe de Socorro":
        return jsonify({"erro": "Apenas o Chefe de Socorro pode assinar."}), 403

    db = get_db()
    row = db.execute("SELECT id FROM vistorias WHERE id = ?", (vistoria_id,)).fetchone()
    if row is None:
        return jsonify({"erro": "Vistoria não encontrada."}), 404

    from datetime import datetime
    assinatura = {
        "nome": usuario["nome"],
        "posto": usuario.get("posto", ""),
        "matricula": usuario.get("matricula", ""),
        "cargo": "Chefe de Socorro",
        "perfil": usuario["perfil"],
        "data_hora": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        "assinado_por": nome_completo_militar(usuario),
        "tipo": "Assinatura eletrônica",
    }
    db.execute(
        "UPDATE vistorias SET assinatura_json = ? WHERE id = ?",
        (json.dumps(assinatura, ensure_ascii=False), vistoria_id),
    )
    db.commit()

    if request.is_json:
        return jsonify({"ok": True, "assinatura": assinatura})
    return redirect(url_for("main.detalhe_vistoria", vistoria_id=vistoria_id))


@bp.route("/arvores/vistorias/<int:vistoria_id>/pdf")
def exportar_pdf(vistoria_id):
    db = get_db()
    row = db.execute(
        "SELECT * FROM vistorias WHERE id = ?", (vistoria_id,)
    ).fetchone()
    if row is None:
        return render_template("404.html"), 404

    fotos = get_fotos_vistoria(vistoria_id)
    pdf_bytes = gerar_pdf(row, fotos, current_app.config["UPLOAD_FOLDER"])
    numero = numero_laudo_vistoria(row)
    filename = f"laudo_{numero.replace('/', '_')}.pdf"
    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{filename}"'},
    )


@bp.route("/uploads/<filename>")
def servir_foto(filename):
    return send_from_directory(
        current_app.config["UPLOAD_FOLDER"],
        filename,
    )


@bp.route("/api/reverse-geocode")
def reverse_geocode():
    lat = request.args.get("lat", type=float)
    lng = request.args.get("lng", type=float)
    if lat is None or lng is None:
        return jsonify({"erro": "Latitude e longitude são obrigatórias."}), 400

    try:
        import urllib.request
        import json as json_lib

        url = (
            f"https://nominatim.openstreetmap.org/reverse"
            f"?lat={lat}&lon={lng}&format=json&accept-language=pt-BR"
        )
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "VistoriaArborea/1.0"},
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json_lib.loads(resp.read().decode())

        endereco = data.get("display_name", "")
        return jsonify({"endereco": endereco, "lat": lat, "lng": lng})
    except Exception as e:
        return jsonify({
            "erro": "Não foi possível obter o endereço.",
            "detalhe": str(e),
            "lat": lat,
            "lng": lng,
        }), 502


def _modulo_placeholder(modulo_id, itens_previstos):
    from app.modules import MODULOS

    info = next(m for m in MODULOS if m["id"] == modulo_id)
    return render_template(
        "modulo_placeholder.html",
        modulo_info=info,
        itens_previstos=itens_previstos,
        show_back=True,
        back_url=url_for("main.index"),
    )


@bp.route("/treinamentos/")
def treinamentos():
    return _modulo_placeholder("treinamentos", [
        "Lista de cursos disponíveis",
        "Vídeos e materiais de estudo",
        "Controle de certificados",
        "Histórico de treinamentos realizados",
    ])


@bp.route("/materiais/")
def materiais():
    return _modulo_placeholder("materiais", [
        "Checklist de EPIs e equipamentos",
        "Controle de estoque em viatura",
        "Registro de entrega e devolução",
        "Alertas de reposição",
    ])


@bp.route("/viaturas/")
def viaturas_home():
    from app.modules import MODULOS
    from app.viaturas_checklist import total_itens_checklist

    info = next(m for m in MODULOS if m["id"] == "viaturas")
    return render_template(
        "viaturas/home.html",
        modulo_info=info,
        total_itens=total_itens_checklist(),
        show_back=True,
        back_url=url_for("main.index"),
        modulo="viaturas",
    )


@bp.route("/viaturas/nova")
def nova_vistoria_viatura():
    from app.auth_utils import pode_assinar_vistoria_viatura
    from app.viaturas_checklist import CHECKLIST_SECOES, total_itens_checklist

    db = get_db()
    viaturas_cadastradas = db.execute(
        "SELECT id, ar, placa, marca, modelo FROM cadastro_viaturas ORDER BY ar"
    ).fetchall()

    usuario = session.get("usuario")

    return render_template(
        "viaturas/formulario.html",
        secoes=CHECKLIST_SECOES,
        viaturas_cadastradas=viaturas_cadastradas,
        total_itens=total_itens_checklist(),
        usuario=usuario,
        pode_assinar=pode_assinar_vistoria_viatura(usuario),
        show_back=True,
        back_url=url_for("main.viaturas_home"),
        modulo="viaturas",
    )


@bp.route("/viaturas/vistorias")
def listar_vistorias_viaturas():
    db = get_db()
    rows = db.execute(
        "SELECT id, created_at, codigo, placa, tipo_viatura, condutor, "
        "pontuacao_total, recomendacao FROM vistorias_viaturas ORDER BY created_at DESC"
    ).fetchall()
    salva_id = request.args.get("salva", type=int)
    from app.viaturas_checklist import total_itens_checklist

    return render_template(
        "viaturas/lista.html",
        vistorias=rows,
        total_itens=total_itens_checklist(),
        salva_id=salva_id,
        show_back=True,
        back_url=url_for("main.viaturas_home"),
        modulo="viaturas",
    )


@bp.route("/viaturas/vistorias/<int:vistoria_id>")
def detalhe_vistoria_viatura(vistoria_id):
    from app.auth_utils import pode_assinar_vistoria_viatura
    from app.viaturas_checklist import CHECKLIST_SECOES, calcular_resultado_viatura, total_itens_checklist

    db = get_db()
    row = db.execute(
        "SELECT * FROM vistorias_viaturas WHERE id = ?", (vistoria_id,)
    ).fetchone()
    if row is None:
        return render_template("404.html"), 404

    checklist = get_checklist_viatura(row)
    assinatura = get_assinatura_viatura(row)
    resultado_calc = calcular_resultado_viatura(checklist) if checklist else None
    numero = numero_vistoria_viatura(row)
    usuario = session.get("usuario")

    return render_template(
        "viaturas/resultado.html",
        vistoria=row,
        numero_vistoria=numero,
        secoes=CHECKLIST_SECOES,
        checklist=checklist,
        resultado_calc=resultado_calc,
        assinatura=assinatura,
        usuario=usuario,
        pode_assinar=pode_assinar_vistoria_viatura(usuario),
        total_itens=total_itens_checklist(),
        show_back=True,
        back_url=url_for("main.viaturas_home"),
        modulo="viaturas",
    )


@bp.route("/viaturas/vistorias/<int:vistoria_id>/pdf")
def exportar_pdf_viatura(vistoria_id):
    from app.pdf_viaturas_report import gerar_pdf_viatura

    db = get_db()
    row = db.execute(
        "SELECT * FROM vistorias_viaturas WHERE id = ?", (vistoria_id,)
    ).fetchone()
    if row is None:
        return render_template("404.html"), 404

    pdf_bytes = gerar_pdf_viatura(row)
    numero = numero_vistoria_viatura(row)
    filename = f"checklist_viatura_{numero.replace('/', '_')}.pdf"
    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{filename}"'},
    )


@bp.route("/viaturas/vistorias/<int:vistoria_id>/assinar", methods=["POST"])
def assinar_vistoria_viatura(vistoria_id):
    usuario = session.get("usuario")
    if not usuario:
        return jsonify({"erro": "Faça login para assinar."}), 401
    from app.auth_utils import pode_assinar_vistoria_viatura

    if not pode_assinar_vistoria_viatura(usuario):
        return jsonify({
            "erro": "Apenas Condutor de viatura, Chefe de Socorro ou Comandante de guarnição podem assinar.",
        }), 403

    db = get_db()
    row = db.execute(
        "SELECT id FROM vistorias_viaturas WHERE id = ?", (vistoria_id,)
    ).fetchone()
    if row is None:
        return jsonify({"erro": "Vistoria não encontrada."}), 404

    from datetime import datetime

    assinatura = {
        "nome": usuario["nome"],
        "posto": usuario.get("posto", ""),
        "matricula": usuario.get("matricula", ""),
        "cargo": usuario["perfil"],
        "perfil": usuario["perfil"],
        "data_hora": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        "assinado_por": nome_posto_guerra(usuario),
        "tipo": "Assinatura eletrônica",
    }
    db.execute(
        "UPDATE vistorias_viaturas SET assinatura_json = ? WHERE id = ?",
        (json.dumps(assinatura, ensure_ascii=False), vistoria_id),
    )
    db.commit()
    _cloud_sync("vistorias_viaturas", vistoria_id)

    if request.is_json:
        return jsonify({"ok": True, "assinatura": assinatura})
    return redirect(url_for("main.detalhe_vistoria_viatura", vistoria_id=vistoria_id))


@bp.route("/api/viaturas/vistorias", methods=["POST"])
def criar_vistoria_viatura():
    from app.viaturas_checklist import calcular_resultado_viatura, iter_checklist_perguntas

    data = request.get_json(silent=True) if request.is_json else request.form

    placa = (data.get("placa") or "").strip().upper()
    if not placa:
        return jsonify({"erro": "Placa é obrigatória."}), 400

    respostas = {}
    for _secao, pergunta in iter_checklist_perguntas():
        pid = pergunta["id"]
        val = (data.get(pid) or "").strip().lower()
        if val not in ("sim", "nao"):
            return jsonify({"erro": f"Responda Sim ou Não para o item {pergunta['numero']}."}), 400
        respostas[pid] = val

    resultado = calcular_resultado_viatura(respostas)
    assinatura_json = _extrair_assinatura_condutor(data)
    usuario = session.get("usuario")
    condutor = nome_posto_guerra(usuario) if usuario else None

    db = get_db()
    cursor = db.execute(
        """
        INSERT INTO vistorias_viaturas (
            placa, tipo_viatura, km, condutor, observacoes,
            checklist_json, assinatura_json,
            pontuacao_total, recomendacao, justificativa
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            placa,
            (data.get("tipo_viatura") or "").strip() or None,
            (data.get("km") or "").strip() or None,
            condutor,
            (data.get("observacoes") or "").strip() or None,
            json.dumps(respostas, ensure_ascii=False),
            assinatura_json,
            resultado["pontuacao_total"],
            resultado["recomendacao"],
            resultado["justificativa"],
        ),
    )
    vistoria_id = cursor.lastrowid
    numero = atribuir_numero_vistoria_viatura(vistoria_id)
    db.commit()
    _cloud_sync("vistorias_viaturas", vistoria_id)

    if request.is_json:
        return jsonify({"id": vistoria_id, "codigo": numero, **resultado}), 201

    return redirect(
        url_for("main.listar_vistorias_viaturas", salva=vistoria_id)
        + f"#vistoria-{vistoria_id}"
    )


@bp.route("/api/viaturas/calcular", methods=["POST"])
def calcular_viatura_preview():
    from app.viaturas_checklist import calcular_resultado_viatura, iter_checklist_perguntas

    data = request.get_json(silent=True) or request.form.to_dict()
    respostas = {}
    for _secao, pergunta in iter_checklist_perguntas():
        pid = pergunta["id"]
        val = (data.get(pid) or "nao").strip().lower()
        respostas[pid] = val if val in ("sim", "nao") else "nao"
    return jsonify(calcular_resultado_viatura(respostas))


def _extrair_assinatura_condutor(data) -> str | None:
    raw = (data.get("assinatura_json") or "").strip()
    if not raw:
        return None
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, dict) and parsed.get("assinado_por"):
            if parsed.get("cargo") != "Condutor de viatura":
                parsed["cargo"] = "Condutor de viatura"
            return json.dumps(parsed, ensure_ascii=False)
    except json.JSONDecodeError:
        pass
    return None


@bp.route("/legislacao/")
def legislacao():
    from app.legislacao_data import LEGISLACAO_CATEGORIAS
    from app.modules import MODULOS

    info = next(m for m in MODULOS if m["id"] == "legislacao")
    return render_template(
        "legislacao/index.html",
        modulo_info=info,
        categorias=LEGISLACAO_CATEGORIAS,
        show_back=True,
        back_url=url_for("main.index"),
    )


@bp.route("/legislacao/<cat_id>")
def legislacao_categoria(cat_id):
    from app.legislacao_data import get_categoria

    cat = get_categoria(cat_id)
    if not cat:
        abort(404)
    return render_template(
        "legislacao/categoria.html",
        categoria=cat,
        show_back=True,
        back_url=url_for("main.legislacao"),
    )


POP_EXTENSOES = {
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".png",
    ".jpg",
    ".jpeg",
}


@bp.route("/pop/")
def pop_index():
    from app.modules import MODULOS

    info = next(m for m in MODULOS if m["id"] == "pop")
    db = get_db()
    pops = db.execute(
        "SELECT id, titulo, original_name, mime_type, created_at "
        "FROM pops ORDER BY id DESC"
    ).fetchall()
    erro = request.args.get("erro")
    return render_template(
        "pop/index.html",
        modulo_info=info,
        pops=pops,
        erro=erro,
        show_back=True,
        back_url=url_for("main.index"),
    )


@bp.route("/pop/upload", methods=["POST"])
def pop_upload():
    titulo = (request.form.get("titulo") or "").strip()
    if not titulo:
        return redirect(url_for("main.pop_index", erro="Informe o título do POP."))

    arquivo = request.files.get("arquivo")
    if not arquivo or not arquivo.filename:
        return redirect(url_for("main.pop_index", erro="Selecione um arquivo."))

    nome_seguro = secure_filename(arquivo.filename)
    ext = os.path.splitext(nome_seguro)[1].lower()
    if ext not in POP_EXTENSOES:
        return redirect(
            url_for(
                "main.pop_index",
                erro="Formato não permitido. Use PDF, Office ou imagem.",
            )
        )

    stored = f"{uuid.uuid4().hex}{ext}"
    pop_folder = current_app.config["POP_FOLDER"]
    arquivo.save(os.path.join(pop_folder, stored))

    usuario = session.get("usuario") or {}
    enviado_por = nome_posto_guerra(usuario) if usuario else None

    db = get_db()
    db.execute(
        """
        INSERT INTO pops (titulo, filename, original_name, mime_type, uploaded_by)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            titulo,
            stored,
            nome_seguro,
            arquivo.mimetype or "application/octet-stream",
            enviado_por,
        ),
    )
    db.commit()
    return redirect(url_for("main.pop_index"))


@bp.route("/pop/<int:pop_id>/arquivo")
def pop_arquivo(pop_id):
    db = get_db()
    row = db.execute(
        "SELECT filename, original_name, mime_type FROM pops WHERE id = ?",
        (pop_id,),
    ).fetchone()
    if row is None:
        abort(404)
    pop_folder = current_app.config["POP_FOLDER"]
    return send_from_directory(
        pop_folder,
        row["filename"],
        as_attachment=False,
        download_name=row["original_name"] or row["filename"],
        mimetype=row["mime_type"] or "application/octet-stream",
    )


def _dados_ocorrencia_vistoria(data):
    cpf_raw = limpar_cpf(data.get("cpf_solicitante", ""))
    cpf_solicitante = formatar_cpf(cpf_raw) if len(cpf_raw) == 11 else (cpf_raw or None)
    forma = (data.get("forma_acionamento") or "").strip() or None
    protocolo = (data.get("protocolo") or "").strip() or None
    natureza = (data.get("natureza_ocorrencia") or "").strip() or None
    descricao = (data.get("descricao_ocorrencia") or "").strip()
    if len(descricao) > 100:
        descricao = descricao[:100]
    descricao = descricao or None
    return cpf_solicitante, forma, protocolo, natureza, descricao


@bp.route("/api/vistorias", methods=["POST"])
def criar_vistoria():
    data = request.get_json(silent=True) if request.is_json else request.form

    endereco = (data.get("endereco") or "").strip()
    if not endereco:
        return jsonify({"erro": "Endereço é obrigatório."}), 400

    solicitante = (data.get("solicitante") or "").strip()
    if not solicitante:
        return jsonify({"erro": "Solicitante é obrigatório."}), 400

    respostas, erro = _extrair_questionario(data)
    if erro:
        return jsonify({"erro": erro}), 400

    resultado = calcular_resultado(respostas)
    lat = _float_or_none(data.get("latitude"))
    lng = _float_or_none(data.get("longitude"))
    rubrica_json = _extrair_rubrica(data, solicitante)
    assinatura_json = _extrair_assinatura_chefe(data)
    cpf_solicitante, forma_acionamento, protocolo, natureza_ocorrencia, descricao_ocorrencia = _dados_ocorrencia_vistoria(data)

    db = get_db()
    cursor = db.execute(
        """
        INSERT INTO vistorias (
            endereco, especie, observacoes, solicitante, cpf_solicitante,
            contato_telefonico, forma_acionamento, protocolo, natureza_ocorrencia,
            descricao_ocorrencia,
            latitude, longitude, questionario_json, notas_json,
            rubrica_solicitante_json, assinatura_json,
            nota_tronco, nota_raizes, nota_inclinacao, nota_copa, nota_pragas, nota_proximidade,
            pontuacao_total, recomendacao, justificativa
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0, ?, ?, ?)
        """,
        (
            endereco,
            (data.get("especie") or "").strip() or None,
            (data.get("observacoes") or "").strip() or None,
            solicitante,
            cpf_solicitante,
            (data.get("contato_telefonico") or "").strip() or None,
            forma_acionamento,
            protocolo,
            natureza_ocorrencia,
            descricao_ocorrencia,
            lat,
            lng,
            json.dumps(respostas, ensure_ascii=False),
            json.dumps(respostas, ensure_ascii=False),
            rubrica_json,
            assinatura_json,
            resultado["pontuacao_total"],
            resultado["recomendacao"],
            resultado["justificativa"],
        ),
    )
    vistoria_id = cursor.lastrowid
    numero_laudo = atribuir_numero_laudo(vistoria_id)

    if not request.is_json:
        _salvar_fotos(request.files.getlist("fotos"), vistoria_id)

    db.commit()
    _cloud_sync("vistorias", vistoria_id)

    if request.is_json:
        return jsonify({"id": vistoria_id, "codigo": numero_laudo, **resultado}), 201

    return redirect(url_for("main.listar_vistorias", salva=vistoria_id) + f"#vistoria-{vistoria_id}")


@bp.route("/api/calcular", methods=["POST"])
def calcular_preview():
    data = request.get_json(silent=True) or request.form.to_dict()
    if any(k.startswith("q_") for k in data):
        respostas = {k: v for k, v in data.items() if k.startswith("q_")}
        return jsonify(calcular_resultado(respostas))

    nota_min, _ = get_nota_range()
    notas = {}
    for c in get_criterios():
        try:
            notas[c["id"]] = int(data.get(c["id"], nota_min))
        except (TypeError, ValueError):
            notas[c["id"]] = nota_min
    return jsonify(calcular_resultado_legado(notas))


def _extrair_rubrica(data, solicitante: str) -> str | None:
    from datetime import datetime

    img = (data.get("rubrica_solicitante") or "").strip()
    if not img or not img.startswith("data:image"):
        return None
    payload = {
        "imagem": img,
        "nome": solicitante,
        "data_hora": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
    }
    return json.dumps(payload, ensure_ascii=False)


def _extrair_assinatura_chefe(data) -> str | None:
    raw = (data.get("assinatura_json") or "").strip()
    if not raw:
        return None
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, dict) and parsed.get("assinado_por"):
            return json.dumps(parsed, ensure_ascii=False)
    except json.JSONDecodeError:
        pass
    return None


def _extrair_questionario(data):
    respostas = {}
    for _secao, pergunta in iter_todas_perguntas():
        pid = pergunta["id"]
        val = (data.get(pid) or "").strip().lower()
        if val not in ("sim", "nao"):
            return None, f"Responda Sim ou Não para o item {pergunta['numero']}."
        respostas[pid] = val
    return respostas, None


def _otimizar_foto_salva(path: str, max_lado: int = 1600, qualidade: int = 85) -> None:
    from PIL import Image as PILImage

    with PILImage.open(path) as im:
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        largura, altura = im.size
        lado_max = max(largura, altura)
        if lado_max > max_lado:
            escala = max_lado / lado_max
            im = im.resize(
                (int(largura * escala), int(altura * escala)),
                PILImage.LANCZOS,
            )
        ext = path.rsplit(".", 1)[-1].lower()
        if ext in ("jpg", "jpeg"):
            im.save(path, "JPEG", quality=qualidade, optimize=True)
        elif ext == "png":
            im.save(path, "PNG", optimize=True)
        else:
            im.save(path, "JPEG", quality=qualidade, optimize=True)


def _salvar_fotos(files, vistoria_id: int):
    cfg = get_fotos_config()
    extensoes = {e.lower() for e in cfg["extensoes"]}
    max_fotos = cfg["max_por_vistoria"]
    max_bytes = cfg["tamanho_max_mb"] * 1024 * 1024
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    db = get_db()

    salvos = 0
    for f in files:
        if not f or not f.filename or salvos >= max_fotos:
            continue

        ext = f.filename.rsplit(".", 1)[-1].lower() if "." in f.filename else ""
        if ext not in extensoes:
            continue

        f.seek(0, os.SEEK_END)
        size = f.tell()
        f.seek(0)
        if size > max_bytes:
            continue

        nome = f"{uuid.uuid4().hex}.{ext}"
        path = os.path.join(upload_folder, nome)
        f.save(path)
        try:
            _otimizar_foto_salva(path)
        except Exception:
            pass

        db.execute(
            "INSERT INTO fotos (vistoria_id, filename) VALUES (?, ?)",
            (vistoria_id, nome),
        )
        salvos += 1


def _float_or_none(value):
    if value is None or value == "":
        return None
    try:
        return float(str(value).replace(",", "."))
    except ValueError:
        return None
