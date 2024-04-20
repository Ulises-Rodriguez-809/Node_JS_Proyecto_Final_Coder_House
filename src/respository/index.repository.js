
import {Users} from '../dao/managersDB/userManager.js';
import {CartManagerDB} from '../dao/managersDB/cartManagerDB.js'
import {ProductManagerDB} from '../dao/managersDB/productManagerDB.js'
import { TicketManager } from '../dao/managersDB/ticketManagerDB.js';

import {CartsRepository} from './carts.repository.js';
import {ProductsRepository} from './products.repository.js';
import {UsersRepository} from './users.repository.js';
import {TicketsRepository} from './tickets.repository.js';


const User = new Users();
const Cart = new CartManagerDB();
const Product = new ProductManagerDB();
const Ticket = new TicketManager();

export const userService = new UsersRepository(User);
export const cartService = new CartsRepository(Cart);
export const productService = new ProductsRepository(Product);
export const ticketService = new TicketsRepository(Ticket);
