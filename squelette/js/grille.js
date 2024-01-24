import Cookie from "./cookie.js";
import { create2DArray } from "./utils.js";

export default class Grille {
  cookiesSelectionnees = [];
  canvasLargeur;
  canvasHauteur;
  largeurColonnes;
  hauteurLignes;

  constructor(l, c, canvasLargeur, canvasHauteur, assetsLoaded) {
    this.c = c;
    this.l = l;
    this.canvasLargeur = canvasLargeur;
    this.canvasHauteur = canvasHauteur;
    this.largeurColonnes = canvasLargeur / c;
    this.hauteurLignes = canvasHauteur / l;
    this.assets = assetsLoaded;
    Cookie.assets = assetsLoaded;

    this.tabcookies = this.remplirTableauDeCookies(6);
  }

  drawGrille(ctx) {
    ctx.save();
    // TODO: Dessiner une grille (peut être une bordure autour des cookies)
    ctx.restore();
  }

  showCookies(ctx) {
    ctx.save();
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.l);
      let colonne = index % this.c;

      console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

      // On récupère le cookie correspondant à cette case
      let cookie = this.tabcookies[ligne][colonne];
      if (cookie === null) {
        div.innerHTML = "";
        return;
      }

      // On dessine le cookie sur le canvas
      cookie.draw(ctx, colonne * this.largeurColonnes, ligne * this.hauteurLignes, this.largeurColonnes, this.hauteurLignes);

      div.appendChild(cookie.canvas);

      cookie.canvas.onclick = (event) => {
        console.log("On a cliqué sur la ligne " + ligne + " et la colonne " + colonne);
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
      };

      cookie.canvas.ondragstart = (event) => {
        console.log("On commence à drag l'image");
        if (this.cookiesSelectionnees.length === 1) {
          this.cookiesSelectionnees[0].togglesSelection();
          this.cookiesSelectionnees = [];
        }
        cookie.canvas.onclick(event);
      };

      cookie.canvas.ondragover = (event) => {
        return false;
      };

      cookie.canvas.ondrop = (event) => {
        console.log("On drop une image");
        console.log(event.target);
        let endcookie = this.getCookieFromLC(event.target.dataset.ligne, event.target.dataset.colonne);
        cookie.canvas.onclick(endcookie);
      };
    });

    ctx.restore();
  }

  getCookieFromLC(ligne, colonne) {
    return this.tabcookies[ligne][colonne];
  }

  remplirTableauDeCookies(nbDeCookiesDifferents) {
    let tab = create2DArray(9);

    for (let l = 0; l < this.l; l++) {
      for (let c = 0; c < this.c; c++) {
        const type = Math.floor(Math.random() * nbDeCookiesDifferents);
        tab[l][c] = new Cookie(type, l, c);
      }
    }

    return tab;
  }

  testAlignementVertical(colonne) {
    let alignement = false;

    for (let ligne = 0; ligne <= this.l - 3; ligne++) {
      let cookie0 = this.tabcookies[ligne][colonne];
      let cookie1 = this.tabcookies[ligne + 1][colonne];
      let cookie2 = this.tabcookies[ligne + 2][colonne];
      if (cookie0 === null || cookie1 === null || cookie2 === null) {
        continue;
      }
      if (cookie0.type === cookie1.type && cookie1.type === cookie2.type) {
        alignement = true;
        cookie0.aligne();
        cookie1.aligne();
        cookie2.aligne();
      }
    }
    return alignement;
  }

  testAlignementVerticalAll() {
    for (let c = 0; c < this.c; c++) {
      this.testAlignementVertical(c);
    }
  }

  testAlignementHorizontal(ligne) {
    let alignement = false;

    for (let colonne = 0; colonne <= this.c - 3; colonne++) {
      let cookie0 = this.tabcookies[ligne][colonne];
      let cookie1 = this.tabcookies[ligne][colonne + 1];
      let cookie2 = this.tabcookies[ligne][colonne + 2];

      if (cookie0 === null || cookie1 === null || cookie2 === null) {
        continue;
      }

      if (cookie0.type === cookie1.type && cookie1.type === cookie2.type) {
        alignement = true;
        cookie0.aligne();
        cookie1.aligne();
        cookie2.aligne();
      }
    }
    return alignement;
  }

  testAlignementHorizontalAll() {
    for (let l = 0; l < this.l; l++) {
      this.testAlignementHorizontal(l);
    }
  }

  testAlignementAll() {
    this.testAlignementHorizontalAll();
    this.testAlignementVerticalAll();
  }

  removeCookies() {
    for (let l = 0; l < this.l; l++) {
      for (let c = 0; c < this.c; c++) {
        let cookie = this.tabcookies[l][c];
        if (cookie !== null) {
          if (cookie.canvas.classList.contains("cookies-aligne")) {
            cookie.canvas.remove();
            this.tabcookies[l][c] = null;
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
        this.tabcookies[ligne + 1][colonne] = this.tabcookies[ligne][colonne];
        this.tabcookies[ligne][colonne] = null;
        console.log("GetCookieUp " + "SWAP de " + ligne + " " + colonne + " avec " + (ligne + 1) + " " + colonne);
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
      for (let l = this.l - 1; l >= 0; l--) {
        if (this.tabcookies[l][c] === null) {
          this.getCookieUp(l, c);
        }
      }
    }
    this.attributeLigneColonne();
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
    let initTabCookies = create2DArray(this.l);
    while (this.tabcookies !== initTabCookies) {
      initTabCookies = this.tabcookies;
      this.testAlignementAll();
      this.removeCookies();
      this.putGravity();
      this.refill();
    }
  }
}
