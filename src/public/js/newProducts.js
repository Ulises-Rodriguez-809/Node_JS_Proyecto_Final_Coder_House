const formNewProduct = document.getElementById("nuevo-producto");

const formDeleteProduct = document.getElementById("delete-product");


const formUpdate = document.getElementById("actualizar-producto");

const owner = document.getElementById("input-owner-add");

owner.readOnly = true;

formNewProduct.addEventListener("submit", e => {
    e.preventDefault();

    const newProductContainer = document.querySelector(".new-producto");

    const newProductInput = document.querySelector(".new-product-input");
    newProductInput.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    newProductContainer.appendChild(i);

    const data = new FormData(formNewProduct);

    fetch(`/api/productsDB`, {
        method: "POST",
        body: data,
    })
        .then(result => result.json())
        .then(json => {
            if (json.status === "success") {
                alert("Producto agregado");
                newProductContainer.removeChild(i);
                newProductInput.style.visibility = "visible";
            } else {
                if (json.message === "El codigo del producto ya se encuentra en uso") {
                    alert("No se logro añadir el producto, motivo: code ya utilizado");
                } else {
                    alert("No se logro añadir el producto, motivos: campos incompletos o no validos");
                }
                newProductContainer.removeChild(i);
                newProductInput.style.visibility = "visible";
            }
        })
});

formDeleteProduct.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputIdEliminar = document.getElementById("input-id-eliminar");

    const deleteProductContainer = document.querySelector(".delete-product");

    const deleteProductInput = document.querySelector(".delete-product-input");
    deleteProductInput.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    deleteProductContainer.appendChild(i);

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
            if (json.status === "error") {
                if (json.payload === "premium") {
                    alert(`Error, un usuario premium solo puede eliminar productos creados por el`);
                } else {
                    alert(`No se logro eliminar el producto con el id: ${idProduct}`);
                }
                deleteProductContainer.removeChild(i);
                deleteProductInput.style.visibility = "visible";
            }
            else {
                alert(`El producto el id: ${idProduct} se elimino con exito`);
                deleteProductContainer.removeChild(i);
                deleteProductInput.style.visibility = "visible";
            }
        })
})

formUpdate.addEventListener("submit", e => {
    e.preventDefault();

    const updateProductContainer = document.querySelector(".update-product");

    const updateProductInput = document.querySelector(".update-product-input");
    updateProductInput.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    updateProductContainer.appendChild(i);

    const data = new FormData(formUpdate);

    const obj = {}

    data.forEach((value, key) => obj[key] = value)

    const endpoint = `/api/productsDB/${obj.id}`;

    fetch(endpoint, {
        method: "PUT",
        body: data,
    })
        .then(result => result.json())
        .then(json => {
            if (json.status === "success") {
                alert("Producto Actualizado");
                updateProductContainer.removeChild(i);
                updateProductInput.style.visibility = "visible";
            }
            else {
                alert("No se logro actualizar el producto");
                updateProductContainer.removeChild(i);
                updateProductInput.style.visibility = "visible";
            }
        })
});