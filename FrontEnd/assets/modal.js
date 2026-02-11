// SECTION 1 : GESTION MODALE
const modal = document.getElementById("modal1"); // La modale
const btnModifier = document.querySelector(".modal-trigger"); // Le déclencheur
const boutonsFermer = document.querySelectorAll(".modal-close"); // Les croix de fermeture
const modalBackground = document.querySelector(".modal"); // L'arrière-plan sombre

if (modal && btnModifier) { // Si les éléments existent
    btnModifier.addEventListener("click", function (event) { // Ouverture
        event.preventDefault(); // Bloque le comportement par défaut
        modal.style.display = "flex"; // Affiche la modale
        modal.removeAttribute("aria-hidden"); // Accessibilité
    });

    boutonsFermer.forEach(bouton => { // Pour chaque bouton de fermeture
        bouton.addEventListener("click", function () { // Fermeture
            modal.style.display = "none"; // Cache la modale
            modal.setAttribute("aria-hidden", "true"); // Accessibilité
            document.querySelector(".modal-wrapper.modal-add").style.display = "none"; // Cache le formulaire d'ajout
            document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "flex"; // Affiche la galerie
        });
    });

    modalBackground.addEventListener("click", function (event) { // Clic extérieur
        if (event.target === modalBackground) { // Vérifie qu'on clique sur le fond
            modal.style.display = "none"; // Cache la modale
            modal.setAttribute("aria-hidden", "true"); // Accessibilité
            document.querySelector(".modal-wrapper.modal-add").style.display = "none"; // Cache le formulaire d'ajout
            document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "flex"; // Affiche la galerie
        }
    });
}

// SECTION 2 : GÉNÉRATION GALERIE MODALE ET SUPPRESSION
function genererTravauxModal(travaux) {
    const modalGallery = document.querySelector(".modal-gallery"); // Sélectionne le conteneur de la galerie
    modalGallery.innerHTML = ""; // Vide la galerie pour éviter les doublons

    for (let i = 0; i < travaux.length; i++) { // Parcourt tous les travaux reçus
        const projet = travaux[i]; // Récupère le projet en cours

        const figure = document.createElement("figure"); // Crée la balise figure
        const image = document.createElement("img"); // Crée la balise img
        const span = document.createElement("span"); // Crée le conteneur noir pour l'icône
        const trashIcon = document.createElement("i"); // Crée l'icône poubelle

        image.src = projet.imageUrl; // Définit l'URL de l'image
        image.alt = projet.title; // Définit le texte alternatif
        image.style.width = "100%"; // Ajuste la largeur de l'image

        trashIcon.classList.add("fa-solid", "fa-trash-can"); // Ajoute les classes FontAwesome à l'icône
        span.classList.add("trash-icon"); // Ajoute la classe CSS personnalisée au span
        span.id = projet.id; // Stocke l'ID du projet dans le span

        span.appendChild(trashIcon); // Insère l'icône dans le span
        figure.appendChild(image); // Insère l'image dans la figure
        figure.appendChild(span); // Insère le span dans la figure
        modalGallery.appendChild(figure); // Ajoute la figure complète à la galerie

        span.addEventListener("click", function (event) { // Écoute le clic sur la poubelle
            event.preventDefault(); // Bloque le comportement par défaut
            event.stopPropagation(); // Empêche la propagation du clic
            supprimerProjet(projet.id); // Lance la fonction de suppression
        });
    }
}

async function supprimerProjet(id) {
    const token = localStorage.getItem("token"); // Récupère le token de connexion

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, { // Envoie une requête DELETE à l'API
            method: "DELETE", // Méthode HTTP utilisée
            headers: {
                "Authorization": `Bearer ${token}` // Ajoute le token dans l'en-tête
            }
        });

        if (response.ok) { // Si la suppression a réussi
            travauxDonnees = travauxDonnees.filter(travail => travail.id !== id); // Filtre le tableau local pour retirer le projet
            genererTravaux(travauxDonnees); // Met à jour la galerie de la page d'accueil
            genererTravauxModal(travauxDonnees); // Met à jour la galerie de la modale
            console.log("Projet supprimé !"); // Affiche un message de succès en console
        } else {
            console.error("Erreur lors de la suppression"); // Affiche une erreur si l'API refuse
        }
    } catch (error) {
        console.error("Erreur réseau :", error); // Affiche une erreur technique (ex: serveur éteint)
    }
}

// SECTION 3 : NAVIGATION (AFFICHER/CACHER LES VUES)
const btnAjouterPhoto = document.querySelector(".btn-add-photo"); // Sélectionne le bouton "Ajouter une photo"
const btnRetour = document.querySelector(".modal-back"); // Sélectionne la flèche de retour
const vueGalerie = document.querySelector(".modal-view-gallery"); // Sélectionne la vue "Galerie"
const vueAjout = document.querySelector(".modal-add"); // Sélectionne la vue "Ajout photo"

if (btnAjouterPhoto) { // Vérifie si le bouton existe
    btnAjouterPhoto.addEventListener("click", function () { // Au clic sur "Ajouter"
        document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "none"; // Cache la galerie
        document.querySelector(".modal-wrapper.modal-add").style.display = "flex"; // Affiche le formulaire
    });
}

if (btnRetour) { // Vérifie si le bouton retour existe
    btnRetour.addEventListener("click", function () { // Au clic sur "Retour"
        document.querySelector(".modal-wrapper.modal-add").style.display = "none"; // Cache le formulaire
        document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "flex"; // Affiche la galerie
    });
}

// SECTION 4 : PRÉVISUALISATION DE L'IMAGE UPLOADÉE
const inputPhoto = document.getElementById("file-upload"); // Sélectionne l'input file (caché)
const previewImage = document.getElementById("preview-img"); // Sélectionne l'image de prévisualisation
const labelPhoto = document.querySelector(".upload-label"); // Sélectionne le bouton bleu "+ Ajouter"
const iconPhoto = document.querySelector(".upload-icon"); // Sélectionne l'icône image par défaut
const infoPhoto = document.querySelector(".upload-info"); // Sélectionne le texte d'information (jpg, png...)

if (inputPhoto) { // Vérifie si l'input existe
    inputPhoto.addEventListener("change", function () { // Écoute le changement de fichier
        const file = this.files[0]; // Récupère le premier fichier sélectionné

        if (file) { // Si un fichier est bien présent
            const reader = new FileReader(); // Crée un outil de lecture de fichier

            reader.onload = function (e) { // Une fois la lecture terminée
                previewImage.src = e.target.result; // Définit la source de l'image avec le résultat
                previewImage.style.display = "block"; // Rend l'image visible

                labelPhoto.style.display = "none"; // Cache le bouton d'ajout
                iconPhoto.style.display = "none"; // Cache l'icône par défaut
                infoPhoto.style.display = "none"; // Cache le texte d'info
                checkForm(); // Vérifie le formulaire pour activer le bouton Valider
            }

            reader.readAsDataURL(file); // Lance la lecture du fichier en URL de données
        }
    });
}

// SECTION 5 : CHARGEMENT DES CATÉGORIES DANS LE SELECT
async function chargerCategoriesSelect() {
    const select = document.getElementById("category-select"); // Sélectionne le menu déroulant
    select.innerHTML = '<option value="" disabled selected></option>'; // Ajoute une option vide par défaut

    try {
        const reponse = await fetch("http://localhost:5678/api/categories"); // Appel API pour récupérer les catégories
        const categories = await reponse.json(); // Convertit la réponse en JSON

        categories.forEach(categorie => { // Pour chaque catégorie reçue
            const option = document.createElement("option"); // Crée une balise option
            option.value = categorie.id; // Définit la valeur (ID)
            option.innerText = categorie.name; // Définit le texte visible (Nom)
            select.appendChild(option); // Ajoute l'option au select
        });
    } catch (error) {
        console.error("Erreur chargement catégories", error); // Affiche une erreur en cas de problème
    }
}

chargerCategoriesSelect(); // Lance la fonction au chargement de la page

// SECTION 6 : VÉRIFICATION DU FORMULAIRE (COULEUR BOUTON)
const titleInput = document.getElementById("title-input"); // Sélectionne le champ Titre
const categorySelect = document.getElementById("category-select"); // Sélectionne le champ Catégorie
const submitButton = document.getElementById("btn-valider"); // Sélectionne le bouton Valider

function checkForm() {
    // Vérifie si Titre rempli ET Catégorie choisie ET Fichier présent
    if (titleInput.value !== "" && categorySelect.value !== "" && inputPhoto.files[0]) {
        submitButton.style.backgroundColor = "#1D6154"; // Change la couleur en vert
        submitButton.disabled = false; // Active le bouton
        submitButton.style.cursor = "pointer"; // Change le curseur en main
    } else {
        submitButton.style.backgroundColor = "#A7A7A7"; // Change la couleur en gris
        submitButton.disabled = true; // Désactive le bouton
        submitButton.style.cursor = "default"; // Change le curseur en défaut
    }
}

// Ajout des écouteurs pour vérifier en temps réel
if (titleInput) titleInput.addEventListener("input", checkForm); // Vérifie quand on tape un titre
if (categorySelect) categorySelect.addEventListener("change", checkForm); // Vérifie quand on change de catégorie

// SECTION 7 : ENVOI DU NOUVEAU PROJET
const formAjout = document.getElementById("add-photo"); // Sélectionne le formulaire d'ajout

if (formAjout) { // Vérifie si le formulaire existe
    formAjout.addEventListener("submit", async function (event) { // Écoute la soumission du formulaire
        event.preventDefault(); // Empêche le rechargement de la page

        const token = localStorage.getItem("token"); // Vérifie si l'utilisateur est connecté
        if (!token) { // Si pas de token
            alert("Veuillez vous connecter"); // Affiche une alerte
            return; // Arrête la fonction
        }

        const formData = new FormData(); // Crée un objet FormData pour envoyer des fichiers
        formData.append("image", inputPhoto.files[0]); // Ajoute le fichier image
        formData.append("title", titleInput.value); // Ajoute le titre
        formData.append("category", categorySelect.value); // Ajoute la catégorie

        try {
            const response = await fetch("http://localhost:5678/api/works", { // Envoie la requête POST à l'API
                method: "POST", // Méthode utilisée
                headers: {
                    "Authorization": `Bearer ${token}` // Ajoute le token d'authentification
                },
                body: formData // Ajoute les données du formulaire
            });

            if (response.ok) { // Si la création a réussi (code 200/201)
                const nouveauProjet = await response.json(); // Récupère le projet créé
                travauxDonnees.push(nouveauProjet); // Ajoute le projet aux données locales
                genererTravaux(travauxDonnees); // Met à jour la galerie accueil
                genererTravauxModal(travauxDonnees); // Met à jour la galerie modale

                // Reset de l'interface
                formAjout.reset(); // Vide les champs du formulaire
                previewImage.style.display = "none"; // Cache l'image de prévisualisation
                labelPhoto.style.display = "flex"; // Affiche le bouton d'ajout
                iconPhoto.style.display = "block"; // Affiche l'icône par défaut
                infoPhoto.style.display = "block"; // Affiche le texte d'info
                checkForm(); // Remet le bouton Valider en gris

                // Retour à la vue galerie (sans fermer la modale)
                document.querySelector(".modal-wrapper.modal-add").style.display = "none"; // Cache la vue ajout
                document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "flex"; // Affiche la vue galerie

                console.log("Projet ajouté !"); // Affiche une confirmation à l'utilisateur
            } else {
                alert("Erreur lors de l'ajout (Vérifiez image < 4Mo)"); // Affiche une erreur si l'API refuse
            }
        } catch (error) {
            console.error("Erreur envoi", error); // Affiche une erreur technique
        }
    });
}