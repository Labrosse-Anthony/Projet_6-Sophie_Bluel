// On sélectionne le formulaire
const form = document.querySelector("form");
const errorMessage = document.getElementById("error-message");

// On écoute l'événement "submit" (quand on clique sur "Se connecter")
form.addEventListener("submit", async function(event) {
    // On empêche le rechargement de la page par défaut
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // On prépare l'envoi vers l'API
    try {
        // await = "Mets-toi en pause et attends la réponse du serveur avant de continuer"
        // fetch = permet d'envoyer des données à une adresse web (l'API)
        const response = await fetch("http://localhost:5678/api/users/login", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json" // On précise au serveur qu'on lui envoie du format JSON
            },
            // // On transforme notre objet JavaScript (email + password) en texte JSON pour qu'il puisse voyager sur le réseau
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // Si la réponse est OK (status 200)
        if (response.ok) {
            const data = await response.json();
            
            // IMPORTANT : On stocke le token (le "laissez-passer") dans le navigateur
            localStorage.setItem("token", data.token);
            
            // On redirige vers la page d'accueil
            window.location.href = "index.html";
        } else {
            // 5. Si erreur (401 ou 404), on affiche un message
            errorMessage.innerText = "Erreur dans l’identifiant ou le mot de passe";
        }

    } catch (error) {
        // Si le serveur est éteint, si l'URL est fausse ou si internet est coupé, le code saute directement ici.
        console.error("Erreur lors de la connexion :", error);
        errorMessage.innerText = "Une erreur est survenue, veuillez réessayer.";
    }
});