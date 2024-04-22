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
    // caso para user con rol "user" o "premium" q solo tiene para ver la info de los usuarios pero sin btn para eliminar user inavtivos
    else{
        const liUsersInfo = document.createElement("li");
        const link = document.createElement("a");

        link.href = "/api/users/";
        link.innerText = "users";

        liUsersInfo.append(link);

        ul.append(liUsersInfo);
    }
}

checkRole();