const formGet = document.getElementById("formGet");
const divGetUser = document.getElementById("divGetUser");


const formUpdateRol = document.getElementById("formUpdateRol");

const formDeleteOneUser = document.getElementById("formDeleteOneUser");

const formDeleteInactive = document.getElementById("formDeleteInactive");

formGet.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputGetUser = document.getElementById("input-get-user").value;

    const enpoint = `/api/users/getUser/${inputGetUser}`;

    fetch(enpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(json => {
            if (json.status === "success") {
                alert("Usuario Encontrado");
                
                const divGetUser = document.getElementById("divGetUser");
                const ul = document.createElement("ul");
                const fragment = document.createDocumentFragment();

                for (let key in json.payload) {
                    const li = document.createElement("li");

                    li.innerText = key + " : " + json.payload[key];

                    fragment.appendChild(li);
                }

                ul.append(fragment);

                divGetUser.append(ul);
            }
            else {
                alert("No se logro encontrar al usuario");
            }
        })
})

formUpdateRol.addEventListener("submit", (e) => {
    e.preventDefault();
    const enpoint = "/api/users";

    const data = new FormData(formUpdateRol);

    const obj = {}

    data.forEach((value, key) => obj[key] = value)

    fetch(enpoint, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
        .then(response => response.json())
        .then(json => {
            if (json.status === "success") {
                alert("El rol del usuario se logto cambiar con exito");
                location.reload();
            }
            else {
                alert(json.payload);
            }
        })
})

formDeleteOneUser.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputDeleteUser = document.getElementById("input-delete-user").value;
    console.log(inputDeleteUser);

    const enpoint = `/api/users/${inputDeleteUser}`;

    fetch(enpoint, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(json => {
            if (json.status === "success") {
                alert(json.payload);
                
                location.reload();
            }
            else {
                alert(json.payload);
            }
        })
})

formDeleteInactive.addEventListener("submit", (e) => {
    e.preventDefault();
    const enpoint = "/api/users";

    fetch(enpoint, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    })
        .then(response => response.json())
        .then(json => {
            if (json.status === "success") {
                alert("Usuario inactivos eliminados");
                location.reload();
            }
            else {
                alert("No se logro eliminar los usuarios");
            }
        })
})