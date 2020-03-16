import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Button, Segment, Divider } from 'semantic-ui-react';
import calculateCartTotal from '../../utils/calculateCartTotal';

function CartSummary({ products, loading, success, handleCheckout }) {
  const [cartAmount, setCartAmount] = React.useState(0);
  const [stripeAmount, setStripeAmount] = React.useState(0);
  const [isCartEmpty, setCartEmpty] = React.useState(false);

  React.useEffect( () => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setCartEmpty(products.length === 0);
  }, [products])

  return <>
    <Divider />
    <Segment clearing size="large">
    <strong>Sub total: </strong> ${cartAmount}
      <StripeCheckout
        name="React Reserve"
        amount={stripeAmount}
        image={products.length > 0 ? products[0].product.mediaUrl: ""}
        currency="USD"
        shippingAddress={true}
        billingAddress={true}
        zipCode={true}
        stripeKey="pk_test_llWo2Gjel5aT5nS04zDrlOwn00gFwWrhwm"
        token={handleCheckout}
        // triggerEvent="onCLick"
      >
        <Button 
          disabled={isCartEmpty || success}
          icon="cart"
          color="teal"
          floated="right"
          content="Checkout"
          loading={loading}
        />
       </StripeCheckout>
    </Segment>
  </>;
}

export default CartSummary;
