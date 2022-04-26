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
    id?: string;
    name!: string; // always
    category!: Category; // always
    price!: number; // if category != Combo
    description!: string; // always
    image?: string | null; // if category != Combo
    visibility?: boolean; // always
    active!: boolean;
    createdAt!: any;
    stripeProductId!: string;
    stripePriceId!: string;
}

// Order
export class OrderDTO {
    id!: string;
    name!: string;
    email!: string;
    lineItems!: any[];
    dateCreated!: any;
    dateCompleted?: any | null;
    totalPrice!: number;
    orderNumber!: number;
}

// Cart Item
export class CartItemDTO {
    name!: string;
    unitAmount!: number;
    quantity!: number;
    stripePriceId!: string;
}