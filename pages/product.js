import axios from 'axios';
import ProductSummary from '../components/Product/ProductSummary';
import ProductAttribures from '../components/Product/ProductAttributes';
import baseUrl from '../utils/baseUrl';

function Product({ product, user }) {
	console.log({product});
  return (
  	<>
  		<ProductSummary user={user} {...product} />
  		<ProductAttribures user={user} {...product} />
  	</>
  	)
}

Product.getInitialProps = async ({ query: { _id } }) => {
	// const url = "http://localhost:3000/api/product";
	const url = `${baseUrl}/api/product`;
	const payload = { params: { _id } };
	const response = await axios.get(url, payload);
	return { product: response.data };

	// console.log(query)
}

export default Product;
