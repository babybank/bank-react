import { Header, Segment, Icon, Button, Input, Item, Message, Label } from 'semantic-ui-react';
import { useRouter } from 'next/router';

function CartItemList({ products, user, handleRemoveFromCart, handleChange, loading, success }) {
  // const user = false;
  // console.log(products)
  const router = useRouter();

  function mapCartProductsToItems(products){
    return products.map(p => ({
      childKey: p.product._id,
      header: (
        <Item.Header as="a" onClick={ () => router.push(`/product?_id=${p.product._id}`)}>
          {p.product.name}
        </Item.Header>
      ),
      image: p.product.mediaUrl,
      meta: `$${p.quantity} x $${p.product.price}`,
      fluid: "true",
      description: (
        <>
          <Icon 
            name="minus"
            floated="left"
            color="red"
            disabled={loading}
            onClick={ () => handleChange(p._id,'minus')}
          />
          <Label 
            size="mini"
            color="blue"
            icon="cart"
            content={p.quantity}
          />
          <Icon 
            name="plus"
            color="green"
            disabled={loading}
            onClick={ () => handleChange(p._id,'plus')}
          />
       </>
      ),
      extra:(
        <Button 
          basic
          content="Delete"
          icon="remove"
          floated="right"
          color="red"
          size="mini"
          disabled={loading}
          onClick={ () => handleRemoveFromCart(p.product._id)}
        />
      )
    }))
  }
  if(success){
    return (
      <Message
        success
        header="Success!"
        content="Your order and payment has been accepted"
        icon="star outline"
      />
    );
  }
  if(products.length === 0){
    return (
      <Segment secondary color="teal" inverted textAlign="center" placeholder>
        <Header icon>
          <Icon name="shopping basket" />
            No products in your cart. Add some!
        </Header>
        <div>
          {user ? (
            <Button color="orange" onClick={() => router.push('/')} >
              View Products
            </Button>
          ): (
            <Button color="blue" onClick={() => router.push('/')} >
              Login to Add product
            </Button>
          )}
        </div>
      </Segment>
    );
  }
  return  <Item.Group divided items={mapCartProductsToItems(products)} />
  
}

export default CartItemList;
