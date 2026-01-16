// 1. On récupère les travaux depuis l'API
fetch("http://localhost:5678/api/works") // Récuperation les travaux depuis L'API

    .then (reponse=> reponse.json())
    .then ( data=> {
        genererTravaux(data); // On appelle la fonction pour afficher les travaux
    });

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