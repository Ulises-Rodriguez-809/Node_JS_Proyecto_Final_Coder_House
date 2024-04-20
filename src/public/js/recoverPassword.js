const form = document.getElementById("recoverPassForm");

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const email = document.getElementById("recoverPassEmail").value.trim();

    console.log(email);

    if (email === "") {
        alert("Es necesario ingresar tu email para recurperar tu contraseña");
        return;
    }

    fetch("/api/sessions/recoverPassword",{
        method : "POST",
        body : JSON.stringify({email}),
        headers : {
            "Content-Type" : "application/json"
        }
    })
    .then(result => result.json())
    .then(json => {
        if (json.status === "success") {
            alert("El email de recuperacion de constraseña se envio con exito");
        }
        else{
            alert("No se logro enviar el email para recuperar la contraseña");
        }
    })
})