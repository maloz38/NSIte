const vert = "rgb(200,255,102)";
const rouge="#feebeb";
if (document.querySelector("#nouveau_pass_1") != null){
    document.querySelector("#nouveau_pass_1").value = "";
}
if (document.querySelector("#nouveau_pass_2") != null){
    document.querySelector("#nouveau_pass_2").value = "";
}
if (document.querySelector("#ancien_pass") != null){
    document.querySelector("#ancien_pass").value = "";
}

if (document.querySelector("#oeil")!=null){
    let oeil = document.querySelector("#oeil");
    oeil.addEventListener("click",(event)=>{
        console.log(event.target);
        let fichier = oeil.getAttribute("src");
        if (fichier == "/public/images/eye.svg"){
            document.querySelector("#pass_saisi").setAttribute("type","text");
            oeil.setAttribute("src","/public/images/eye-off.svg");
            oeil.setAttribute("class","oeil c1");
            document.querySelector("#pass_saisi").setAttribute("placeholder","Saisie visible");
        }else{
            document.querySelector("#pass_saisi").setAttribute("type","password");
            oeil.setAttribute("src","/public/images/eye.svg");
            oeil.setAttribute("class","oeil c2");
            document.querySelector("#pass_saisi").setAttribute("placeholder","Mot de passe");
        }
    })
}

if (document.querySelector("#oeilIma")!=null){
    let o1 = document.querySelector("#oeilIma");
    o1.addEventListener("click",(event)=>{
        console.log(event)
        let fichier = o1.getAttribute("src");
        if (fichier == "/public/images/eye.svg"){
            document.querySelector("#nouveau_pass_1").setAttribute("type","text");
            o1.setAttribute("src","/public/images/eye-off.svg");
            o1.setAttribute("class","oeil c1");
            document.querySelector("#nouveau_pass_1").setAttribute("placeholder","Saisie visible");
        }else{
            document.querySelector("#nouveau_pass_1").setAttribute("type","password");
            o1.setAttribute("src","/public/images/eye.svg");
            o1.setAttribute("class","oeil c2");
            document.querySelector("#nouveau_pass_1").setAttribute("placeholder","Mot de passe");
        }
    })
}

if (document.querySelector("#oeilImb")!=null){
    let o2 = document.querySelector("#oeilImb");
    o2.addEventListener("click",(event)=>{
        let fichier = o2.getAttribute("src");
        if (fichier == "/public/images/eye.svg"){
            document.querySelector("#nouveau_pass_2").setAttribute("type","text");
            o2.setAttribute("src","/public/images/eye-off.svg");
            o2.setAttribute("class","oeil c1");
            document.querySelector("#nouveau_pass_2").setAttribute("placeholder","Saisie visible");
        }else{
            document.querySelector("#nouveau_pass_2").setAttribute("type","password");
            o2.setAttribute("src","/public/images/eye.svg");
            o2.setAttribute("class","oeil c2");
            document.querySelector("#nouveau_pass_2").setAttribute("placeholder","Mot de passe");
        }
    })
}


function barre(strength,strengthBar){
    switch (strength) {
        case 0:
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = '#ccc';
        break;
        case 1:
        strengthBar.style.width = '20%';
        strengthBar.style.backgroundColor = '#ff4d4d';
        break;
        case 2:
        strengthBar.style.width = '40%';
        strengthBar.style.backgroundColor = '#ff944d';
        break;
        case 3:
        strengthBar.style.width = '60%';
        strengthBar.style.backgroundColor = '#ffcc00';
        break;
        case 4:
        strengthBar.style.width = '80%';
        strengthBar.style.backgroundColor = '#ccff33';
        break;
        case 5:
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = '#66ff33';
        break;
    }
}


function checkIdentifiantStrength(idInput,idBarre) {
    let strengthBar = document.getElementById(idBarre);
    let password = document.getElementById(idInput).value;
    let strength = 0;
    if (password.length > 4) {strength = 5;}
    else if (password.length > 3)  {strength = 4;}
    else if (password.length > 2)  {strength = 3;}
    else if (password.length > 1)  {strength = 2;}
    else if (password.length > 0)  {strength = 1;}
    barre(strength,strengthBar)
    if (strength == 5){
        document.getElementById(idInput).style.backgroundColor = "rgb(200,255,102)";
        document.getElementById(idInput).style.color = "#f00";
    }else{
        document.getElementById(idInput).style.backgroundColor = "transparent";
        document.getElementById(idInput).style.color = "#feebeb";
    }
    valide()
}



function checkPasswordStrength(idInput,idBarre) {
    var strengthBar = document.getElementById(idBarre);
    var password = document.getElementById(idInput).value;
    var strength = 0;
    if (password.length > 7) {
        strength += 1;
        document.querySelector("#passLongueur").style.color=vert;
    }else{
        document.querySelector("#passLongueur").style.color=rouge;
    }
    if (password.match(/[a-z]+/)) {
        strength += 1;
        document.querySelector("#passMinuscule").style.color=vert;
    }else{
        document.querySelector("#passMinuscule").style.color=rouge;
    }
    if (password.match(/[A-Z]+/)){
        strength += 1;
        document.querySelector("#passMajuscule").style.color=vert;
    }else{
        document.querySelector("#passMajuscule").style.color=rouge;
    }
    if (password.match(/[0-9]+/)) {
        strength += 1;
        document.querySelector("#passChiffre").style.color=vert;
    }else{
        document.querySelector("#passChiffre").style.color=rouge;
    }
    if (password.match(/[$@#&!_]+/)) {
        strength += 1;
        document.querySelector("#pasSpecial").style.color=vert;
    }else{
        document.querySelector("#pasSpecial").style.color=rouge;
    }
    barre(strength,strengthBar)
    if (strength == 5){
        document.getElementById(idInput).style.backgroundColor = "rgb(200,255,102)";
        document.getElementById(idInput).style.color = "#f00";
    }else{
        document.getElementById(idInput).style.backgroundColor = "transparent";
        document.getElementById(idInput).style.color = "#feebeb";
    }
    valide()
}

function checkSamePasswords(idInput1,idInput2,idBarre){
    var strengthBar = document.getElementById(idBarre);
    var password1 = document.getElementById(idInput1).value;
    var password2 = document.getElementById(idInput2).value;
    var strength = 0;
    if (password2 == password1 ){
        strength = 5;
    }
    barre(strength,strengthBar)
    if (strength == 5){
        document.getElementById(idInput2).style.backgroundColor = "rgb(200,255,102)";
        document.getElementById(idInput2).style.color = "#f00";
    }else{
        document.getElementById(idInput2).style.backgroundColor = "transparent";
        document.getElementById(idInput2).style.color = "#feebeb";
    }
    valide()
}


function checkEmail(idInput,idBarre){
    let strengthBar = document.getElementById(idBarre);
    let email = document.getElementById(idInput).value;
    let strength = 0;
    let validRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
    if (email.match(validRegex)) {strength = 5;
    } else {strength = 0;}
    barre(strength,strengthBar)
    if (strength == 5){
        document.getElementById(idInput).style.backgroundColor = "rgb(200,255,150)";
        document.getElementById(idInput).style.color = "#ff0000";
    }else{
        document.getElementById(idInput).style.backgroundColor = "transparent";
        document.getElementById(idInput).style.color = "#feebeb";
    }
    valide()
}

function checkNonNull(idInput,idBarre){
    var strengthBar = document.getElementById(idBarre);
    var nom = document.getElementById(idInput).value;
    var strength = 5;
    if (nom.length == 0) strength = 0;
    if (nom.match(/[0-9]+/)) strength = 0;
    if (nom.match(/[$@#&!_]+/)) strength = 0;
    barre(strength,strengthBar)
    if (strength == 5){
        document.getElementById(idInput).style.backgroundColor = "rgb(200,255,102)";
        document.getElementById(idInput).style.color = "#f00";
    }else{
        document.getElementById(idInput).style.backgroundColor = "transparent";
        document.getElementById(idInput).style.color = "#feebeb";
    }
    valide()
}

function valide(){
    const boutonInscription = document.querySelector("#boutonInscription");
    let tabClass = document.querySelectorAll(".password-strength")
    let nb = 0
    for (let i = 0 ; i < tabClass.length ; i++){
        if (tabClass[i].style.width == "100%"){nb +=1}
    }
    if (nb == 2) {

        boutonInscription.setAttribute("type","submit");
        document.querySelector("#labelBoutonInscription").textContent="Formulaire complet. Bouton d'envoi à valider"
    }else{

        boutonInscription.setAttribute("type","");
        document.querySelector("#labelBoutonInscription").textContent="Formulaire incomplet. Bouton d'envoi non valide"

    }
}
