const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const registerBtnContainer = document.querySelector(".registerBtnContainer");

    const inputRegister = document.querySelector(".registerInput");
    inputRegister.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    registerBtnContainer.appendChild(i);

    const data = new FormData(form);

    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    fetch('/api/sessions/register', {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(result => result.json())
        .then(json => {
            if (json.status === "error") {
                alert("Error al registrarse");
                registerBtnContainer.removeChild(i);
                inputRegister.style.visibility = "visible";
                return "";
            }
            alert("Te registraste con exito");
            registerBtnContainer.removeChild(i);
            inputRegister.style.visibility = "visible";
        })
})