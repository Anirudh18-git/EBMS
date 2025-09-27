
import { User, Bill, UserRole } from '../types';
import { LOCAL_STORAGE_USERS_KEY, LOCAL_STORAGE_BILLS_KEY, LOCAL_STORAGE_AUTH_KEY } from '../constants';

// --- User Management ---

const getInitialUsers = (): User[] => {
    const adminUser: User = {
        id: 'admin_001',
        name: 'Admin',
        address: '123 Power Grid St.',
        email: 'admin@system.com',
        meterNumber: 'N/A',
        password: 'admin',
        role: UserRole.ADMIN,
    };
    return [adminUser];
};

export const getUsers = (): User[] => {
    try {
        const usersJson = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
        if (!usersJson) {
            const initialUsers = getInitialUsers();
            localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(initialUsers));
            return initialUsers;
        }
        return JSON.parse(usersJson) as User[];
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        return getInitialUsers();
    }
};

export const saveUsers = (users: User[]): void => {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
};

export const addUser = (user: User): User[] => {
    const users = getUsers();
    const updatedUsers = [...users, user];
    saveUsers(updatedUsers);
    return updatedUsers;
};


// --- Bill Management ---

export const getBills = (): Bill[] => {
    try {
        const billsJson = localStorage.getItem(LOCAL_STORAGE_BILLS_KEY);
        return billsJson ? JSON.parse(billsJson) : [];
    } catch (error) {
        console.error("Failed to parse bills from localStorage", error);
        return [];
    }
};

export const saveBills = (bills: Bill[]): void => {
    localStorage.setItem(LOCAL_STORAGE_BILLS_KEY, JSON.stringify(bills));
};

export const addBill = (bill: Bill): void => {
    const bills = getBills();
    saveBills([...bills, bill]);
};

// --- Auth Management ---

export const getAuthenticatedUser = (): User | null => {
    try {
        const authJson = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
        return authJson ? JSON.parse(authJson) as User : null;
    } catch (error) {
        console.error("Failed to parse authenticated user from localStorage", error);
        return null;
    }
};

export const saveAuthenticatedUser = (user: User | null): void => {
    if (user) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }
};
