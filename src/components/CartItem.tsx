import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { CartItemDTO, CartItemType, ComboItem } from '../utils/models';

interface CartItemProps {
    cartItem: CartItemDTO,
    subtotalState: any
}

const CartItem: React.FC<CartItemProps> = ({ cartItem, subtotalState }) => {

    const { cartItems, setCartItems } = useContext(CartContext);
    const { subtotal, setSubtotal } = subtotalState;
    const navigate = useNavigate();

    const removeCartItem = () => {
        toast.success(cartItem.title + ' removed from cart') // Toast message
        let newCartItems = cartItems.filter((item: CartItemDTO) => item !== cartItem);
        setCartItems(newCartItems);
        let newSubtotal = subtotal - cartItem.price;
        setSubtotal(newSubtotal);
        if (newCartItems.length === 0) navigate("/");
    }

    return (
        <div className="w-full flex justify-between items-center p-4 border-b">
            <div className='w-3/5'>
                <h1 className='text-xl'>{cartItem.title}</h1>
                {cartItem.content?.map((comboItem: ComboItem, idx: number) => <li key={idx} className="text-sm">{comboItem.title}</li>)}
            </div>
            <div className='flex justify-around items-center w-2/5'>
                <p>x{cartItem.count}</p>
                <p>{cartItem.price}CAD</p>
                <i onClick={removeCartItem} className="fa-solid fa-trash-can"></i>
            </div>
        </div>
    );
}

export default CartItem;
