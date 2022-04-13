import { useContext, useEffect, useRef, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, doc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import SingleMenuItem from '../components/SingleMenuItem';
import { CartItemDTO, Category, ComboItem, MenuItemDTO } from '../utils/models';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import ComboForm from '../components/ComboForm';

const Home = () => {

    // General References
    const { cartItems, _ } = useContext(CartContext);
    const [activeTab, setActiveTab] = useState<Category>(Category.Combo);
    const [singleMenuItems, setSingleMenuItems] = useState<MenuItemDTO[]>([]);
    const [beverageMenuItems, setBeverageMenuItems] = useState<MenuItemDTO[]>([]);
    const singleSection = useRef<null | HTMLHeadingElement>(null);
    const beverageSection = useRef<null | HTMLHeadingElement>(null);
    const [popUpVisible, setPopUpVisible] = useState(false);

    // Combo References
    const [meatComboItems, setMeatComboItems] = useState<MenuItemDTO[]>([]);
    const [vegetableComboItems, setVegetableComboItems] = useState<MenuItemDTO[]>([]);
    const [selectedCombo, setSelectedCombo] = useState<ComboItem[] | null>(null);

    useEffect(() => {
        getAllMenuItems();
        observeSectionViewChangeOnScroll();
    }, []);


    const getAllMenuItems: any = () => {
        getDocs(query(collection(db, "menu-items-" + process.env.NODE_ENV), where("visibility", "==", true))).then((res: any) => {
            let allItems: any[] = [];
            res.forEach((doc: any) => {
                allItems.push({ ...doc.data(), id: doc.id });
            });
            setMeatComboItems(allItems.filter((item: MenuItemDTO) => item.category === Category.Combo && item.type === "meat"));
            setVegetableComboItems(allItems.filter((item: MenuItemDTO) => item.category === Category.Combo && item.type === "vegetable"));

            // Test References
            setSingleMenuItems(allItems.filter((item: MenuItemDTO) => item.category === Category.Single));
            setBeverageMenuItems(allItems.filter((item: MenuItemDTO) => item.category === Category.Beverage));
        });
    }

    const observeSectionViewChangeOnScroll = () => {
        const oberserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if ((entry.boundingClientRect.top > window.innerHeight / 2)) return;
            const intersectedSection: any = entry.target.classList[0];
            if (intersectedSection === "comboSection") setActiveTab(Category.Combo);
            else if (intersectedSection === "singleSection") setActiveTab(entry.isIntersecting ? Category.Combo : Category.Single);
            else if (intersectedSection === "beverageSection") setActiveTab(entry.isIntersecting ? Category.Single : Category.Beverage);
        }, { rootMargin: "-200px 10px 0px 10px" });
        oberserver.observe(singleSection.current as HTMLHeadingElement);
        oberserver.observe(beverageSection.current as HTMLHeadingElement);
    }

    const scrollToSection = (tab: Category) => {
        let y;
        switch (tab) {
            case Category.Combo:
                window.scrollTo({ top: -70, behavior: 'smooth' });
                break;
            case Category.Single:
                y = (singleSection.current?.getBoundingClientRect().top as number) - 160;
                window.scrollBy({ top: y, behavior: 'smooth' });
                break;
            case Category.Beverage:
                y = (beverageSection.current?.getBoundingClientRect().top as number) - 160;
                window.scrollBy({ top: y, behavior: 'smooth' });
                break;
        }
    }

    const closePopUp = () => {
        setPopUpVisible(false);
        setSelectedCombo(null);
    }

    return (
        <div className={`App ${popUpVisible ? 'overflow-hidden' : ''}`}>
            <div className='w-full fixed top-0 z-10'>
                {/* Hero Area */}
                <div className='hero-area relative flex justify-center items-center'/>

                {/* Navigation Bar*/}
                <div className="w-full mb-1 flex flex-row items-center justify-between bg-gray-100">
                    <ul className="w-full grid grid-cols-3">
                        <button onClick={() => scrollToSection(Category.Combo)} className={"w-full mr-3 text-center block border rounded-r py-2 px-4 " + (activeTab === Category.Combo ? "bg-red-500 border-red-500 text-white" : "bg-gray-100 border-none")}>
                            Speciality Wraps
                        </button>
                        <button onClick={() => scrollToSection(Category.Single)} className={"w-full mr-3 text-center block border rounded py-2 px-4 " + (activeTab === Category.Single ? "bg-red-500 border-red-500 text-white" : "bg-gray-100 border-none")}>
                            Manouche
                        </button>
                        <button onClick={() => scrollToSection(Category.Beverage)} className={"w-full mr-3 text-center block border rounded-l py-2 px-4 " + (activeTab === Category.Beverage ? "bg-red-500 border-red-500 text-white" : "bg-gray-100 border-none")}>
                            Beverages
                        </button>
                    </ul>
                </div>
            </div>

            {/* Body */}
            <div className="w-11/12 pb-24 mt-40">

                <h1 ref={singleSection} className='singleSection text-3xl font-bold mt-5'>Singles</h1>
                {singleMenuItems.map((item: MenuItemDTO) => (
                    <SingleMenuItem key={item.id} {...item} />
                ))}

                <h1 ref={beverageSection} className='beverageSection text-3xl font-bold mt-5'>Beverages</h1>
                {beverageMenuItems.map((item: MenuItemDTO) => (
                    <SingleMenuItem key={item.id} {...item} />
                ))}
                {beverageMenuItems.map((item: MenuItemDTO) => (
                    <SingleMenuItem key={item.id} {...item} />
                ))}

            </div>

            {/* View Cart Button */}
            <div className="bg-transparent fixed flex items-center bottom-[4%]">
                <Link to='/checkout' className="shadow-xl flex justify-between items-center w-80 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-4 rounded-full">
                    <i className="fa-solid fa-lg fa-cart-shopping"></i>
                    <h1 className='text-lg font-extrabold'>View Cart</h1>
                    <h1 className='text-lg font-extrabold'>{cartItems.reduce((a: number, b: CartItemDTO) => a + b.count, 0)}</h1>
                </Link>
            </div>
            
            {/* Pop up View */}
            <div onClick={closePopUp} className={`fixed z-30 inset-0 bg-gray-900 opacity-60 ${popUpVisible ? '' : 'hidden'}`} />
            <div className={`overflow-scroll px-3 fixed z-40 bottom-0 w-full rounded-t-lg bg-white ${popUpVisible ? 'slide-up' : 'slide-down'}`}>
                <ComboForm meatComboItems={meatComboItems} vegetableComboItems={vegetableComboItems} selectedCombo={selectedCombo} setSelectedCombo={setSelectedCombo} setPopUpVisible={setPopUpVisible} />
            </div>

        </div>
    );
}


export default Home;