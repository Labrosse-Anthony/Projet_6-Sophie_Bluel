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
      resetFormulaireAjout(); // Nettoie le formulaire lors de la fermeture
      modal.setAttribute("aria-hidden", "true"); // Accessibilité
      document.querySelector(".modal-wrapper.modal-add").style.display = "none"; // Cache le formulaire d'ajout
      document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "flex"; // Affiche la galerie
    });
  });

  modalBackground.addEventListener("click", function (event) { // Clic extérieur
    if (event.target === modalBackground) { // Vérifie qu'on clique sur le fond
      modal.style.display = "none"; // Cache la modale
      resetFormulaireAjout(); // Nettoie le formulaire si on clique à côté
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
      travauxDonnees = travauxDonnees.filter(travail => travail.id !== id); // Retire le projet localement
      genererTravaux(travauxDonnees); // Met à jour la galerie de la page d'accueil
      genererTravauxModal(travauxDonnees); // Met à jour la galerie de la modale
      console.log("Projet supprimé !");
    } else {
      console.error("Erreur lors de la suppression");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
}

// SECTION 3 : NAVIGATION (AFFICHER/CACHER LES VUES)
const btnAjouterPhoto = document.querySelector(".btn-add-photo"); // Bouton "Ajouter une photo"
const btnRetour = document.querySelector(".modal-back"); // Flèche de retour

if (btnAjouterPhoto) {
  btnAjouterPhoto.addEventListener("click", function () {
    document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "none";
    document.querySelector(".modal-wrapper.modal-add").style.display = "flex";
  });
}

if (btnRetour) {
  btnRetour.addEventListener("click", function () {
    resetFormulaireAjout(); // Nettoie le formulaire en revenant à la galerie
    document.querySelector(".modal-wrapper.modal-add").style.display = "none";
    document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "flex";
  });
}

// SECTION 4 : PRÉVISUALISATION DE L'IMAGE UPLOADÉE
const inputPhoto = document.getElementById("file-upload"); // Input file
const previewImage = document.getElementById("preview-img"); // Image prévisualisation
const labelPhoto = document.querySelector(".upload-label"); // Bouton bleu
const iconPhoto = document.querySelector(".upload-icon"); // Icône grise
const infoPhoto = document.querySelector(".upload-info"); // Texte info

if (inputPhoto) {
  inputPhoto.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        labelPhoto.style.display = "none";
        iconPhoto.style.display = "none";
        infoPhoto.style.display = "none";
        checkForm(); // Vérifie le formulaire pour activer le bouton Valider
      }
      reader.readAsDataURL(file);
    }
  });
}

// SECTION 5 : CHARGEMENT DES CATÉGORIES DANS LE SELECT
async function chargerCategoriesSelect() {
  const select = document.getElementById("category-select");
  select.innerHTML = '<option value="" disabled selected></option>';

  try {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    categories.forEach(categorie => {
      const option = document.createElement("option");
      option.value = categorie.id;
      option.innerText = categorie.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur chargement catégories", error);
  }
}

chargerCategoriesSelect();

// SECTION 6 : VÉRIFICATION DU FORMULAIRE (COULEUR BOUTON)
const titleInput = document.getElementById("title-input");
const categorySelect = document.getElementById("category-select");
const submitButton = document.getElementById("btn-valider");

function checkForm() {
  if (titleInput.value !== "" && categorySelect.value !== "" && inputPhoto.files[0]) {
    submitButton.style.backgroundColor = "#1D6154";
    submitButton.disabled = false;
    submitButton.style.cursor = "pointer";
  } else {
    submitButton.style.backgroundColor = "#A7A7A7";
    submitButton.disabled = true;
    submitButton.style.cursor = "default";
  }
}

if (titleInput) titleInput.addEventListener("input", checkForm);
if (categorySelect) categorySelect.addEventListener("change", checkForm);

// SECTION 7 : ENVOI DU NOUVEAU PROJET
const formAjout = document.getElementById("add-photo");

if (formAjout) {
  formAjout.addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Veuillez vous connecter");
      return;
    }

    const formData = new FormData();
    formData.append("image", inputPhoto.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const nouveauProjet = await response.json();
        travauxDonnees.push(nouveauProjet);
        genererTravaux(travauxDonnees);
        genererTravauxModal(travauxDonnees);

        resetFormulaireAjout(); // Nettoie tout après succès

        document.querySelector(".modal-wrapper.modal-add").style.display = "none";
        document.querySelector(".modal-wrapper.modal-view-gallery").style.display = "flex";
        console.log("Projet ajouté !");
      } else {
        alert("Erreur lors de l'ajout (Vérifiez image < 4Mo)");
      }
    } catch (error) {
      console.error("Erreur envoi", error);
    }
  });
}

// SECTION 8 : RÉINITIALISATION DU FORMULAIRE
function resetFormulaireAjout() {
  if (formAjout) formAjout.reset(); // Vide les champs texte, la catégorie et l'input fichier
  if (previewImage) previewImage.style.display = "none"; // Cache la miniature
  if (labelPhoto) labelPhoto.style.display = "flex"; // Réaffiche le bouton bleu
  if (iconPhoto) iconPhoto.style.display = "block"; // Réaffiche l'icône
  if (infoPhoto) infoPhoto.style.display = "block"; // Réaffiche le texte d'instruction
  
  if (typeof checkForm === "function") checkForm(); // Grise le bouton "Valider"
}
