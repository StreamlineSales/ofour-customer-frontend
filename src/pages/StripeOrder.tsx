import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { CartItemDTO, Category, MenuItemDTO, OrderDTO } from "../utils/models";
import { collection, doc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { db, functions } from "../utils/firebase";
import toast from "react-hot-toast";
import { loadStripe, StripeCardElement } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { httpsCallable } from "firebase/functions";

const stripePromise: any = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY?.toString() as string);

const StripeOrder = () => {

    const { cartItems, setCartItems } = useContext(CartContext);

    const redirectToCheckout = async () => {
        if (cartItems.length === 0) {
            toast.error("No cart items to checkout");
            return;
        }
        const lineItems = cartItems.map((cartItem: CartItemDTO) => { return { price: cartItem.price, quantity: cartItem.quantity }; });
        const checkoutOptions = {
            lineItems: lineItems,
            mode: "payment",
            successUrl: `${window.location.origin}`,
            cancelUrl: `${window.location.origin}/checkout`
        }
        const stripe: any = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY?.toString() as string);
        await stripe.redirectToCheckout(checkoutOptions);
    }

    return (
        <div className="App">
            <div className='w-full fixed top-0 z-10'>
                {/* Hero Area */}
                <div className='hero-area relative flex justify-center items-center' />
            </div>
            <div className="w-11/12 pb-24 mt-40">
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </div>
        </div>
    );
}

export default StripeOrder;


const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const emailRef = useRef<any>();

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (elements == null) {
            return;
        }

        // console.log(clientSecret);
        const createStripePaymentIntent = httpsCallable(functions, 'createStripePaymentIntent');
        const {data: clientSecret} = await createStripePaymentIntent({ amount: 1000 });

        const paymentMethodReq = await stripe!.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement) as StripeCardElement,
            billing_details: {
                email: emailRef.current.value
            }
        });
        console.log(paymentMethodReq);

        const confirmCardPayment = await stripe?.confirmCardPayment(clientSecret as string, {
            payment_method: paymentMethodReq.paymentMethod?.id,
        });

        console.log(confirmCardPayment);
    };

    console.log("stripe:", stripe);
    console.log("elements: ", elements);

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email <span className="text-red-600">*</span>
                </label>
                <input ref={emailRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Enter your email" required />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Card <span className="text-red-600">*</span>
                </label>
                <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <CardElement options={{ hidePostalCode:true, iconStyle: "solid" }} />
                </div>
            </div>
            <button className="w-full mt-3 p-1 bg-red-500 rounded text-white" type="submit" disabled={!stripe || !elements}>
                Pay
            </button>
        </form>
    );
};

