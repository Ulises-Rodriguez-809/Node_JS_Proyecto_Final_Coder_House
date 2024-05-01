const ul = document.getElementById("ul-home");
const rol = document.getElementById("user-rol");

const checkRole = ()=>{
    // vista para el admin con el btn para eliminar usuarios inactivos en los ultimos 2 dias
    if (rol.innerText === "admin") {
        const liDeleteInactiveUsers = document.createElement("li");
        const link = document.createElement("a");

        link.href = "/users";
        link.innerText = "users";

        liDeleteInactiveUsers.append(link);

        ul.append(liDeleteInactiveUsers);
    }
}

checkRole();