import { useContext, useRef } from 'react';
import toast from 'react-hot-toast';
import { CartContext } from '../contexts/CartContext';
import { CartItemDTO, MenuItemDTO } from '../utils/models';

const SingleMenuItem: React.FC<MenuItemDTO> = (menuItem) => {

    const quantityInput = useRef<any>();
    const menuCard = useRef<any>();
    const { cartItems, setCartItems } = useContext(CartContext);

    const addCartItem = () => { // add item to cart

        menuCard.current.checked = false; // uncheck the checkbox
        for (let i = 0; i < cartItems.length; i++) { // check if item already exists in cart
            if (cartItems[i].stripePriceId === menuItem.stripePriceId) { // if item already exists in cart
                cartItems[i].quantity += parseInt(quantityInput.current.value); // add quantity to existing item
                setCartItems([...cartItems]);
                toast.success(quantityInput.current.value + ' ' + menuItem.name + ' added to cart');
                menuCard.current.checked = false;
                return;
            }
        }
        let newCartItem = new CartItemDTO();
        newCartItem.name = menuItem.name;
        newCartItem.unitAmount = menuItem.price;
        newCartItem.quantity = parseInt(quantityInput.current.value);
        newCartItem.stripePriceId = menuItem.stripePriceId;
        setCartItems([...cartItems, newCartItem]);
        toast.success(quantityInput.current.value + ' ' + menuItem.name + ' added to cart');
    }

    return (
        <div className="w-full border-b">
            <input ref={menuCard} type="checkbox" name="card" id={`${"item-" + menuItem.id}`} className="hidden" />
            <label htmlFor={`${"item-" + menuItem.id}`} className="flex p-4">
                <div className="w-2/3 flex flex-col items-start justify-start pr-2">
                    <h1 className="text-xl font-medium">{menuItem.name}</h1>
                    <p className="font-normal my-1">{menuItem.price} CAD</p>
                </div>
                <div className="w-1/3">
                    <img src={menuItem.image as string} alt="" className="h-full max-h-28 rounded" />
                </div>
            </label>
            <div className="accordion__content flex flex-row justify-around items-end overflow-hidden bg-grey-lighter px-4">
                <div className="custom-number-input w-32 mb-2">
                    <label htmlFor="custom-input-number" className="w-full text-gray-700 text-sm font-semibold">Quantity
                    </label>
                    <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                        <button onClick={() => { if (quantityInput.current.value > 1) quantityInput.current.value = parseInt(quantityInput.current.value) - 1 }} className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                            <span className="m-auto text-2xl font-thin">−</span>
                        </button>
                        <input defaultValue={1} ref={quantityInput} className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700"></input>
                        <button onClick={() => { quantityInput.current.value = parseInt(quantityInput.current.value) + 1 }} data-action="increment" className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                            <span className="m-auto text-2xl font-thin">+</span>
                        </button>
                    </div>
                </div>
                <button onClick={addCartItem} className="bg-blue-500 text-white h-fit mb-2 px-4 py-2 rounded-md text-1xl font-medium">Add to Cart</button>
            </div>
        </div>
    );
}

export default SingleMenuItem;
