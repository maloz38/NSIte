// Gestion des blocs ouvrants
const couleurTexte = "#fff"
const couleurFond = "#302e2e"
function couleurTuile(i,couleur,fond){
    document.querySelector("#theme_"+i+" p").style.color = couleur;
    document.querySelector("#theme_"+i+" p").style.backgroundColor = fond;
}

function ouverture(i){
    let h_a = document.querySelector("#theme_"+i).offsetTop;
    let h_b = document.querySelector("#theme_"+i).offsetHeight;
    let h = parseInt(h_a + h_b/2);
    let width = window.innerWidth;
    let l = 0;
    if (width < 900){
        l = parseInt(0.025 * width);
    }
    document.querySelector("#contenu_"+i).style.top = h.toString()+"px";
    document.querySelector("#contenu_"+i).style.left = l.toString()+"px";
    document.querySelector("#contenu_"+i).style.display="block" ;
    couleurTuile(i,couleurFond,couleurTexte);
    let objFetch = new MethodeFetch(i)
    objFetch.idConnexion()
}

var id_selection = null; // contient l'objet bouton ou icone qui a été cliqué en dernier 


if (document.querySelector("#nombre_tags")!=null){
let N = document.querySelector("#nombre_tags").value;  // nombre de tuiles
    if (N != null){
        if (document.querySelector("#ouverture")!=null){
            let num_tag =  document.querySelector("#ouverture").value;
            if (num_tag > 0 && num_tag <= N){
                ouverture(num_tag);
                id_selection = num_tag;
            }
        }
        for (let i = 1 ; i <= N ; i++){
            let theme = document.querySelector("#theme_"+i);
            let contenu = document.querySelector("#contenu_"+i);
            let icone_fermeture = document.querySelector("#icone_fermeture_"+i);
            theme.addEventListener("click" , function(){
                if (id_selection == i){
                    contenu.style.display="none" ;
                    couleurTuile(i,couleurTexte,couleurFond);
                    id_selection = null;
                    stopIframeYt();
                }else{
                    ouverture(i);
                    if (id_selection != null && id_selection !=i){
                        document.querySelector("#contenu_"+id_selection).style.display="none" ;
                        couleurTuile(id_selection,couleurTexte,couleurFond);
                        stopIframeYt();
                    }
                    id_selection = i;

                }            
            });
        
            icone_fermeture.addEventListener("click" , function(){
                    contenu.style.display="none" ;
                    couleurTuile(i,couleurTexte,couleurFond);
                    id_selection = null;
                    stopIframeYt();
            });  

            theme.addEventListener("mouseover",function(){
                couleurTuile(i,couleurFond,couleurTexte);
            })
            theme.addEventListener("mouseout",function(){
                if (contenu.style.display != "block"){
                    couleurTuile(i,couleurTexte,couleurFond);
                }
            })

        }                                                                              
    }
};

//gestion de annuler sur le bloc de suppression
id_bouton_annuler = null;
if (document.querySelector("#bouton_non") !=null){
    document.querySelector("#bouton_non").addEventListener("click",function(){
        document.querySelector(".confirmation_suppression").style.display="none";
        document.querySelector("#idSupprime").value = "";
        id_bouton_annuler.style.backgroundColor ="rgba(255,255,255,0.3)";
        id_bouton_annuler = null;
    })
} 

if (document.querySelector("#nombre_tags")!=null){
    let N = document.querySelector("#nombre_tags").value;  // nombre de tuiles
    let niveau = document.querySelector("#niveau").value;
    if (N != null){
        for (let i = 1 ; i <= N ; i++){
            if (document.querySelector("#nb_depots_tp"+i)!=null){
                let nb_depots = document.querySelector("#nb_depots_tp"+i).value;
                for (let j = 1 ; j <=nb_depots ; j++){
                    document.querySelector("#icone_supprimer_tp"+i+"_"+j).addEventListener("click" , function(){
                        if (id_bouton_annuler == this){
                            document.querySelector(".confirmation_suppression").style.display="none";
                            this.style.backgroundColor ="rgba(255,255,255,0.3)";
                            id_bouton_annuler = null;
                        }else{
                            document.querySelector("#formSup").setAttribute("action","/"+niveau+"/seances/"+i);
                            document.querySelector("#idSupprime").value = document.querySelector("#infos_tp"+i+"_"+j).value;  
                            document.querySelector(".confirmation_suppression").style.display="flex";  
                            document.querySelector(".confirmation_suppression").style.zIndex="3"; 
                            document.querySelector(".confirmation_suppression").style.top = (this.offsetTop+document.querySelector("#contenu_"+i).offsetTop ) +"px";
                            let left = (this.offsetLeft+document.querySelector("#contenu_"+i).offsetLeft) - document.querySelector(".confirmation_suppression").offsetWidth;
                            if (left < 0){ left = 0; }
                            document.querySelector(".confirmation_suppression").style.left = left+"px";
                            this.style.backgroundColor ="#e04646";
                            id_bouton_annuler = this;  
                        }
                    });
                    document.querySelector("#icone_supprimer_tp"+i+"_"+j).addEventListener("mouseover" , function(){
                        this.style.backgroundColor ="#e04646";   
                    });
                    document.querySelector("#icone_supprimer_tp"+i+"_"+j).addEventListener("mouseout" , function(){
                        if (document.querySelector(".confirmation_suppression").style.display!="flex"){
                            this.style.backgroundColor ="rgba(255,255,255,0.3)"; 
                        }
                          
                    });
                }
            }
        }
    }
}
