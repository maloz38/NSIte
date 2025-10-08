class Diaporama{
    /**
 * Creates an instance of Diaporama.
 *
 * @constructor
 * @param {*} nom
 * @param {*} lenght
 * @param {*} id
 */
constructor(nom , lenght , id){ 
        this.nom = nom;
        this.lenght = lenght;
        this.pic = document.querySelector("#pic_"+nom);
        this.fg= document.querySelector("#fg_"+nom); 
        this.fd = document.querySelector("#fd_"+nom);
        this.compteur = 0;
        this.deplace = false;
        this.id = id;
    }

    visibiliteFleches(){
        if (this.compteur > 0) {
            this.fg.setAttribute("src","/public/images/gauche.png");
        }else{
            this.fg.setAttribute("src","/public/images/gaucheT.png");
        }
        if (this.compteur < this.lenght-1) {
            this.fd.setAttribute("src","/public/images/droite.png");
        }else{
            this.fd.setAttribute("src","/public/images/droiteT.png");
        }
    }

    /**
 * ${1:Description placeholder}
 */
avance(){
        if (this.compteur < this.lenght-1){
            this.compteur += 1; 
        }
        this.visibiliteFleches();
        this.pic.setAttribute("src","/public/images/"+this.nom+"/pic"+this.compteur+".jpg");
    }
  

    /**
 * ${1:Description placeholder}
 */
recule(){
        if (this.compteur > 0){
            this.compteur -= 1;
        }
        this.visibiliteFleches();
        this.pic.setAttribute("src","/public/images/"+this.nom+"/pic"+this.compteur+".jpg"); 
    }          

    /**
 * ${1:Description placeholder}
 */
evenement(){ 
        this.pic.setAttribute("src","/public/images/"+this.nom+"/pic"+this.compteur+".jpg");      
        this.fd.addEventListener('click', this.avance.bind(this));
        this.fg.addEventListener('click', this.recule.bind(this));
        let d = this;
        document.addEventListener('keydown', function(event) {
            let blocOuvert =  document.querySelector("#contenu_"+d.id);
            if (event.code == 'ArrowRight' && blocOuvert.style.display =="block" ) {
                d.avance();
            }
            if (event.code == 'ArrowLeft' && blocOuvert.style.display =="block") {
                d.recule();
            }
        });
    }

}



class EnsDiaporama{
    constructor(){
        let objDiapos = new Array();
        if (document.querySelector("#ens_diapos") != null){
            let tabTemp = document.querySelector("#ens_diapos").value.split(',');
            for (let dia of tabTemp) {
                let temp = dia.split('*')
                objDiapos.push(new Diaporama(temp[0] , temp[1] , temp[2]));
            }
        }
        this.diapos = objDiapos;  
    }
    /**
 * ${1:Description placeholder}
 */
activeDiapo(){
        for (let dia of this.diapos) {
            dia.evenement() ;   
        }
    }
}

/**
 * ${1:Description placeholder}
 *
 * @type {EnsDiaporama}
 */
let dia = new EnsDiaporama(); 
dia.activeDiapo();
