// Iframe en cours de lecture
class VideoJouee {
    constructor(){
      this.type = null;
      this.indice = null;
    }
    get(){
      console.log(this.type,this.indice);
    }
    set(type,indice){
      this.type = type;
      this.indice = indice;
    }
  }
var videoJouee = new VideoJouee();
  
//Gestion des Iframes
let nombreIframe = document.querySelector("#nombreIframe").value;
var vidIfr = new Array();

function onYouTubeIframeAPIReady() {
for (let i = 1 ; i <= nombreIframe ; i++ ){
    let src = document.querySelector("#iframeHidden"+i).value;
    let id = "iframe"+i;
    vidIfr[id] = new YT.Player(id, {
                            height: '315',
                            width: '560',
                            videoId: src,
                            events: {
                            'onStateChange': change,
                            }
        });
} 
}

function change(event) {
if (event.data == YT.PlayerState.PLAYING) {
    console.log(videoJouee);
    console.log(vidIfr);
    if(videoJouee.type == "iframe"  && event.target.id != videoJouee.indice){
        vidIfr["iframe"+videoJouee.indice].stopVideo();
    }
    videoJouee.set("iframe",event.target.id);
}
} 

function stopIframeYt(){
    for (let cle in vidIfr){
        console.log()
        vidIfr[cle].stopVideo();
    }
}
