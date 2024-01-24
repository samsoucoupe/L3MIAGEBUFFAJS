import Grille from "./grille.js";

// 1 On définisse une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES est chargée

window.onload = init;

let grille;

function init() {
  console.log("Page et ressources prêtes à l'emploi");
  // appelée quand la page et ses ressources sont prêtes.
  // On dit aussi que le DOM est ready (en fait un peu plus...)
  let btn = document.querySelector("#btnStart");
    btn.onclick = () => {
      console.log("On a cliqué sur le bouton");
      grille.removeAlignement();
    }


  grille = new Grille(9, 9);
  grille.removeAlignement();
  grille.showCookies();


}
