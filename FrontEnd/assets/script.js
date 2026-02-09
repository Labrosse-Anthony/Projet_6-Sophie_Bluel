// SECTION 1 : RÉCUPERATION ET AFFICHAGE DES TRAVAUX ( ACCEUIL )
//  On récupère les travaux depuis l'API
let travauxDonnees = []; // // Cela permet d'utiliser les travaux plus tard dans les filtres sans refaire d'appel API

async function travaux() {
    const reponse = await fetch("http://localhost:5678/api/works"); // 'await' suspend l'exécution tant que la réponse n'est pas arrivée
    travauxDonnees = await reponse.json(); // Stocker dans la variable globale
    genererTravaux(travauxDonnees)
    genererTravauxModal(travauxDonnees)
}

// Fonction pour générer le HTML de la galerie
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

// SECTION 2 : LES FILTRES (BOUTONS)
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
        genererTravaux(travauxDonnees)  // On relance la génération avec la liste filtrée
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


// SECTION 3 : MODE ADMINISTRATEUR (CONNECTÉ)

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

// SECTION 4 : GESTION DE L'OUVERTURE ET FERMETURE DE LA MODALE

const modal = document.getElementById("modal1"); // La fenêtre modale entière
const btnModifier = document.querySelector(".modal-trigger"); // Le bouton "modifier"
const boutonsFermer = document.querySelectorAll(".modal-close"); // La croix
const modalBackground = document.querySelector(".modal"); // Le fond grisé

// Fonction pour ouvrir la modale
btnModifier.addEventListener("click", function(event) {
    event.preventDefault(); // Empêche le lien de nous faire remonter en haut de page
    modal.style.display = "flex"; // On affiche la modale (flex pour centrer)
    modal.removeAttribute("aria-hidden"); // Pour l'accessibilité (lecteurs d'écran)
});

// Fonction pour fermer les modales (au clic sur la croix)
boutonsFermer.forEach(bouton => {
    bouton.addEventListener("click", function() {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    });
});

// Fermer la modale si on clique sur le fond grisé (en dehors de la boîte blanche)
modalBackground.addEventListener("click", function(event) {
    if (event.target === modalBackground) { // On vérifie qu'on clique bien sur le fond et pas sur la boîte
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    }
});

// SECTION 5 : GALERIE DE LA MODALE ET SUPPRESSION

// Fonction pour générer la galerie dans la modale
function genererTravauxModal(travaux) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = ""; // On vide la galerie avant de la remplir

    for (let i = 0; i < travaux.length; i++) { // On démarre une boucle pour passer sur chaque projet un par un
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
        span.appendChild(trashIcon); // On met l'icône poubelle DANS le carré noir (span)
        figure.appendChild(image); // On met l'image DANS la figure
        figure.appendChild(span); // On met le carré noir (avec la poubelle) DANS la figure aussi (par dessus l'image grâce au CSS absolute)
        modalGallery.appendChild(figure); // On ajoute la figure complète DANS la galerie de la modale

        // --- GESTION DU CLIC SUR LA POUBELLE ---
        span.addEventListener("click", function() { // On surveille si l'utilisateur clique sur le petit carré noir (span)
            supprimerProjet(projet.id); // Si clic, on lance la fonction de suppression en lui donnant l'ID précis de ce projet
        });
    }
}

async function supprimerProjet(id) { // Fonction asynchrone (car elle appelle le serveur) pour supprimer un projet
    const token = localStorage.getItem("token"); // Récupère le token  // Sans ce token, l'API refusera la suppression (Erreur 401).

    // On ouvre un bloc try/catch pour gérer les erreurs potentielles
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, { // On envoie une requête au serveur à l'adresse "api/works/ID_DU_PROJET"
            method: "DELETE", // On précise qu'on veut SUPPRIMER (DELETE)
            headers: {
                "Authorization": `Bearer ${token}` // On montre notre "laissez-passer" au serveur. Sans ça, erreur 401 (Interdit)
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
            
            console.log("Projet supprimé !");  // Petit message dans la console pour dire que tout s'est bien passé
        } else {
            console.error("Erreur lors de la suppression"); // Si le serveur dit non , on l'affiche
        }
    } catch (error) {
        console.error("Erreur réseau :", error); // On arrive ici seulement si la requête n'a pas pu partir ou revenir
    }
}

// SECTION 6 : NAVIGATION DANS LA MODALE (GALERIE AJOUT)

// On sélectionne les éléments HTML (boutons et conteneurs) pour pouvoir interagir avec eux
const btnAjouterPhoto = document.querySelector(".btn-add-photo");
const btnRetour = document.querySelector(".modal-back");
const vueGalerie = document.querySelector(".modal-view-gallery");
const vueAjout = document.querySelector(".modal-add");

// On vérifie si le bouton existe avant d'ajouter l'événement (pour éviter des erreurs si on n'est pas connecté)
if (btnAjouterPhoto) {
    // On écoute le "clic" sur le bouton
    btnAjouterPhoto.addEventListener("click", function() {
        // ACTION : On bascule l'affichage
        // On cache la vue "Galerie" (display: none)
        document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "none";
        // On affiche la vue "Ajout" (display: flex pour garder la mise en page flexible)
        document.querySelector(".modal-wrapper.modal-add").style.display = "flex";
    });
}

// Gestion du bouton retour (la flèche)
if (btnRetour) {
    btnRetour.addEventListener("click", function() {
        // ACTION : On fait l'inverse (Retour à la galerie)
        document.querySelector(".modal-wrapper.modal-add").style.display = "none";     // On cache le formulaire
        document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "flex"; // On réaffiche la galerie
    });
}

// SECTION 7 : PRÉVISUALISATION DE L'IMAGE (AVANT ENVOI)

// On récupère les éléments liés à l'upload d'image
const inputPhoto = document.getElementById("file-upload"); // Le champ <input type="file"> (souvent caché)
const previewImage = document.getElementById("preview-img"); // La balise <img> vide qui servira à la prévisualisation
const labelPhoto = document.querySelector(".upload-label"); // Le bouton "+ Ajouter photo" visible
const iconPhoto = document.querySelector(".upload-icon");   // L'icône de montagne/image
const infoPhoto = document.querySelector(".upload-info");   // Le texte "jpg, png : 4mo max"

if (inputPhoto) {
    // On écoute l'événement "change" : se déclenche quand l'utilisateur a choisi un fichier
    inputPhoto.addEventListener("change", function() {
        // "this.files[0]" récupère le premier fichier sélectionné par l'utilisateur
        const file = this.files[0];

        // Si un fichier a bien été sélectionné
        if (file) {
            // Création d'un "FileReader" : un outil JS qui permet de lire le contenu d'un fichier sur l'ordi de l'utilisateur
            const reader = new FileReader();

            // On définit ce qui doit se passer une fois que la lecture est finie ("onload")
            reader.onload = function(e) {
                // e.target.result contient l'image convertie en code (Base64) lisible par le navigateur
                previewImage.src = e.target.result; // On donne cette source à notre balise <img>
                previewImage.style.display = "block"; // On rend l'image visible
                
                // On cache les éléments de décoration (label, icône, texte) pour que l'image prenne toute la place
                labelPhoto.style.display = "none";
                iconPhoto.style.display = "none";
                infoPhoto.style.display = "none";
            }

            // C'est cette ligne qui lance la lecture du fichier. Une fois lu, ça déclenchera le "onload" juste au-dessus.
            reader.readAsDataURL(file);
        }
    });
}

// SECTION 8 : REMPLISSAGE DU SELECT (MENU DÉROULANT CATÉGORIES)

// Fonction "async" car on fait un appel réseau (fetch) qui prend du temps
async function chargerCategoriesSelect() {
    // On cible la balise <select> du HTML par son ID
    const select = document.getElementById("category-select"); 
    
    // On remet le select à zéro (vide) et on ajoute une option "blanche" par défaut.
    // "disabled selected" fait que cette option est visible au début mais non cliquable ensuite.
    select.innerHTML = '<option value="" disabled selected></option>';
    
    try {
        // (Cette ligne est bien commentée car inutile : on ne veut pas les travaux ici, mais les catégories)
        // const reponse = await fetch("http://localhost:5678/api/works"); 
        
        // APPEL API : On demande la liste des catégories au serveur
        const reponseCats = await fetch("http://localhost:5678/api/categories");
        
        // CONVERSION : On transforme la réponse brute en tableau JavaScript exploitable
        const categories = await reponseCats.json();

        // BOUCLE : Pour chaque catégorie trouvée (ex: "Objets", "Appartements")...
        categories.forEach(categorie => {
            // ... on crée une balise <option> virtuelle
            const option = document.createElement("option");
            
            // On définit la VALEUR cachée qui sera envoyée au serveur (l'ID, ex: 1)
            option.value = categorie.id;      
            
            // On définit le TEXTE visible par l'utilisateur (le Nom, ex: "Objets")
            option.innerText = categorie.name; 
            
            // On insère cette option dans le menu déroulant <select>
            select.appendChild(option);
        });
    } catch (error) {
        // Si le serveur est éteint ou l'URL fausse, on affiche l'erreur dans la console
        console.error("Erreur lors du chargement des catégories dans le select", error);
    }
}

// On lance la fonction immédiatement au chargement de la page pour que le menu soit prêt
chargerCategoriesSelect();