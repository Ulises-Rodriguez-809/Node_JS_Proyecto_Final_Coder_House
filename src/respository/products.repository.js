export class ProductsRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async getAll(query, options){
        const result = await this.dao.getProducts(query, options);

        return result;
    }

    async getById(id){
        const result = await this.dao.getProductById(id);

        return result;
    }

    async isInStock(amount,id){
        const result = await this.dao.productInStock(amount,id);

        return result;
    }

    async add(fields){
        const result = await this.dao.addProduct(fields);

        return result;
    }

    async updateOne(id, fields){
        const result = await this.dao.updateProduct(id, fields);

        return result;
    }

    async deleteOne(id){
        const result = await this.dao.deleteProduct(id);

        return result;
    }
}