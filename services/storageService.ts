
import { User, Bill, UserRole } from '../types';
import { LOCAL_STORAGE_AUTH_KEY } from '../constants';
import { apiRequest } from './apiService';

// --- User Management ---

export const getUsers = async (): Promise<User[]> => {
    try {
        const data = await apiRequest('/users');
        return data.map((u: any) => ({ ...u, id: u._id })); // Map _id to id
    } catch (error) {
        console.error("Failed to fetch users", error);
        return [];
    }
};

export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
    try {
        const data = await apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify(user),
        });
        return { ...data, id: data._id };
    } catch (error) {
        console.error("Failed to add user", error);
        throw error;
    }
};

// --- Bill Management ---

export const getBills = async (): Promise<Bill[]> => {
    try {
        const data = await apiRequest('/bills');
        return data.map((b: any) => ({ ...b, id: b._id, customerId: b.customerId._id || b.customerId })); // Map _id
    } catch (error) {
        console.error("Failed to fetch bills", error);
        return [];
    }
};

export const addBill = async (bill: Omit<Bill, 'id'>): Promise<Bill> => {
    try {
        const data = await apiRequest('/bills', {
            method: 'POST',
            body: JSON.stringify(bill),
        });
        return { ...data, id: data._id };
    } catch (error) {
        console.error("Failed to add bill", error);
        throw error;
    }
};

export const updateBill = async (id: string, updates: Partial<Bill>): Promise<Bill> => {
    try {
        const data = await apiRequest(`/bills/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        return { ...data, id: data._id };
    } catch (error) {
        console.error("Failed to update bill", error);
        throw error;
    }
};

// --- Auth Management ---

export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', data.token);
    const user = { ...data.user, id: data.user.id };
    saveAuthenticatedUser(user);
    return { token: data.token, user };
};

export const register = async (user: Omit<User, 'id'>): Promise<{ token: string; user: User }> => {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(user),
    });
    localStorage.setItem('token', data.token);
    const newUser = { ...data.user, id: data.user.id };
    saveAuthenticatedUser(newUser);
    return { token: data.token, user: newUser };
};

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
        localStorage.removeItem('token');
    }
};
