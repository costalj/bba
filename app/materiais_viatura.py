"""Conferência diária de materiais das viaturas."""

from datetime import datetime


def item(qtd, nome, obs=""):
    return {"qtd": str(qtd), "nome": nome, "obs": obs}


SECOES_MODELO = [
    {
        "titulo": "Materiais VTR AR 76",
        "itens": [
            item(1, "Escada de alumínio de 02 (dois) lances"),
            item(2, "Fita zebrada", "porta luva"),
            item(1, "Caixa de madeira para transporte de animal silvestre"),
            item(1, "Balde para transporte de animal silvestre"),
            item(2, "Pinça gatilho"),
            item(1, "Gancho de manuseio de répteis"),
            item(1, "Cambão"),
            item(2, "Pés de cabra"),
            item(1, "Alavanca"),
            item(1, "Motosserra pequena MS 194T"),
            item(1, "Motosserra média MS 260"),
            item(2, "Facão"),
            item(1, "Serrapoda"),
            item(1, "Bolsa de APH", "verificar todo dia"),
            item(1, "Alavanca HOOLIGAN"),
            item(1, "Refletor"),
            item(3, "Roupas de apicultor"),
            item(3, "Capas de chuva"),
            item(1, "Bomba costal flexível"),
            item(1, "Rede de captura preta", "avariada"),
            item(1, "Bidão"),
            item(1, "Dosador de combustível"),
            item(1, "Lona laranja"),
            item(3, "Calças de proteção para uso de motosserra"),
            item(1, "Camisa para proteção de uso de motosserra"),
            item(3, "Pares de luva para uso de motosserra"),
            item(1, "Puçá"),
            item(3, "Capacetes com abafadores e proteção facial"),
            item(3, "Pares de luvas de vaqueta"),
        ],
    },
    {
        "titulo": "Caixa de ferramenta",
        "itens": [
            item(2, "Chave estrela"),
            item(3, "Chaves de fenda"),
            item(1, "Alicate torquês"),
            item(1, "Arco de serra"),
            item(1, "Alicate universal"),
            item(2, "Alicates de pressão"),
            item(2, "Marretas"),
            item(2, "Talhadeiras"),
            item(2, "Chaves cachimbo"),
            item(1, "Chave combinada"),
            item(1, "Chave de boca 14/15 mm"),
            item(1, "Chave de boca 12/13 mm"),
            item(1, "Chave de boca 10/11 mm"),
            item(1, "Chave inglesa ajustável"),
        ],
    },
    {
        "titulo": "Materiais de motosserra",
        "itens": [
            item(2, "Chaves cachimbo"),
            item(5, "Pincéis"),
            item(2, "Facas de serra"),
            item(1, "Chave pequena de fenda para calibragem de motosserra"),
            item(1, "Chave allen"),
            item(1, "Escovão de aço"),
            item(1, "Guia de afiação Hsoft"),
            item(2, "Limas arredondadas"),
        ],
    },
    {
        "titulo": "Materiais de altura",
        "itens": [
            item(2, "Cordas para tração laranja"),
            item(1, "Corda para tração branca"),
            item(1, "Corda para resgate branca"),
            item(1, "Corda de resgate vermelha"),
            item(1, "Cadeira de arborismo"),
            item(1, "Cadeira nível III"),
            item(1, "Cabo solteiro branco"),
            item(7, "Cabos solteiro laranja"),
            item(5, "Cabos solteiro vermelho", "01 na falta"),
        ],
    },
    {
        "titulo": "Bolsa preta",
        "itens": [
            item(1, "Trava quedas LUCK"),
            item(2, "Ascensores ventrais"),
            item(2, "Ascensores de punho"),
            item(1, "Stop"),
            item(1, "Placa de ancoragem de 12 furos"),
            item(2, "Polias duplas"),
            item(1, "Polia simples"),
            item(1, "Ascensor de pé"),
        ],
    },
    {
        "titulo": "Bolsa digitalizada",
        "itens": [
            item(3, "Cordeletes laranjas"),
            item(5, "Cordeletes azuis"),
            item(6, "Cordeletes vermelhos"),
            item(1, "Cinta de ancoragem laranja"),
            item(2, "Cintas de ancoragem em olhal D pretas"),
            item(1, "Fita tubular azul"),
            item(
                1,
                "Talabarte de posicionamento",
                "cabo vermelho com mosquetão de aço de rosca dourada e grigri",
            ),
            item(1, "Fita retrátil para motosserra vermelha"),
            item(1, "Linha de arremesso (balde)"),
        ],
    },
    {
        "titulo": "Mochila verde",
        "itens": [
            item(6, "Mosquetões de aço com trava dourada tripla"),
            item(2, "Mosquetões preto trava tripla"),
            item(1, "Rope grape"),
            item(1, "Polia simples"),
            item(6, "Mosquetões de aço + freio 8"),
            item(8, "Mosquetões de aço"),
            item(2, "Mosquetões de alumínio preto"),
        ],
    },
]

CONFERENCIA_INICIAL = {
    "data_servico": "2026-09-23",
    "dia_semana": "Quarta-feira",
    "chefe_socorro": "1° TEN QOA BM JEAN Marry",
    "contato": "(98) 987918536",
    "condutor": "1º Sgr BM Egídio",
    "comandante": "2º SGT BM Lindonberg",
    "oficial_dia": "2° Ten. BM Marconi",
    "viaturas": [
        {"ar": "76", "km": "104433", "k7": "6/8"},
        {"ar": "87", "km": "5195", "k7": "7/8"},
    ],
    "secoes": SECOES_MODELO,
}

DIAS_SEMANA = (
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
)


def dia_semana(data_iso: str) -> str:
    data = datetime.strptime(data_iso, "%Y-%m-%d")
    return DIAS_SEMANA[data.weekday()]


def data_extenso(data_iso: str) -> str:
    data = datetime.strptime(data_iso, "%Y-%m-%d")
    return data.strftime("%d/%m/%Y")


def qtd_label(qtd) -> str:
    texto = str(qtd or "").strip()
    if texto.isdigit():
        return f"{int(texto):02d}"
    return texto or "—"


def modelo_para_formulario():
    return {
        "data_servico": datetime.now().strftime("%Y-%m-%d"),
        "chefe_socorro": "",
        "contato": "",
        "condutor": "",
        "comandante": "",
        "oficial_dia": "",
        "viaturas": [
            {"ar": "76", "km": "", "k7": ""},
            {"ar": "87", "km": "", "k7": ""},
        ],
        "secoes": SECOES_MODELO,
    }
