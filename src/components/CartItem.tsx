import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { CartItemDTO } from '../utils/models';

interface CartItemProps {
    cartItem: CartItemDTO,
    subtotalState: any,
    orderPlaced: boolean
}

const CartItem: React.FC<CartItemProps> = ({ cartItem, subtotalState, orderPlaced }) => {

    const { cartItems, setCartItems } = useContext(CartContext);
    const { subtotal, setSubtotal } = subtotalState;
    const navigate = useNavigate();

    const removeCartItem = () => {
        toast.success('Removed from cart') // Toast message
        let newCartItems = cartItems.filter((item: CartItemDTO) => item !== cartItem);
        setCartItems(newCartItems);
        let newSubtotal = subtotal - cartItem.unitAmount*cartItem.quantity;
        setSubtotal(newSubtotal);
        if (newCartItems.length === 0) navigate("/");
    }

    return (
        <div className="w-full flex justify-between items-center p-4 border-b">
            <div className='w-3/5'>
                <h1 className='text-xl'>{cartItem.name}</h1>
            </div>
            <div className='flex justify-around items-center w-2/5'>
                <p>x{cartItem.quantity}</p>
                <p>{(cartItem.unitAmount*cartItem.quantity).toFixed(2)}CAD</p>
                <i onClick={removeCartItem} className={`fa-solid fa-trash-can ${orderPlaced ? 'hidden' : ''}`}></i>
            </div>
        </div>
    );
}

export default CartItem;
