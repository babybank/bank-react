import React from 'react';
import { Segment } from 'semantic-ui-react';
import CartItemList from '../components/Cart/CartItemList';
import CarsSummary from '../components/Cart/CartSummary';
import { parseCookies } from 'nookies';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';
import cookie from 'js-cookie';

function Cart({ products, user }) {
  // console.log(products);
  const [cartProducts, setCartProducts] = React.useState(products);
  (products)
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  async function handleRemoveFromCart(productId){
    try{
      setLoading(true);
      const url = `${baseUrl}/api/cart`;
      const token = cookie.get('token');
      const payload = {
        params: { productId },
        headers: { Authorization: token }
      }
      const response = await axios.delete(url, payload);
      setCartProducts(response.data)
    }catch(error){
      console.error(error);
    }finally{
      setLoading(false);
    }
  }

  async function handleChange(_id, type){
    // console.log(cartProducts);
    const url = `${baseUrl}/api/cart`;
    const token = cookie.get('token');
    const result = cartProducts.find(x => x._id === _id);
    if(result){
      try {
        setLoading(true);
        // console.log(result);
        const productId = result.product._id;
        let quantity = '';
      
        if(type === "plus"){
          quantity = '+1';
        }else{
          quantity = '-1';
        }
        const params = { 
            '_id': _id,
            'quantity': quantity,
            'productId': productId,
            'quantity_total': result.quantity,
            'type': type,
            'number': 1
        }
        const payload = { params }
        const headers = { headers: { Authorization:token } }
        const response = await axios.post(url, payload, headers);
        // console.log('success',response.data);
        setCartProducts(response.data)
        // setSuccess(true);
      } catch (error){
        console.error(error);
      } finally{
        setLoading(false);
      }
      
      // console.log(cartProducts);
      // console.log(productId);
      // console.log(quantity);
    }
  }

  async function handleCheckout(paymentData) {
    try{
      setLoading(true);
      const url = `${baseUrl}/api/checkout`;
      const token = cookie.get('token');
      const payload = { paymentData }
      const headers = { headers: { Authorization:token } }
      const response = await axios.post(url, payload, headers)
      // console.log(response.data)
      // setCartProducts(response.data)
      setSuccess(true)
    }catch (error){
      catchErrors(error, window.alert);
    } finally{
      setLoading(false);
    }
  }

  return (
    <Segment loading={loading}>
      <CartItemList
        handleRemoveFromCart={handleRemoveFromCart}
        handleChange={handleChange}
        loading={loading}
        success={success}
        user={user} 
        products={cartProducts} 
      />
      <CarsSummary 
        products={cartProducts} 
        loading={loading}
        success={success}
        handleCheckout={handleCheckout}
      />
    </Segment>
  )
}

Cart.getInitialProps = async ctx => {
  // console.log(parseCookies(ctx));
  const { token } = parseCookies(ctx);
  if(!token){
    return { products: [] };
  }
  const url = `${baseUrl}/api/cart`;
  const payload = { headers: { Authorization: token } };
  const response = await axios.get(url, payload);
  // console.log(response.data);
  return { products:  response.data }
}

export default Cart;
