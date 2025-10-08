//Gestion ouverture dossier ***************************************************************
let fichiers = document.querySelector("#Ouvfichiers");
let icone =  document.querySelector("#iconeOuv");
fichiers.style.height = "0px";
let N = 20;
icone.addEventListener("click",()=>{
    let H = fichiers.scrollHeight + 50;
    let im = icone.getAttribute("src");
    if (im == "/public/images/icone_ouv.png"){
        for (let i =0 ; i<=N ; i++){
            setTimeout(()=>{
                fichiers.style.height = (i*H/N)+"px";
            },i*30);
        }   
        icone.setAttribute("src","/public/images/icone_ferm.png")
    }else{
        for (let i =0 ; i<=N ; i++){
            setTimeout(()=>{
                fichiers.style.height = (H-i*H/N)+"px";
            },i*30);
        }   
        icone.setAttribute("src","/public/images/icone_ouv.png");
       
    }
})

//Gestion Affichage fichiers webs du membre si connecté
let objFetchRacine = new MethodeFetchWeb("Racine")
objFetchRacine.idConnexion()
let objFetchImages = new MethodeFetchWeb("Images")
objFetchImages.idConnexion()
let objFetchCss = new MethodeFetchWeb("Css")
objFetchCss.idConnexion()
let objFetchJs = new MethodeFetchWeb("Js")
objFetchJs.idConnexion()
let objFetchAutres = new MethodeFetchWeb("Autres")
objFetchAutres.idConnexion()

