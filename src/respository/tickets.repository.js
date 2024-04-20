export class TicketsRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async get(email){
        const result = await this.dao.getTicket(email);

        return result;
    }

    async amount(arrayProducts){
        const result = await this.dao.calculateAmount(arrayProducts);

        return result;
    }

    async purchesedProducts(cartId,arrayProducts){
        const result = await this.dao.purchesedProducts(cartId,arrayProducts);
    
        return result;
    }

    async create(cartId){
        const result = await this.dao.createTicket(cartId);

        return result;
    }
}