import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import connectDb from '../../utils/connectDb';

connectDb();

const { ObjectId } = mongoose.Types;
 
export default async (req, res) => {
    switch (req.method){
        case "GET":
            await handleGetRequest(req, res);
            break;
        case "PUT":
            await handlePutRequest(req, res);
            break
        case "DELETE":
            await handleDeleteRequest(req, res);
            break
        case "POST":
            await handleUpdateRequest(req, res);
            break
        default:
            res.status(405).send(`Method ${req.method} not allowed`)
            break
    }
}

async function handleGetRequest(req, res){
    if(!("authorization" in req.headers)){
        return res.status(401).send("No authorization token");
    }
    try{
        const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const cart = await Cart.findOne({ user: userId }).populate({
            path: "products.product",
            model: "Product"
        });
        res.status(200).json(cart.products);
    }catch (error){
        console.error(error);
        res.status(403).send("Please login again")
    }
}

async function handlePutRequest(req, res){
    const { quantity, productId } = req.body;
    if(!("authorization" in req.headers)){
        return res.status(401).send("No authorization token");
    }
    try {
        const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        // Get user cart based on userId
        const cart = await Cart.findOne({ user: userId })
        // console.log(cart._id);
        // Check if product already exists in cart
        // cart.products.every()
        const productExists = cart.products.some(doc => ObjectId(productId).equals(doc.product))
        // If so, imcrement quantty (by number provided to request)
        if(productExists){
            const edit_update = await Cart.findOneAndUpdate(
                { _id: cart._id, "products.product": productId },
                { $inc: { "products.$.quantity": quantity } }
            );
            // console.log(edit_update);
        }else{
            // If not, add mew product with give quantity
            const newProduct = { quantity, product: productId }
            const add_new = await Cart.findOneAndUpdate(
                { _id: cart._id },
                { $addToSet: { products: newProduct } }
            );
            // console.log(userId);
            // console.log('_ID', cart._id);
            // console.log(add_new);
             // { $push: {} }
        }
        res.status(200).send("Cart updated");

    }catch (error){
        console.error(error);
        res.status(403).send("Please login again")
    }
}


async function handleDeleteRequest(req, res) {
    const { productId } = req.query
    if(!("authorization" in req.headers)){
        return res.status(401).send("No authorization token");
    }
    try {
        const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { products: { product: productId } } },
            { new: true }
        ).populate({
            path: "products.product",
            model: "Product"
        })
        res.status(200).json(cart.products);
    }catch(error){
        console.error(error);
        res.status(403).send("Please login again")
    }
}

async function handleUpdateRequest(req, res){
    // console.log(req.body.headers.Authorization);
    const { quantity, productId, _id, quantity_total, type, number } = req.body.params;
    // console.log(quantity);
    if(!("authorization" in req.headers)){
        return res.status(401).send("No authorization token");
    }
    try {
        const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        let total = 0;
        if(type === "plus"){
            total = quantity_total + number;
        }else{
            total = quantity_total - number;
        }
        // console.log(total);
        if(total < 1){
            
            const cart = await Cart.findOneAndUpdate(
                { user: userId, "products.product": productId  },
                // { $pull: { products: { product: productId } } },
                { $pull: { products: { product: productId } } },
                { new: true }
            ).populate({
                path: "products.product",
                model: "Product"
            });
            res.status(200).json(cart.products);
        }else{
            const cart = await Cart.findOneAndUpdate(
                { user: userId, "products.product": productId  },
                { $inc: { "products.$.quantity": quantity } },
                { new: true }
            ).populate({
                path: "products.product",
                model: "Product"
            });
            res.status(200).json(cart.products);
        }
        
        // console.log(cart);
        
        // console.log(userId);
        // Get user cart based on userId
        // const cart = await Cart.findOne({ user: userId }).populate({
        //     path: "products.product",
        //     model: "Product"
        // });
        
        // console.log(ObjectId(productId));
        // Check if product already exists in cart
        // const productExists = cart.products.some(doc => ObjectId(productId).equals(doc.product._id));
        
        // If so, imcrement quantty (by number provided to request)
        // if(productExists){
            // console.log('edit');
            // const cart = await Cart.findOneAndUpdate(
            //     { _id: cart._id, "products.product": productId },
            //     { $inc: { "products.$.quantity": quantity } },
            //     { new: true }
            //     // { $set: {
            //     //         "products.$.quantity": quantity
            //     //     } 
            //     // },
                
            //     // { $addToSet: { products: newProduct } }
            // ).populate({
            //     path: "products.product",
            //     model: "Product"
            // });
            // res.status(200).json(cart.products);
            // console.log(cart.products)
            // console.log(edit_update);
        // }
        // console.log(edit_update);
        
        // res.status(200).send("Cart updated");

    }catch (error){
        console.error(error);
        res.status(403).send("Please login again")
    }
}