const btn = document.getElementById("btn")

btn.addEventListener("click", (e) => {
    // esto seria mas facil si lo renderizas desde la obtencion de la vista pero como ya esta creado el /current en session vamos a usarlo
    fetch("/api/sessions/current", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(result => result.json())
        .then(json => {
            const divInfoContainer = document.getElementById("infoContainer");
            if (json.status === "success") {

                divInfoContainer.innerHTML = `
                    <div id="full_name">Nombre: ${json.payload.full_name}</div>
                    <div id="age">Edad: ${json.payload.age}</div>
                    <div id="email">Email: ${json.payload.email}</div>
                    <div id="rol">Rol: ${json.payload.rol}</div>
                    <div id="cart">Cart ID: ${json.payload.cart}</div>
                    <div id="products">Products: ${json.payload.products}</div>
            `
            }
            else {
                divInfoContainer.innerText = "No se logro obtener la informacion del usuario, contacte con el servicio al cliente";
            }
        })
})

// {
//     product: { owner: 'admin', _id: new ObjectId('657f6d0db3f9db4a9c00978a'), title: 'cafe', description: 'cafe de la db rico', code: 'ds4f564ds', price: 1200, status: 'true', stock: 1, category: 'bebida', thumbnails: ['cafeUrl1,cafeUrl2'], __v: 0 },
//     quantity: 1,
//     _id: new ObjectId('66311f4df2999e97fe308b74')
// },
// {
//     product: { owner: 'admin', _id: new ObjectId('657f6d40b3f9db4a9c00978c'), title: 'masitas', description: 'masitas de la db rico', code: '8jhkhj654l', price: 1000, status: 'true', stock: 58, category: 'comida', thumbnails: [], __v: 0 }, quantity: 1, _id: new ObjectId('6631234ec823d9bc88389068')
// }