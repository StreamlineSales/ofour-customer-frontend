import { useEffect, useState } from 'react';
import { ComboItem } from '../utils/models';

const ComboConfig: React.FC<any> = ({ comboNumber, selectedCombo, setSelectedCombo, setPopUpVisible }) => {

    const [comboType, setComboType] = useState<any>(["1 Meat 2 Vegetables", 11.99, []]);
    const [currCombo, setCurrCombo] = useState<ComboItem[]>([]);

    useEffect(() => {
        switch (comboNumber) {
            case 1:
                setComboType(["1 Meat 2 Vegetables", 11.99]);
                setCurrCombo([new ComboItem("meat"), new ComboItem("vegetable"), new ComboItem("vegetable")]);
                break;
            case 2:
                setComboType(["2 Meats 1 Vegetable", 12.99]);
                setCurrCombo([new ComboItem("meat"), new ComboItem("meat"), new ComboItem("vegetable")]);
                break;
            case 3:
                setComboType(["2 Meat 2 Vegetables", 13.99]);
                setCurrCombo([new ComboItem("meat"), new ComboItem("meat"), new ComboItem("vegetable"), new ComboItem("vegetable")]);
                break;
            case 4:
                setComboType(["3 Meats", 13.99]);
                setCurrCombo([new ComboItem("meat"), new ComboItem("meat"), new ComboItem("meat")]);
        }
    }, [selectedCombo]);

    const isSameCombo = (combo1: ComboItem[], combo2: ComboItem[]) => {
        let equalMeatCount = combo1?.filter((c: ComboItem) => c.type === "meat").length === combo2.filter((c: ComboItem) => c.type === "meat").length;
        let equalVegetableCount = combo1?.filter((c: ComboItem) => c.type === "vegetable").length === combo2.filter((c: ComboItem) => c.type === "vegetable").length;
        return equalMeatCount && equalVegetableCount;
    }

    const selectCombo = () => {
        if (isSameCombo(selectedCombo, currCombo)) {
            setSelectedCombo(null);
        } else {
            setSelectedCombo(currCombo);
            window.scrollTo(0, 0);
            setPopUpVisible(true);
        }
    }

    return (
        <div className={"mt-1 w-full border-b rounded-lg transition ease-in " + (isSameCombo(selectedCombo, currCombo) ? 'bg-red-500 text-white' : '')} onClick={selectCombo}>
            <div className="flex items-center p-4">
                <div className="w-2/3 flex flex-col items-start justify-start pr-2">
                    <h1 className="text-xl font-medium">{comboType[0]}</h1>
                    <p className="font-normal my-1">{comboType[1]} CAD</p>
                </div>
                <div className="ml-auto flex flex-wrap">
                    {currCombo.filter((comboItem: ComboItem) => comboItem.type === "meat").map((c: ComboItem, idx: number) => <i key={idx} className="fa-solid fa-xl fa-drumstick-bite text-red-500"></i>)}
                    {currCombo.filter((comboItem: ComboItem) => comboItem.type === "vegetable").map((c: ComboItem, idx: number) => <i key={idx} className="fa-solid fa-xl fa-leaf text-green-500"></i>)}
                </div>
            </div>
        </div>
    );
}

export default ComboConfig;
