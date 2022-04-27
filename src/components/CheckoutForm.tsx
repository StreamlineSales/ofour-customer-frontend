import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { db, functions } from "../utils/firebase";
import toast from "react-hot-toast";
import { StripeCardElement } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { httpsCallable } from "firebase/functions";
import { collection, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";

const CheckoutForm: React.FC<any> = ({ totalAmount, setOrderNumber, setOrderPlaced }) => {

    const stripe = useStripe();
    const elements = useElements();
    const { cartItems, setCartItems } = useContext(CartContext);
    const emailRef = useRef<any>();
    const nameRef = useRef<any>();
    const [loading, setLoading] = useState<boolean>(false);

    const pay = async (event: any) => {
        setLoading(true);
        event.preventDefault();

        // if name or email or not given, toast an error
        if (!nameRef.current.value || !emailRef.current.value) {
            toast.error("Name and email fields are required");
            setLoading(false);
            return;
        }
        // if cart has no items, toast an error
        if (cartItems.length === 0) {
            toast.error("No cart items to checkout");
            setLoading(false);
            return;
        }
        // if elements or stripe has not been loaded yet, toast an error
        if (elements == null || !stripe) {
            toast.error("Stripe not loaded yet! Please try again in a moment.")
            setLoading(false);
            return;
        }

        try {
            // create Stripe Payment Intent and get the client secret
            const createStripePaymentIntent = httpsCallable(functions, 'createStripePaymentIntent');
            const { data: clientSecret } = await createStripePaymentIntent({ cartItems: cartItems });

            // create payment method
            const paymentMethodReq = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement) as StripeCardElement,
                billing_details: {
                    name: nameRef.current.value,
                    email: emailRef.current.value
                }
            });
            if (paymentMethodReq.error) {
                toast.error("Unable to process payment");
                setLoading(false);
                return;
            }

            // confirm card payment
            const confirmCardPayment = await stripe.confirmCardPayment(clientSecret as string, {
                payment_method: paymentMethodReq.paymentMethod?.id,
            });
            if (confirmCardPayment.error) {
                toast.error("Unable to process payment");
                setLoading(false);
                return;
            }

            // if payment succeeds, write the order to firestore
            if (confirmCardPayment.paymentIntent?.status === "succeeded") {

                // get the next order number
                let nextOrderNumber = 1;
                const orderCollection = await getDocs(query(collection(db, "orders"), orderBy("orderNumber", "desc")));
                if (orderCollection.docs.length > 0) {
                    nextOrderNumber = orderCollection.docs[0].data().orderNumber + 1;
                    setOrderNumber(nextOrderNumber);
                }

                // write the order data object to firestore
                setDoc(doc(collection(db, "orders")), {
                    name: nameRef.current.value,
                    email: emailRef.current.value,
                    lineItems: cartItems.map((obj: any)=> {return Object.assign({}, obj)}),
                    dateCreated: new Date(),
                    dateCompleted: null,
                    totalPrice: confirmCardPayment.paymentIntent.amount,
                    orderNumber: nextOrderNumber
                }).then(() => {
                    setLoading(false);
                    setOrderPlaced(true);
                }).catch((err: any) => {
                    toast.error(err.message);
                    setLoading(false);
                });
            }
        }
        catch (err: any) { // catch errors if any
            console.log(err);
            toast.error(err.message);
        }
    };

    return (
        <form className="w-full" onSubmit={pay}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                    Name <span className="text-red-600">*</span>
                </label>
                <input ref={nameRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="firstname" type="text" placeholder="Name" required />
            </div>
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
                    <CardElement options={{ hidePostalCode: true, iconStyle: "solid" }} />
                </div>
            </div>
            <button className="w-full mt-2 mb-4 p-2 bg-red-500 rounded text-white" type="submit" disabled={!stripe || !elements}>
                {loading ?
                    <div className="w-full flex justify-center">
                        <span className="spinner"></span>
                    </div>
                    :
                    <span className="text-lg font-bold">Pay {totalAmount} CAD</span>
                }
            </button>
        </form>
    );
};

export default CheckoutForm;