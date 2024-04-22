const form = document.getElementById("formDelete");

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const enpoint = "/api/users";

    fetch(enpoint,{
        method : "DELETE",
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({})
    })
    .then(response => response.json())
    .then(json => {
        if (json.status === "success") {
            alert("Usuario inactivos eliminados");
            location.reload();
        }
        else{
            alert("No se logro eliminar los usuarios");
        }
    })
})