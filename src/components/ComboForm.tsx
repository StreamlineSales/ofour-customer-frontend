import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CartContext } from '../contexts/CartContext';
import { CartItemDTO, CartItemType, ComboItem, MenuItemDTO } from '../utils/models';
import ComboOption from './ComboOption';

const ComboForm: React.FC<any> = ({ meatComboItems, vegetableComboItems, selectedCombo, setSelectedCombo, setPopUpVisible }) => {

    const { cartItems, setCartItems } = useContext(CartContext);

    const equals = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

    const addToCart = () => {
        if (selectedCombo.some((comboItem: ComboItem) => comboItem.title === "")) {
            toast.error("Please select all combo options");
            return;
        }
        let newCartItem = new CartItemDTO();
        newCartItem.type = CartItemType.Combo;
        let meatAndVegetableCount = [selectedCombo.filter((comboItem: ComboItem) => comboItem.type === 'meat').length, selectedCombo.filter((comboItem: ComboItem) => comboItem.type === 'vegetable').length];
        let titleAndPrice!: any;
        if (equals(meatAndVegetableCount, [1, 2])) titleAndPrice = ["1 Meat 2 Vegetables", 11.99];
        else if (equals(meatAndVegetableCount, [2, 1])) titleAndPrice = ["2 Meats 1 Vegetable", 12.99];
        else if (equals(meatAndVegetableCount, [2, 2])) titleAndPrice = ["2 Meats 2 Vegetables", 13.99];
        else if (equals(meatAndVegetableCount, [3, 0])) titleAndPrice = ["3 Meats", 13.99];
        newCartItem.title = titleAndPrice[0];
        newCartItem.price = titleAndPrice[1];
        newCartItem.count = 1;
        newCartItem.content = selectedCombo.map((obj: ComboItem) => { return Object.assign({}, obj) });
        toast.success(newCartItem.title + ' added to cart!');
        setCartItems([...cartItems, newCartItem]);
        setPopUpVisible(false);
        setSelectedCombo(null);
    }

    const closePopUp = () => {
        setSelectedCombo(null);
        setPopUpVisible(false);
    }

    return (
        <div className={'flex flex-col w-full h-full transition duration-600'}>
            <div className='w-full flex justify-between mt-4'>
                <h1 className='text-3xl font-bold mb-1 flex items-center'>Meats {selectedCombo ? <span className='text-base font-thin ml-2'>({selectedCombo.filter((i: ComboItem) => i.type === "meat").length} required)</span> : ""}</h1>
                <span onClick={closePopUp} className='mr-2 mt-1'><i className="fa-solid fa-2xl fa-multiply text-slate-600"></i></span>
            </div>
            <ol>
                {meatComboItems.map((comboOption: MenuItemDTO, idx: number) => (
                    <ComboOption key={idx} idx={idx} comboOption={comboOption} selectedCombo={selectedCombo} setSelectedCombo={setSelectedCombo} />
                ))}
            </ol>
            <div className={selectedCombo?.filter((i: ComboItem) => i.type === "vegetable").length === 0 ? 'hidden' : ''}>
                <h1 className='text-3xl font-bold mt-2 mb-1 flex items-center'>Vegetables{selectedCombo ? <span className='text-base font-thin ml-2'>({selectedCombo.filter((i: ComboItem) => i.type === "vegetable").length} required)</span> : ""}</h1>
                <ol>
                    {vegetableComboItems.map((comboOption: MenuItemDTO, idx: number) => (
                        <ComboOption key={idx} idx={idx} comboOption={comboOption} selectedCombo={selectedCombo} setSelectedCombo={setSelectedCombo} />
                    ))}
                </ol>
            </div>
            <div className={'pt-2 pb-5 flex w-full justify-end items-center mb-2 ' + (selectedCombo ? '' : 'hidden')}>
                <button onClick={addToCart} className="bg-blue-500 text-white h-fit px-4 py-2 rounded-md text-1xl font-medium">Add to Cart</button>
            </div>
        </div>
    );
}

export default ComboForm;
