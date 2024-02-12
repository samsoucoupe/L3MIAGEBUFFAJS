import Grille from "./grille.js";
import {assetsToLoadURLs} from "./assets.js";
import Sound from "./sound.js";

// 1 On définisse une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES est chargée
let btnInitialiser = document.querySelector("#boutonStart");
    btnInitialiser.addEventListener("click", () => {
    init();
    btnInitialiser.style.display = "none";
});

let grille;

function init() {
    console.log("Page et ressources prêtes à l'emploi");
    let soundManager = new Sound();
    soundManager.loadSound(assetsToLoadURLs.backgroundMusic.url).then(buffer => {
        soundManager.playSound(buffer);
    })
    // appelée quand la page et ses ressources sont prêtes.
    // On dit aussi que le CandyCrushDOM est ready (en fait un peu plus...)
    let nombre_lignes = 9;
    grille = new Grille(nombre_lignes, nombre_lignes);
    while (grille.getAllCookiesAlignes().length > 0) {
        grille.removeCookies();
    }

    grille.checkIfPossibleToPlay();
    grille.showCookies();
    let score = document.querySelector("#scoreValeur");
    score.innerHTML = 0;
    let tempsRestant = document.querySelector("#tempsRestantValeur");
    tempsRestant.innerHTML = 25;
    let level = document.querySelector("#levelValeur");
    level.innerHTML = 1;
    let scoreNextLevelValeur = document.querySelector("#scoreNextLevelValeur");
    scoreNextLevelValeur.innerHTML = grille.nextScoreTolvlUp;

    let interval = setInterval(decompte, 1000);

//   on decrement le temps de 1 seconde et on met a jour le temps dans la balise du html tempsRestantValeur
//    on verifie si le temps est a 0 et si oui on affiche le message de fin de partie et on arrete le jeu


    function gameOver() {
        soundManager.stopSound();
        alert("Fin de partie");
        let btnInitialiser = document.querySelector("#boutonStart");
        btnInitialiser.style.display = "block";
        clearInterval(interval);
        grille.clearGrille();
        tempsRestant.style.color = "rgb(133, 47, 47)";

    }


    function decompte() {
        tempsRestant.innerHTML--;
        if (tempsRestant.innerHTML < 1) {
            gameOver();
        }

        if (tempsRestant.innerHTML % 10 === 0) {
            grille.showCookiesSwapables();

            if (tempsRestant.innerHTML < 5) {
                tempsRestant.style.color = "red";
            } else if (tempsRestant.innerHTML < 10) {
                tempsRestant.style.color = "orange";
            } else if (tempsRestant.innerHTML < 15) {
                tempsRestant.style.color = "yellow";
            }
        }

    }
}