export interface User {
    _id: string;
    username: string;
    email: string;
    class: string;
    gender: string;
    level: number;
    xp: number;
    gold: number;
    stats: {
        strength: number;
        intelligence: number;
        agility: number;
        vitality: number;
    };
    combat: {
        maxHP: number;
        currentHP: number;
        maxMana: number;
        currentMana: number;
        attack: number;
        defense: number;
    };
    inventory: InventoryItem[];
    equipment: {
        weapon: string | null;
        armor: string | null;
        accessory: string | null;
    };
}

export interface InventoryItem {
    itemId: string;
    quantity: number;
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    completed: boolean;
    userId: string;
    createdAt: string;
}

export interface CombatSession {
    combatId: string;
    enemy: {
        name: string;
        level: number;
        hp: number;
        maxHP: number;
        attack: number;
        defense: number;
    };
    playerHP: number;
    playerMaxHP: number;
    status: 'active' | 'victory' | 'defeat';
    log: CombatLogEntry[];
    turn: number;
}

export interface CombatLogEntry {
    actor: 'Player' | 'Enemy' | 'System';
    action: string;
    damage?: number;
    message?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
