"use strict";
// PAINEL
let formPainel = document.querySelector("#form-painel");
let iconeLogout = document.querySelector("#icone-logout");
let textoTop = document.querySelector("#texto-top");
let divPrincipalPainel = document.querySelector("#div-principal-painel");
let inputId = document.querySelector("#input-numero-id");
let inputDescricao = document.querySelector("#input-desc");
let inputDetalhamento = document.querySelector("#input-det");
let painelRecados = document.querySelector("#painel-recados");
let btnEditar;
let btnApagar;
;
let edicao = false;
let usuarioLogado = "";
let listaUsuarios = [];
let indiceDoUsuarioLogado = 0;
let recadosDoUsuarioLogado = [];
// ALERTAS
let espacoAlertaRecados = document.getElementById('espaco-alerta-recados');
let corpoAlertaRecados = document.createElement('div');
function mostrarAlertaRecados(mensagem, tipo) {
    corpoAlertaRecados.innerHTML = `
                        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                                <div>${mensagem}</div>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                        `;
    espacoAlertaRecados.appendChild(corpoAlertaRecados);
    setTimeout(() => { corpoAlertaRecados.innerHTML = ''; }, 3000);
}
;
document.addEventListener("DOMContentLoaded", () => {
    pegarDadosStorage();
    recadosDoUsuarioLogado.forEach((recado) => mostrarRecadosNoPainel(recado));
    if (recadosDoUsuarioLogado.length > 0) {
        removerLinhaInicial();
        mapeiaBotaoEditar();
        mapeiaBotaoApagar();
    }
});
formPainel.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validaInputs()) {
        salvarRecado();
    }
});
formPainel.addEventListener("reset", (e) => {
    e.preventDefault();
    limparCamposPainel();
    cancelarEdicaoDivPrincipalPainel();
});
iconeLogout.addEventListener("click", () => {
    let confirma = confirm(`Tem certeza que deseja sair da página?`);
    if (confirma) {
        localStorage.removeItem("usuario_logado");
        redirecionaParaLogin();
    }
});
function mapeiaBotaoEditar() {
    btnEditar = document.querySelector("#btn-editar");
    btnEditar.addEventListener("click", () => {
        editarRecado(Number(inputId.value));
    });
}
function mapeiaBotaoApagar() {
    btnApagar = document.querySelector("#btn-apagar");
    btnApagar.addEventListener("click", () => {
        apagarRecado(Number(inputId.value));
    });
}
// FUNÇÕES
function validaInputs() {
    return validaCamposPreenchidos() && (edicao || validaIdUnico());
}
;
function validaIdUnico() {
    let id = Number(inputId.value);
    let existe = recadosDoUsuarioLogado.some((recado) => recado.id == id);
    if (existe) {
        mostrarAlertaRecados("O ID deve ser único, você já tem um recado com este ID.", "warning");
        inputId.value = "";
        inputId.focus();
    }
    ;
    return !existe;
}
;
function validaCamposPreenchidos() {
    let retorno = true;
    if (inputId.value.length === 0 || inputDescricao.value.length === 0 || inputDetalhamento.value.length === 0) {
        mostrarAlertaRecados("Você deve preencher todos os campos.", "warning");
        retorno = false;
    }
    ;
    return retorno;
}
;
function salvarRecado() {
    let indiceRecadoEdicao = 0;
    let id = Number(inputId.value);
    let descricao = inputDescricao.value;
    let detalhamento = inputDetalhamento.value;
    let recado = {
        id,
        descricao,
        detalhamento
    };
    if (edicao) {
        indiceRecadoEdicao = recadosDoUsuarioLogado.findIndex((recado) => recado.id = id);
        recadosDoUsuarioLogado.splice(indiceRecadoEdicao, 1, recado);
        edicao = false;
    }
    else {
        recadosDoUsuarioLogado.push(recado);
    }
    salvarRecadosNoLocalStorage(recadosDoUsuarioLogado);
    recarregaPagina();
}
;
function mostrarRecadosNoPainel(recado) {
    let divContainerCard = document.createElement("div");
    let divCard = document.createElement("div");
    let divCardBody = document.createElement("div");
    let headingCardId = document.createElement("h5");
    let headingCardDescricao = document.createElement("h6");
    let paragrafoCardDetalhamento = document.createElement("p");
    let divButtons = document.createElement("div");
    divContainerCard.setAttribute("class", "col-sm-3 mb-2 p-1");
    divCard.setAttribute("class", "card");
    divCardBody.setAttribute("class", "card-body");
    headingCardId.setAttribute("class", "card-id");
    headingCardDescricao.setAttribute("class", "card-descricao");
    paragrafoCardDetalhamento.setAttribute("class", "card-detalhamento");
    divButtons.setAttribute("class", "div-buttons");
    headingCardId.innerHTML = JSON.stringify(recado.id);
    headingCardDescricao.innerHTML = recado.descricao;
    paragrafoCardDetalhamento.innerHTML = recado.detalhamento;
    divButtons.innerHTML = `
                                <button class="btn-card" id="btn-apagar"><i class="bi bi-trash3" onclick="apagarRecado(${recado.id})"></i></button>
                                <button class="btn-card" id="btn-editar"><i class="bi bi-pencil-square" onclick="editarRecado(${recado.id})"></i></button>
                            `;
    painelRecados.appendChild(divContainerCard);
    divContainerCard.appendChild(divCard);
    divCard.appendChild(divCardBody);
    divCardBody.appendChild(headingCardId);
    divCardBody.appendChild(headingCardDescricao);
    divCardBody.appendChild(paragrafoCardDetalhamento);
    divCardBody.appendChild(divButtons);
}
;
function limparCamposPainel() {
    inputId.value = "";
    inputDescricao.value = "";
    inputDetalhamento.value = "";
}
;
function salvarRecadosNoLocalStorage(listaRecados) {
    listaUsuarios[indiceDoUsuarioLogado].recados = listaRecados;
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
}
;
function pegarDadosStorage() {
    usuarioLogado = localStorage.getItem("usuario_logado") || "[]";
    if (usuarioLogado === null) {
        redirecionaParaLogin();
    }
    listaUsuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    indiceDoUsuarioLogado = listaUsuarios.findIndex((usuario) => usuario.email === usuarioLogado);
    recadosDoUsuarioLogado = listaUsuarios[indiceDoUsuarioLogado].recados;
}
;
function removerLinhaInicial() {
    let h5 = document.getElementById("linha-inicial");
    painelRecados.removeChild(h5);
}
;
function apagarRecado(id) {
    let indiceEncontrado = recadosDoUsuarioLogado.findIndex((recado) => recado.id === id);
    let confirma = confirm(`Tem certeza que deseja remover o recado nº ${id}?`);
    if (confirma) {
        recadosDoUsuarioLogado.splice(indiceEncontrado, 1);
        salvarRecadosNoLocalStorage(recadosDoUsuarioLogado);
        recarregaPagina();
    }
}
;
function editarDivPrincipalPainel() {
    divPrincipalPainel.classList.add("borda-div-principal-painel");
    textoTop.innerText = "EDITE SEU RECADO:";
}
function cancelarEdicaoDivPrincipalPainel() {
    divPrincipalPainel.classList.remove("borda-div-principal-painel");
    textoTop.innerText = "MEU PAINEL DE RECADOS";
}
function editarRecado(id) {
    let recado = recadosDoUsuarioLogado.find((recado) => recado.id === id);
    if (recado) {
        edicao = true;
        inputId.value = JSON.stringify(recado.id);
        inputDescricao.value = recado.descricao;
        inputDetalhamento.value = recado.detalhamento;
    }
    editarDivPrincipalPainel();
    inputId.focus();
}
;
function recarregaPagina() {
    location.reload();
}
;
function redirecionaParaLogin() {
    window.location.href = "../index.html";
}
;
