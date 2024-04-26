import supertest from 'supertest';
import { expect } from 'chai'; //imp {expect as chaiExpect} from chai --> esto por si te vuelve a dar error chai
import { app } from '../src/app.js';
import { options } from '../src/config/config.js';

import productsModel from '../src/dao/models/productsModel.js';
import cartsModel from '../src/dao/models/cartsModel.js';
import userModel from '../src/dao/models/userModel.js';

const MONGO = options.MONGO_URL;

// se encarga de hacer la llamada
//de esta manera no te hace falta poner localhost o un endpoint especifico
// ademas asi te evitas tener q levantar el servidor
// con esto tambien te evitas tener q importar los controllers q es donde esta la logica
const requester = supertest(app);

describe('super test de los endpoints del ecommerce', () => {
    describe('products endpoints test', () => {

        let cookie;
        // befroeEach(async function () {
        //     await productsModel.deleteMany({});
        // })

        // get
        it("endpoint: /api/productsDB || metodo: GET, obtiene todos los productos de la DB", async function () {
            this.timeout(15000);

            const response = await requester.get("/api/productsDB");

            const { statusCode, _body } = response;
            const { status, result } = _body;
            const { payload } = result;

            // verifico varias veces para ver si el resultado es el esperado y no solo q me devolvio algo
            // 1- veo si lo q me llega es un objeto
            expect(response).to.be.an("object");
            // 2- veo si el objeto tiene la prop status y q esta sea igual a success
            expect(statusCode).to.be.deep.equal(200);
            // 3- veo si el _body es un objeto
            expect(_body).to.be.an("object");
            // 4- veo si _body lo q esta dentro de body es un objeto con las prop status y result (q es lo q retorna el get products)
            expect(_body).to.have.property("status");
            expect(_body).to.have.property("result");
            // 5- veo si status (dentro de _body) es igual a success
            expect(status).to.be.deep.equal("success");
            // 6- veo si dentro de result hay porps status y payload
            expect(result).to.have.property("status");
            expect(result).to.have.property("payload");
            // 7- veo q el payload es un objeto con toda la info de la paginacion
            expect(payload).to.be.an("object");
            // 8- veo q el array docs no este vacio o veo q hay por lo menos 1 producto para mostrar
            expect(payload.docs).to.have.lengthOf.at.least(1);
            // expect(result.payload.docs).to.be.not.empty;
        })

        it("endpoint: /api/productsDB/:productId || metodo: GET, obtiene el producto de la DB por su id", async function () {

            const response = await requester.get("/api/productsDB/657f6d0db3f9db4a9c00978a");

            const { statusCode, _body } = response;
            const { status, message } = _body;

            expect(response).to.be.an("object");
            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");

            expect(status).to.be.deep.equal("success");

            // aca no corroboro q el objeto este vacio ya q es obligatorio q los productos tengan: owner, _id, title, etc
            expect(message).to.have.property("owner");
            expect(message).to.have.property("title");
            expect(message).to.have.property("description");
            expect(message).to.have.property("code");
            expect(message).to.have.property("price");
            expect(message).to.have.property("stock");
            expect(message).to.have.property("category");
            expect(message).to.have.property("_id");
        })

        // post con checkrol
        it("endpoint: /api/productsDB || metodo: POST, permite añadir un nuevo producto a la DB", async function () {
            this.timeout(15000);

            // creas el usuario q sea admin q tenes en .env
            const mockUser = {
                email: "adminCoder@gmail.com",
                password: "adminCod3r123"
            }

            // le pegas al endpoint de login para poder setear la cookie y poder obtener la info para pasarsela al endpoint de crear un producto
            const responseLogin = await requester.post("/api/sessions/login").send(mockUser);

            // obtener del header de la respuesta la cookie
            const cookieResult = responseLogin.headers["set-cookie"][0];

            // obtenes el nombre y value para simular lo mismo de como estaria en el navegador
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            const mockProduct = {
                title: "rockStart",
                description: "bebida energetica, 500ml, producida en Argentina",
                code: "r0cks4rt",
                price: 1000,
                status: "true",
                stock: 25,
                category: "bebida",
                thumbnails: ["rockStartUrl1"],
                owner: "admin"
            }

            // aca le seteas la cookie para q el check rol no joda
            const response = await requester.post("/api/productsDB").set("Cookie", [`${cookie.name}=${cookie.value}`]).send(mockProduct);

            const { statusCode, _body } = response;

            const { status, message } = _body;

            const { owner, title, description, code, price, stock, category } = message;

            expect(response).to.be.an("object");
            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");

            expect(status).to.be.deep.equal("success");

            expect(message).to.have.property("owner");
            expect(message).to.have.property("title");
            expect(message).to.have.property("description");
            expect(message).to.have.property("code");
            expect(message).to.have.property("price");
            expect(message).to.have.property("stock");
            expect(message).to.have.property("category");

            expect(owner).to.be.deep.equal("admin");
            expect(title).to.be.deep.equal("rockStart");
            expect(description).to.be.deep.equal("bebida energetica, 500ml, producida en Argentina");
            expect(code).to.be.deep.equal("r0cks4rt");
            expect(price).to.be.deep.equal(1000);
            expect(stock).to.be.deep.equal(25);
            expect(category).to.be.deep.equal("bebida");
        })

        // put
        it("endpoint: /api/productsDB/:productId || metodo: PUT, actualiza los campos del producto en la DB por su id", async function () {
            // creo un producto
            const mockProduct = {
                title: "Taza",
                description: "Taza cafe chico",
                code: "T4z4C4f3",
                price: 500,
                status: "true",
                stock: 5,
                category: "utilidad",
                thumbnails: ["tazaUrl1", "tazaUrl2"],
            }

            // lo guardo en la db y obtengo su id para poder usarlo de forma dinamica en el update
            const responseCreate = await productsModel.create(mockProduct);
            const { id } = responseCreate;

            // nuevos campos
            const updateProduct = {
                title: "TazaCafe",
                description: "Taza blanca de para cafe chico",
                code: "T4z4C4f3",
                price: 500,
                status: "true",
                stock: 5555,
                category: "utilidad",
                thumbnails: ["tazaUrl1", "tazaUrl2"],
            }

            // aca uso el id de forma dinamica
            const response = await requester.put(`/api/productsDB/${id}`).set("Cookie", [`${cookie.name}=${cookie.value}`]).send(updateProduct);

            const { statusCode, _body } = response;

            const { status, message } = _body;

            expect(response).to.be.an("object");
            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");

            expect(status).to.be.deep.equal("success");

            expect(message).to.be.deep.equal(`Se modifico con exito el producto con el id: ${id}`);

            const productFind = await productsModel.findOne({ code: "T4z4C4f3" });
            const { id: idProducto } = productFind;

            await productsModel.deleteOne({ _id: idProducto });
        })

        // delete 
        it("endpoint: /api/productsDB/:productId || metodo: DELETE, elimina un producto en la DB por su id", async function () {
            const responseGetById = await productsModel.findOne({ code: "r0cks4rt" });

            const { id } = responseGetById;

            const response = await requester.delete(`/api/productsDB/${id}`).set("Cookie", [`${cookie.name}=${cookie.value}`]);

            const { statusCode, _body } = response;


            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);
        })
    })

    describe('carts endpoints test', () => {
        let cookie;
        // befroeEach(async function () {
        //     await cartsModel.deleteMany({});
        // })

        // get
        it("endpoint: /api/cartsDB || metodo: GET, obtiene todos los carts de la DB", async function () {

            const response = await requester.get("/api/cartsDB");

            const { statusCode, _body } = response;
            const { status, message } = _body;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");
            expect(_body).to.have.property("status");
            expect(_body).to.have.property("message");

            expect(status).to.be.deep.equal("success");

            // aca no compruebo si esta vacio o no ya q cuando se registra un usuario neuvo el cart esta vacio ([])
            expect(message).to.be.an("array");
        })

        it("endpoint: /api/cartsDB/:cartId || metodo: GET, obtiene un cart de la DB por su id", async function () {

            const response = await requester.get("/api/cartsDB/660df5043766ec33d106c5eb");

            const { statusCode, _body } = response;
            const { status, message } = _body;
            const { products } = message;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");
            expect(_body).to.have.property("status");
            expect(_body).to.have.property("message");

            expect(status).to.be.deep.equal("success");

            // aca no compruebo si esta vacio o no ya q cuando se registra un usuario neuvo el cart esta vacio ([])
            expect(message).to.be.an("object");
            expect(message).to.have.property("_id");
            expect(message).to.have.property("products");

            expect(products).to.be.an("array");
        })

        // post
        it("endpoint: /api/cartsDB/ || metodo: POST, crea un nuevo cart y lo guarda en la DB", async function () {

            const response = await requester.post("/api/cartsDB");

            const { statusCode, _body } = response;
            const { status, cart } = _body;
            const { _id, products } = cart;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");
            expect(_body).to.have.property("status");
            expect(_body).to.have.property("cart");

            expect(status).to.be.deep.equal("success");

            expect(cart).to.be.an("object");
            expect(cart).to.have.property("_id");
            expect(cart).to.have.property("products");

            expect(products).to.be.an("array");

            await cartsModel.deleteOne({ _id });
        })

        // post
        it("endpoint: /api/cartsDB/:cartId/product/:productId || metodo: POST, agrega un producto con una cantidad determinada al cart (ambos por id)", async function () {
            this.timeout(15000);

            // para este caso pone un usuario premium o user para q te llegue el mail (osea pone el tuyo si pones un mail q no existe no va a llegar nada XD)
            // PROFE ACA PONGA LOS DATOS DEL REGISTRO NUEVO Q HIZO
            const mockUser = {
                email: "uliisesrodriguez809@gmail.com",
                password: "asd"
            }

            // le pegas al endpoint de login para poder setear la cookie y poder obtener la info para pasarsela al endpoint de crear un producto
            const responseLogin = await requester.post("/api/sessions/login").send(mockUser);

            // obtener del header de la respuesta la cookie
            const cookieResult = responseLogin.headers["set-cookie"][0];

            // obtenes el nombre y value para simular lo mismo de como estaria en el navegador
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            const response = await requester.post("/api/cartsDB/660df5043766ec33d106c5eb/product/6586d47bd7c76a66e55718b4").set("Cookie", [`${cookie.name}=${cookie.value}`]).send({ quantity: 3 });

            const { statusCode, _body } = response;
            const { status, message } = _body;
            const { products } = message;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");
            expect(_body).to.have.property("status");
            expect(_body).to.have.property("message");

            expect(status).to.be.deep.equal("success");

            expect(message).to.be.an("object");
            expect(message).to.have.property("_id");
            expect(message).to.have.property("products");

            expect(products).to.be.an("array");
        })

        // tikcet queda en espera xq tambien necesita del token
        it("endpoint: /api/cartsDB/:cartId/purchase || metodo: POST, realiza la compra y envia el ticket", async function () {
            this.timeout(15000);

            const response = await requester.post("/api/cartsDB/660df5043766ec33d106c5eb/purchase").set("Cookie", [`${cookie.name}=${cookie.value}`]);

            const { statusCode, _body } = response;
            const {payload} = _body;
            const {ticket} = payload;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");
            expect(_body).to.have.property("status");
            expect(_body).to.have.property("payload");


            expect(ticket).to.be.an("object");
            expect(ticket).to.have.property("code");
            expect(ticket).to.have.property("purchase_datetime");
            expect(ticket).to.have.property("amount");
            expect(ticket).to.have.property("purchaser");
        })

        // put
        it("endpoint: /api/cartsDB/:cartId || metodo: PUT, actualiza toda la lista de productos con una lista nueva", async function () {

            const mockNewListProducts = {
                products: [
                    {
                        product: "657f6d0db3f9db4a9c00978a",
                        quantity: 32
                    },
                    {
                        product: "657f6d40b3f9db4a9c00978c",
                        quantity: 5
                    },
                    {
                        product: "6585e72c61847a6e6f60ccfe",
                        quantity: 3
                    }
                ]
            }

            const response = await requester.put("/api/cartsDB/660df5043766ec33d106c5eb").send(mockNewListProducts);

            const { statusCode, _body } = response;
            const { status, message } = _body;
            const { products } = message;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");
            expect(_body).to.have.property("status");
            expect(_body).to.have.property("message");

            expect(status).to.be.deep.equal("success");

            expect(message).to.be.an("object");
            expect(message).to.have.property("_id");
            expect(message).to.have.property("products");

            // puede estar vacio como no, asi q solo compruebo si "products" es un array
            expect(products).to.be.an("array");
        })

        it("endpoint: /api/cartsDB/:cartId/products/:productId || metodo: PUT, actualiza la cantidad del producto dentro de un cart (ambos por id)", async function () {

            const mockQuantity = {
                quantity: 8
            }

            const response = await requester.put("/api/cartsDB/660df5043766ec33d106c5eb/products/657f6d0db3f9db4a9c00978a").send(mockQuantity);

            const { statusCode, _body } = response;
            const { status, message } = _body;
            const { products } = message;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");
            expect(_body).to.have.property("status");
            expect(_body).to.have.property("message");

            expect(status).to.be.deep.equal("success");

            expect(message).to.be.an("object");
            expect(message).to.have.property("_id");
            expect(message).to.have.property("products");

            expect(products).to.be.an("array");
            expect(products).to.have.lengthOf.at.least(1);
        })

        it("endpoint: /api/cartsDB/:cartId/product/:productId || metodo: DELETE, elimina un productos del cart (ambos por id)", async function () {

            const response = await requester.delete("/api/cartsDB/660df5043766ec33d106c5eb/product/657f6d0db3f9db4a9c00978a");


            const { statusCode, _body } = response;
            const { status, message } = _body;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");
            expect(_body).to.have.property("status");
            expect(_body).to.have.property("message");

            expect(status).to.be.deep.equal("success");

            expect(message).to.be.a("string");
        })

        it("endpoint: /api/cartsDB/:cartId || metodo: DELETE, elimina la lista de productos y deja un array []", async function () {

            const response = await requester.delete("/api/cartsDB/660df5043766ec33d106c5eb");

            const { statusCode, _body } = response;
            const { status, message } = _body;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.be.an("object");
            expect(_body).to.have.property("status");
            expect(_body).to.have.property("message");

            expect(status).to.be.deep.equal("success");

            expect(message).to.be.deep.equal("Los productos del cart: 660df5043766ec33d106c5eb se eliminaron con exito");
        })
    })

    describe('users endpoints test', () => { 
        let cookie;

        it("enpoint: /api/users/ || metodo: GET, obtener todos los usuarios", async function(){
            this.timeout(15000);

            const mockUser = {
                email: "adminCoder@gmail.com",
                password: "adminCod3r123"
            }

            const responseLogin = await requester.post("/api/sessions/login").send(mockUser);

            const cookieResult = responseLogin.headers["set-cookie"][0];

            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            const response = await requester.get("/api/users").set("Cookie", [`${cookie.name}=${cookie.value}`]);

            const { statusCode, _body } = response;
            const { status, payload } = _body;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.have.property("status");
            expect(_body).to.have.property("payload");

            expect(status).to.be.deep.equal("success");
            expect(payload).to.be.an("array");
            expect(payload).to.have.lengthOf.at.least(1);
        })

        it("enpoint: /api/users/getUser/:userEmail || metodo: GET, obtener un usuario por su email", async function(){
            this.timeout(15000);

            const mockUser = {
                email: "adminCoder@gmail.com",
                password: "adminCod3r123"
            }

            const responseLogin = await requester.post("/api/sessions/login").send(mockUser);

            const cookieResult = responseLogin.headers["set-cookie"][0];

            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            const response = await requester.get("/api/users/getUser/ulirodriguez5@gmail.com").set("Cookie", [`${cookie.name}=${cookie.value}`]);

            const { statusCode, _body } = response;
            const { status, payload } = _body;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.have.property("status");
            expect(_body).to.have.property("payload");

            expect(status).to.be.deep.equal("success");
            expect(payload).to.be.an("object");
            expect(payload).to.have.property("full_name");
            expect(payload).to.have.property("email");
            expect(payload).to.have.property("age");
            expect(payload).to.have.property("rol");
            expect(payload).to.have.property("cart");
            expect(payload).to.have.property("products");

        })

        it("enpoint: /api/users/ || metodo: PUT, El admin puede modificar el rol del usuario", async function(){
            this.timeout(15000);

            const mockUser = {
                email: "adminCoder@gmail.com",
                password: "adminCod3r123"
            }

            const auxBody = {
                id : "662be7dbac0d17cec4d17484",
                rol: "premium"
            }

            const responseLogin = await requester.post("/api/sessions/login").send(mockUser);

            const cookieResult = responseLogin.headers["set-cookie"][0];

            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            const response = await requester.put("/api/users/").set("Cookie", [`${cookie.name}=${cookie.value}`]).send(auxBody);

            const { statusCode, _body } = response;
            const { status, payload } = _body;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.have.property("status");
            expect(_body).to.have.property("payload");

            expect(status).to.be.deep.equal("success");
            expect(payload).to.be.an("string");

        })

        it("enpoint: /api/users/:userId || metodo: DELETE, El admin puede eliminar un usuario por su id", async function(){
            this.timeout(15000);

            const mockUser = {
                email: "adminCoder@gmail.com",
                password: "adminCod3r123"
            }

            const id = "662be61fbd43e13a1d0d83f9";

            const responseLogin = await requester.post("/api/sessions/login").send(mockUser);

            const cookieResult = responseLogin.headers["set-cookie"][0];

            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            const response = await requester.delete(`/api/users/${id}`).set("Cookie", [`${cookie.name}=${cookie.value}`]);
            const { statusCode, _body } = response;
            const { status, payload } = _body;

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(_body).to.have.property("status");
            expect(_body).to.have.property("payload");

            expect(status).to.be.deep.equal("success");
            expect(payload).to.be.an("string");

        })

        it("enpoint: /api/users/ || metodo: DELETE, El admin puede eliminar todos los usuarios inactivos", async function(){
            this.timeout(15000);

            const mockUser = {
                email: "adminCoder@gmail.com",
                password: "adminCod3r123"
            }

            const responseLogin = await requester.post("/api/sessions/login").send(mockUser);

            const cookieResult = responseLogin.headers["set-cookie"][0];

            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            const response = await requester.delete(`/api/users/`).set("Cookie", [`${cookie.name}=${cookie.value}`]);
            
            expect(response).to.be.an("object");
        })
    })

    describe('sessions endpoints test', () => {
        // efectivamente borro toda la colleccion
        // beforeEach(async function () {
        //     await cartsModel.deleteMany({});
        //     await userModel.deleteMany({});
        // })

        let cookie;

        it("enpoint: /api/sessions/register || metodo: POST, registro exitoso", async function () {
            // https://stackoverflow.com/questions/16607039/in-mocha-testing-while-calling-asynchronous-function-how-to-avoid-the-timeout-er#
            // es como q mocha por defecto tiene de tiempo para resolver las operaciones 2000ms si supera eso corta la ejecucion
            // probe ponerlo para todos los it pero no hubo caso solo anduvo asi poniendo a los it
            this.timeout(15000);

            const mockUser = {
                first_name: "Pepe",
                last_name: "Argento",
                email: "pepito@gmail.com",
                age: "40",
                password: "pepe1234"
            }

            const response = await requester.post("/api/sessions/register").send(mockUser);

            const { statusCode, _body } = response

            expect(response).to.be.an("object");

            expect(statusCode).to.be.deep.equal(200);

            expect(response).to.be.an("object");
            expect(_body).to.have.property("status");
            expect(_body).to.have.property("message");
            expect(_body).to.have.property("payload");
        })

        it("enpoint: /api/sessions/login || metodo: POST, login exitoso", async function () {
            this.timeout(15000);

            const mockUser = {
                email: "pepito@gmail.com",
                password: "pepe1234"
            }

            const response = await requester.post("/api/sessions/login").send(mockUser);

            expect(response).to.be.an("object");

            const cookieResult = response.headers["set-cookie"][0];

            // const tokenInfo = req.cookies["jwt-cookie"];
            // const decodedToken = jwt.decode(tokenInfo);

            expect(cookieResult).to.be.ok;

            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            // este ejem de q podes hasta decodificar el token 
            // console.log(cookie);

            // const tokenInfo = cookie.value.split(";")[0];
            // console.log(tokenInfo);

            // const decodedToken = jwt.decode(tokenInfo);
            // console.log(decodedToken);

            expect(cookie.name).to.be.ok.and.equal("jwt-cookie");
            expect(cookie.value).to.be.ok;
        })

        it("enpoint: /api/sessions/recoverPassword || metodo: POST, envia un email para recuperar contraseña", async function () {
            this.timeout(15000);

            const response = await requester.post("/api/sessions/recoverPassword").send({ email: "pepito@gmail.com" })

            const { statusCode, _body } = response;

            const { status, payload } = _body

            expect(response).to.be.an("object");

            expect(status).to.be.deep.equal("success");

            expect(payload).to.be.deep.equal("mail enviado con exito");
        })

        it("enpoint: /api/sessions/resetPassword || metodo: POST, permite cambiar la contraseña", async function () {
            this.timeout(15000);

            const mockUserNewPassword = {
                email: "pepito@gmail.com",
                password: "123456",
                confirmPassword: "123456"
            }

            const response = await requester.post("/api/sessions/resetPassword").send(mockUserNewPassword);

            const { statusCode, _body } = response;

            const { status, payload } = _body

            expect(response).to.be.an("object");

            expect(status).to.be.deep.equal("success");

            expect(payload).to.be.deep.equal("todo bien");
        })

        it("enpoint: /api/sessions/current || metodo: GET, obtiene la info del usuario actual", async function () {
            this.timeout(15000);

            const response = await requester.get("/api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`]);

            const { _body } = response;

            const { status, payload } = _body

            const { email } = payload;

            expect(response).to.be.an("object");

            expect(status).to.be.deep.equal("success");

            expect(payload).to.be.an("object");
            expect(email).to.be.deep.equal("pepito@gmail.com");

            // el borrado tenes q hacerlo despues de probar el login y current xq si lo borras en el register cuando intente loguear el usuario mock ya esta eliminado de la db
            const getUser = await userModel.findOne({ email: "pepito@gmail.com" });

            const { email: emailUser, cart } = getUser;
            const { id } = cart;

            await cartsModel.deleteOne({ _id: id });
            await userModel.deleteOne({ email: emailUser });
        })
    })
})