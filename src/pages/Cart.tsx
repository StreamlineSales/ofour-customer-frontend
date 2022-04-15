import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { CartItemDTO } from "../utils/models";
import CartItem from '../components/CartItem';
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {

    const { cartItems, _ } = useContext(CartContext);
    const [subtotal, setSubtotal] = useState<number>(0);

    useEffect(() => {
        let newSubtotal: any = cartItems.length !== 0 ? Object.values(cartItems).reduce((curr: number, item: any): any => curr + item.price, 0) : 0;
        setSubtotal(newSubtotal);
    }, []);

    const item = {
        price: "price_1KkLsXKvlpwmSssgP52DD4S7",
        quantity: 1
    }

    const checkoutOptions = {
        lineItems: [item],
        mode: "payment",
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout`
    }

    const redirectToCheckout = async () => {
        console.log("redirectToCheckout");
        const stripe: any = await loadStripe(process.env.REACT_APP_STRIPE_KEY?.toString() as string);
        await stripe.redirectToCheckout(checkoutOptions);
    }

    // Flow: Create product => store id in firebase 
    // menu item: { stripeStatus, id }

    return (
        <div className="App">

            {/* Hero Area */}
            <div className='mb-5 hero-area relative flex justify-center items-center'></div>

            {/* Cart Header */}
            <div className="w-11/12 mt-1 flex flex-row items-center">
                <div className="menu-line grow"></div>
                <div className="flex items-center px-3">
                    <i className="fa-solid fa-lg fa-cart-shopping"></i>
                    <h2 className='text-3xl font-bold grow-0 pl-2'>Cart</h2>
                </div>
                <div className="menu-line grow"></div>
            </div>

            {/* Cart Items */}
            <div className="w-11/12 mt-3 shadow-md rounded-lg p-1">
                {cartItems.map((item: CartItemDTO, idx: number) => (
                    <CartItem
                        key={idx}
                        cartItem={item}
                        subtotalState={{ subtotal, setSubtotal }}
                    />
                ))}
                <div className="w-full flex flex-col items-center p-3">
                    <div className="w-full font-thin flex justify-between items-center">
                        <h1 className='text-lg w-1/2'>Subtotal</h1>
                        <p className='ml-auto'>{subtotal.toFixed(2)} CAD</p>
                    </div>
                    <div className="w-full font-thin flex justify-between items-center">
                        <h1 className='text-lg w-1/2'>GST</h1>
                        <p className='ml-auto'>{(subtotal * 0.05).toFixed(2)} CAD</p>
                    </div>
                    <div className="w-full font-thin flex justify-between items-center">
                        <h1 className='text-lg w-1/2'>PST</h1>
                        <p className='ml-auto'>{(subtotal * 0.09975).toFixed(2)} CAD</p>
                    </div>
                    {/* <div className="w-full font-thin flex justify-between items-center">
                        <h1 className='text-lg w-1/2'>Service Fee</h1>
                        <p className='ml-auto'>{(subtotal * 0.01).toFixed(2)} CAD</p>
                    </div> */}
                    <div className="w-full font-bold flex justify-between items-center">
                        <h1 className='text-lg w-1/2'>Total</h1>
                        <p className='ml-auto'>{(subtotal * 1.14975).toFixed(2)} CAD</p>
                    </div>
                </div>
            </div>

            {/* Continue Button (continue without payment) */}
            <Link to="/order" className="flex justify-center items-center w-1/2 mt-4 bg-red-600 text-white text-sm px-4 py-4 rounded-full">
                <h1 className='text-lg font-extrabold'>Continue</h1>
            </Link>

            {/* Checkout Button (continue to stripe payment) */}
            {/* <button onClick={redirectToCheckout} className="text-lg font-extrabold flex justify-center items-center w-1/2 mt-4 bg-red-600 text-white px-4 py-4 rounded-full">
                Checkout
            </button> */}

            {/* Go back to menu */}
            <Link to="/" className="flex justify-center items-center w-1/2 mt-2 mb-5 bg-slate-400 text-white text-sm py-4 rounded-full">
                <h1 className='text-lg font-extrabold'>Add items</h1>
            </Link>
        </div>
    );
}

export default Cart;
