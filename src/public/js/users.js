const formGet = document.getElementById("formGet");
const divGetUser = document.getElementById("divGetUser");

const formUpdateRol = document.getElementById("formUpdateRol");

const formDeleteOneUser = document.getElementById("formDeleteOneUser");

const formDeleteInactive = document.getElementById("formDeleteInactive");

formGet.addEventListener("submit", (e) => {
    e.preventDefault();

    const getUserContainer = document.getElementById("getUserContainer");

    const getUserInput = document.querySelector(".getUserInput");
    getUserInput.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    getUserContainer.appendChild(i);

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

            getUserContainer.removeChild(i);
            getUserInput.style.visibility = "visible";
        })
})

formUpdateRol.addEventListener("submit", (e) => {
    e.preventDefault();

    const updateContainer = document.getElementById("updateContainer");

    const updateUserInput = document.querySelector(".updateUserInput");
    updateUserInput.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    updateContainer.appendChild(i);

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
                updateContainer.removeChild(i);
                updateUserInput.style.visibility = "visible";
                location.reload();
            }
            else {
                alert(json.payload);
                updateContainer.removeChild(i);
                updateUserInput.style.visibility = "visible";
            }
        })
})

formDeleteOneUser.addEventListener("submit", (e) => {
    e.preventDefault();

    const deleteContainerInput = document.getElementById("deleteContainerInput");

    const deleteInput = document.querySelector(".deleteInput");
    deleteInput.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    deleteContainerInput.appendChild(i);

    const inputDeleteUser = document.getElementById("input-delete-user").value;

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
                deleteContainerInput.removeChild(i);
                deleteInput.style.visibility = "visible";
                location.reload();
            }
            else {
                alert(json.payload);
                deleteContainerInput.removeChild(i);
                deleteInput.style.visibility = "visible";
            }
        })
})

formDeleteInactive.addEventListener("submit", (e) => {
    e.preventDefault();

    const deleteInactiveContainer = document.getElementById("deleteInactiveContainer");

    const deleteInactiveInput = document.querySelector(".deleteInactiveInput");
    deleteInactiveInput.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    deleteInactiveContainer.appendChild(i);


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
                deleteInactiveContainer.removeChild(i);
                deleteInactiveInput.style.visibility = "visible";
                location.reload();
            }
            else {
                alert("No se logro eliminar los usuarios");
                deleteInactiveContainer.removeChild(i);
                deleteInactiveInput.style.visibility = "visible";
            }
        })
})