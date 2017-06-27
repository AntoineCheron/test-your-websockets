/* Code from sametmax.com/include-require-import-en-javacript/
Thank to them for this very useful piece of code ! */

const include = function(url, callback) {
	/* On crée une balise <script type="text/javascript"></script> */
	const script = document.createElement('script');
	script.type = 'text/javascript';

	/* On fait pointer la balise sur le script qu'on veut charger,
	avec en prime un timestamp pour éviter les problèmes de cache */
	script.src = `${url}?${new Date().getTime()}`;

	/* On dit d'executer cette fonction une fois que le script est chargé */
	if (callback) {
		script.onreadystatechange = callback;
		script.onload = script.onreadystatechange;
	}

	/* On rajoute la balise script dans le head, ce qui demarre le téléchargement */
	document.getElementsByTagName('head')[0].appendChild(script);
}