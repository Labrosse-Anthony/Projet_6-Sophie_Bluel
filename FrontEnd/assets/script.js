// SECTION 1 : RÉCUPERATION ET AFFICHAGE DES TRAVAUX
let travauxDonnees = []; // Variable globale pour stocker les données des travaux

async function travaux() {
    try {
        const reponse = await fetch("http://localhost:5678/api/works"); // Appel à l'API pour récupérer les travaux
        travauxDonnees = await reponse.json(); // Conversion de la réponse en JSON et stockage global
        
        genererTravaux(travauxDonnees); // Affichage initial de tous les travaux
        
        if (typeof genererTravauxModal === "function") { // Vérifie si la fonction de la modale existe
             genererTravauxModal(travauxDonnees); // Génère aussi les travaux dans la modale
        }
    } catch (error) {
        console.error("Erreur récupération travaux :", error); // Affiche l'erreur en console si l'API échoue
    }
}

function genererTravaux(travaux) {
    const sectionGallery = document.querySelector(".gallery"); // Sélectionne la div .gallery
    sectionGallery.innerHTML = ""; // Vide la galerie pour éviter les doublons

    for (let i = 0; i < travaux.length; i++) { // Boucle sur chaque projet
        const projet = travaux[i]; // Récupère le projet en cours

        const figure = document.createElement("figure"); // Crée une balise figure
        const image = document.createElement("img"); // Crée une balise img
        const figcaption = document.createElement("figcaption"); // Crée une légende

        image.src = projet.imageUrl; // Définit l'URL de l'image
        image.alt = projet.title; // Définit le texte alternatif
        figcaption.innerText = projet.title; // Ajoute le titre du projet

        figure.appendChild(image); // Insère l'image dans la figure
        figure.appendChild(figcaption); // Insère la légende dans la figure
        sectionGallery.appendChild(figure); // Ajoute la figure complète à la galerie
    }
}

travaux(); // Lance la fonction principale au chargement

// SECTION 2 : LES FILTRES
async function categories() {
    try {
        const reponse = await fetch("http://localhost:5678/api/categories"); // Appel API pour les catégories
        const categories = await reponse.json(); // Conversion en JSON
        genererFiltres(categories); // Lance la création des boutons
    } catch (error) {
        console.error("Erreur récupération catégories :", error); // Gestion des erreurs
    }
}

function genererFiltres(categories) {
    const sectionFiltres = document.querySelector(".filters"); // Sélectionne la div des filtres

    // --- Bouton "Tous" ---
    const boutonTous = document.createElement("button"); // Crée le bouton "Tous"
    boutonTous.innerText = "Tous"; // Ajoute le texte "Tous"
    boutonTous.classList.add('filtresbutton'); // Ajoute la classe CSS
    boutonTous.classList.add('active'); // Le rend vert par défaut
    sectionFiltres.appendChild(boutonTous); // L'ajoute au DOM

    boutonTous.addEventListener("click", function() { // Clic sur "Tous"
        document.querySelectorAll('.filtresbutton').forEach(btn => btn.classList.remove('active')); // Retire le vert partout
        boutonTous.classList.add('active'); // Met le vert sur "Tous"
        genererTravaux(travauxDonnees); // Affiche TOUTES les images (reset)
    });

    // --- Boutons par catégorie ---
    for (let i = 0; i < categories.length; i++) { // Boucle sur chaque catégorie reçue
        const categorie = categories[i]; // Catégorie en cours
        const bouton = document.createElement("button"); // Crée un bouton
        bouton.innerText = categorie.name; // Met le nom (ex: Objets)
        bouton.classList.add('filtresbutton'); // Ajoute la classe CSS

        bouton.addEventListener("click", function() { // Clic sur une catégorie
            document.querySelectorAll('.filtresbutton').forEach(btn => btn.classList.remove('active')); // Reset style
            bouton.classList.add('active'); // Active le bouton cliqué

            const travauxFiltres = travauxDonnees.filter(function(travail) { // Filtre le tableau global
                return travail.category.id === categorie.id; // Garde si l'ID correspond
            });

            genererTravaux(travauxFiltres); // Affiche seulement les filtrés
        });

        sectionFiltres.appendChild(bouton); // Ajoute le bouton à la page
    }
}

categories(); // Lance la création des filtres

// SECTION 3 : MODE ADMINISTRATEUR
const token = localStorage.getItem("token"); // Récupère le token de connexion

if (token) { // Si un token existe (utilisateur connecté)
    const editionMode = document.querySelector(".edition-mode"); // Barre noire
    if (editionMode) editionMode.style.display = "flex"; // Affiche la barre noire

    const editBtn = document.querySelector(".modal-trigger"); // Bouton modifier
    if (editBtn) {
        editBtn.style.display = "flex"; // Affiche le bouton
        editBtn.removeAttribute("hidden"); // Sécurité pour l'afficher
    }

    const filtersElement = document.querySelector(".filters"); // Les filtres
    if (filtersElement) filtersElement.style.display = "none"; // Cache les filtres

    const loginLink = document.getElementById("login-link"); // Lien login
    if (loginLink) {
        loginLink.innerText = "logout"; // Change le texte en logout
        
        loginLink.addEventListener("click", function(event) { // Clic sur logout
            event.preventDefault(); // Bloque le lien
            localStorage.removeItem("token"); // Supprime le token
            window.location.reload(); // Recharge la page (mode visiteur)
        });
    }

    // SECTION 4 : GESTION MODALE
    const modal = document.getElementById("modal1"); // La modale
    const btnModifier = document.querySelector(".modal-trigger"); // Le déclencheur
    const boutonsFermer = document.querySelectorAll(".modal-close"); // Les croix de fermeture
    const modalBackground = document.querySelector(".modal"); // L'arrière-plan sombre

    if (modal && btnModifier) { // Si les éléments existent
        btnModifier.addEventListener("click", function(event) { // Ouverture
            event.preventDefault(); // Bloque le comportement par défaut
            modal.style.display = "flex"; // Affiche la modale
            modal.removeAttribute("aria-hidden"); // Accessibilité
        });

        boutonsFermer.forEach(bouton => { // Pour chaque bouton de fermeture
            bouton.addEventListener("click", function() { // Fermeture
                modal.style.display = "none"; // Cache la modale
                modal.setAttribute("aria-hidden", "true"); // Accessibilité
            });
        });

        modalBackground.addEventListener("click", function(event) { // Clic extérieur
            if (event.target === modalBackground) { // Vérifie qu'on clique sur le fond
                modal.style.display = "none"; // Cache la modale
                modal.setAttribute("aria-hidden", "true"); // Accessibilité
            }
        });
    }
}