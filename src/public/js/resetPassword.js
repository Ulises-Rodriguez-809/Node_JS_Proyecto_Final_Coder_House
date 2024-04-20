const form = document.getElementById("resetPassForm");

// aca capaz podes obtener la data del token de la url
// le haces un split en el "?"
// asi te quedas solo con el token
// cosa de asi no ponerlo como texto en el la vista y despues tomarlo
form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const data = new FormData(form);

    const obj = {}

    data.forEach((value,key) => obj[key] = value);

    fetch("/api/sessions/resetPassword",{
        method : "POST",
        body : JSON.stringify(obj),
        headers : {
            "Content-Type" : "application/json"
        }
    })
    .then(result => result.json())
    .then(json => {
        console.log(json);
        if (json.status === "success") {
            alert("Contraseña cambiada con exito");
        } else {
            alert(`${json.payload}`);
        }
    })
})