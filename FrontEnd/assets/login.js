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
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // Si la réponse est OK (status 200)
        if (response.ok) {
            const data = await response.json();
            
            // IMPORTANT : On stocke le token (le "laissez-passer") dans le navigateur
            sessionStorage.setItem("token", data.token);
            
            // On redirige vers la page d'accueil
            window.location.href = "index.html";
        } else {
            // 5. Si erreur (401 ou 404), on affiche un message
            errorMessage.innerText = "Erreur dans l’identifiant ou le mot de passe";
        }

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        errorMessage.innerText = "Une erreur est survenue, veuillez réessayer.";
    }
});