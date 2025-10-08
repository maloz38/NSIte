/** 
 * Classe qui gère dans les blocs ouvrant des pages session, la création du bloc qui permet d'afficher, supprimer et modifier les fichiers déposés par une personne loguée
 *
 * @class MethodeFetch
 * @typedef {MethodeFetch}
 */
class MethodeFetch{
    /**
 * Instance crée dans le fichier seance.js, lorsque l'on ouvre un tag - function ouverture() 
 *
 * @constructor
 * @param id (int) : Numéro du tag ouvert dans la page "seance"
 */
    constructor(id){  
        /**
         * numéro du tag ouvert
         * @type {int}
         */
        this.id = id;  
        /**
         * document.querySelector("#contenu_"+id)
         * @type {Object}
         */
        this.div = document.querySelector("#contenu_"+id)
        /**
         * document.querySelector("#contenu_"+id+" fieldset:last-child")d
         * @type {object}
         */
        this.last = document.querySelector("#contenu_"+id+" fieldset:last-child")
        /**
         * niveau "premiere" ou "terminale" de la page visualisée
         * @type {string}
         */
        this.niveau = document.querySelector("#niveau").value
        /**
         * objet <form> html : document.querySelector("#upload form")
         * @type {object}
         */
        this.formulaire = null 
        /**
         * objet <div> html : document.querySelector("#depots")
         * @type {object}
         */
        this.depots = null  // objet <div id="depots"> 

        /**
         * objet <div> html : document.querySelector("#reponseUpload")
         * @type {object}
         */
        this.reponse = null  // objet <div id="depots"> 
        /**
         * nombre de fichiers répertoriés dans <div id="depots">
         * @type {int}
         */
        this.nombreDepots = 0 
        /**
         * Informations sur les fichiers affichés
         * @type {(href :string ,nomFichier :string , code:boolean)[]}
         */
        this.idDepots = Array() // liste [ numéros de fichiers , true ou false ] répertoriés dans <div id="depots">
        /**
         * = false si bouton Modifier  a été activé
         * @type {boolean}
         */  
        this.modifPossible = true 
         /**
         * = nombre de div réponse écrit dans #reponseUpload après un transfert
         * @type {int}
         */  
         this.nombreDivReponse = 0 
    }   
    
    /**
     * Méthode exécutée dans le fichier "seance.js", lorsque l'on ouvre un tag --> function ouverture() 
     * Fait :   - requête "fetch" au serveur pour vérifier que l'utilisateur est logué et dans la page séance du bon niveau
     *          - reçoit en retour un json contenant le nom des fichiers liés au répertoire et au nom de famille de l'utilisateur
     *          - créer le bloc html "depots" dans le tag ouvert
     *          - créer les évènements liés à la suppression et à la modification des fichiers sur le serveur
     *          - gère le formulaire qui permet d'uploader les fichiers sur le serveur
     *  * @async
     * @returns {*}
     */
    async idConnexion(){   // 
            const requete = await fetch("../fetch/id.php",{ //requete contient le retour de l'exécution de id.php
                method:"POST",
                body: JSON.stringify({
                    "id":true,
                    "niveau":this.niveau,
                    "code":this.id
                }),
                headers:{
                    "Content-Type":"application/json"
                }   
            })
            const reponse = await requete.json() //l'array reponse contient la liste des noms de fichiers liés au tag ouvert et au nom de famille de la personne connectée
            console.log("retour du fichier id.php, $userManager->depot($code)",reponse)
            if ( reponse["identifiant"] != false){
                if (document.querySelector("#fieldsetUpload") != null){ //on supprime le bloc dépot s'il a déjà été rajouté dans l'html
                    document.querySelector("#fieldsetUpload").remove()
                }
                this.creationFieldset() //création de l'html du bloc
                this.depots = document.querySelector("#depots")
                this.nombreDepots = 0
                this.formulaire = document.querySelector("#upload form")
                this.reponse = document.querySelector("#reponseUpload")


                this.ecrireDansDepots(reponse) //ecriture de la liste des fichiers
                this.evenementDepots() //évènement sur les div de depots pour supprimer ou modifier le nom d'un fichier
                let self = this
                this.formulaire.addEventListener("submit", async (event)=>{
                    event.preventDefault()
                    const formData = new FormData(self.formulaire);
                    this.logoAttente()
                    const requete = await fetch("../fetch/upload.php",{
                        method:"POST",
                        body: formData
                    }) 
                    try {
                        const reponse = await requete.json()
                        console.log("retour du fichier upload.php,$loginManager->fichier($code) et $userManager->depot($code)",reponse)
                        this.ecrireDansReponseApresUpload(reponse) //ecriture sous formulaire si non transféré
                        this.ecrireDansDepotApresUpload(reponse) //ecriture liste fichier modifiée
                        self.formulaire.reset()
                    } catch (error) {
                        this.divReponseUpload("","Le formulaire est vide")
                        this.evenementsReponse()
                    }
                    document.querySelector(".container").style.display="none";
                })
            }
        }

    /**
     *Ecrit dans la partie "reponseUpload" sous le formulaire, les messages d'erreurs de l'upload
     * @param {[]} reponse :   Retour de la requête "fetch" dans le fichier "../fetch/upload.php"
     *                          $reponse[nomFichier] = True ou commentaire .....
     *                          $reponse["identifiant"] = $_SESSION["identifiant"];
     *                          $reponse["nom"] = $_SESSION["nom"];
     *                          $reponse["prenom"] = $_SESSION["prenom"];
     *                          $reponse["code"] = $code;
     *                          $reponse["niveau"] = $_SESSION["niveau"];
     *                          $reponse["transfert"] = array : $reponse["transfert"][nomFichier] = True ou commentaire .....
     * @returns {*}
     */
    ecrireDansReponseApresUpload(reponse){
        while (this.reponse.firstChild) {  // on supprime les enfants du bloc id "reponseUpload"
            this.reponse.removeChild(this.reponse.firstChild);
        }
        this.nombreDivReponse = 0
        for(let fichier in reponse["transfert"]){
            if (reponse["transfert"][fichier] != true) {
                this.divReponseUpload(fichier,reponse["transfert"][fichier])
            }
        }
        this.evenementsReponse()
    }

    divReponseUpload(fichier,texte){
        this.nombreDivReponse += 1
        let div = document.createElement("div")
       
        let span = document.createElement("span")
        span.innerText = fichier + " : "
        
        let p = document.createElement("p")
        p.innerText = texte
        let img = document.createElement("img")
        img.setAttribute("src","/public/images/icone_ferm2.png")
        div.append(img)
        if (fichier != ""){
            div.append(span)
        }else{
            p.style.fontSize = "1rem"
        }
        div.append(p)
        div.setAttribute("id","divReponseUpload_"+this.nombreDivReponse)
        this.reponse.append(div)
    }


    /**
    * Met à jour la liste des fichiers affichés dans le bloc "depots"
    *
     * @param {[]} reponse :   Retour de la requête "fetch" dans le fichier "../fetch/upload.php"
     *                          $reponse[nomFichier] = True ou commentaire .....
     *                          $reponse["identifiant"] = $_SESSION["identifiant"];
     *                          $reponse["nom"] = $_SESSION["nom"];
     *                          $reponse["prenom"] = $_SESSION["prenom"];
     *                          $reponse["code"] = $code;
     *                          $reponse["niveau"] = $_SESSION["niveau"];
     *                          $reponse["transfert"] = array : $reponse["transfert"][nomFichier] = True ou commentaire .....
     * @returns {*}
    */
    ecrireDansDepotApresUpload(reponse){
            while (this.depots.firstChild) {  // on supprime les enfants du bloc id depots
                this.depots.removeChild(this.depots.firstChild);
            }
            this.ecrireDansDepots(reponse)   
            this.evenementDepots()   
        }

    /**
     * Ecrit dans le bloc depots la liste des fichiers 
     *
     * @param {[]} reponse :   Retour de la requête "fetch" dans le fichier "../fetch/upload.php"
     *                          $reponse[nomFichier] = True ou commentaire .....
     *                          $reponse["identifiant"] = $_SESSION["identifiant"];
     *                          $reponse["nom"] = $_SESSION["nom"];
     *                          $reponse["prenom"] = $_SESSION["prenom"];
     *                          $reponse["code"] = $code;
     *                          $reponse["niveau"] = $_SESSION["niveau"];
     *                          $reponse["transfert"] = array : $reponse["transfert"][nomFichier] = True ou commentaire .....
     * @returns {*}
    */
    ecrireDansDepots(reponse){
            let nombre = reponse["nombre"]
            let nom = reponse["nom"]
            for (let i=1 ; i <= nombre ; i++){
                let nomFichier = reponse[i]
                let div = this.creationDivFichiers(nomFichier,nom)
                if (reponse["transfert"] != undefined){ //si un fichier a été transféré ..

                    if (reponse["transfert"][nomFichier] == true){
                        div.style.backgroundColor="rgba(0,255,0,0.5)"
                        setTimeout(()=>{
                            let n = 5
                            let intervalID = setInterval(()=>{
                                n -= 1
                                if (n > 0){
                                    let transparence = n/10
                                    div.style.backgroundColor = 'rgba(0,255,0,'+transparence+')'
                                }else{
                                    clearInterval(intervalID)
                                    div.style.backgroundColor="transparent"
                                }
                                }, 200 )
                        }, 3000)
                    }

                }
                this.depots.append(div)
            }
        }


    /**
     * Crée le formulaire html qui gère l'upload des fichiers
     *
     * @returns {eltHtml<form>} : formulaire html qui gère l'upload des fichiers
     */
    creationForm(){
        let form = document.createElement("form")
        form.append(this.creationInput('hidden','code','code','tp'+this.id,'',false))
        form.append(this.creationInput('file','','fichier[]','','40',true))
        form.append(this.creationInput('hidden','','MAX_FILE_SIZE','1000000','',false))
        form.append(this.creationInput('submit','','','Transférer','',false))
        
        let div = document.createElement("div")
        div.setAttribute("id","reponseUpload")
        form.append(div)

        return form
    }

    /**
     * ${Crée un élément html <input> avec ses attributs}
     *
     * @param {string} type : : valeur de l'attribut "type" de l'élément <input>
     * @param {string} id : valeur de l'attribut "id" de l'élément <input>
     * @param {string} name : valeur de l'attribut "name" de l'élément <input>
     * @param {string} value : valeur de l'attribut "value" de l'élément <input>
     * @param {string} size : valeur de l'attribut "size" de l'élément <input>
     * @param {bool} multiple : si true alors l'attribut "multiple" est mis sur l'élément <input>
     * @returns {eltHtml<input>}
     */
    creationInput(type,id,name,value,size,multiple){
        let input = document.createElement("input")
        input.setAttribute("type",type)
        input.setAttribute("id",id)
        input.setAttribute("name",name)
        input.setAttribute("value",value)
        input.setAttribute("size",size)
        if (multiple) {input.setAttribute("multiple","")}
        return input
    }

    /**
     * crée un élément html <div> qui contient les infos d'1 seul fichier détecté sur le serveur.
     *
     * @param {string} nomFichier 
     * @param {string} nom de famille de l'utilisateur logué
     * @returns {eltHtml<div>}
     */
    creationDivFichiers(nomFichier,nom){
        let div = document.createElement("div")
        let divImg = document.createElement("div")
        let divH = document.createElement("div")
        let divB = document.createElement("div")

        let a = document.createElement("a")
        let img = document.createElement("img")
        let src = this.srcImage(nomFichier)
        img.setAttribute("src",src)
        this.nombreDepots += 1  
        let id = "fichierUpload_"+ this.nombreDepots
        img.setAttribute("id",id)
        let href = '/public/zone_transfert/'+this.niveau+'/tp'+this.id+'/'+'tp'+this.id+'_'+nom+"_"+nomFichier
        this.idDepots[this.nombreDepots] = [href ,nomFichier ,true]
        a.setAttribute("href",href)
        a.setAttribute("target","_blank")
        id = "lienUpload_"+ this.nombreDepots
        a.setAttribute("id",id)
        a.setAttribute("download",nomFichier)
        a.append(nomFichier)     
        divImg.append(img)       
        div.append(divImg)
        id = "hUpload_"+ this.nombreDepots
        divH.setAttribute("id",id)
        divH.setAttribute("class","hUpload")
        let spanH = document.createElement('span')  
        spanH.textContent = "Supprimer"
        divH.append(spanH)
        divImg.append(divH)
        id = "bUpload_"+ this.nombreDepots
        divB.setAttribute("id",id)
        divB.setAttribute("class","bUpload")
        let spanB= document.createElement('span')  
        spanB.textContent = "Modifier"
        divB.append(spanB)
        divImg.append(divB)

        let divA = document.createElement("div")
        id = "divLienUpload_"+ this.nombreDepots
        divA.setAttribute("id",id)
        divA.append(a)


        //div.append(a)
        div.append(divA)
        id = "divUpload_"+ this.nombreDepots
        div.setAttribute("id",id)
        div.setAttribute("class","divUpload")
        return div
    }

    /**
     * Permet de retourner le "src" de l'image icone liée au fichier
     *
     * @param {string} nomFichier
     * @returns {string} : chemin de l'image utilisé pour visualiser le type de fichier
     */
    srcImage(nomFichier){
        let extension = nomFichier.split('.').pop()
        let src
        const im = ['png','PNG','jpg','JPG','svg','gif','jpeg','tiff','bmp','tif','pcd',"fpx","jpx","jp2","JPG","JPEG"]
        const txt = ["docx","odt","doc","pdf","txt","rtf","odg"]
        const donnee = ["zip","ZIP","RAR"]
        const vid = ["mp4","webm"]
        const web = ["html","css","db","sql","js","otf"]
        const pyt = ["py"]
        const fil = ["fls"]
        const musique = ["mp3","wav"]
        if (im.includes(extension)){src = "/public/images/depotsIm.png";}
        else if (txt.includes(extension)){src = "/public/images/depotsTxt.png";}
        else if (donnee.includes(extension)){src = "/public/images/depotsZip.png";}
        else if (vid.includes(extension)){src = "/public/images/depotsVid.png";}
        else if (web.includes(extension)){src = "/public/images/depotsWeb.png";}
        else if (pyt.includes(extension)){src = "/public/images/depotsPyt.png";}
        else if (fil.includes(extension)){src = "/public/images/depotsFil.png";}
        else if (musique.includes(extension)){src = "/public/images/depotsMus.png";}
        else {src = "/public/images/depotsAutres.png";}
        return src
    }


    /**
     * $Permet de créer le <div> du bloc depots
     *
     * @returns {eltHtml<div>}
     */
    creationDivDepots(){
        let div = document.createElement("div")
        div.setAttribute("id","depots")
        return div
    }

    
    /**
     * Permet de créer l'élément html <fieldset> qui correspond au bloc depot
     */
    creationFieldset(){
        let fieldset = document.createElement("fieldset");
        fieldset.setAttribute("id","fieldsetUpload") 

        let legend = document.createElement("legend");
        legend.innerText = "Mes dépots";
        fieldset.append(legend);

        let div = document.createElement("div")
        div.setAttribute("id","upload") 

        div.append(this.creationForm())
        div.append(this.creationDivDepots())
        
        fieldset.append(div);

        this.div.insertBefore(fieldset,this.last)
    }

    /**
     * Permet de créer les évènements de suppression et de modification nom pour toute la liste de fichiers 
     */
    evenementDepots(){
        for (let i = 1 ; i <= this.nombreDepots ; i++){
            if (document.querySelector("#hUpload_"+i)!=null){
                document.querySelector("#hUpload_"+i).addEventListener("click",(event)=>{
                    let href = this.idDepots[i][0] 
                    let nomFichier = this.idDepots[i][1]
                    let evenement = this.idDepots[i][2]
                    if (evenement && this.modifPossible){
                        this.confirmSupprimeFichier(nomFichier,i)
                    }
                })
            }

            if (document.querySelector("#bUpload_"+i)!=null){
                document.querySelector("#bUpload_"+i).addEventListener("click",(event)=>{
                    let href = this.idDepots[i][0] 
                    let nomFichier = this.idDepots[i][1]
                    let evenement = this.modifPossible
                    if (evenement){
                        this.modifNom(href,nomFichier,i)

                    }
                })
            }

        }
    }



    /**
     * Permet de créer les évènement qui suppriment les divs écrits dans #réponseUpload en cliquant sur la croix qui est dans le div
     *
     * @returns {*}
     */
    evenementsReponse(){
        if (this.nombreDivReponse > 0){
            for (let i=1 ; i <=this.nombreDivReponse ; i++ ){
                document.querySelector("#divReponseUpload_"+i+" img").addEventListener("click",(event)=>{
                    //console.log("debut","this.nombreDivReponse",this.nombreDivReponse,"remove","#divReponseUpload_"+i )
                    //document.querySelector("#divReponseUpload_"+i).remove()
                    document.querySelector("#divReponseUpload_"+i).style.display="none"
                    //this.nombreDivReponse -= 1
                    //console.log("fin","this.nombreDivReponse",this.nombreDivReponse,"remove","#divReponseUpload_"+i )
                })
            }

        }
    }

    /**
     * Permet de supprimer un fichier sur le serveur en utilisant la méthode "fetch"
     * L'array renvoyé par "../fetch/supprime.php" est nommé reponse : 
     * $reponse["identifiant"] = $_SESSION["identifiant"];
     * $reponse["fichier"] = $file;
     * $reponse["resultat"] = bool 
     *
     * @async
     * @param {string} href : chemin du fichier à supprimer sur le serveur
     * @param {string} nomFichier : nom du fichier à supprimer
     * @param {int} i : numéro du bloc <div> lié au fichier
     * @returns {*}
     */
    async supprime(nomFichier,i){
        const requete = await fetch("../fetch/supprime.php",{
            method:"POST",
            body: JSON.stringify({
                "id":true,
                "niveau":this.niveau,
                "code":this.id,
                "nomFichier":nomFichier
            }),
            headers:{
                "Content-Type":"application/json"
            }   
          })
          const reponse = await requete.json()

          if (reponse["resultat"]){
            document.querySelector("#divOuiNon").remove()
            this.animSuppression(i)
            this.supprimeLien(i)
            this.idDepots[i][2] = false
            this.modifPossible = true                        
            document.querySelector("#hUpload_"+i).style.display = "none"
            document.querySelector("#bUpload_"+i).style.display = "none"               
          }else{
            document.querySelector("#divOuiNon").remove()
            this.ecrireDansReponseApres(nomFichier," supprimé")
            this.modifPossible = true                        

          }
          console.log("retour du fichier supprime.php, $userManager->supprimerFichier($file) ",reponse)
        
    }

    /**
     * Modifie le nom du fichier
     *
     * @async
     * @param {string} href : chemin sur le serveur du fichier
     * @param {string} nomFichier : nom du fichier
     * @param {int} i : numéro du bloc <div> de ce fichier
     * @returns {*}
     */
    modifNom(href,nomFichier,i){
        let extension = this.ajoutInput(i,nomFichier)
        this.modifPossible = false

        document.querySelector("#non").addEventListener("click",()=>{
            document.querySelector("#inputModifier").remove()
            document.querySelector("#lienUpload_"+i).style.display="block"
            this.modifPossible = true
        })

        document.querySelector("#oui").addEventListener("click",()=>{
            this.modifNomServeur(href,nomFichier,i,extension)
        })
        
    }

    /**
     * Pour confirmer la suppression du fichier
     *
     * @async
     * @param {string} href : chemin sur le serveur du fichier
     * @param {string} nomFichier : nom du fichier
     * @param {int} i : numéro du bloc <div> de ce fichier
     * @returns {*}
     */
    confirmSupprimeFichier(nomFichier,i){
        this.InsererdivOuiNon(i)
        this.modifPossible = false

        document.querySelector("#non").addEventListener("click",()=>{
            document.querySelector("#divOuiNon").remove()
            this.modifPossible = true
        })

        document.querySelector("#oui").addEventListener("click",()=>{
            this.supprime(nomFichier,i)
        })
        
    }
    





    /**
     * Permet de faire une requête fetch sur le serveur pour modifier le nom d'un fichier 
     * L'array renvoyé par "../fetch/modifNom.php" est nommé reponse : 
     * $reponse["identifiant"] = $_SESSION["identifiant"];
     * $reponse["fichier"] = $file;
     * $reponse["resultat"] = bool 
     *
     * @async
     * @param {string} href : chemin du fichier sur le serveur, avec l'ancien nom
     * @param {string} nomFichier : ancien nom du fichier à supprimer
     * @param {int} i : numéro du bloc <div> lié au fichier
     * @param {string} extension : extension du fichier 
     * @returns {*}
     */
    async modifNomServeur(href,nomFichier,i,extension){

        let nouveauNomFichier = document.querySelector("#inputModif").value
        nouveauNomFichier = nouveauNomFichier.replace("/","")
        nouveauNomFichier = nouveauNomFichier+"."+extension       

        const requete = await fetch("../fetch/modifNom.php",{
            method:"POST",
            body: JSON.stringify({
                "id":true,
                "niveau":this.niveau,
                "code":this.id,
                "nomFichier":nomFichier,
                "nouveauNomFichier":nouveauNomFichier
            }),
            headers:{
                "Content-Type":"application/json"
            }   
          })
          const reponse = await requete.json()
          console.log("retour du fichier modifNom.php, $userManager->modifNomFichier($cheminFichier,$nouveauNomFichier,$code);",reponse)
          
          if (reponse["resultat"]){
            document.querySelector("#inputModifier").remove()
            this.modifLien(nomFichier,nouveauNomFichier,i)
            this.modifPossible = true                        
          }else{
            document.querySelector("#inputModifier").remove()
            this.ecrireDansReponseApres(nomFichier," modifié")
            this.modifPossible = true                       
            document.querySelector("#lienUpload_"+i).style.display = 'block'

          }
            
    }

    /**
     * Actualise le lien <a> et le réaffiche dans le div
     * 
     * @param {string} nomFichier : ancien nom du fichier 
     * @param {string} nouveauNomFichier : nouveau nom du fichier 
     * @param {int} i : numéro du bloc <div> du fichier
     */
    modifLien(nomFichier,nouveauNomFichier,i){
        let a = document.querySelector("#lienUpload_"+i)

        let href = a.getAttribute("href")
        href = href.replace(nomFichier,nouveauNomFichier)
        a.setAttribute("href",href)

        let download = a.getAttribute("download")
        download = download.replace(nomFichier,nouveauNomFichier)
        a.setAttribute("download", download)   

        a.innerText = nouveauNomFichier

        this.idDepots[i] = [href ,nouveauNomFichier ,true]

        a.style.color = 'rgba(48, 46, 46, 0)'
        a.style.display = 'block'

        let n = 0
        let intervalID = setInterval(()=>{
            n += 1
            if (n < 10){
                let transparence = n/10
                a.style.color = 'rgba(48, 46, 46,'+transparence+')'
            }else{
                clearInterval(intervalID)
            }
            }, 100 )

    }




    /**
     * Remplace le lien <a> de ce fichier par un champ <input>
     *
     * @param {int} i : numéro du bloc <div> du fichier
     * @param {string} nomFichier : nom du fichier
     */
    ajoutInput(i,nomFichier){
        document.querySelector("#lienUpload_"+i).style.display="none"

        let tab = nomFichier.split(".")
        let extension = tab.pop()
        let nom = tab.join('')
        let div1 = document.createElement("div")
        div1.append(this.creationInput('text','inputModif','',nom,'',false))
        let span = document.createElement('span')
        span.textContent = "."+extension
        div1.append(span)

        let div2 = document.createElement("div")
        let img1 = document.createElement("img")
        let src = "/public/images/oui.png"
        let id = "oui"
        let title = "Valider"
        img1.setAttribute("src",src)
        img1.setAttribute("id",id)
        img1.setAttribute("title",title)
        div2.append(img1)
        let img2 = document.createElement("img")
        src = "/public/images/non.png"
        id = "non"
        title = "Annuler"
        img2.setAttribute("src",src)
        img2.setAttribute("id",id)
        img2.setAttribute("title",title)
        div2.append(img2)

        let div = document.createElement("div")
        div.append(div1)
        div.append(div2)
        id = "inputModifier"
        div.setAttribute("id",id)

        document.querySelector("#divUpload_"+i).append(div)
        return extension

    }


    /**
     * Créer une animation pour remplacer l'icone du fichier par une croix
     *
     * @param {int} i : numéro du bloc <div> du fichier à supprimer
     */
    animSuppression(i){
        let width = 40
        let intervalID = setInterval(()=>{
                width -= 5
                if (width >= 0){
                    document.querySelector("#fichierUpload_"+i).style.width = width+"px"
                    document.querySelector("#fichierUpload_"+i).style.height = width+"px"
                    document.querySelector("#fichierUpload_"+i).style.margin = Math.floor((40-width)/2)+"px"
                }else{
                    clearInterval(intervalID)
                    intervalID = setInterval(()=>{
                        width += 5
                        if (width > 40){
                            clearInterval(intervalID)
                        }else{
                            document.querySelector("#fichierUpload_"+i).setAttribute("src","/public/images/icone_ferm2.png")
                            document.querySelector("#fichierUpload_"+i).style.width = width+"px"
                            document.querySelector("#fichierUpload_"+i).style.height = width+"px"
                            document.querySelector("#fichierUpload_"+i).style.margin = Math.floor((40-width)/2)+"px"
                        }
                    }, 50 )
                }
            }, 50 )
        document.querySelector("#fichierUpload_"+i).addEventListener("click",(event)=>{
            let coef = 1
            let intervalID = setInterval(()=>{
                    coef -= 0.1
                    if (coef >= 0){
                        document.querySelector("#divUpload_"+i).style.transform = "scale("+coef+")"
                    }else{
                        clearInterval(intervalID)
                        document.querySelector("#divUpload_"+i).style.display="none"
                    }
                }, 50 )
        })
        
    }

    /**
     * $Crée une animation pour remplacer l'element <a> par un élément <p>
     *
     * @param {*} i
     */
    supprimeLien(i){
        let nomFichier = document.querySelector("#lienUpload_"+i).textContent
        let div = document.querySelector("#lienUpload_"+i).parentNode
        let n = 10
        let intervalID = setInterval(()=>{
            n -= 1
            if (n > 0){
                let transparence = n/10
                document.querySelector("#lienUpload_"+i).style.color = 'rgba(48, 46, 46,'+transparence+')'
            }else{
                clearInterval(intervalID)
                document.querySelector("#lienUpload_"+i).remove()
                let p = document.createElement("p")
                p.textContent = nomFichier
                p.style.color = 'rgba(48, 46, 46,0)'
                p.style.textDecoration = "line-through" 
                p.style.wordBreak = "break-all"
                div.append(p)
                intervalID = setInterval(()=>{
                    n += 1
                    if (n <= 10){
                        let transparence = n/10
                        p.style.color = 'rgba(48, 46, 46,'+transparence+')'
                    }else{
                        clearInterval(intervalID)        
                    }
                }, 50 )

            }
        }, 50 )
    }

    /**
     * Ecrit les messages d'erreurs si la suppression ou la modification d'un fichier n'a pas pu avoir lieu
     *
     * @param {string} nomFichier : nom du fichier supprimé
     */
    ecrireDansReponseApres(nomFichier,texte){
        while (this.reponse.firstChild) {  // on supprime les enfants du bloc id "reponseUpload"
            this.reponse.removeChild(this.reponse.firstChild);
        }
        this.nombreDivReponse = 0      
        this.divReponseUpload(nomFichier," n'a pas été "+texte)
        this.evenementsReponse()

    }

    /**
     * Permet de lancer l'animation de .container
     *
     * 
     */
    logoAttente(){
        let bou = this.formulaire;
        //let bou = document.querySelector("#upload form")
        let x_bou = bou.offsetLeft; 
        let y_bou = bou.offsetTop;
        let l_bou = bou.offsetWidth;
        let h_bou = bou.offsetHeight;
        let L = document.querySelector("#contenu_"+this.id).offsetLeft
        let H = document.querySelector("#contenu_"+this.id).offsetTop
        
        let bou2 = document.querySelector("#fieldsetUpload")
        y_bou += bou2.offsetTop;

        let container_left = Math.trunc(L + x_bou + (l_bou - 30)/2).toString()+"px";
        let container_top = Math.trunc(H + y_bou + (h_bou - 30)/2).toString()+"px";
        console.log(L,H,x_bou,y_bou,l_bou,h_bou,container_left , container_top)

        document.querySelector(".container").style.display="block";
        document.querySelector(".container").style.left= container_left;
        document.querySelector(".container").style.top= container_top ;
    }


InsererdivOuiNon(i) {   
    let div2 = document.createElement("div")
    let img1 = document.createElement("img")
    let src = "/public/images/oui.png"
    let id = "oui"
    let title = "Valider"
    img1.setAttribute("src",src)
    img1.setAttribute("id",id)
    img1.setAttribute("title",title)
    div2.append(img1)
    let img2 = document.createElement("img")
    src = "/public/images/non.png"
    id = "non"
    title = "Annuler"
    img2.setAttribute("src",src)
    img2.setAttribute("id",id)
    img2.setAttribute("title",title)
    div2.append(img2)
    id="divOuiNon"
    div2.setAttribute("id",id)
    document.querySelector("#divLienUpload_"+i).append(div2)
}







}





