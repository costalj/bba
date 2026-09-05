"""Módulos disponíveis no app BBA."""



MODULOS = [

    {

        "id": "arvores",

        "nome": "Vistoria de Árvores",

        "descricao": "Avaliação de risco arbóreo e laudo",

        "icone": "🌳",

        "cor": "#2d6a4f",

        "rota": "main.arvores_home",

        "ativo": True,

    },

    {

        "id": "materiais",

        "nome": "Checklist de Materiais",

        "descricao": "Controle de equipamentos e EPIs",

        "icone": "📦",

        "icone_img": "img/icon-motosserra.svg",

        "cor": "#f5921e",

        "rota": "main.materiais",

        "ativo": False,

    },

    {

        "id": "viaturas",

        "nome": "Vistoria de Viaturas",

        "descricao": "Inspeção de veículos da frota",

        "icone": "🚗",

        "icone_img": "img/icon-viatura-bombeiro.svg",

        "cor": "#c62828",

        "rota": "main.viaturas_home",

        "ativo": True,

    },

    {

        "id": "legislacao",

        "nome": "Legislação",

        "descricao": "Portarias, BG, manuais e normas",

        "icone": "⚖️",

        "cor": "#334155",

        "rota": "main.legislacao",

        "ativo": True,

    },

    {

        "id": "pop",

        "nome": "POP",

        "descricao": "Procedimentos operacionais padrão",

        "icone": "📋",

        "cor": "#0f766e",

        "rota": "main.pop_index",

        "ativo": True,

    },

    {

        "id": "treinamentos",

        "nome": "Treinamentos",

        "descricao": "Cursos e capacitações",

        "icone": "🎓",

        "cor": "#1d4ed8",

        "rota": "main.treinamentos",

        "ativo": False,

    },

]



APP_INFO = {

    "nome": "BBA",

    "subtitulo": "Batalhão de Bombeiros Ambiental",

    "versao": "1.0.30",

}

