import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ComboOption: React.FC<any> = ({ idx, comboOption, selectedCombo, setSelectedCombo }) => {

    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        // setCount(selectedCombo ? selectedCombo.filter((comboItem: ComboItem) => comboItem.title === comboOption.title).length : 0);
    }, [selectedCombo]);

    // const addComboItem = (comboOption: ComboItem) => {
    //     const newSelectedCombo = [...(selectedCombo as ComboItem[])];
    //     const comboToEdit = newSelectedCombo?.filter((comboItem: ComboItem) => comboItem.type === comboOption.type && comboItem.title === "");
    //     if (comboToEdit?.length) {
    //         comboToEdit[0].title = comboOption.title;
    //         setSelectedCombo(newSelectedCombo);
    //         setCount(count+1);
    //     } else {
    //         toast.error("Can't add any more " + comboOption.type + " items!");
    //     }
    // }

    // const removeComboItem = (comboOption: ComboItem) => {
    //     const newSelectedCombo = [...(selectedCombo as ComboItem[])];
    //     const comboToEdit = newSelectedCombo?.filter((comboItem: ComboItem) => comboItem.type === comboOption.type && comboItem.title === comboOption.title);
    //     if (comboToEdit?.length) {
    //         comboToEdit[0].title = "";
    //         setSelectedCombo(newSelectedCombo);
    //         setCount(count-1);
    //     } else {
    //         toast.error("Can't remove any more!");
    //     }
    // }

    return (
        <li className="w-full h-fit flex items-stretch justify-between font-medium border bg-white rounded-lg mb-1">
            {/* <h1 className="p-1 w-3/4">{comboOption.title}</h1>
            <div className="w-1/4 bg-gray-200 flex items-center rounded-lg">
                <button onClick={() => removeComboItem(comboOption)} className="grow h-full flex items-center justify-center bg-gray-300 px-2 rounded-l-lg cursor-pointer outline-none">
                     -
                </button>
                <p className="w-8 outline-none focus:outline-none text-center bg-transparent font-semibold text-md md:text-basecursor-default">{count}</p>
                <button onClick={() => addComboItem(comboOption)} className="grow h-full flex items-center justify-center bg-gray-300 px-2 rounded-r-lg cursor-pointer outline-none">
                    +
                </button>
            </div> */}
        </li>
    );
}

export default ComboOption;
