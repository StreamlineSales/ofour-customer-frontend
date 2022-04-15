// Admin User
export class UserDTO {
    email?: string;
}

// Menu Item
export enum Category {
    SpecialityWrap, // 0
    Manouche, // 1
    Eggs, // 2
    SpecialSub, // 3
    Side, // 4
    ColdDishes, // 5
    Desserts, // 6
    Beverages // 7
}

export class MenuItemDTO {
    id!: string;
    title!: string; // always
    category!: Category; // always
    price!: number; // if category != Combo
    description!: string; // always
    image!: string | null; // if category != Combo
    visibility?: boolean; // always
}

// Order
export class OrderDTO {
    name!: string;
    email!: string;
    phoneNumber!: string;
    instructions?: string;
    cartItems!: CartItemDTO[];
    dateCreated!: Date;
    dateCompleted?: Date | null;
    totalPrice!: number;
    orderNumber!: number;
}

// Cart Item
export class CartItemDTO {
    title!: string; // always
    price!: number; // always
    count!: number; // always
}