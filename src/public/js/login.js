const form = document.getElementById("loginForm");

form.addEventListener("submit",(e)=>{
    e.preventDefault(); 

    const loginBtnContainer = document.querySelector(".loginBtnContainer");

    const loginInput = document.querySelector(".loginInput");
    loginInput.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    loginBtnContainer.appendChild(i);

    const data = new FormData(form); //Los objetos FormData le permiten compilar un conjunto de pares clave/valor para enviar mediante XMLHttpRequest

    const obj = {};

    data.forEach((value,key)=> obj[key] = value); //esta parte se encarga de guardar en "obj" toda la info q ingrese el usuario en la vista de login
    // osea obj = {email : "tino@gma...", password : "1234"} --> estos name te vienen de la instancia del FormData, cuando le pasas como argumento el form de login 

    fetch("/api/sessions/login",{
        method : "POST",
        body : JSON.stringify(obj),
        headers : {
            "Content-Type" : "application/json"
        }
    })
    .then(result => result.json())
    .then(json => {
        if (json.status === "success") {
            loginBtnContainer.removeChild(i);
            loginInput.style.visibility = "visible";
            window.location.replace('/home');
        }
        else{
            alert("error en los datos");
            loginBtnContainer.removeChild(i);
            loginInput.style.visibility = "visible";
        }
    })
})