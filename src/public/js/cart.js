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

    fetch(endpoint, {
        method: "DELETE",
        body: JSON.stringify({}),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(result => result.json())
        .then(json => {
            console.log(json);
            if (json.status === "success") {
                alert(json.message);
                location.reload();
            }
            else {
                alert("No se logro vaciar el carrito de compra, contacte al servicio al cliente");
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