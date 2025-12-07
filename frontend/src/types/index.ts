// ===========================================
// TypeScript Interfaces for RPG Project
// ===========================================

// ===== Combat Types =====
export interface Enemy {
    _id?: string;
    name: string;
    image: string;
    tier: number;
    level: number;
    hp: number;
    maxHP: number;
    damage: number;
    strength: number;
    defense: number;
    mana?: number;
    rewards?: EnemyRewards;
    description?: string;
}

export interface EnemyRewards {
    gold: number;
    xp: number;
    tetranutaChance: number;
}

export interface CombatLogEntry {
    turn: number;
    actor: string;
    action: string;
    damage?: number;
    targetHP?: number;
    message?: string;
}

export interface CombatSession {
    combatId: string;
    status: 'active' | 'victory' | 'defeat';
    enemy: Enemy;
    enemyHP?: number;
    playerHP: number;
    playerMaxHP: number;
    playerMana?: number;
    playerMaxMana?: number;
    turn: number;
    log: CombatLogEntry[];
    dungeonInfo?: DungeonInfo;
    nextEnemy?: boolean;
    dungeonComplete?: boolean;
}

export interface DungeonInfo {
    name: string;
    currentEnemy: number;
    totalEnemies: number;
}

export interface Dungeon {
    _id: string;
    name: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'very-hard' | 'extreme';
    requiredLevel: number;
    enemyCount: number;
    rewards: DungeonRewards;
    inProgress?: boolean;
    currentEnemy?: number;
}

export interface DungeonRewards {
    gold: number;
    xp: number;
    tetranuta: number;
    items?: string[];
}

// ===== User Types =====
export interface UserStats {
    strength: number;
    intelligence: number;
    vitality: number;
    dexterity: number;
    luck: number;
}

export interface UserCombat {
    currentHP: number;
    maxHP: number;
    currentMana: number;
    maxMana: number;
    wins: number;
    losses: number;
}

export interface InventoryItem {
    itemId: string;
    quantity: number;
    equipped: boolean;
    details?: ItemDetails;
}

export interface ItemDetails {
    _id: string;
    name: string;
    description: string;
    type: 'weapon' | 'armor' | 'accessory' | 'consumable';
    tier: number;
    price: number;
    image?: string;
    stats?: Partial<UserStats>;
}

export interface User {
    _id: string;
    username: string;
    email?: string;
    xp: number;
    level: number;
    gold: number;
    stamina: number;
    class: 'warrior' | 'mage' | 'rogue';
    avatar: string;
    stats: UserStats;
    combat: UserCombat;
    skillPoints: number;
    tetranuta: number;
    inventory: InventoryItem[];
    equipmentBonuses?: UserStats;
}

// ===== Skill Types =====
export interface Skill {
    id: string;
    name: string;
    cost: number;
    desc: string;
    dmgMult?: number;
    type?: 'physical' | 'magical' | 'heal';
}

export interface SkillUpgrade {
    _id: string;
    name: string;
    description: string;
    maxLevel: number;
    currentLevel: number;
    cost: number;
    effect: string;
}

// ===== Task Types =====
export interface Task {
    _id: string;
    name: string;
    description: string;
    xpReward: number;
    goldReward: number;
    category: 'daily' | 'weekly' | 'achievement';
    isCompleted?: boolean;
    completedAt?: string;
}

// ===== API Response Types =====
export interface ApiResponse<T> {
    success?: boolean;
    message?: string;
    data?: T;
}

export interface CombatActionResponse extends CombatSession {
    rewards?: {
        xpGained: number;
        goldGained: number;
        tetranutaDropped: boolean;
    };
    leveledUp?: boolean;
    newLevel?: number;
    goldLost?: number;
    user?: Partial<User>;
}

export interface AutoCombatResult {
    result: string;
    enemy: Enemy;
    combatLog: CombatLogEntry[];
    finalPlayerHP: number;
    finalEnemyHP: number;
    xpGained: number;
    goldGained: number;
    goldLost?: number;
    tetranutaDropped: boolean;
    leveledUp: boolean;
    newLevel?: number;
    user: Partial<User>;
}

// ===== Theme Types =====
export interface Theme {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
    border: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
}

// ===== Context Types =====
export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (emailOrUsername: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    class: string;
    avatar: string;
}

export interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
}

export interface LanguageContextType {
    language: 'en' | 'es';
    t: Record<string, string>;
    setLanguage: (lang: 'en' | 'es') => void;
}
