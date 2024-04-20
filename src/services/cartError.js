const generateGettAllCartsError = () => {
    return `
    No se logro obtener todos los carritos
    `
}

const generateGetCartByIdError = (cartID) => {
    return `
    No se encontro el cart con el ID : ${cartID}
    `
}

const generateCreateCartError = () => {
    return `
    No se logro crear el cart para el usuario
    `
}

const generateAddProductToCartError = (productID, cartID) => {
    return `
    No se logro añadir el producto con el id : ${productID}, al cart con el id : ${cartID}
    `
}

const generateUpdateProductsListError = (cartID) => {
    return `
    No se logro actualizar los productos del cart con el id : ${cartID}
    `
}

const generateUpdateProductQuantityError = (cartID, productID, quantity) => {

    if (!cartID) {
        return `
        No se encontro el cart con el id : ${cartID}
        `
    }

    if (!productID) {
        return `
        No se encontro el producto con el id : ${productID}
        `
    }

    if (typeof quantity === String) {
        return `
        La cantidad indicada es de tipo : String y esta debe de ser de tipo : Number
        `
    }
}

const generateDeleteCartProductsError = (cartID) => {
    return `
    No se logro actualizar los productos del cart con el id : ${cartID}
    `
}

const generateDeleteProductToCartError = (cartID, productID) => {

    if (!cartID) {
        return `
        No se encontro el cart con el id : ${cartID}
        `
    }

    if (!productID) {
        return `
        No se logro eliminar el producto con el id : ${productID} del cart con el id : ${cartID}
        `
    }
}


const cartErrorOptions = {
    generateGettAllCartsError,
    generateGetCartByIdError,
    generateCreateCartError,
    generateAddProductToCartError,
    generateUpdateProductsListError,
    generateUpdateProductQuantityError,
    generateDeleteCartProductsError,
    generateDeleteProductToCartError,
}

export default cartErrorOptions;