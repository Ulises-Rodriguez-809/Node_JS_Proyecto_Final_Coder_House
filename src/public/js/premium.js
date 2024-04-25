const form = document.getElementById("form-premium");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("id-user").value;
    const endpointDocuments = `/api/users/${userId}/documents`;
    const data = new FormData(form);

    let aux = "";

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

        if (url.includes("onrender")) {
            location.replace("https://node-proyecto-final.onrender.com/");
        }
        else if (url.includes("railway")) {
            location.replace("https://nodeproyectofinal-production.up.railway.app/");
        }
        // else if (url.includes("vercel")) { //esto a futuro para cuando suba el proyecto a vercel tambien
        //     location.replace("url de vercel");
        // }
        else{
            location.replace("http://localhost:8080/");
        }
    }
})
