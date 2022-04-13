import { NumericLiteral } from "typescript";

// Admin User
export class UserDTO {
    email?: string;
}

// Menu Item
export enum Category {
    Single, // 0
    Combo, // 1
    Beverage // 2
}
export class MenuItemDTO {
    id!: string;
    title!: string; // always
    category!: Category; // always
    type!: string; // if category == Combo, values:"meat" or "vegetable"
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
export enum CartItemType {
    NonCombo, // 0 
    Combo, // 1
}
export class ComboItem {
    title!: string;
    type!: string // "meat" or "vegetable"
    constructor(type: string) {
        this.title = "";
        this.type = type;
    }
}
export class CartItemDTO {
    type!: CartItemType // always
    title!: string; // always
    price!: number; // always
    count!: number; // always
    content?: ComboItem[] | null; // if type == Combo, list of combo items
}