export default class Cookie {

  type=0;
  htmlImage=undefined;

  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  constructor(type, ligne, colonne) {
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;

    const url = Cookie.urlsImagesNormales[type];

    // On crée une image avec le CandyCrushDOM
    let img = document.createElement("img");
    img.src = url;
    img.width = 80;
    img.height = 80;
    // pour pouvoir récupérer la ligne et la colonne
    // quand on cliquera sur une image et donc à partir
    // de cette ligne et colonne on pourra récupérer le cookie
    img.dataset.ligne = ligne;
    img.dataset.colonne = colonne;

    this.htmlImage = img;

  }

  selectionnee() {
    // on change l'image et la classe CSS
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
    // on zoome et on ajoute une ombre
    this.htmlImage.classList.add("cookies-selected");

  }

  deselectionnee() {
    // on change l'image et la classe CSS
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
    // on dézoome et on enlève l'ombre
    this.htmlImage.classList.remove("cookies-selected");
  }

  togglesSelection() {
    if (this.htmlImage.classList.contains("cookies-selected")) {
      this.deselectionnee();
    }
    else {
      this.selectionnee();
    }
  }

  static swapCookies(c1, c2, animation, alerte = false) {

    // On échange leurs images et types.
    if (Cookie.distance(c1, c2) <2) {
        if (animation) {
      c1.htmlImage.classList.add('swap-animation');
      c2.htmlImage.classList.add('swap-animation');
    }

      // On échange leurs images et types
      const imageTemp = c2.htmlImage.src;
      const typeTemp = c2.type;

      c2.htmlImage.src = c1.htmlImage.src;
      c2.type = c1.type;

      c1.htmlImage.src = imageTemp;
      c1.type = typeTemp;

    if (animation){
      setTimeout(() => {
        c1.htmlImage.classList.remove('swap-animation');
        c2.htmlImage.classList.remove('swap-animation');
      }, 300);}


    }else{
      if (alerte) {
        alert("Vous ne pouvez pas échanger ces deux cookies");
      }
    }
    // et on les désélectionne
    c1.deselectionnee();
    c2.deselectionnee();
    return Cookie.distance(c1, c2) <2;
  }

  immobile(){
    this.htmlImage.classList.add("cookies-immobile");
  }

  deimmobile(){
    this.htmlImage.classList.remove("cookies-immobile");
  }



  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.abs(l1 - l2) + Math.abs(c1 - c2);
    return distance;
  }

  addShiverState(){
    this.htmlImage.classList.add("cookies-shiver");
  }
  removeShiverState(){
    this.htmlImage.classList.remove("cookies-shiver");
  }

}
