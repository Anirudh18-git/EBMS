export enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
}

export enum BillStatus {
    PAID = 'Paid',
    UNPAID = 'Unpaid',
}

export interface Payment {
    id: string;
    date: string;
    amount: number;
}

export interface User {
    id: string;
    name: string;
    address: string;
    email: string;
    meterNumber: string;
    password?: string; // Optional because we don't want to expose it everywhere
    role: UserRole;
}

export interface Bill {
    id: string;
    customerId: string;
    customerName: string; // denormalized for easier display
    meterNumber: string; // denormalized for easier display
    month: string;
    unitsConsumed: number;
    amount: number;
    status: BillStatus;
    generationDate: string;
    payments?: Payment[];
}