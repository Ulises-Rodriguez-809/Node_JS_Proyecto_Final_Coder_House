const idCart = document.getElementById("id-cart").textContent;

const arrayForms = document.querySelectorAll(".form");

const arrayBtnsPlus = document.querySelectorAll(".plus");
const arrayBtnsMinus = document.querySelectorAll(".minus");
const arrayCount = document.querySelectorAll(".count");

const finalizarCompra = document.querySelector(".finalizarCompra");

const userName = document.getElementById("userName").textContent;
const userRol = document.getElementById("userRol").textContent;

const checkRol = () => {
    const containerChangeRol = document.getElementById("containerChangeRol");

    if (userRol === "user") {
        const btn = document.createElement("button");

        btn.textContent = "Obtener premium";

        btn.setAttribute("class", "opcionLink");
        btn.setAttribute("id", "btnChangeRol");

        containerChangeRol.append(btn);

        const btnChangeRol = document.getElementById("btnChangeRol");

        btnChangeRol.addEventListener("click", () => {
            location.replace("/preimum");
        })
    }
}

finalizarCompra.addEventListener("click", () => {
    const finalizarCompraContainer = document.querySelector(".finalizarCompraContainer");
    finalizarCompra.style.visibility = "hidden";

    const i = document.createElement("i");
    i.className = "gg-spinner";

    finalizarCompraContainer.appendChild(i);

    const endpoint = `/api/cartsDB/${idCart}/purchase`;

    const obj = {};

    fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(result => result.json())
        .then(json => {
            if (json.status === "success") {
                alert("Compra finalizada, tu ticket fue enviado a tu email");
                finalizarCompraContainer.removeChild(i);
                finalizarCompra.style.visibility = "visible";
            } else {
                alert("Error al intentar confirmar la compra, contacte con el servicio al cliente");
                finalizarCompraContainer.removeChild(i);
                finalizarCompra.style.visibility = "visible";
            }
        })

})

arrayBtnsPlus.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const count = parseInt(arrayCount[index].value);
        arrayCount[index].value = count + 1;
    })
})

arrayBtnsMinus.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const count = parseInt(arrayCount[index].value);

        if (count > 0) {
            arrayCount[index].value = count - 1;
        }
    })
})

arrayForms.forEach((form) => {
    form.addEventListener("submit", e => {
        e.preventDefault();

        // para q solo afecte al form donde se dispara el evento
        const currentForm = e.target;
        const parentDiv = e.target["11"].parentElement;
        const inputClicked = e.target["11"];


        inputClicked.style.visibility = "hidden";

        const i = document.createElement("i");
        i.className = "gg-spinner";

        parentDiv.appendChild(i);

        const data = new FormData(form);

        const obj = {}

        data.forEach((value, key) => obj[key] = value)

        fetch(`/api/cartsDB/${idCart}/product/${obj.id}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(result => result.json())
            .then(json => {
                if (json.status === "success") {
                    alert("Producto comprado");
                    parentDiv.removeChild(i);
                    inputClicked.style.visibility = "visible";

                } else {
                    alert("No se logro comprar el producto, contacte con el servicio al cliente");
                    parentDiv.removeChild(i);
                    inputClicked.style.visibility = "visible";

                }
            })
    })
});

checkRol();