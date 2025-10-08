
/**
 * ${1:Description placeholder}
 *
 * @type {number}
 */
let nbrProjets = 7;
if (document.querySelector("#pjtsBulle")!= null) {
    let fenBulle =document.querySelector("#pjtsBulle");
    let imFenBulle = document.querySelector("#pjtsBulle img");
    let txtFenBulle = document.querySelector("#pjtsBulle p");
    document.querySelector("#vote").style.color="white"; 
    let pjtSelf = document.querySelector("#pjtSelf").value;
    
    function cacheSelf(pjtSelf,id){
       
        for (let i = 0 ; i < nbrProjets ; i++){
            let element = document.querySelector(id+i);
            if  (element.value == pjtSelf) {
                element.style.display = "none";
            }
        }
        
    }


    function compteCheck(){
        let n = 0;
        for (let i = 0 ; i < nbrProjets ; i++){
            let element = document.querySelector("#pjtsInput"+i);
            if  (element.checked) {n += 1;}
        }
        return n;
    }
    function ecritBulle(n,txtFenBulle){
        if (n == 1) {
            txtFenBulle.textContent="Encore 1 case à cocher";
            txtFenBulle.style.color="#302e2e";
        }else if (n < 2){
            txtFenBulle.textContent="Encore "+(2-n)+" cases à cocher";
            txtFenBulle.style.color="#302e2e"; 
        }else if (n == 2){
            txtFenBulle.textContent="2 cases déjà cochées";
            txtFenBulle.style.color="white";
        }else{
            txtFenBulle.textContent="Trop de cases cochées";
            txtFenBulle.style.color="red";
        }
    }
    
    cacheSelf(pjtSelf,"#pjtsInput");

    for (let i = 0 ; i < nbrProjets ; i++){
        let element = document.querySelector("#pjtsInput"+i);
        element.addEventListener("mouseover",function() {
            let x = element.offsetLeft - 188;
                       
            let y = element.offsetTop + 8;
            let n = compteCheck();
            imFenBulle.setAttribute("src","public/images/projets/im"+i+".jpg");
            ecritBulle(n,txtFenBulle);
            fenBulle.style.left = x+'px' ;
            fenBulle.style.top = y+'px' ;
            fenBulle.style.display="block";
        });
        element.addEventListener("mouseout",invisibleBulle);   
    
        element.addEventListener("click",function() {
            let n = compteCheck();  
            ecritBulle(n,txtFenBulle);
            if (n == 2){
                document.querySelector("#vote").setAttribute('type','submit');
                document.querySelector("#vote").style.color="black";
                fenBulle.style.display="none";
            }else{
                document.querySelector("#vote").setAttribute('type','button');
                document.querySelector("#vote").style.color="white";
            }
        });  
    
    
    }
    
    function invisibleBulle(){
        fenBulle.style.display="none";
    }
    
    //****************************************** */
    
    let fenBulle2 =document.querySelector("#pjtsBulle2");
    let imFenBulle2 = document.querySelector("#pjtsBulle2 img");
    let txtFenBulle2 = document.querySelector("#pjtsBulle2 p");
    document.querySelector("#vote2").style.color="white";
    
    function compteCheck2(){
        let n = 0;
        for (let i = 0 ; i < nbrProjets ; i++){
            let element = document.querySelector("#pjtsInput2"+i);
            if  (element.checked) {n += 1;}
        }
        return n;
    }
   
    cacheSelf(pjtSelf,"#pjtsInput2");

    for (let i = 0 ; i < nbrProjets ; i++){
        let element = document.querySelector("#pjtsInput2"+i);
        element.addEventListener("mouseover",function() {
            let x = element.offsetLeft - 188;
            let y = element.offsetTop;
            let n = compteCheck2();
            imFenBulle2.setAttribute("src","public/images/projets/im"+i+".jpg");
            ecritBulle(n,txtFenBulle2);
            fenBulle2.style.left = x+'px' ;
            fenBulle2.style.top = y+'px' ;
            fenBulle2.style.display="block";
        });
        element.addEventListener("mouseout",invisibleBulle2);   
    
        element.addEventListener("click",function() {
            let n = compteCheck2();  
            ecritBulle(n,txtFenBulle2);

            if (n == 2){
                document.querySelector("#vote2").setAttribute('type','submit');
                document.querySelector("#vote2").style.color="black";
                fenBulle.style.display="none";
            }else{
                document.querySelector("#vote2").setAttribute('type','button');
                document.querySelector("#vote2").style.color="white";
            }
        });  
    
    
    }
    
    function invisibleBulle2(){
        fenBulle2.style.display="none";
    }
    
    
    




}

