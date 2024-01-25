import Cookie from "./cookie.js";
import {create2DArray} from "./utils.js";

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
    showCookies() {
        let caseDivs = document.querySelectorAll("#grille div");

        caseDivs.forEach((div, index) => {
            let ligne = Math.floor(index / this.l);
            let colonne = index % this.c;

            console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

            // on récupère le cookie correspondant à cette case
            let cookie = this.tabcookies[ligne][colonne];
            if (cookie === null) {
                div.innerHTML = "";
                return;
            }
            let img = cookie.htmlImage;

            img.onclick = (event) => {

                console.log("On a cliqué sur la ligne " + ligne + " et la colonne " + colonne);
                //let cookieCliquee = this.getCookieFromLC(ligne, colonne);
                console.log("Le cookie cliqué est de type " + cookie.type);
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
                        this.cookiesSelectionnees = [];
                        this.removeAlignement();
                    }
                }

            }
            img.ondragstart = (event) => {
                console.log("On commence à drag l'image");
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
                console.log("On drop une image");
                console.log(event.target);
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

    testAlignementVertical(colonne) {
        let alignement = false;

        // on parcourt les lignes de la colonne courante
        for (let ligne = 0; ligne <= this.l - 3; ligne++) {
            let cookie0 = this.tabcookies[ligne][colonne];
            let cookie1 = this.tabcookies[ligne + 1][colonne];
            let cookie2 = this.tabcookies[ligne + 2][colonne];
            if (cookie0 === null || cookie1 === null || cookie2 === null) {
                continue;
            }
            if ((cookie0.type === cookie1.type) && (cookie1.type === cookie2.type)) {
                alignement = true;
                //   on ajoute un encadrement autour des cookies aligné
                cookie0.aligne()
                cookie1.aligne()
                cookie2.aligne()
            }
        }
        return alignement;
    }

    testAlignementHorizontal(ligne) {
        let alignement = false;

        // on parcourt les lignes de la colonne courante
        for (let colonne = 0; colonne <= this.c - 3; colonne++) {

            let cookie0 = this.tabcookies[ligne][colonne];
            let cookie1 = this.tabcookies[ligne][colonne + 1];
            let cookie2 = this.tabcookies[ligne][colonne + 2];

            if (cookie0 === null || cookie1 === null || cookie2 === null) {
                continue;
            }

            if ((cookie0.type === cookie1.type) && (cookie1.type === cookie2.type)) {
                alignement = true;
                //   on ajoute un encadrement autour des cookies aligné
                cookie0.aligne()
                cookie1.aligne()
                cookie2.aligne()
            }
        }
        return alignement;
    }

    testAlignementVerticalAll() {
        let alignement = false;
        for (let c = 0; c < this.c; c++) {
            console.log("test alignement vertical pour la colonne " + c);
            alignement = alignement || this.testAlignementVertical(c);
            console.log(this.testAlignementVertical(c))
        }
        return alignement;

    }

    testAlignementHorizontalAll() {
        let alignement = false;
        for (let l = 0; l < this.l; l++) {
            console.log("test alignement horizontal pour la ligne " + l);
            alignement = alignement || this.testAlignementHorizontal(l);
            console.log(this.testAlignementHorizontal(l))
        }
        return alignement;
    }

    testAlignementAll() {
        let alignementhorizontal = false;
        let alignementvertical = false;
        alignementhorizontal = this.testAlignementHorizontalAll();
        alignementvertical = this.testAlignementVerticalAll();
        return (alignementhorizontal || alignementvertical);
    }

    removeCookies() {
        let score = document.querySelector("#scoreValeur");
        for (let l = 0; l < this.l; l++) {
            for (let c = 0; c < this.c; c++) {
                let cookie = this.tabcookies[l][c];
                if (cookie !== null) {
                    if (cookie.htmlImage.classList.contains("cookies-aligne")) {
                        cookie.htmlImage.remove();
                        this.tabcookies[l][c] = null;
                        score.innerHTML++;

                    }
                }
            }
        }
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

    removeAlignement() {

        while (this.testAlignementAll()) {
            this.removeCookies();
            this.putGravity();
            this.refill();
        }
        this.showCookies();

    }

}


