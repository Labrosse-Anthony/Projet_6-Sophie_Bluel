// SECTION 1 : GÉNÉRATION GALERIE MODALE ET SUPPRESSION
function genererTravauxModal(travaux) {
    const modalGallery = document.querySelector(".modal-gallery"); // Sélectionne le conteneur de la galerie
    modalGallery.innerHTML = ""; // Vide la galerie pour éviter les doublons

    for (let i = 0; i < travaux.length; i++) { // Parcourt tous les travaux
        const projet = travaux[i]; // Récupère le projet en cours

        const figure = document.createElement("figure"); // Crée la balise figure
        const image = document.createElement("img"); // Crée l'image
        const span = document.createElement("span"); // Crée le conteneur de l'icône
        const trashIcon = document.createElement("i"); // Crée l'icône poubelle

        image.src = projet.imageUrl; // Définit l'URL de l'image
        image.alt = projet.title; // Définit le texte alternatif
        image.style.width = "100%"; // Ajuste la largeur

        trashIcon.classList.add("fa-solid", "fa-trash-can"); // Ajoute les classes FontAwesome
        span.classList.add("trash-icon"); // Ajoute la classe CSS personnalisée
        span.id = projet.id; // Stocke l'ID du projet

        span.appendChild(trashIcon); // Insère la poubelle dans le span
        figure.appendChild(image); // Insère l'image dans la figure
        figure.appendChild(span); // Insère le span (poubelle) dans la figure
        modalGallery.appendChild(figure); // Ajoute le tout à la galerie

        span.addEventListener("click", function(event) { // Écoute le clic sur la poubelle
            event.preventDefault(); // Bloque le comportement par défaut
            event.stopPropagation(); // Empêche la fermeture de la modale
            supprimerProjet(projet.id); // Lance la suppression
        });
    }
}

async function supprimerProjet(id) {
    const token = localStorage.getItem("token"); // Récupère le token de connexion

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, { // Requête DELETE vers l'API
            method: "DELETE", // Méthode de suppression
            headers: {
                "Authorization": `Bearer ${token}` // En-tête d'autorisation
            }
        });

        if (response.ok) { // Si la suppression a réussi
            travauxDonnees = travauxDonnees.filter(travail => travail.id !== id); // Met à jour les données locales
            genererTravaux(travauxDonnees); // Rafraîchit la page d'accueil
            genererTravauxModal(travauxDonnees); // Rafraîchit la modale
            console.log("Projet supprimé !"); // Log de confirmation
        } else {
            console.error("Erreur lors de la suppression"); // Log d'erreur
        }
    } catch (error) {
        console.error("Erreur réseau :", error); // Gestion des erreurs techniques
    }
}

// SECTION 2 : NAVIGATION (AFFICHER/CACHER LES VUES)
const btnAjouterPhoto = document.querySelector(".btn-add-photo"); // Bouton "Ajouter une photo"
const btnRetour = document.querySelector(".modal-back"); // Flèche retour
const vueGalerie = document.querySelector(".modal-view-gallery"); // Vue liste des photos
const vueAjout = document.querySelector(".modal-add"); // Vue formulaire d'ajout

if (btnAjouterPhoto) { // Si le bouton existe
    btnAjouterPhoto.addEventListener("click", function() { // Au clic
        document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "none"; // Cache la galerie
        document.querySelector(".modal-wrapper.modal-add").style.display = "flex"; // Affiche le formulaire
    });
}

if (btnRetour) { // Si le bouton retour existe
    btnRetour.addEventListener("click", function() { // Au clic
        document.querySelector(".modal-wrapper.modal-add").style.display = "none"; // Cache le formulaire
        document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "flex"; // Affiche la galerie
    });
}

// SECTION 3 : PRÉVISUALISATION DE L'IMAGE UPLOADÉE
const inputPhoto = document.getElementById("file-upload"); // Input file caché
const previewImage = document.getElementById("preview-img"); // Image de prévisualisation
const labelPhoto = document.querySelector(".upload-label"); // Label bouton bleu
const iconPhoto = document.querySelector(".upload-icon"); // Icône image
const infoPhoto = document.querySelector(".upload-info"); // Texte d'info

if (inputPhoto) { // Si l'input existe
    inputPhoto.addEventListener("change", function() { // Quand un fichier est choisi
        const file = this.files[0]; // Récupère le fichier

        if (file) { // Si un fichier est présent
            const reader = new FileReader(); // Outil de lecture de fichier

            reader.onload = function(e) { // Une fois lu
                previewImage.src = e.target.result; // Affiche l'image
                previewImage.style.display = "block"; // Rend l'image visible
                
                labelPhoto.style.display = "none"; // Cache le label
                iconPhoto.style.display = "none"; // Cache l'icône
                infoPhoto.style.display = "none"; // Cache le texte info
                checkForm(); // Vérifie le formulaire pour activer le bouton
            }

            reader.readAsDataURL(file); // Lance la lecture
        }
    });
}

// SECTION 4 : CHARGEMENT DES CATÉGORIES DANS LE SELECT
async function chargerCategoriesSelect() {
    const select = document.getElementById("category-select"); // Sélectionne le menu déroulant
    select.innerHTML = '<option value="" disabled selected></option>'; // Option vide par défaut

    try {
        const reponse = await fetch("http://localhost:5678/api/categories"); // Appel API catégories
        const categories = await reponse.json(); // Conversion en JSON

        categories.forEach(categorie => { // Pour chaque catégorie
            const option = document.createElement("option"); // Crée une option
            option.value = categorie.id; // Valeur = ID
            option.innerText = categorie.name; // Texte = Nom
            select.appendChild(option); // Ajoute au select
        });
    } catch (error) {
        console.error("Erreur chargement catégories", error); // Log erreur
    }
}

chargerCategoriesSelect(); // Exécute la fonction au chargement

// SECTION 5 : VÉRIFICATION DU FORMULAIRE (COULEUR BOUTON)
const titleInput = document.getElementById("title-input"); // Champ titre
const categorySelect = document.getElementById("category-select"); // Champ catégorie
const submitButton = document.getElementById("btn-valider"); // Bouton valider

function checkForm() {
    // Vérifie si Titre rempli ET Catégorie choisie ET Fichier présent
    if (titleInput.value !== "" && categorySelect.value !== "" && inputPhoto.files[0]) {
        submitButton.style.backgroundColor = "#1D6154"; // Vert
        submitButton.disabled = false; // Active le bouton
        submitButton.style.cursor = "pointer"; // Curseur main
    } else {
        submitButton.style.backgroundColor = "#A7A7A7"; // Gris
        submitButton.disabled = true; // Désactive le bouton
        submitButton.style.cursor = "default"; // Curseur défaut
    }
}

// Ajout des écouteurs pour vérifier en temps réel
if(titleInput) titleInput.addEventListener("input", checkForm); // Au changement de titre
if(categorySelect) categorySelect.addEventListener("change", checkForm); // Au changement de catégorie
// L'input photo appelle déjà checkForm() dans son listener "change" plus haut

// SECTION 6 : ENVOI DU NOUVEAU PROJET
const formAjout = document.getElementById("add-photo"); // Le formulaire

if (formAjout) { // Si le formulaire existe
    formAjout.addEventListener("submit", async function(event) { // À la soumission
        event.preventDefault(); // Bloque le rechargement de page

        const token = localStorage.getItem("token"); // Vérifie le token
        if (!token) { // Si pas connecté
            alert("Veuillez vous connecter"); // Alerte
            return; // Stoppe tout
        }

        const formData = new FormData(); // Crée l'objet pour envoyer des fichiers
        formData.append("image", inputPhoto.files[0]); // Ajoute l'image
        formData.append("title", titleInput.value); // Ajoute le titre
        formData.append("category", categorySelect.value); // Ajoute la catégorie

        try {
            const response = await fetch("http://localhost:5678/api/works", { // Requête POST
                method: "POST", // Méthode
                headers: {
                    "Authorization": `Bearer ${token}` // Authentification
                },
                body: formData // Données
            });

            if (response.ok) { // Si succès (200 ou 201)
                const nouveauProjet = await response.json(); // Récupère le projet créé
                travauxDonnees.push(nouveauProjet); // Ajoute aux données locales
                genererTravaux(travauxDonnees); // Met à jour l'accueil
                genererTravauxModal(travauxDonnees); // Met à jour la modale

                // Reset de l'interface
                formAjout.reset(); // Vide les champs
                previewImage.style.display = "none"; // Cache la preview
                labelPhoto.style.display = "flex"; // Affiche le label
                iconPhoto.style.display = "block"; // Affiche l'icône
                infoPhoto.style.display = "block"; // Affiche le texte
                checkForm(); // Remet le bouton en gris

                // Fermeture et retour à la galerie
                document.querySelector(".modal-wrapper.modal-add").style.display = "none"; // Cache ajout
                document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "flex"; // Affiche galerie
                document.getElementById("modal1").style.display = "none"; // Ferme la modale
                document.getElementById("modal1").setAttribute("aria-hidden", "true"); // Accessibilité

                alert("Projet ajouté !"); // Confirmation
            } else {
                alert("Erreur lors de l'ajout (Vérifiez image < 4Mo)"); // Erreur API
            }
        } catch (error) {
            console.error("Erreur envoi", error); // Erreur réseau
        }
    });
}