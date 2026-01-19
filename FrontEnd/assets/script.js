// 1. On récupère les travaux depuis l'API
async function travaux() {
    const reponse = await fetch("http://localhost:5678/api/works"); // Récuperation travaux depuis L'API
    travauxDonnees = await reponse.json(); // Stocker dans la variable globale
    genererTravaux(travauxDonnees)

// 2. Fonction pour générer le HTML de la galerie
function genererTravaux(travaux) {
    const sectionGallery = document.querySelector(".gallery"); // On cible la div .gallery

    // On parcourt la liste des travaux (boucle)
    for (let i = 0; i < travaux.length; i++) {
        const projet = travaux[i];

        // Création des balises
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        // Configuration des attributs (src, alt, texte)
        image.src = projet.imageUrl;
        image.alt = projet.title;
        figcaption.innerText = projet.title;

        // Rattachement des éléments (Parent -> Enfant)
        figure.appendChild(image);
        figure.appendChild(figcaption);
        sectionGallery.appendChild(figure);
    }
}

fetch("http://localhost:5678/api/categories")

    .then (reponse=> reponse.json())
    .then ( categories=> {
        genererFiltres(categories);
    });

function genererFiltres(categories) {
    const sectionFiltres = document.querySelector(".filters");

    const boutonTous = document.createElement("button");
    boutonTous.innerText = "Tous";
    sectionFiltres.appendChild(boutonTous);

    for (let i = 0; i < categories.length; i++) {
    const categorie = categories[i];
    const bouton = document.createElement("button");
    bouton.innerText = categorie.name;

    bouton.addEventListener("click", function() {
        console.log("J'ai cliqué sur : " + categorie.name);
    });

    sectionFiltres.appendChild(bouton);
}
}
