import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="cart-title">Your Cart</h1>
        <p className="cart-empty">Your cart is empty.</p>
        <Link to="/products" className="cart-shop-link">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
        <button className="cart-clear-button" onClick={clearCart}>
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => {
            const imageUrl = item.image
              ? `http://127.0.0.1:8000/storage/${item.image}`
              : null;

            return (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-image-wrapper">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="cart-item-image"
                    />
                  ) : (
                    <div className="cart-item-placeholder">No Image</div>
                  )}
                </div>

                <div className="cart-item-content">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <p className="cart-item-price">
                    {Number(item.price).toLocaleString("it-IT", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-quantity-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>

                  <button
                    className="cart-remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div className="cart-summary-row">
            <span>Total</span>
            <strong>
              {cartTotal.toLocaleString("it-IT", {
                style: "currency",
                currency: "EUR",
              })}
            </strong>
          </div>

          <button className="cart-checkout-button">Proceed to checkout</button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;