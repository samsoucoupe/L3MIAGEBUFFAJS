import Cookie from "./cookie.js";
import {create2DArray} from "./utils.js";
import Sound from "./sound.js";
import {assetsToLoadURLs} from "./assets.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille {

    cookiesSelectionnees = [];

    constructor(l, c) {
        this.c = c;
        this.l = l;
        this.tabcookies = this.remplirTableauDeCookies(6)
    }

    /**
     * parcours la liste des divs de la grille et affiche les images des cookies
     * correspondant à chaque case. Au passage, à chaque image on va ajouter des
     * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
     * et implémenter la logique du jeu.
     */
    showCookies(verbose = false) {
        let soundManager = new Sound();
        let caseDivs = document.querySelectorAll("#grille div");

        caseDivs.forEach((div, index) => {
            let ligne = Math.floor(index / this.l);
            let colonne = index % this.c;
            if (verbose) {
                console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);
            }


            // on récupère le cookie correspondant à cette case
            let cookie = this.tabcookies[ligne][colonne];
            if (cookie === null) {
                div.innerHTML = "";
                return;
            }
            let img = cookie.htmlImage;

            img.onclick = (event) => {
                if (verbose) {
                    console.log("On a cliqué sur la ligne " + ligne + " et la colonne " + colonne);
                    //let cookieCliquee = this.getCookieFromLC(ligne, colonne);
                    console.log("Le cookie cliqué est de type " + cookie.type);
                }
                // highlight + changer classe CSS
                if (this.cookiesSelectionnees.length === 0) {
                    cookie.togglesSelection();
                    this.cookiesSelectionnees.push(cookie);
                } else if (this.cookiesSelectionnees.length === 1) {
                    if (this.cookiesSelectionnees[0] === cookie) {
                        cookie.togglesSelection();
                        this.cookiesSelectionnees = [];
                    } else {
                        cookie.togglesSelection();
                        this.cookiesSelectionnees.push(cookie);
                        Cookie.swapCookies(this.cookiesSelectionnees[0], this.cookiesSelectionnees[1]);
                        soundManager.loadSound(assetsToLoadURLs.swapSound.url).then((buffer) => {
                            soundManager.playSound(buffer);
                        })
                        this.cookiesSelectionnees = [];
                        this.removeCookies();
                    }
                }

            }
            img.ondragstart = (event) => {
                if (verbose) {
                    console.log("On commence à drag l'image");
                }
                if (this.cookiesSelectionnees.length === 1) {
                    this.cookiesSelectionnees[0].togglesSelection();
                    this.cookiesSelectionnees = [];
                }
                img.onclick(event);

            }


            img.ondragover = (event) => {
                return false;
            }

            img.ondrop = (event) => {
                if (verbose)
                {
                    console.log("On drop une image");
                    console.log(event.target);
                }
                let endcookie = this.getCookieFromLC(event.target.dataset.ligne, event.target.dataset.colonne);
                img.onclick(endcookie);
            }

            // on affiche l'image dans le div pour la faire apparaitre à l'écran.
            div.appendChild(img);
        });
    }

    getCookieFromLC(ligne, colonne) {
        return this.tabcookies[ligne][colonne];
    }

    /**
     * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
     * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
     * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
     *
     * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
     * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
     * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
     * difficiles.
     *
     * On verra plus tard pour les améliorations...
     */
    remplirTableauDeCookies(nbDeCookiesDifferents) {
        let tab = create2DArray(9);
        // remplir
        for (let l = 0; l < this.l; l++) {
            for (let c = 0; c < this.c; c++) {

                const type = Math.floor(Math.random() * nbDeCookiesDifferents);
                //console.log(type)
                tab[l][c] = new Cookie(type, l, c);
            }
        }

        return tab;
    }


    getCookiesAlignes(cookie, verbose = false) {
        const ligne = cookie.ligne;
        const colonne = cookie.colonne;
        const typeCookie = cookie.type;
        const cookiesAlignes = [];

        const checkAndPush = (temp, nbAlignes) => {
            if (nbAlignes >= 3) {
                cookiesAlignes.push(...temp);
            }
        };

        const analyzeDirection = (rowIncrement, colIncrement, direction, verbose = false) => {
            let cookiesAlignesTemp = [];
            let nbCookiesAlignes = 0;
            let ligneAnalyse = ligne;
            let colonneAnalyse = colonne;
            if (verbose) {
                console.log(`Analyse des cookies ${direction} :`);
                console.log(cookie);
                console.log("ligneAnalyse : " + ligneAnalyse);
                console.log("colonneAnalyse : " + colonneAnalyse);
                console.log("ligne: " + ligne);
                console.log("colonne: " + colonne);
                console.log(cookie.ligne);
            }

            let cookieAnalyse = this.tabcookies[ligneAnalyse][colonneAnalyse];

            while (ligneAnalyse >= 1 && ligneAnalyse < this.l - 1 && colonneAnalyse >= 1 && colonneAnalyse < this.c - 1 && cookieAnalyse.type === typeCookie) {
                cookiesAlignesTemp.push(cookieAnalyse);
                ligneAnalyse += rowIncrement;
                colonneAnalyse += colIncrement;
                cookieAnalyse = this.tabcookies[ligneAnalyse][colonneAnalyse];
                nbCookiesAlignes++;
            }

            if (cookieAnalyse.type === typeCookie) {
                cookiesAlignesTemp.push(cookieAnalyse);
                nbCookiesAlignes++;
            }
            if (verbose) {
                console.log(`nombre de cookies alignés ${direction} : ${nbCookiesAlignes}`);
                console.log(cookiesAlignesTemp);
            }

            checkAndPush(cookiesAlignesTemp, nbCookiesAlignes);
        };

        analyzeDirection(-1, 0, 'en haut',verbose);
        analyzeDirection(1, 0, 'en bas',verbose);
        analyzeDirection(0, -1, 'à gauche',verbose);
        analyzeDirection(0, 1, 'à droite',verbose);

        // Enlever les doublons
        const uniqueCookiesAlignes = cookiesAlignes.filter(
            (cookie, index, self) => self.indexOf(cookie) === index
        );

        return uniqueCookiesAlignes;
    }

    getAllCookiesAlignes(verbose = false) {
        let cookiesAlignes = [];
        for (let l = 0; l < this.l; l++) {
            for (let c = 0; c < this.c; c++) {
                let cookieAnalyse = this.tabcookies[l][c];
                cookiesAlignes.push(...this.getCookiesAlignes(cookieAnalyse, verbose));
            }
        }
        // Enlever les doublons
        cookiesAlignes = cookiesAlignes.filter(
            (cookie, index, self) => self.indexOf(cookie) === index
        );

        return cookiesAlignes;
    }


    scoreToGet(nombre_element_aligne) {
        switch (nombre_element_aligne) {
            case 3:
                return 1;
            case 4:
                return 2;
            case 5:
                return 3;
            case 6:
                return 4;
            default:
                return 0;
        }
    }

    attribuerScore(nombre_element_aligne) {
        let score = document.querySelector("#scoreValeur");
        let newScore = parseInt(score.innerHTML) + this.scoreToGet(nombre_element_aligne);
        score.innerHTML = newScore;
    }

    removeCookies() {

        for (let l = 0; l < this.l; l++) {
            for (let c = 0; c < this.c; c++) {

                let cookieAnalyse = this.tabcookies[l][c];
                if (cookieAnalyse === null) {
                    continue;
                }
                let cookiesAlignes = this.getCookiesAlignes(cookieAnalyse);
                let nombre_element_aligne = cookiesAlignes.length;
                if (nombre_element_aligne >= 3) {
                    cookiesAlignes.forEach((cookie) => {
                        cookie.htmlImage.remove();
                        this.tabcookies[cookie.ligne][cookie.colonne] = null;
                    });
                    this.putGravity();
                    this.refill();
                    this.showCookies();
                    this.attribuerScore(nombre_element_aligne);
                }
            }
        }
        let soundManager = new Sound();
        soundManager.loadSound(assetsToLoadURLs.destroySound.url).then((buffer) => {
            soundManager.playSound(buffer);
        })
    }

    getCookieUp(ligne, colonne) {
        if (ligne === -1) {
            return null;
        }
        if (this.tabcookies[ligne][colonne] === null) {
            this.getCookieUp(ligne - 1, colonne);
        }
        if (ligne + 1 < this.l) {
            if (this.tabcookies[ligne + 1][colonne] === null) {
                this.tabcookies[ligne + 1][colonne] = this.tabcookies[ligne][colonne]
                this.tabcookies[ligne][colonne] = null;
            }
        }

        return this.tabcookies[ligne][colonne];
    }

    attributeLigneColonne() {
        for (let l = 0; l < this.l; l++) {
            for (let c = 0; c < this.c; c++) {
                if (this.tabcookies[l][c] !== null) {
                    this.tabcookies[l][c].ligne = l;
                    this.tabcookies[l][c].colonne = c;
                }
            }
        }
    }

    putGravity() {

        for (let c = 0; c < this.c; c++) {
            //         si une case est vide on la remplit avec une case au dessus jusqu'à ce qu'il n'y ait plus de case vide ou qu'on arrive en haut
            for (let l = this.l - 1; l >= 0; l--) {
                if (this.tabcookies[l][c] === null) {
                    this.getCookieUp(l, c);
                }
            }


            // this.showCookies()
        }
        this.attributeLigneColonne()
    }

    refill() {
        for (let l = 0; l < this.l; l++) {
            for (let c = 0; c < this.c; c++) {
                if (this.tabcookies[l][c] === null) {
                    this.tabcookies[l][c] = new Cookie(Math.floor(Math.random() * 6), l, c);
                }
            }
        }
    }


}


