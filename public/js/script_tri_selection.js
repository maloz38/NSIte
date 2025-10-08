
/**
 * ${1:Description placeholder}
 *
 * @type {*}
 */
var liste = document.getElementById("liste");

if (document.getElementById('transit') != null){
	var transit = document.getElementById('transit');
	var nombrestransit = transit.getElementsByTagName('td');
	var nombres = liste.getElementsByTagName('td');
	
	var cardinal = nombres.length;
	var couleur = "#f8ede0";
	
	var debutnoir = 0; // indice à partir duquel les éléments ne sont pas encore rangés
	var indicenoiracomparer; // élément de la liste noire à comparer avec min courant de la liste noire
	var indiceMin; // indice du min courant
	
	
	var etape  = "demarrenoir"; //plusieurs types d'étape.
	
	
	for(let td of nombres) {
		// place des entiers au hasard dans les td de l'élément id="nombres"
		// passe en noir les fonds (noir  = couleur de la partie non traitée)
		
		td.style.backgroundColor = "black";
		td.style.color = couleur;
		 
		td.textContent = 100 + Math.floor(Math.random() * 900);
	}



}






function elever(j) {
	// le nombre de la cellule j est monté dans la ligne supérieure
	// pour le mettre en évidence
	
	nombrestransit[j].style.backgroundColor = "black";
	nombrestransit[j].style.color = couleur;
	nombrestransit[j].textContent = nombres[j].textContent;
	nombres[j].style.backgroundColor = couleur;
	nombres[j].style.color = couleur;
}




function abaisser(j) {
	// le nombre de la cellule j ligne transit est redescendu 
	nombres[j].style.backgroundColor = "black";
	nombres[j].textContent = nombrestransit[j].textContent;
	nombrestransit[j].style.backgroundColor = couleur;
	nombrestransit[j].style.color = couleur;
}



/**
 * ${1:Description placeholder}
 */
function comparer( ){
	// compare les éléments indice indiceMin et  indicenoiracomparer
	// et abaisse le plus grand des deux, mettant ainsi en évidence le min
	let entiermin = parseInt(nombrestransit[indiceMin].textContent); 
	let entiernoiracomparer = parseInt(nombrestransit[indicenoiracomparer].textContent); 
	if(entiermin < entiernoiracomparer)
	{
		 abaisser(indicenoiracomparer);
	}
	else
	{	
		nombrestransit[indiceMin].style.backgroundColor = "black";
		abaisser(indiceMin);
		nombrestransit[indicenoiracomparer].style.backgroundColor = "green";
		indiceMin = indicenoiracomparer;
	}
}





/**
 * ${1:Description placeholder}
 */
function finaliser() {
	// l'élément d'indice i passe de la couleur liste non traitée 
	// à la couleur liste traitée
	
	nombres[debutnoir].style.backgroundColor = 'red';
	
	debutnoir += 1;
	if( debutnoir === cardinal-1 ) 
	{
		nombres[debutnoir].style.backgroundColor = 'red';
		etape = "fini";
		message();
	}
}

/**
 * ${1:Description placeholder}
 */
function debutechange( ) {
	elever(indiceMin);
	elever(debutnoir);
	nombrestransit[debutnoir].style.backgroundColor = "black";
	nombrestransit[indiceMin].style.backgroundColor = "green";
	
}

/**
 * ${1:Description placeholder}
 */
function echange( ) {
	// échange les entiers des td numero debutnoir
	// et numero  indiceMin
	 
	  
	let entierMin = nombres[indiceMin].textContent;
	let entierTeteNoire = nombres[debutnoir].textContent;
	
	nombrestransit[indiceMin].textContent =  entierTeteNoire;
	nombres[indiceMin].textContent =  entierTeteNoire;
	
	nombrestransit[debutnoir].textContent = entierMin;
	nombres[debutnoir].textContent = entierMin;
	nombrestransit[indiceMin].style.backgroundColor = "black";
	nombrestransit[debutnoir].style.backgroundColor = "green";
		 
	 
}

/**
 * ${1:Description placeholder}
 */
function finechange() {
	abaisser(indiceMin);
	abaisser(debutnoir);
	nombres[debutnoir].style.backgroundColor = "green";
}




function message(){
	let decrit = '';
	switch(etape)
	{
		case "demarrenoir" :
			decrit = "On commence la recherche d'un élément noir minimum.";
			decrit += "<br>";
			decrit += "Pour cela, on visite les noirs un par un.";
			decrit += "<br>";
			decrit += "Le vert est le plus petit des noirs visités.";
		break;
		case "candidatcomparaison" :
			decrit = "Visite du noir suivant.";
			decrit += "<br>";
			decrit += " Le nouveau vert sera le plus petit des deux éléments 'hauts'.";
		break;
		case "comparaison" :
			decrit = "";
		break;
		case "debutechange" :
			decrit = "On va échanger la tête noire et le  vert (qui est le min des noirs à ce stade).";
		break;
		case "echange" :
			decrit = "&Eacute;change ! ";
		break;
		case "finechange":
			decrit = ""; 
		break;
		case "undeplus" :
			decrit = "L'élément min des noirs devient la queue des rouges."; 
			decrit += "<br>"; 
			decrit += "Il ne bougera plus jusqu'à la fin."; 
		break;
		case "fini":
			decrit = "C'est fini !"; 
			clearInterval(lancement);
		break;
			
	}
	document.getElementById("descriptif").innerHTML = decrit;
}

/**
 * ${1:Description placeholder}
 */
function uneEtape(){
	switch(etape)
	{
		case "demarrenoir" :
			message();
			elever(debutnoir);
			indiceMin = debutnoir;
			nombrestransit[indiceMin].style.backgroundColor = "green";
			indicenoiracomparer = debutnoir +1;
			etape = "candidatcomparaison";
		break;
		case "candidatcomparaison" :
			message();
			elever(indicenoiracomparer);
			etape = "comparaison";
		break;
		case "comparaison" :
			message();
			comparer();
			if( indicenoiracomparer < cardinal-1 )  {
				indicenoiracomparer += 1;
				etape = "candidatcomparaison";
			}
			else {
				if(indiceMin === debutnoir) {
					etape = "finechange";
				}
				else {
					etape = "debutechange";
				}
			}
		break;
		case "debutechange" :
			message();
			debutechange();
			etape = "echange";
		break;
		case "echange" :
			message();
			echange();
			etape = "finechange";
		break;
		case "finechange":
			message();
			finechange();
			etape = "undeplus";
		break;
		case "undeplus" :
			message();
			etape = "demarrenoir";
			finaliser();
		break;
	}
}

/**
 * ${1:Description placeholder}
 *
 * @type {*}
 */
var lancement;
 

/**
 * ${1:Description placeholder}
 */
function relance(){
	clearInterval(lancement);
	lancement = setInterval(uneEtape , parseInt(document.getElementById("intervalletemps").value) );
}
if (document.getElementById("etapeManuelle") != null){
	document.getElementById("etapeManuelle").addEventListener('click', uneEtape, false); 
	document.getElementById("automatique").addEventListener('click', 
	function(){lancement = setInterval(uneEtape , 3000);}, false); 
	document.getElementById("intervalletemps").addEventListener('change', relance, false); 
	
	
}
