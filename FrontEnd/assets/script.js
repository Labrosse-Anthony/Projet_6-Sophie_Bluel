// 1. On récupère les travaux depuis l'API
let travauxDonnees = []; // // Cela permet d'utiliser les travaux plus tard dans les filtres sans refaire d'appel API

async function travaux() {
    const reponse = await fetch("http://localhost:5678/api/works"); // 'await' suspend l'exécution tant que la réponse n'est pas arrivée
    travauxDonnees = await reponse.json(); // Stocker dans la variable globale
    genererTravaux(travauxDonnees)
}

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
travaux() // On lance la fonction principale pour démarrer le processus au chargement de la page


async function categories() {
    const reponse = await fetch("http://localhost:5678/api/categories"); // Appel API pour récupérer la liste des catégories (Objets, Appartements, etc.)
    const categories = await reponse.json();
    genererFiltres(categories) // On appelle la fonction qui va créer les boutons, en lui passant les catégories reçues
}

function genererFiltres(categories) {
    const sectionFiltres = document.querySelector(".filters");

    const boutonTous = document.createElement("button"); // Création du bouton
    boutonTous.innerText = "Tous"; // Texte du bouton
    boutonTous.classList.add('filtresbutton'); // Ajout de la classe CSS pour le style
    boutonTous.classList.add('active'); //On le met "actif" (vert) par défaut au chargement
    sectionFiltres.appendChild(boutonTous); // On l'ajoute à la page

    boutonTous.addEventListener("click", function() { // Ajouter l'événement au bouton "Tous" ici
        console.log("J'ai cliqué sur : Tous");
        document.querySelectorAll('.filtresbutton').forEach(btn => btn.classList.remove('active')); // Retirer la classe 'active' de tous les boutons
        boutonTous.classList.add('active'); // Ajouter la classe 'active' au bouton "Tous"
        
        const worksAll = travauxDonnees.filter(function(travail) {
            return travail.category.id === 1||travail.category.id === 2||travail.category.id === 3 // Ici, tu filtres pour garder les ID 1, 2 ou 3.
        })
        document.querySelector(".gallery").innerHTML = '';  // On vide la galerie actuelle
        genererTravaux(worksAll)  // On relance la génération avec la liste filtrée
    });

    for (let i = 0; i < categories.length; i++) {
    const categorie = categories[i]; //La catégorie en cours (ex: "Objets")
    const bouton = document.createElement("button");
    bouton.innerText = categorie.name; // Nom de la catégorie
    bouton.classList.add('filtresbutton') // Classe CSS

    bouton.addEventListener("click", function() {  // Gestion du clic sur une catégorie spécifique
        console.log("J'ai cliqué sur : " + categorie.name); 
        // 1. Gestion du style
        document.querySelectorAll('.filtresbutton').forEach(btn => btn.classList.remove('active')); // Retirer la classe 'active' de tous les boutons
        bouton.classList.add('active'); // Ajouter la classe 'active' au bouton cliqué
        // 2. Filtrage des données
        // On garde uniquement les travaux dont l'ID catégorie correspond à celui du bouton cliqué
        const worksProject = travauxDonnees.filter(function(travail) {
            return travail.category.id === categorie.id;
        });
        // 3. Mise à jour de l'affichage
        document.querySelector(".gallery").innerHTML = '';
        genererTravaux(worksProject)
    });
    // On ajoute le bouton créé à la section filtres
    sectionFiltres.appendChild(bouton);
}
}

// On lance la fonction pour récupérer les catégories
categories()
