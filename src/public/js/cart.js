const btnClearCart = document.getElementById("clearCart");
const btnsRemoveProductArray = document.querySelectorAll(".removeProduct");

const getCartId = () => {
    const url = window.location.href;
    const urlArray = url.split("/");
    const cartId = urlArray[urlArray.length - 1];

    return cartId;
}

btnClearCart.addEventListener("click", (e) => {
    const id = getCartId();
    const endpoint = `/api/cartsDB/${id}`;

    const clearCartContainer = document.getElementById("clearCartContainer");

    const clearCartBtn = document.getElementById("clearCart");

    clearCartBtn.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    clearCartContainer.appendChild(i);

    fetch(endpoint, {
        method: "DELETE",
        body: JSON.stringify({}),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(result => result.json())
        .then(json => {
            if (json.status === "success") {
                alert(json.message);
                clearCartContainer.removeChild(i);
                clearCartBtn.style.visibility = "visible";
                location.reload();
            }
            else {
                alert("No se logro vaciar el carrito de compra, contacte al servicio al cliente");
                clearCartContainer.removeChild(i);
                clearCartBtn.style.visibility = "visible";
            }
        })

})

btnsRemoveProductArray.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        
        const cartId = getCartId();
        const productId = e.target.id;

        const endpoint = `/api/cartsDB/${cartId}/product/${productId}`;

        fetch(endpoint, {
            method: "DELETE",
            body: JSON.stringify({}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(result => result.json())
        .then(json => {
            if (json.status === "success") {
                alert(json.message);
                location.reload();
            }
            else {
                alert("No se logro vaciar el carrito de compra, contacte al servicio al cliente");
            }
        })
    })
})