// const express = require('express');
// import express from 'express';
//import products from '../../static/products.json';
import Product from '../../models/Product';
import connectDb from '../../utils/connectDb';

connectDb();

export default async (req, res) => {
	//console.log(req.method);
	// res.status(200).send('asdas');
	// res.status(200).json(products);

	// Convert querystring values to numbers
	const { page, size } = req.query;
	const pageNum = Number(page);
	const pageSize = Number(size);
	let products = [];
	const totalDocs = await Product.countDocuments();
	const totalPages = Math.ceil(totalDocs / pageSize);
	if (pageNum === 1){
		products = await Product.find().limit(pageSize);
	}else{
		const skips = pageSize * (pageNum - 1);
		products = await Product.find().skip(skips).limit(pageSize);
	}
	
	// const products = await Product.find()
	res.status(200).json({ products, totalPages });
}
