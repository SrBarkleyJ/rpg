import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import inventoryApi from '../api/inventoryApi';
import { useAuth } from './useAuth';

interface InventoryItem {
    _id: string;
    itemId: string;
    quantity: number;
    equipped: boolean;
    equippedSlot?: string;
    enhancementLevel: number;
    details?: any;
}

interface InventoryContextType {
    inventory: InventoryItem[];
    isInventoryLoading: boolean;
    loadInventory: () => Promise<void>;
    updateInventory: (newInventory: InventoryItem[]) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [isInventoryLoading, setIsInventoryLoading] = useState(false);
    const { user } = useAuth();

    const loadInventory = useCallback(async () => {
        if (!user) return;
        
        try {
            setIsInventoryLoading(true);
            const response = await inventoryApi.getInventory();
            setInventory(response.data.data.inventory || []);
        } catch (error) {
            console.error('Error loading inventory:', error);
            setInventory([]);
        } finally {
            setIsInventoryLoading(false);
        }
    }, [user]);

    const updateInventory = useCallback((newInventory: InventoryItem[]) => {
        setInventory(newInventory);
    }, []);

    // Load inventory when user changes
    useEffect(() => {
        if (user) {
            // Only load if inventory is empty (avoid reloading on every hot reload)
            if (inventory.length === 0) {
                loadInventory();
            }
        } else {
            setInventory([]);
        }
    }, [user, inventory.length, loadInventory]);

    const value = {
        inventory,
        isInventoryLoading,
        loadInventory,
        updateInventory
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = (): InventoryContextType => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within InventoryProvider');
    }
    return context;
};