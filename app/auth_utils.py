import hashlib
import re

POSTOS = [
    "Soldado", "Cabo", "3° Sargento", "2° Sargento", "1° Sargento",
    "Subtenente", "2° Tenente", "1° Tenente", "Capitão", "Major",
    "Tenente-coronel", "Coronel",
]

PERFIS = [
    "Administrador",
    "Chefe de Socorro",
    "Condutor de viatura",
    "Comandante de guarnição",
]

PERFIS_CADASTRO = [p for p in PERFIS if p != "Administrador"]

PERFIS_ASSINATURA_VIATURA = (
    "Condutor de viatura",
    "Chefe de Socorro",
    "Comandante de guarnição",
)


def limpar_cpf(cpf: str) -> str:
    return re.sub(r"\D", "", cpf or "")


def formatar_cpf(cpf: str) -> str:
    c = limpar_cpf(cpf)
    if len(c) != 11:
        return cpf or ""
    return f"{c[:3]}.{c[3:6]}.{c[6:9]}-{c[9:]}"


def limpar_telefone(telefone: str) -> str:
    return re.sub(r"\D", "", telefone or "")[:11]


def formatar_telefone(telefone: str) -> str:
    d = limpar_telefone(telefone)
    if not d:
        return telefone or ""
    if len(d) <= 2:
        return f"({d}"
    if len(d) <= 6:
        return f"({d[:2]}) {d[2:]}"
    if len(d) <= 10:
        return f"({d[:2]}) {d[2:6]}-{d[6:]}"
    return f"({d[:2]}) {d[2:7]}-{d[7:]}"


def hash_senha(senha: str) -> str:
    return hashlib.sha256(senha.encode("utf-8")).hexdigest()


def nome_completo_militar(user: dict) -> str:
    if not user:
        return ""
    posto = user.get("posto", "")
    nome = user.get("nome", "")
    return f"{posto} {nome}".strip()


def nome_exibicao(user: dict) -> str:
    """Nome de guerra para boas-vindas; fallback para nome civil."""
    if not user:
        return ""
    guerra = (user.get("nome_guerra") or "").strip()
    if guerra:
        return guerra
    return (user.get("nome") or "").strip()


def pode_assinar_vistoria_viatura(user: dict) -> bool:
    if not user:
        return False
    return user.get("perfil") in PERFIS_ASSINATURA_VIATURA


def nome_posto_guerra(user: dict) -> str:
    """Posto/graduação + nome de guerra (ex.: Cabo Silva)."""
    if not user:
        return ""
    posto = (user.get("posto") or "").strip()
    nome = nome_exibicao(user)
    if posto and nome:
        return f"{posto} {nome}"
    return posto or nome
