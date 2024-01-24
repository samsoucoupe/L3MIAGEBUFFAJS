export default class Cookie {
  ligne = 0;
  colonne = 0;
  type = 0;
  canvas = document.createElement("canvas"); // Utilisation de canvas au lieu de htmlImage
  static assets;

  constructor(type, ligne, colonne) {
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;

    this.canvas.width = 80;
    this.canvas.height = 80;
    this.canvas.dataset.ligne = ligne;
    this.canvas.dataset.colonne = colonne;

    const url = Cookie.urlsImagesNormales[type];

    const image = new Image();
    image.src = url;
    image.onload = () => {
      this.draw(this.canvas.getContext("2d"), 0, 0, 80, 80);
    };
  }

  draw(ctx, x, y, width, height) {
    ctx.clearRect(x, y, width, height); // Efface le contenu précédent du canvas

    // Dessine l'image sur le canvas
    ctx.drawImage(Cookie.assets[this.type], x, y, width, height);
  }

  selectionnee() {
    // On change le dessin du canvas
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, 80, 80);
    ctx.drawImage(Cookie.assets[this.type + "_highlighted"], 0, 0, 80, 80);

    // On ajoute une classe CSS (peut être personnalisée pour le canvas)
    this.canvas.classList.add("cookies-selected");
  }

  deselectionnee() {
    // On change le dessin du canvas
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, 80, 80);
    ctx.drawImage(Cookie.assets[this.type], 0, 0, 80, 80);

    // On enlève la classe CSS
    this.canvas.classList.remove("cookies-selected");
  }

  togglesSelection() {
    if (this.canvas.classList.contains("cookies-selected")) {
      this.deselectionnee();
    } else {
      this.selectionnee();
    }
  }

  static swapCookies(c1, c2) {
    console.log("SWAP C1 C2");
    // On échange leurs types
    const typeTemp = c2.type;
    c2.type = c1.type;
    c1.type = typeTemp;

    // On redessine les cookies
    c1.draw(c1.canvas.getContext("2d"), 0, 0, 80, 80);
    c2.draw(c2.canvas.getContext("2d"), 0, 0, 80, 80);

    // et on les désélectionne
    c1.deselectionnee();
    c2.deselectionnee();
  }

  aligne() {
    this.canvas.classList.add("cookies-aligne");
  }

  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.abs(l1 - l2) + Math.abs(c1 - c2);
    console.log("Distance = " + distance);
    return distance;
  }
}
