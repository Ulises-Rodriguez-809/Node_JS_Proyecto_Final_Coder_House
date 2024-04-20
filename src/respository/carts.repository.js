export class CartsRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async getAll(){
        const result = await this.dao.getCarts();

        return result;
    }

    async getById(id){
        const result = await this.dao.getCartById(id);

        return result;
    }

    async create(){
        const result = await this.dao.createCart();

        return result;
    }

    async add(idCart, idProduct, quantity = 1){
        const result = await this.dao.addProductToCart(idCart, idProduct, quantity);

        return result;
    }

    async updateList(idCart,arryProducts){
        const result = await this.dao.updateProductsList(idCart,arryProducts);

        return result;
    }

    async updateQuantity(idCart, idProduct, quantity){
        const result = await this.dao.updateProductQuantity(idCart, idProduct, quantity);

        return result;
    }

    async deleteAll(idProduct){
        const result = await this.dao.deleteCartProducts(idProduct);

        return result;
    }

    async deleteOne(idCart, idProduct){
        const result = await this.dao.deleteProductToCart(idCart, idProduct);

        return result;
    }
}