// 1. On récupère les travaux depuis l'API
let travauxDonnees = []; // // Cela permet d'utiliser les travaux plus tard dans les filtres sans refaire d'appel API

async function travaux() {
    const reponse = await fetch("http://localhost:5678/api/works"); // 'await' suspend l'exécution tant que la réponse n'est pas arrivée
    travauxDonnees = await reponse.json(); // Stocker dans la variable globale
    genererTravaux(travauxDonnees)
    genererTravauxModal(travauxDonnees)
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
            genererTravaux(travauxDonnees);
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


/* --- GESTION DU MODE ÉDITION (Une fois connecté) --- */

// On vérifie si le token est présent dans le stockage de la session
const token = localStorage.getItem("token");

if (token) {
    // 1. Afficher la barre noire "Mode édition"
    const editionMode = document.querySelector(".edition-mode");
    editionMode.style.display = "flex";

    // 2. Afficher le bouton "modifier"
    const editBtn = document.querySelector(".modal-trigger");
    editBtn.style.display = "flex";

    // 3. Cacher les filtres
    const filtersElement = document.querySelector(".filters");
    filtersElement.style.display = "none";

    // 4. Changer "login" en "logout"
    const loginLink = document.getElementById("login-link");
    loginLink.innerText = "logout";
    
    // 5. Gérer la déconnexion quand on clique sur "logout"
    loginLink.addEventListener("click", function(event) {
        event.preventDefault(); // On empêche le lien de nous changer de page tout de suite
        localStorage.removeItem("token"); // On supprime le token
        window.location.reload(); // On recharge la page (ce qui remettra le site en mode normal)
    });
}

/* --- GESTION DE LA MODALE --- */

const modal = document.getElementById("modal1"); // La fenêtre modale entière
const btnModifier = document.querySelector(".modal-trigger"); // Le bouton "modifier"
const btnFermer = document.querySelector(".modal-close"); // La croix
const modalBackground = document.querySelector(".modal"); // Le fond grisé

// Fonction pour ouvrir la modale
btnModifier.addEventListener("click", function(event) {
    event.preventDefault(); // Empêche le lien de nous faire remonter en haut de page
    modal.style.display = "flex"; // On affiche la modale (flex pour centrer)
    modal.removeAttribute("aria-hidden"); // Pour l'accessibilité (lecteurs d'écran)
});

// Fonction pour fermer la modale (au clic sur la croix)
btnFermer.addEventListener("click", function() {
    modal.style.display = "none"; // On cache la modale
    modal.setAttribute("aria-hidden", "true"); // On indique qu'elle est cachée
});

// Fermer la modale si on clique sur le fond grisé (en dehors de la boîte blanche)
modalBackground.addEventListener("click", function(event) {
    if (event.target === modalBackground) { // On vérifie qu'on clique bien sur le fond et pas sur la boîte
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    }
});

// Fonction pour générer la galerie dans la modale
function genererTravauxModal(travaux) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = ""; // On vide la galerie avant de la remplir

    for (let i = 0; i < travaux.length; i++) {
        const projet = travaux[i];

        // Création des éléments
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const span = document.createElement("span");
        const trashIcon = document.createElement("i");

        // Configuration de l'image
        image.src = projet.imageUrl;
        image.alt = projet.title;
        image.style.width = "100%"; // Petit ajustement CSS rapide si besoin

        // Configuration de l'icône poubelle
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        span.classList.add("trash-icon"); // Classe pour le CSS (positionnement)
        span.id = projet.id; // On garde l'ID du projet pour savoir quoi supprimer

        // Assemblage
        span.appendChild(trashIcon);
        figure.appendChild(image);
        figure.appendChild(span);
        modalGallery.appendChild(figure);

        // --- GESTION DU CLIC SUR LA POUBELLE (ÉTAPE 7) ---
        span.addEventListener("click", function() {
            supprimerProjet(projet.id);
        });
    }
}

async function supprimerProjet(id) {
    const token = localStorage.getItem("token"); // Récupère le token  // Sans ce token, l'API refusera la suppression (Erreur 401).

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}` // INDISPENSABLE : prouve que tu soit admin
            }
        });

        if (response.ok) {
            // Si la suppression a marché :
            
            // 1. On met à jour la liste globale des travaux
            // On garde tout SAUF celui qu'on vient de supprimer
            travauxDonnees = travauxDonnees.filter(travail => travail.id !== id);

            // 2. On régénère les affichages sans recharger la page
            genererTravaux(travauxDonnees);       // Met à jour la page d'accueil
            genererTravauxModal(travauxDonnees);  // Met à jour la modale
            
            console.log("Projet supprimé !");
        } else {
            console.error("Erreur lors de la suppression");
        }
    } catch (error) {
        console.error("Erreur réseau :", error); // On arrive ici seulement si la requête n'a pas pu partir ou revenir
    }
}

