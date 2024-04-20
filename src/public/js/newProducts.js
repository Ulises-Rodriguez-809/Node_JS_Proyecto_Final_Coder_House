const form = document.getElementById("nuevo-producto");

const inputIdEliminar = document.getElementById("input-id-eliminar");
const btnEliminar = document.getElementById("btn-eliminar");

const formUpdate = document.getElementById("actualizar-producto");

const owner = document.getElementById("input-owner-add");

owner.readOnly = true;

form.addEventListener("submit", e => {
    e.preventDefault()

    const data = new FormData(form);

    // const obj = {}

    // data.forEach((value, key) => obj[key] = value)

    // obj.thumbnails = [...inputThumbnails.files];

    // este fetch va asi xq sino multer trae undifined en el req.file
    fetch(`/api/productsDB`, {
        method: "POST",
        body: data,
    })
    // fetch(`/api/productsDB`, {
    //     method: "POST",
    //     body: JSON.stringify(obj),
    //     headers: {
    //         "Content-Type": "application/json"
    //     }
    // })
        .then(result => result.json())
        .then(json => {
            console.log(json);

            if (json.status === "success") {
                alert("Producto agregado");
            } else {
                if (json.message === "El codigo del producto ya se encuentra en uso") {
                    alert("No se logro añadir el producto, motivo: code ya utilizado");
                } else {
                    alert("No se logro añadir el producto, motivos: campos incompletos o no validos")
                }
            }
        })
});

btnEliminar.addEventListener("click", () => {
    const idProduct = inputIdEliminar.value;

    const endpoint = `/api/productsDB/${idProduct}`

    const obj = {};

    fetch(endpoint, {
        method: "DELETE",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(result => result.json())
        .then(json => {
            console.log(json)

            if (json.status === "error") {
                if (json.payload === "premium") {
                    alert(`Error, un usuario premium solo puede eliminar productos creados por el`);
                } else {
                    alert(`No se logro eliminar el producto con el id: ${idProduct}`);
                }
            }
            else {
                alert(`El producto el id: ${idProduct} se elimino con exito`);
            }
        })
})

formUpdate.addEventListener("submit", e => {
    e.preventDefault()

    const data = new FormData(formUpdate);

    const obj = {}

    data.forEach((value, key) => obj[key] = value)

    const endpoint = `/api/productsDB/${obj.id}`;

    fetch(endpoint, {
        method: "PUT",
        body: data,
    })
    // fetch(endpoint, {
    //     method: "PUT",
    //     body: JSON.stringify(obj),
    //     headers: {
    //         "Content-Type": "application/json"
    //     }
    // })
        .then(result => result.json())
        .then(json => {
            console.log(json);
            if (json.status === "success") {
                alert("Producto Actualizado");
            }
            else{
                alert("No se logro actualizar el producto");
            }
        })
});