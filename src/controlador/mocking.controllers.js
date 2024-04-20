import { generateProductMocking } from "../utils.js";

class MockingController{
    static getMockingProducts = async (req,res)=>{

        const cantidad = parseInt(req.query.cantidad) || 100;

        const result = [];

        for (let i = 0; i < cantidad; i++) {
            const newProduct = generateProductMocking();
            
            result.push(newProduct);
        }

        res.send({
            status : "success",
            payload : result
        })
    }
}

export {MockingController};