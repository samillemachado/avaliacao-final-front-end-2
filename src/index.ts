//LOGIN
let formLogin = document.querySelector("#form-login") as HTMLFormElement;

let inputEmailLogin = document.querySelector("#input-email") as HTMLInputElement;
let inputSenhaLogin = document.querySelector("#input-senha") as HTMLInputElement;
let btnCriar = document.querySelector("#btn-criar") as HTMLButtonElement;
let btnVoltarLogin = document.querySelector("#btn-voltar-login") as HTMLButtonElement;
let divPrincipalLogin = document.querySelector("#div-principal-login") as HTMLDivElement;
let divPrincipalSignup = document.querySelector("#div-principal-signup") as HTMLDivElement;

let usuarios : Usuario[] = JSON.parse(localStorage.getItem("usuarios") || "[]");

interface Usuario {
    email: string,
    senha: string,
    recados: any []
}

// CADASTRO
let formSignup = document.querySelector("#form-signup") as HTMLFormElement;

let labelInputEmailSignup = document.querySelector("#label-input-email") as HTMLLabelElement;
let inputEmailSignup = document.querySelector("#input-signup-email") as HTMLInputElement;
let validEmailSignup : boolean = false;

let labelInputSenhaSignup = document.querySelector("#label-input-senha") as HTMLLabelElement;
let inputSenhaSignup = document.querySelector("#input-signup-senha")  as HTMLInputElement;
let validSenhaSignup : boolean = false;

let labelInputRepeteSenhaSignup = document.querySelector("#label-input-repete-senha") as HTMLLabelElement;
let inputRepeteSenhaSignup = document.querySelector("#input-signup-repete-senha") as HTMLInputElement;
let validRepeteSenhaSignup : boolean = false;

let regSenha : RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;


// ALERTAS
let espacoAlertaIndex = document.getElementById('espaco-alerta-index') as HTMLDivElement;
let espacoAlertaSignupIndex = document.getElementById('espaco-alerta-signup-index') as HTMLDivElement;
let corpoAlertaIndex: HTMLDivElement = document.createElement('div');

function mostrarAlertaIndex(mensagem: string, tipo: string, espaco: HTMLDivElement) {
     
    corpoAlertaIndex.innerHTML = `
                        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                                <div>${mensagem}</div>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                        `;                                                
    espaco.appendChild(corpoAlertaIndex);
    setTimeout(() => {corpoAlertaIndex.innerHTML = '';}, 3000);
};

// EVENTOS
formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    if (verificaCamposLogin()) {
        if (validaUsuarioLogin() && validaSenhaLogin()) {
            salvarNoLocalStorage();
            redirecionaParaPaginaPainel();
        }
    }
});

btnCriar.addEventListener("click", () => {
    formLoginHide();
    formSignupShow();
});

btnVoltarLogin.addEventListener("click", () => {
    formSignupHide();
    formLoginShow();
});

inputEmailSignup.addEventListener("keyup", verificaEmailSignup);
inputSenhaSignup.addEventListener("keyup", verificaSenhaSignup);
inputRepeteSenhaSignup.addEventListener("keyup", verificaRepeteSenhaSignup);

formSignup.addEventListener("submit", (e) => {
    e.preventDefault();
    if( verificaCampos() ) {
        criarRegistroUsuario();
        formSignupHide();
        formLoginShow();
        limparCamposLogin();
    }
});


// FUNÇÕES
function verificaCamposLogin(){

    let retorno = true;

    if(inputEmailLogin.value === "" || inputSenhaLogin.value ===""){
        mostrarAlertaIndex("Você deve preencher todos os campos!", "warning", espacoAlertaIndex);
        retorno = false;
    }
    return retorno;
}

function validaUsuarioLogin(){

    let usuarioExistente : boolean = usuarios.some((usuario) => usuario.email === inputEmailLogin.value);
    
    if (!usuarioExistente) {
        mostrarAlertaIndex("Usuário não cadastrado! Primeiro crie uma conta.", "warning", espacoAlertaIndex);
    }
    return usuarioExistente;
}


function validaSenhaLogin(){

    let usuario = usuarios.find((usuario) => usuario.email === inputEmailLogin.value);
    let senhaCorreta  = usuario ? usuario.senha === inputSenhaLogin.value : false;

    if (!senhaCorreta) {
        mostrarAlertaIndex("Senha incorreta, tente novamente.", "danger", espacoAlertaIndex);
    }
    return senhaCorreta;
}

function redirecionaParaPaginaPainel() {
    window.location.href = "./public/painel.html";
}

function salvarNoLocalStorage() {
    localStorage.setItem("usuario_logado", inputEmailLogin.value);
}

function formLoginHide(){
    divPrincipalLogin.classList.add("d-none");
}

function formSignupShow(){
    divPrincipalSignup.classList.remove("d-none");
}

function formSignupHide(){
    divPrincipalSignup.classList.add("d-none");
}

function formLoginShow(){
    divPrincipalLogin.classList.remove("d-none");
}

function verificaEmailSignup(){ 

    if(inputEmailSignup.value.length < 10){
        labelInputEmailSignup.style.color = 'red';
        labelInputEmailSignup.innerHTML = "e-mail: * insira no mínimo 10 caracteres";
        validEmailSignup = false;
    } else{   
        labelInputEmailSignup.style.color = '#592c12';    
        labelInputEmailSignup.innerHTML = "e-mail:";
        validEmailSignup = true;
    }    
};

function verificaSenhaSignup(){  
    let senhaValida = inputSenhaSignup.value.match(regSenha);   

    if(inputSenhaSignup.value.length < 6){
        labelInputSenhaSignup.style.color = 'red';
        labelInputSenhaSignup.innerHTML = "senha: * insira no mínimo 6 caracteres";
        validSenhaSignup = false;

    } else if(senhaValida === null){
        labelInputSenhaSignup.innerHTML = "senha: * senha deve conter uma letra maiúscula e um caracter especial";
        labelInputSenhaSignup.style.color = 'red';
        validSenhaSignup = false;

    } else {      
        labelInputSenhaSignup.style.color = '#592c12'; 
        labelInputSenhaSignup.innerHTML = "senha:";
        validSenhaSignup = true;
    }
};

function verificaRepeteSenhaSignup(){   

    if(inputRepeteSenhaSignup.value !== inputSenhaSignup.value){
        labelInputRepeteSenhaSignup.style.color = 'red';
        labelInputRepeteSenhaSignup.innerHTML = "repete senha: * a senha digitada não corresponde";
        validRepeteSenhaSignup = false;
    } else {      
        labelInputRepeteSenhaSignup.style.color = '#592c12';
        labelInputRepeteSenhaSignup.innerHTML = "repete senha:";
        validRepeteSenhaSignup = true;
    }
};

function verificaCampos(){

    let retorno = true;

    let usuarioExistente: boolean = (JSON.parse(localStorage.getItem("usuarios") || "[]")
        .some((usuario: Usuario) => usuario.email === JSON.stringify(inputEmailSignup.value)));

    if(inputEmailSignup.value === "" || inputSenhaSignup.value === "" || inputRepeteSenhaSignup.value === ""){
        mostrarAlertaIndex("Você deve preencher todos os campos!", "warning", espacoAlertaSignupIndex);
        retorno = false;

    } else if(!validEmailSignup || !validSenhaSignup || !validRepeteSenhaSignup){
        mostrarAlertaIndex("Você deve preencher todos os campos!", "warning", espacoAlertaSignupIndex);
        retorno = false;

    } else if(usuarioExistente){
        mostrarAlertaIndex("E-mail já cadastrado!", "warning", espacoAlertaSignupIndex);
        retorno = false;

    } else {
        mostrarAlertaIndex("Cadastro efetuado com sucesso!", "success", espacoAlertaSignupIndex);

    }

    return retorno;
};

function criarRegistroUsuario(){
    let dadosStorage : Usuario[] = JSON.parse(window.localStorage.getItem("usuarios") || "[]");
    let email = inputEmailSignup.value;
    let senha = inputSenhaSignup.value;

    let user: Usuario = {
        email,
        senha,
        recados: []
    }

    dadosStorage.push(user);
    
    window.localStorage.setItem("usuarios", JSON.stringify(dadosStorage));
}

function limparCamposLogin(){
    inputEmailLogin.value = "";
    inputSenhaLogin.value = "";
};