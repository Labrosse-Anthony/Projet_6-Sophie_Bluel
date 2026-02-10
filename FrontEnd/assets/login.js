const form = document.querySelector("form"); // Sélectionne le formulaire dans le DOM
const errorMessage = document.getElementById("error-message"); // Sélectionne la zone d'affichage des erreurs

form.addEventListener("submit", async function(event) { // Écoute l'événement d'envoi du formulaire
    event.preventDefault(); // Empêche le rechargement automatique de la page

    const email = document.getElementById("email").value; // Récupère la valeur du champ email
    const password = document.getElementById("password").value; // Récupère la valeur du champ mot de passe

    try {
        const response = await fetch("http://localhost:5678/api/users/login", { // Envoie une requête à l'API
            method: "POST", // Utilise la méthode POST pour envoyer des données
            headers: {
                "Content-Type": "application/json" // Précise que le format envoyé est du JSON
            },
            body: JSON.stringify({ // Convertit l'objet JavaScript en chaîne JSON
                email: email, // L'email saisi
                password: password // Le mot de passe saisi
            })
        });

        if (response.ok) { // Vérifie si la réponse du serveur est un succès (code 200)
            const data = await response.json(); // Convertit la réponse en objet JavaScript
            localStorage.setItem("token", data.token); // Stocke le token d'authentification dans le navigateur
            window.location.href = "index.html"; // Redirige l'utilisateur vers la page d'accueil
        } else {
            errorMessage.innerText = "Erreur dans l’identifiant ou le mot de passe"; // Affiche un message d'erreur si la connexion échoue
        }

    } catch (error) {
        console.error("Erreur lors de la connexion :", error); // Affiche l'erreur technique dans la console
        errorMessage.innerText = "Une erreur est survenue, veuillez réessayer."; // Affiche un message d'erreur générique à l'utilisateur
    }
});