import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, doc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import SingleMenuItem from '../components/SingleMenuItem';
import { CartItemDTO, Category, MenuItemDTO } from '../utils/models';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const Home = () => {

    // General References
    const { cartItems, _ } = useContext(CartContext);
    const [activeTab, setActiveTab] = useState<Category>(Category.SpecialityWrap);
    const [menuItems, setMenuItems] = useState<any>([]);
    const elementsRef = useRef(Array.from(Array(8).keys()).map(() => createRef()));
    const navItemsRef = useRef(Array.from(Array(8).keys()).map(() => createRef()));

    useEffect(() => {
        getAllMenuItems();
    }, []);


    const getAllMenuItems: any = () => {
        getDocs(query(collection(db, "menu-items-stripe"), where("visibility", "==", true))).then((res: any) => {
            let allItems: any[] = [];
            res.forEach((doc: any) => {
                allItems.push({ ...doc.data(), id: doc.id });
            });

            let newMenuItems: any = {};
            allItems.forEach((menuItem: MenuItemDTO) => {
                if (menuItem.category in newMenuItems) {
                    newMenuItems[menuItem.category].push(menuItem);
                } else {
                    newMenuItems[menuItem.category] = [menuItem];
                } 
            })
            setMenuItems(newMenuItems);
            observeSectionViewChangeOnScroll();
        });
    }

    const observeSectionViewChangeOnScroll = () => {
        const oberserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if ((entry.boundingClientRect.top > window.innerHeight / 2)) return;
            const intersectedSection: any = entry.target.classList[0];
            setActiveTab(parseInt(intersectedSection));
            (navItemsRef.current[parseInt(intersectedSection)] as any).current?.scrollIntoView({ block: "start", inline: "center", behavior: "auto"});
        }, { rootMargin: "-170px 0px 0px 0px", threshold: [0, 1] });
        elementsRef.current.forEach((section: any) => {
            oberserver.observe(section.current as HTMLHeadingElement);
        });
    }

    const scrollToSection = (category: Category) => {
        if (category == Category.SpecialityWrap) {
            window.scrollTo({ top: -70, behavior: 'smooth' });
            return;
        }
        let y = ((elementsRef.current[category] as any).current?.getBoundingClientRect().top as number) - 155;
        window.scrollBy({ top: y, behavior: 'smooth' });
    }

    const getCategoryName = (category: Category) => {
        if (category == 0) return "Speciality Wrap (16'')";
        else if (category == 1) return "Manouche (12'')";
        else if (category == 2) return "Les Oeufs";
        else if (category == 3) return "Our Special Sub";
        else if (category == 4) return "Side";
        else if (category == 5) return "Cold Dishes";
        else if (category == 6) return "Desserts";
        else if (category == 7) return "Beverages";
    }

    return (
        <div className="App overflow-hidden">
            <div className='w-full fixed top-0 z-10'>
                {/* Hero Area */}
                <div className='hero-area relative flex justify-center items-center' />

                {/* Navigation Bar*/}

                <div className="navigation-wrapper overflow-x-scroll whitespace-nowrap w-full mb-1 flex flex-row items-center justify-between bg-gray-100">
                    {Array.from(Array(8).keys()).map((category: Category) => (
                        <button ref={navItemsRef.current[category] as any} key={category} onClick={() => scrollToSection(category)} className={"w-fit-content max-w-xs mr-3 text-center block border py-2 px-4 " + (category == 0 ? "rounded-r " : category == 7 ? "rounded-l " : "rounded ") + (activeTab === category ? "bg-red-500 border-red-500 text-white" : "bg-gray-100 border-none")}>
                            {getCategoryName(category)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="w-11/12 pb-24 mt-40">
                {Object.entries(menuItems).map(([category, categoryItems]: [any, any]) => (
                    <div key={category}>
                        <h1 ref={elementsRef.current[category] as any} className={`${category} text-3xl font-bold mt-5`}>{getCategoryName(category)}</h1>
                        {
                            categoryItems.map((item: MenuItemDTO) => (
                                <SingleMenuItem key={item.id} {...item} />
                            ))
                        }
                    </div>
                ))}
            </div>

            {/* View Cart Button */}
            <div className="bg-transparent fixed flex items-center bottom-[4%]">
                <Link to='/cart' className="shadow-xl flex justify-between items-center w-80 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-4 rounded-full">
                    <i className="fa-solid fa-lg fa-cart-shopping"></i>
                    <h1 className='text-lg font-extrabold'>View Cart</h1>
                    <h1 className='text-lg font-extrabold'>{cartItems.reduce((a: number, b: CartItemDTO) => a + b.quantity, 0)}</h1>
                </Link>
            </div>

        </div>
    );
}

export default Home;