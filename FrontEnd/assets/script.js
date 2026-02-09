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
        span.addEventListener("click", function(event) { // 1. On ajoute 'event' entre parenthèses
            event.preventDefault();  // 2. On empêche tout comportement par défaut (rechargement...)
            event.stopPropagation(); // 3. On empêche le clic de "remonter" et de fermer la modale
            supprimerProjet(projet.id); // 4. On lance la suppression
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

//CHANGEMENT DE COULEUR DU BOUTON QUAND TOUT EST REMPLI

// On récupère les éléments du formulaire
const titleInput = document.getElementById("title-input");
const categorySelect = document.getElementById("category-select");
const fileInput = document.getElementById("file-upload");
const submitButton = document.getElementById("btn-valider");

// Fonction qui vérifie si tout est rempli
function checkForm() {
    // On vérifie : Est-ce que le titre n'est pas vide ? ET Est-ce qu'une catégorie est choisie ? ET Est-ce qu'il y a un fichier ?
    if (titleInput.value !== "" && categorySelect.value !== "" && fileInput.files[0]) {
        
        // Si tout est bon : Bouton VERT et CLIQUABLE
        submitButton.style.backgroundColor = "#1D6154";
        submitButton.disabled = false;
        
    } else {
        
        // Si il manque quelque chose : Bouton GRIS et NON-CLIQUABLE
        submitButton.style.backgroundColor = "#A7A7A7";
        submitButton.disabled = true;
    }
}

// On demande à la page de surveiller les changements sur les 3 champs
titleInput.addEventListener("input", checkForm);      // Quand on écrit
categorySelect.addEventListener("change", checkForm); // Quand on choisit une catégorie
fileInput.addEventListener("change", checkForm);      // Quand on ajoute une photo

//SECTION 9 : ENVOI DU FORMULAIRE (LA CRÉATION DU PROJET)

// On cible le formulaire complet via son ID
const formAjout = document.getElementById("add-photo"); 

// Vérification de sécurité : si le formulaire n'existe pas (ex: page login), on ne fait rien
if (formAjout) {
    
    // On écoute l'événement "submit" (déclenché par le bouton "Valider" ou la touche Entrée)
    formAjout.addEventListener("submit", async function(event) {
        
        // TRÈS IMPORTANT : On empêche le rechargement automatique de la page.
        // Sans ça, la page se rafraîchit avant même que le code JS ne puisse s'exécuter.
        event.preventDefault(); 

        // On récupère le "token" stocké lors de la connexion
        const token = localStorage.getItem("token");
        
        // Si l'utilisateur n'a pas de token (pas connecté ou session expirée), on bloque tout.
        if (!token) {
            alert("Vous devez être connecté pour ajouter un projet.");
            return; // Le "return" arrête la fonction ici.
        }

        // --- PRÉPARATION DES DONNÉES ---
        
        // On crée un objet "FormData". 
        // C'est une "enveloppe" spéciale obligatoire pour envoyer des FICHIERS via fetch.
        // (Le format JSON classique ne marche pas pour les images).
        const formData = new FormData();
        
        // On remplit l'enveloppe :
        // 1. L'image (on prend le premier fichier du champ input type="file")
        formData.append("image", document.getElementById("file-upload").files[0]); 
        // 2. Le titre (texte)
        formData.append("title", document.getElementById("title-input").value);    
        // 3. La catégorie (l'ID sélectionné dans le menu déroulant)
        formData.append("category", document.getElementById("category-select").value); 

        // --- ENVOI AU SERVEUR ---
        try {
            // On envoie la requête à l'API
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST", // Méthode POST pour CRÉER
                headers: {
                    // On présente le badge d'authentification (Token)
                    // NOTE : On ne met PAS "Content-Type": "application/json" ici car FormData le gère tout seul !
                    "Authorization": `Bearer ${token}` 
                },
                body: formData // On met notre enveloppe dans le corps de la requête
            });

            // Si le serveur répond "Succès" (Code 201 Created ou 200 OK)
            if (response.ok) {
                // Le serveur nous renvoie le projet qu'il vient de créer (avec son nouvel ID)
                const nouveauProjet = await response.json();
                
                // --- MISE À JOUR VISUELLE (SANS RECHARGER LA PAGE) ---
                
                // 1. On ajoute le nouveau projet à notre liste locale 'travauxDonnees'
                travauxDonnees.push(nouveauProjet);
                
                // 2. On régénère la galerie principale (l'accueil) avec la nouvelle photo
                genererTravaux(travauxDonnees);       
                
                // 3. On régénère la galerie de la modale (les petites photos avec poubelles)
                genererTravauxModal(travauxDonnees);  

                // --- NETTOYAGE DU FORMULAIRE ---
                
                formAjout.reset(); // Vide les champs texte
                
                // On remet le design de la zone d'upload à zéro (on cache l'image, on remet l'icône bleue)
                previewImage.style.display = "none";
                labelPhoto.style.display = "flex";
                iconPhoto.style.display = "block";
                infoPhoto.style.display = "block";

                // --- FERMETURE DE LA MODALE ---
                
                // On cache la fenêtre d'ajout
                document.querySelector(".modal-wrapper.modal-add").style.display = "none";
                // On prépare la fenêtre galerie pour la prochaine ouverture (retour à l'état initial)
                document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "flex";
                
                // Petit message de confirmation
                alert("Projet ajouté avec succès !");
            
            } else {
                // --- GESTION DES ERREURS SERVEUR ---
                
                // Erreur 401 = Non autorisé (Token invalide ou expiré)
                if (response.status === 401) {
                    alert("Votre session a expiré. Veuillez vous reconnecter.");
                    window.location.href = "login.html"; // On renvoie vers le login
                } else {
                    // Autres erreurs (ex: image trop lourde, titre manquant...)
                    alert("Erreur : Vérifiez les champs (Titre, Catégorie) et la taille de l'image (max 4Mo).");
                }
            }       
        } catch (error) {
            // Si le réseau plante complètement
            console.error("Erreur technique lors de l'envoi :", error);
        }
    });
}