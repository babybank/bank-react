import Product from '../../models/Product';
import Cart from '../../models/Cart';
import connectDb from '../../utils/connectDb';

connectDb();

// GET -> handleGetRequest, DELETE -> handleDelete
export default async (req, res) => {
	switch(req.method){
		case "GET":
			await handleGetRequest(req,res);
			break;
		case "POST":
			await handlePostRequest(req, res);
			break;
		case "DELETE":
			await handleDeleteRequest(req,res);
			break;
		default:
			res.status(405).send(`Method ${req.method} not allowed `);
			break;
	}
}

async function handlePostRequest(req, res){
	const {name, price, description, mediaUrl } = req.body;
	try {
		if(!name || !price || !description || !mediaUrl){
			return res.status(422).send("Product missing one or more fields")
		}
	
		const product = await new Product({
			name,
			price,
			description,
			mediaUrl
		}).save();
	
		res.status(200).json(product);
	} catch (error){
		console.error(error);
		res.status(500).send("Server createing product")
	}
	
}


async function handleGetRequest(req, res){
	const { _id } = req.query;
	try{
		// 1) Delete product by id
		await Product.findOne({ _id });
		// const product = await Product.findOne({ _id });
		// 2) Remove product from all carts, referenced as 'product'
		await Cart.updateMany(
			{ "products.product": _id },
			{ $pull: { products: { product: _id } } }
		)
		res.status(200).json({})
		// Product.findOne({ _id: _id })
	}catch(error){
		console.error(error)
		res.send(500).send('Error deleteing product')
	}
	
}

async function handleDeleteRequest(req, res){
	const { _id } = req.query;
	const product = await Product.findOneAndRemove({ _id });
	res.status(204).json(product)
}