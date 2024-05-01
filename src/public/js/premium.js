const form = document.getElementById("form-premium");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("id-user").value;
    const endpointDocuments = `/api/users/${userId}/documents`;
    const data = new FormData(form);

    let aux = "";

    const premiumContainerInput = document.getElementById("premiumContainerInput");

    const premiumInput = document.getElementById("premiumInput");
    premiumInput.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    premiumContainerInput.appendChild(i);

    const request = await fetch(endpointDocuments, {
        method: "POST",
        body: data,
    })

    const response = await request.json();

    if (response.status === "error") {
        alert(`${response.message}`);
    }
    else {
        aux = response.status;
        alert(`${response.message}`);
    }

    if (aux === "success") {
        const endpointPremium = `/api/users/premium/${userId}`;

        const request = await fetch(endpointPremium, {
            method: "POST",
            body: JSON.stringify({ rol: "premium" }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const response = await request.json();

        if (response.status === "success") {
            alert(`Felicidades por obtener rol premium, ahora podras crear, actualizar y eliminar tus propios products, PARA VER LOS CAMBIOS VUELVA A INICAR SESSION`);
        }

        let url = location.href;

        premiumContainerInput.removeChild(i);
        premiumInput.style.visibility = "visible";

        if (url.includes("onrender")) {
            location.replace("https://node-proyecto-final.onrender.com/");
        }
        else if (url.includes("railway")) {
            location.replace("https://nodeproyectofinal-production.up.railway.app/");
        }
        else{
            location.replace("http://localhost:8080/");
        }
    }
})
