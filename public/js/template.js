// calcul H = hauteur bloc nav2
document.querySelector("nav2").style.display="flex";
let H = document.querySelector("nav2").clientHeight;
document.querySelector("nav2").style.display="none";
let hNav = document.querySelector("#nav").clientHeight + document.querySelector(".logo").clientHeight;

// gestion de l'apparition progressive de nav2
if (document.querySelector(".scroll_conteneur")==null){
document.addEventListener("scroll", (event) => { 
    if (window.scrollY > hNav) { //si défilement SOUS NAV
        document.querySelector("nav2").style.display="flex";
        if(window.innerWidth < 600){
            document.querySelector("#menuNav2").style.display="block";
            if (window.scrollY < (hNav+70)){ 
                document.querySelector("#menuNav2").style.top=(window.scrollY-hNav-70)+"px";
                document.querySelector("nav2").style.top=(window.scrollY-hNav)+"px";
            }else{
                document.querySelector("#menuNav2").style.top="0px";
                document.querySelector("nav2").style.top="70px";
            }
        }else{
            document.querySelector("#menuNav2").style.display="none";
            if (window.scrollY < (hNav+H)){
                document.querySelector("nav2").style.top=(window.scrollY-hNav-H)+"px";
            }else{
                document.querySelector("nav2").style.top="0px";
            }
        }
    }else{ //si défilement AVEC NAV VISIBLE
        document.querySelector("nav2").style.display="none";
        document.querySelector("#menuNav2").style.display="none";
        document.querySelector("#menuNav2 img").setAttribute("src","/public/images/menuNavOuv2.png");
        if(window.innerWidth < 600){ 
            document.querySelector("nav2").style.left="-280px";
        }else if (window.innerWidth < 900){
            document.querySelector("nav2").style.left="0px";
        }else {
            document.querySelector("nav2").style.left="10px";
        }
    }
});
}

// gestion du glissement de nav2 en position smartphone
document.querySelector("#menuNav2 img").addEventListener("click", (event) => {
    if (document.querySelector("#menuNav2 img").getAttribute("src") == "/public/images/menuNavOuv2.png") {
        document.querySelector("#menuNav2 img").setAttribute("src","/public/images/menuNavFerm2.png");
        for (let n = 1 ; n < 11; n++){setTimeout(function(){
                                        document.querySelector("nav2").style.left=(-280+28*n)+"px";
                                                          }
                                      ,n*50);}

    }else{
        document.querySelector("#menuNav2 img").setAttribute("src","/public/images/menuNavOuv2.png");
        for (let n = 1 ; n < 11; n++){setTimeout(function(){
            document.querySelector("nav2").style.left=(-28*n)+"px";
                                                            }
                                        ,n*100);}    }
});

// gestion de la METEO 45.753220550700235, 4.79103286274117
let meteo;
fetch("https://api.openweathermap.org/data/2.5/weather?lat=45.753220550700235&lon=4.791032862741172&units=metric&lang=fr&appid=fed2662095a6145165167da7a942885f")
    .then((reponse) => reponse.json())
    .then((data) => {
        meteo = data;
        console.log(meteo);
        document.querySelector("#met").innerHTML = "Aujourd'hui, "+meteo.weather[0]['description']+" à Lyon, avec une température de "+ Math.round(meteo.main.temp) + "°C";
});
