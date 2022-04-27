import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { CartItemDTO } from "../utils/models";
import CartItem from '../components/CartItem';
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
const stripePromise: any = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY?.toString() as string);

const Cart = () => {

    const { cartItems, _ } = useContext(CartContext);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
    const [orderNumber, setOrderNumber] = useState<number>(1);

    useEffect(() => {
        let newSubtotal: any = cartItems.length !== 0 ? Object.values(cartItems).reduce((curr: number, item: any): any => curr + item.unitAmount*item.quantity, 0) : 0;
        setSubtotal(newSubtotal);
    }, []);

    return (
        <div className="App">

            {/* Hero Area */}
            <div className='mb-5 hero-area relative flex justify-center items-center'></div>

            {!orderPlaced ?
                <>
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
                    <div className="w-11/12 mt-3 shadow-md rounded-lg">
                        {cartItems.map((item: CartItemDTO, idx: number) => (
                            <CartItem
                                key={idx}
                                cartItem={item}
                                subtotalState={{ subtotal, setSubtotal }}
                                orderPlaced={false}
                            />
                        ))}
                        <div className="w-full flex flex-col items-center pt-3">
                            <div className="w-full font-thin flex justify-between items-center px-3">
                                <h1 className='text-lg w-1/2'>Subtotal</h1>
                                <p className='ml-auto'>{subtotal.toFixed(2)} CAD</p>
                            </div>
                            <div className="w-full font-thin flex justify-between items-center px-3">
                                <h1 className='text-lg w-1/2'>GST</h1>
                                <p className='ml-auto'>{(subtotal * 0.05).toFixed(2)} CAD</p>
                            </div>
                            <div className="w-full font-thin flex justify-between items-center px-3">
                                <h1 className='text-lg w-1/2'>PST</h1>
                                <p className='ml-auto'>{(subtotal * 0.09975).toFixed(2)} CAD</p>
                            </div>
                            <div className="w-full font-bold flex justify-between items-center px-3">
                                <h1 className='text-lg w-1/2'>Total</h1>
                                <p className='ml-auto'>{(subtotal * 1.14975).toFixed(2)} CAD</p>
                            </div>
                            <Link to="/" className="flex justify-center items-center w-full mt-2 bg-slate-400 text-white text-sm py-2 rounded-b-lg">
                                <h1 className='text-lg font-extrabold'>Add items</h1>
                            </Link>
                        </div>
                    </div>

                    <div className="w-11/12 mt-5 p-1">
                        <Elements stripe={stripePromise}>
                            <CheckoutForm totalAmount={(subtotal * 1.14975).toFixed(2)} setOrderNumber={setOrderNumber} setOrderPlaced={setOrderPlaced} />
                        </Elements>
                    </div>
                </>
                :
                <div className="w-11/12 mt-3 shadow-md rounded-lg">
                    <h1 className="text-center text-3xl font-bold w-full">Order Placed!</h1>
                    <p className="text-center pb-2 text-xl w-full border-b">Order #: <span className="font-bold">{orderNumber}</span></p>
                    {cartItems.map((item: CartItemDTO, idx: number) => (
                        <CartItem
                            key={idx}
                            cartItem={item}
                            subtotalState={{ subtotal, setSubtotal }}
                            orderPlaced={true}
                        />
                    ))}
                    <div className="w-full flex flex-col items-center p-3">
                        <div className="w-full font-thin flex justify-between items-center px-3">
                            <h1 className='text-lg w-1/2'>Subtotal</h1>
                            <p className='ml-auto'>{subtotal.toFixed(2)} CAD</p>
                        </div>
                        <div className="w-full font-thin flex justify-between items-center px-3">
                            <h1 className='text-lg w-1/2'>GST</h1>
                            <p className='ml-auto'>{(subtotal * 0.05).toFixed(2)} CAD</p>
                        </div>
                        <div className="w-full font-thin flex justify-between items-center px-3">
                            <h1 className='text-lg w-1/2'>PST</h1>
                            <p className='ml-auto'>{(subtotal * 0.09975).toFixed(2)} CAD</p>
                        </div>
                        <div className="w-full font-bold flex justify-between items-center px-3">
                            <h1 className='text-lg w-1/2'>Total</h1>
                            <p className='ml-auto'>{(subtotal * 1.14975).toFixed(2)} CAD</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Cart;
