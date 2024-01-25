import Grille from "./grille.js";

// 1 On définisse une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES est chargée

window.onload = init;

let grille;

function init() {
  console.log("Page et ressources prêtes à l'emploi");
  // appelée quand la page et ses ressources sont prêtes.
  // On dit aussi que le CandyCrushDOM est ready (en fait un peu plus...)
  let nombre_lignes = 9;
  grille = new Grille(nombre_lignes, nombre_lignes);
  grille.removeAlignement();
  grille.showCookies();
  let score = document.querySelector("#scoreValeur");
    score.innerHTML = 0;

//   on decrement le temps de 1 seconde et on met a jour le temps dans la balise du html tempsRestantValeur
//    on verifie si le temps est a 0 et si oui on affiche le message de fin de partie et on arrete le jeu

  let tempsRestant = document.querySelector("#tempsRestantValeur");
  function decompte() {
    tempsRestant.innerHTML--;
    if (tempsRestant.innerHTML == 0) {
      alert("Fin de partie");
      clearInterval(interval);
    //   mettre le score en gros devant la grille et faire que la grille ne soit plus cliquable

    let score = document.querySelector("#scoreValeur");
    score.style.fontSize = "xx-large";

    let grille = document.querySelector("#grille");

    grille.style.opacity = "0.5";
    grille.style.pointerEvents = "none";



    }
  }
    let interval = setInterval(decompte, 1000);





}