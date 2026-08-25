import os
from flask import Flask
from flask_cors import CORS

from app.database import init_db


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-vistoria-arvores")
    app.config["DATABASE"] = os.path.join(
        app.instance_path, "vistorias.db"
    )
    app.config["UPLOAD_FOLDER"] = os.path.join(
        app.instance_path, "uploads"
    )
    app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024  # 50 MB total

    os.makedirs(app.instance_path, exist_ok=True)
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    app.config["POP_FOLDER"] = os.path.join(app.instance_path, "pops")
    os.makedirs(app.config["POP_FOLDER"], exist_ok=True)

    CORS(app)
    init_db(app)

    from flask import session

    from app.modules import APP_INFO, MODULOS

    from app.auth_utils import formatar_cpf as fmt_cpf
    from app.auth_utils import nome_exibicao as nome_exibicao_fn
    from app.auth_utils import (
        nome_posto_guerra as nome_posto_guerra_fn,
        pode_assinar_vistoria_viatura as pode_assinar_vistoria_viatura_fn,
    )

    @app.context_processor
    def inject_globals():
        return {
            "app_info": APP_INFO,
            "modulos": MODULOS,
            "usuario": session.get("usuario"),
            "mostrar_bem_vindo": session.pop("bem_vindo", False),
            "nome_posto_guerra": nome_posto_guerra_fn,
            "pode_assinar_vistoria_viatura": pode_assinar_vistoria_viatura_fn,
        }

    @app.template_filter("formatar_cpf")
    def formatar_cpf_filter(cpf):
        return fmt_cpf(cpf)

    from app.format_utils import formatar_data_hora_br, status_viatura, texto_viatura

    @app.template_filter("formatar_data_hora_br")
    def formatar_data_hora_br_filter(valor):
        return formatar_data_hora_br(valor)

    from app.database import numero_laudo_vistoria, numero_vistoria_viatura

    @app.context_processor
    def inject_vistoria_helpers():
        return {
            "numero_laudo_vistoria": numero_laudo_vistoria,
            "numero_vistoria_viatura": numero_vistoria_viatura,
            "nome_exibicao": nome_exibicao_fn,
            "nome_posto_guerra": nome_posto_guerra_fn,
            "pode_assinar_vistoria_viatura": pode_assinar_vistoria_viatura_fn,
            "texto_viatura": texto_viatura,
            "status_viatura": status_viatura,
        }

    from app.routes import bp

    app.register_blueprint(bp)

    return app
