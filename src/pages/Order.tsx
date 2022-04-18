import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { CartItemDTO, Category, MenuItemDTO, OrderDTO } from "../utils/models";
import { collection, doc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "../utils/firebase";
import toast from "react-hot-toast";

const Order = () => {

    const { cartItems, setCartItems } = useContext(CartContext);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const nameRef = useRef<any>();
    const emailRef = useRef<any>();
    const phoneNumberRef = useRef<any>();
    const instructionsRef = useRef<any>();
    const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
    const [error, setError] = useState("");
    const [loadingOrderConfirmation, setLoadingOrderConfirmation] = useState<boolean>(false);
    const [nextOrderNumber, setNextOrderNumber] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate(-1);
            return;
        }
        let newSubtotal: any = cartItems.length !== 0 ? Object.values(cartItems).reduce((curr: number, item: any): any => curr + item.price, 0) : 0;
        setTotalPrice(parseFloat((newSubtotal * 1.14975).toFixed(2)));
        nameRef.current.value = localStorage.getItem("name");
        emailRef.current.value = localStorage.getItem("email") ? JSON.parse(localStorage.getItem("email") as string) : "";
        phoneNumberRef.current.value = localStorage.getItem("phoneNumber") ? JSON.parse(localStorage.getItem("phoneNumber") as string) : "";
        getDocs(query(collection(db, "orders"), orderBy("orderNumber", "desc"))).then((res: any) => {
            if (res.docs) setNextOrderNumber(res.docs[0].data().orderNumber + 1);
        });
    }, []);

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const placeOrder = () => {
        const options = {
            from: "streamlinepos@gmail.com",
            to: "carlmachaalany1@gmail.com",
            subject: "Sending email with node.js!",
            text: "This is the text"
        };
        setLoadingOrderConfirmation(true);
        if (!nameRef.current.value || !emailRef.current.value) {
            setError("Name and email fields are required");
            setLoadingOrderConfirmation(false);
            return;
        } else if (!validateEmail(emailRef.current.value)) {
            setError("Please enter a valid email format");
            setLoadingOrderConfirmation(false);
            return;
        } else if (cartItems.length === 0) {
            setError("Cart has no items!");
            setLoadingOrderConfirmation(false);
            return;
        }
        const newOrder: OrderDTO = new OrderDTO();
        newOrder.name = nameRef.current.value;
        newOrder.email = emailRef.current.value;
        newOrder.phoneNumber = phoneNumberRef.current.value;
        newOrder.instructions = instructionsRef.current.value;
        newOrder.lineItems = cartItems.map((item: any) => { return { ...item }; });
        newOrder.dateCreated = new Date();
        newOrder.dateCompleted = null;
        newOrder.totalPrice = totalPrice;
        newOrder.orderNumber = nextOrderNumber;
        setDoc(doc(collection(db, "orders-" + process.env.NODE_ENV)), { ...newOrder }).then(() => {
            setLoadingOrderConfirmation(false);
            localStorage.setItem("firstName", JSON.stringify(nameRef.current.value));
            localStorage.setItem("email", JSON.stringify(emailRef.current.value));
            localStorage.setItem("phoneNumber", JSON.stringify(phoneNumberRef.current.value));
            setError("");
            setOrderPlaced(true);
            toast.success("Order Placed!");
        }, (err: any) => {
            setError(err.message);
            toast.error("Order couldn't be placed, please try again later.");
        });
    }

    return (
        <div className="App">

            {/* Hero Area */}
            <div className='mb-5 hero-area relative flex justify-center items-center'></div>

            {!orderPlaced ?
                <>
                    {/* Order Header */}
                    <div className="w-11/12 mt-1 flex flex-row items-center">
                        <div className="menu-line grow"></div>
                        <div className="flex items-center px-3">
                            <i className="fa-solid fa-lg fa-receipt"></i>
                            <h2 className='text-3xl font-bold grow-0 pl-2'>Order</h2>
                        </div>
                        <div className="menu-line grow"></div>
                    </div>

                    {/* Order Form */}
                    <div className="w-full mt-2 max-w-sm">
                        <form className="bg-white rounded px-8 pt-6">
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phonenumber">
                                    Phone Number
                                </label>
                                <input ref={phoneNumberRef} className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phonenumber" type="tel" placeholder="+1xxxxxxxxxx" required />
                            </div>
                            <div className="mb-1">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instructions">
                                    Instructions
                                </label>
                                <input ref={instructionsRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="instructions" type="text" placeholder="Add extra sauce, etc." required />
                            </div>
                        </form>
                    </div>

                    {error ? <small className="text-red-600 mt-2"><i className="fa-solid fa-circle-exclamation mr-1"></i>{error}</small> : ""}
                    {/* Place Order Button */}
                    <Link to="/order" className="flex justify-center items-center w-1/2 mt-3 bg-red-600 text-white text-sm px-4 py-4 rounded-full">
                        {!loadingOrderConfirmation ?
                            <><h1 onClick={placeOrder} className='w-full h-full text-center text-lg font-extrabold'>Place Order</h1></> :
                            <><span className='spinner' /><p className='text-lg font-extrabold ml-2'>Placing Order</p></>
                        }
                    </Link>
                    <Link to="/checkout" className="flex justify-center items-center w-1/2 mt-2 mb-5 bg-slate-400 text-white text-sm py-4 rounded-full">
                        <h1 className='text-lg font-extrabold'>Back to Cart</h1>
                    </Link>
                </>
                :
                <></>
                // Order Placed
                // <div className="flex flex-col items-center rounded px-4 py-4 shadow-md w-11/12 mb-2">
                //     <h1 className="text-center text-3xl font-bold w-full">Order Summary</h1>
                //     <p className="text-center mb-1 text-xl w-full">Order #: <span className="font-bold">{nextOrderNumber}</span></p>
                //     {cartItems.map((cartItem: CartItemDTO, idx: number) => (
                //         <div key={idx} className="w-full flex justify-between items-center p-4 border-t">
                //             <div className='w-3/5'>
                //                 <h1 className='text-xl'>{cartItem.title}</h1>
                //             </div>
                //             <div className='flex justify-around items-center w-2/5'>
                //                 <p>x{cartItem.count}</p>
                //                 <p>{cartItem.price}CAD</p>
                //             </div>
                //         </div>
                //     ))}
                //     <p className="w-full text-xl font-semibold border-t pt-2 pl-4">Total: {totalPrice} CAD</p>
                // </div>
            }
        </div>
    );
}

export default Order;
