export class GetUserDto{
    constructor(user) {
        this.full_name = `${user.first_name} ${user.last_name}`;
        this.email = `${user.email}`;
        this.age = `${user.age}`;
        this.rol = `${user.rol}`;
        this.cart = `${user.cart._id}`;
        this.products = `${user.cart.products}`;
    }
}