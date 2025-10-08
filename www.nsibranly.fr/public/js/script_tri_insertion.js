

const liste1 = document.getElementById("liste1");
const transit1 = document.getElementById("transit1");
const nombrestransit1 = transit1.getElementsByTagName('td');
const nombres1 = liste1.getElementsByTagName('td');
const cardinal1 = nombres1.length;
var couleur1 = "#f8ede0";
let indice_tete_noire = 0;  
let valeur_tete_noire = parseInt(nombres1[indice_tete_noire].textContent);
let indice_d_insertion = 0;
let longueurRouge = 0;

for(let td of nombres1) {
    // place des entiers au hasard dans les td de l'élément id="nombres"
    // passe en noir les fonds (noir  = couleur de la partie non traitée)
    td.style.backgroundColor = "black";
    td.style.color = couleur1;
    td.textContent = 100 + Math.floor(Math.random() * 900);
}

for(let i = 0; i < cardinal1; i++) {
    nombrestransit1[i].style.backgroundColor = couleur1;
    nombrestransit1[i].style.color = couleur1;
    nombrestransit1[i].textContent =  "xxx";
}



function mettreEnRouge1(){
    //mise en rouge d'un élément pour le placer dans la partie traitée
    nombres1[indice_tete_noire].style.backgroundColor = 'red';
    nombres1[indice_tete_noire].style.color = couleur1;
    indice_tete_noire += 1;
    valeur_tete_noire = parseInt(nombres1[indice_tete_noire].textContent);
    longueurRouge += 1;
}



function elever1() {
    // le nombre de la cellule indice_tete_noire est monté dans la ligne supérieure
    // pour le mémoriser 
    nombrestransit1[indice_tete_noire].style.backgroundColor = "black";
    nombrestransit1[indice_tete_noire].style.color = couleur1;
    nombrestransit1[indice_tete_noire].textContent = nombres1[indice_tete_noire].textContent;
    nombres1[indice_tete_noire].style.backgroundColor = couleur1;
    nombres1[indice_tete_noire].style.color = couleur1;
}

function decaler1(){
    let i = 0;
    while (parseInt(nombres1[i].textContent) <  valeur_tete_noire && i < longueurRouge) 
    {
        i += 1;
    }
    nombres1[indice_tete_noire].style.color = "red";
    for(let k = indice_tete_noire; k > i; k -= 1)
    {
        nombres1[k].textContent = nombres1[k-1].textContent;
    }
    nombres1[i].style.color = couleur1;
    nombres1[i].style.backgroundColor = couleur1;
    return i;
}


function placerTeteNoire1(indice){
    nombrestransit1[indice_tete_noire].style.backgroundColor = couleur1;
    nombrestransit1[indice_tete_noire].style.color = couleur1;
    nombrestransit1[indice_tete_noire].textContent = "xxx";
    nombres1[indice].textContent = valeur_tete_noire;
    nombres1[indice].style.color = couleur1;
    nombres1[indice].style.backgroundColor = "red";
    mettreEnRouge1();
}



function message1(){
    let decrit = '';
    switch(etape)
    {
        case "demarrenoir" :
            decrit = "La liste est initialement entièrement noire.";
        break;
        case "Initialiser liste rouge." :
            decrit = "On passe la tête noire en rouge.";
        break;
        case "Traiter tête noire." :
            decrit = "On mémorise la tête noire.";
        break;
        case "Décalage." :
            decrit = "Les éléments rouges supérieurs à la tête noire.";
            decrit += "<br>";
            decrit += "montent d'un rang.";
        break;
        case "Insertion." :
            decrit = "La tête noire est insérée à sa place définitive.";
        break;
        case "suivant" :
            decrit = "On mémorise la tête noire.";
        break;
        case "Fini." :
            decrit = "Terminé.";
        break;
    }
    document.getElementById("descriptif1").innerHTML = decrit;

}



function uneEtape1(){
    switch(etape)
    {
      case "demarrenoir" :
            message1();
            etape = "Initialiser liste rouge.";
        break;
        case "Initialiser liste rouge." :
            message1();
            mettreEnRouge1();
            etape = "Traiter tête noire.";
        break;
        case "Traiter tête noire." :
            message1();
            elever1();
            etape = "Décalage.";
        break;
        case "Décalage." :
            message1();
            indice_d_insertion = decaler1();
            etape = "Insertion.";
        break;
        case "Insertion." :
            if ( indice_tete_noire >  cardinal1-1)
            {
                etape = "Fini.";
                message1();
            }
            else
            {
                message1();
                placerTeteNoire1(indice_d_insertion);
                etape = "suivant";
            }
        break;
        case "suivant":
                elever1();
                message1();
                etape = "Décalage.";
        break;
    }

}

let lancement1;

function relance1(){
    clearInterval(lancement1);
    lancement1 = setInterval(uneEtape1 , parseInt(document.getElementById("intervalletemps").value) );
}


document.getElementById("etapeManuelle1").addEventListener('click', uneEtape1, false); 
document.getElementById("automatique1").addEventListener('click', 
function(){lancement1 = setInterval(uneEtape1 , 3000);}, false); 
document.getElementById("intervalletemps1").addEventListener('change', relance1, false); 

