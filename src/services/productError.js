const generateGetAllProductsError = () => {
    return `
    No se logro obtener la lista de productos
    `
}

const generateGetProductByIdError = (id) => {
    return `
    No se logro obtener el producto con el id: ${id}
    `
}

const generateAddProductError = () => {
    return `
    Alguno de los campos esta incompleto o no cumple con el tipo requirido
    `
}

const generateUpdateProductError = (id) => {
    return `
    El id : ${id} no es correcto o alguno de los campos esta incompleto o no cumple con el tipo requirido
    `
}

const generateDeleteProductError = (id) => {
    return `
    No se logro eliminar el producto con el id : ${id}
    `
}

const productErrorOptions = {
    generateGetAllProductsError,
    generateGetProductByIdError,
    generateAddProductError,
    generateUpdateProductError,
    generateDeleteProductError,
}

export default productErrorOptions;