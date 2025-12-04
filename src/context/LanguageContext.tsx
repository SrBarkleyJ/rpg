import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext<any>({});

export const translations = {
    en: {
        // Common
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',

        // Navigation
        navTasks: 'Tasks',
        navShop: 'Shop',
        navCombat: 'Combat',
        navProfile: 'Profile',

        // Profile
        profileTitle: 'HERO PROFILE',
        level: 'Level',
        xp: 'XP',
        gold: 'Gold',
        skillPoints: 'Skill Points',
        language: 'Language',
        theme: 'Dark Theme',
        logout: 'LOGOUT',
        class: 'Class',
        warrior: 'Warrior',
        mage: 'Mage',
        rogue: 'Rogue',

        // Tasks
        tasksTitle: 'QUEST BOARD',
        daily: 'DAILY',
        weekly: 'WEEKLY',
        once: 'ONCE',
        complete: 'COMPLETE',
        completed: 'COMPLETED',
        reward: 'Reward',
        difficulty: 'Difficulty',

        // Shop
        shopTitle: 'ITEM SHOP',
        buy: 'BUY',
        notEnoughGold: 'Not enough gold!',
        buySuccess: 'You bought',

        // Combat
        combatTitle: 'ARENA',
        startCombat: 'FIGHT!',
        rest: 'REST',
        inventory: 'INVENTORY',
        playerTurn: 'Your Turn',
        enemyTurn: 'Enemy Turn',
        victory: 'VICTORY!',
        defeat: 'DEFEAT...',
        attack: 'Attack',
        crit: 'Critical Hit!',
        restCooldown: 'Cannot rest yet. Wait',
        use: 'USE',
        emptyInventory: 'Inventory is empty',
        hp: 'HP',
        selectCombatMode: 'Select Combat Mode',
        automatic: 'AUTOMATIC',
        manual: 'MANUAL',
        fastCombat: 'Fast combat with instant results',
        turnBasedCombat: 'Turn-based combat with full control',
        yourHP: 'YOUR HP',
        autoCombat: 'AUTO COMBAT',
        manualCombat: 'MANUAL COMBAT',
        pressToStart: 'Press FIGHT to start automatic combat!',
        pressToBegin: 'Press START COMBAT to begin!',
        yourTurn: 'YOUR TURN',
        enemyTurnLabel: 'ENEMY TURN',
        startCombatButton: 'START COMBAT',
        backToMenu: 'Back to Menu',
        defend: 'DEFEND',
        useItem: 'USE ITEM',
        defending: 'DEFENDING',
        fight: 'FIGHT!',
        skills: 'SKILLS',
        dungeon: 'DUNGEON',
        enterDungeon: 'ENTER DUNGEON',
        continueDungeon: 'CONTINUE DUNGEON',
        dungeonProgress: 'Progress',
        dungeonComplete: 'Dungeon Complete!',
        nextEnemy: 'Next Enemy',
        enemy: 'Enemy',
        notEnoughMana: 'Not enough Mana!',
        mana: 'Mana',

        // Auth
        welcome: 'WELCOME HERO',
        loginSubtitle: 'Login to continue your adventure',
        emailPlaceholder: 'Email or Username',
        passwordPlaceholder: 'Password',
        loginButton: 'LOGIN',
        createAccount: 'CREATE ACCOUNT',
        joinAdventure: 'JOIN THE ADVENTURE',
        usernamePlaceholder: 'Username',
        next: 'NEXT',
        back: 'BACK',
        selectChar: 'SELECT YOUR CHARACTER',
        gender: 'GENDER',
        male: 'Male',
        female: 'Female',
        createChar: 'CREATE CHARACTER',
        loginLink: 'Login',

        // Class Descriptions
        warriorDesc: 'Master of melee combat',
        mageDesc: 'Wielder of arcane magic',
        rogueDesc: 'Swift and deadly assassin',

        // Home Screen
        homeTitle: 'CHARACTER SHEET',
        classLabel: 'Class',
        novice: 'Novice',
        stamina: 'Stamina',
        questSummary: 'QUEST SUMMARY',
        completedQuests: 'Completed',

        // Stats Screen
        statsTitle: 'CHARACTER STATS',
        skillPointsAvailable: 'SKILL POINTS AVAILABLE',
        skillPointsHint: 'Complete 5 weekly tasks or reach level multiples of 5 to earn points',
        attributes: 'ATTRIBUTES',
        strength: 'STR',
        intelligence: 'INT',
        vitality: 'VIT',
        dexterity: 'DEX',
        luckStat: 'LUCK',
        physicalDamage: 'Physical Damage',
        magicalDamage: 'Magical Damage',
        maxHP: 'Max HP',
        criticalChance: 'Critical Chance',
        lootAndCrits: 'Loot & Crits',
        calculatedStats: 'CALCULATED STATS',

        // Rewards Screen
        marketplace: 'MARKETPLACE',
        noItemsInStock: 'No items in stock.',
        purchaseSuccess: 'Purchased! Remaining Gold:',
        purchaseFailed: 'Failed to buy reward',

        // Inventory
        inventoryTitle: 'INVENTORY',
        equip: 'EQUIP',
        unequip: 'UNEQUIP',
        equipped: 'EQUIPPED',
        allItems: 'All Items',
        consumables: 'Consumables',
        weapons: 'Weapons',
        armors: 'Armor',
        accessories: 'Accessories',
        equippedGear: 'EQUIPPED GEAR',
        manageInventory: 'MANAGE INVENTORY',
        noItemEquipped: 'None',
        itemEquipped: 'Item equipped successfully',
        itemUnequipped: 'Item unequipped successfully',
        failedToLoadInventory: 'Failed to load inventory',
        failedToEquip: 'Failed to equip item',
        failedToUnequip: 'Failed to unequip item',
        weapon: 'Weapon',
        armorSlot: 'Armor',
        accessory: 'Accessory',

        // Skills
        skillsTitle: 'SKILLS',
        upgrade: 'UPGRADE',

        // Warrior Skills
        'Heroic Strike': 'Heroic Strike',
        'Heroic Strike_desc': 'A powerful strike dealing increased damage',
        'Shield Wall': 'Shield Wall',
        'Shield Wall_desc': 'Reduce incoming damage',
        'Battle Cry': 'Battle Cry',
        'Battle Cry_desc': 'Increase damage dealt temporarily',
        'Execute': 'Execute',
        'Execute_desc': 'Massive damage to low HP enemies',

        // Mage Skills
        'Fireball': 'Fireball',
        'Fireball_desc': 'Magical damage with defense penetration',
        'Frost Nova': 'Frost Nova',
        'Frost Nova_desc': 'Chance to freeze enemy',
        'Arcane Shield': 'Arcane Shield',
        'Arcane Shield_desc': 'Absorb damage',
        'Mana Surge': 'Mana Surge',
        'Mana Surge_desc': 'Reset cooldowns',

        // Rogue Skills
        'Backstab': 'Backstab',
        'Backstab_desc': 'Guaranteed critical hit',
        'Smoke Bomb': 'Smoke Bomb',
        'Smoke Bomb_desc': 'Evade next attack',
        'Poison Blade': 'Poison Blade',
        'Poison Blade_desc': 'Damage over time',
        'Shadow Strike': 'Shadow Strike',
        'Shadow Strike_desc': 'Attack with chain potential',

        // Combat Skills (New)
        'Bash': 'Bash',
        'Bash_desc': 'Heavy strike (1.5x Dmg)',
        'Berserk': 'Berserk',
        'Berserk_desc': 'Buff STR (3 turns)',
        'Execute_skill': 'Execute',
        'Execute_skill_desc': '2.5x Dmg if enemy < 30% HP',
        'Iron Skin': 'Iron Skin',
        'Iron Skin_desc': 'Reduce dmg 50% (2 turns)',
        'Fireball_skill': 'Fireball',
        'Fireball_skill_desc': 'Fire dmg (1.5x)',
        'Ice Shard': 'Ice Shard',
        'Ice Shard_desc': 'Ice dmg (1.2x)',
        'Thunder Strike': 'Thunder Strike',
        'Thunder Strike_desc': 'High dmg (2.0x)',
        'Heal': 'Heal',
        'Heal_desc': 'Restore HP',
        'Double Stab': 'Double Stab',
        'Double Stab_desc': '2 hits (0.8x each)',
        'Poison Tip': 'Poison Tip',
        'Poison Tip_desc': 'Apply Poison',
        'Evasion': 'Evasion',
        'Evasion_desc': 'Dodge next attack',
        'Assassinate': 'Assassinate',
        'Assassinate_desc': 'High Crit chance',

        // Forge
        forgeTitle: 'BLACKSMITH',
        forgeDesc: 'Upgrade your weapons using Tetranuta',
        forgeButton: 'FORGE',
        cost: 'Cost',
        current: 'Current',
        failedToPerformAction: 'Failed to perform action',
        failedToRest: 'Failed to rest',
        failedToPurchase: 'Failed to purchase item',
        failedToComplete: 'Failed to complete task',
        failedToAssign: 'Failed to assign point'
    },
    es: {
        // Common
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        confirm: 'Confirmar',

        // Navigation
        navTasks: 'Misiones',
        navShop: 'Tienda',
        navCombat: 'Combate',
        navProfile: 'Perfil',

        // Profile
        profileTitle: 'PERFIL DE HÉROE',
        level: 'Nivel',
        xp: 'XP',
        gold: 'Oro',
        skillPoints: 'Puntos de Habilidad',
        language: 'Idioma',
        theme: 'Tema Oscuro',
        logout: 'CERRAR SESIÓN',
        class: 'Clase',
        warrior: 'Guerrero',
        mage: 'Mago',
        rogue: 'Pícaro',

        // Tasks
        tasksTitle: 'TABLÓN DE MISIONES',
        daily: 'DIARIA',
        weekly: 'SEMANAL',
        once: 'ÚNICA',
        complete: 'COMPLETAR',
        completed: 'COMPLETADA',
        reward: 'Recompensa',
        difficulty: 'Dificultad',

        // Shop
        shopTitle: 'TIENDA DE OBJETOS',
        buy: 'COMPRAR',
        notEnoughGold: '¡No tienes suficiente oro!',
        buySuccess: 'Has comprado',

        // Combat
        combatTitle: 'ARENA',
        startCombat: '¡LUCHAR!',
        rest: 'DESCANSAR',
        inventory: 'INVENTARIO',
        playerTurn: 'Tu Turno',
        enemyTurn: 'Turno Enemigo',
        victory: '¡VICTORIA!',
        defeat: 'DERROTA...',
        attack: 'Ataque',
        crit: '¡Golpe Crítico!',
        restCooldown: 'No puedes descansar aún. Espera',
        use: 'USAR',
        emptyInventory: 'Inventario vacío',
        hp: 'PV',
        selectCombatMode: 'Selecciona Modo de Combate',
        automatic: 'AUTOMÁTICO',
        manual: 'MANUAL',
        fastCombat: 'Combate rápido con resultados instantáneos',
        turnBasedCombat: 'Combate por turnos con control total',
        yourHP: 'TUS PV',
        autoCombat: 'COMBATE AUTOMÁTICO',
        manualCombat: 'COMBATE MANUAL',
        pressToStart: '¡Presiona LUCHAR para iniciar combate automático!',
        pressToBegin: '¡Presiona INICIAR COMBATE para comenzar!',
        yourTurn: 'TU TURNO',
        enemyTurnLabel: 'TURNO ENEMIGO',
        startCombatButton: 'INICIAR COMBATE',
        backToMenu: 'Volver al Menú',
        defend: 'DEFENDER',
        useItem: 'USAR OBJETO',
        defending: 'DEFENDIENDO',
        fight: '¡LUCHAR!',
        skills: 'HABILIDADES',
        dungeon: 'MAZMORRA',
        enterDungeon: 'ENTRAR A MAZMORRA',
        continueDungeon: 'CONTINUAR MAZMORRA',
        dungeonProgress: 'Progreso',
        dungeonComplete: '¡Mazmorra Completada!',
        nextEnemy: 'Siguiente Enemigo',
        enemy: 'Enemigo',
        notEnoughMana: '¡No tienes suficiente Maná!',
        mana: 'Maná',

        // Auth
        welcome: 'BIENVENIDO HÉROE',
        loginSubtitle: 'Inicia sesión para continuar tu aventura',
        emailPlaceholder: 'Email o Usuario',
        passwordPlaceholder: 'Contraseña',
        loginButton: 'INICIAR SESIÓN',
        createAccount: 'CREAR CUENTA',
        joinAdventure: 'ÚNETE A LA AVENTURA',
        usernamePlaceholder: 'Usuario',
        next: 'SIGUIENTE',
        back: 'REGRESAR',
        selectChar: 'SELECCIONA TU PERSONAJE',
        gender: 'GÉNERO',
        male: 'Masculino',
        female: 'Femenino',
        createChar: 'CREAR PERSONAJE',
        loginLink: 'Iniciar Sesión',

        // Class Descriptions
        warriorDesc: 'Maestro del combate cuerpo a cuerpo',
        mageDesc: 'Portador de magia arcana',
        rogueDesc: 'Asesino veloz y letal',

        // Home Screen
        homeTitle: 'HOJA DE PERSONAJE',
        classLabel: 'Clase',
        novice: 'Novato',
        stamina: 'Energía',
        questSummary: 'RESUMEN DE MISIONES',
        completedQuests: 'Completadas',

        // Stats Screen
        statsTitle: 'ESTADÍSTICAS DEL PERSONAJE',
        skillPointsAvailable: 'PUNTOS DE HABILIDAD DISPONIBLES',
        skillPointsHint: 'Completa 5 misiones semanales o alcanza niveles múltiplos de 5 para ganar puntos',
        attributes: 'ATRIBUTOS',
        strength: 'FUE',
        intelligence: 'INT',
        vitality: 'VIT',
        dexterity: 'DES',
        luckStat: 'SUERTE',
        physicalDamage: 'Daño Físico',
        magicalDamage: 'Daño Mágico',
        maxHP: 'PV Máximos',
        criticalChance: 'Probabilidad de Crítico',
        lootAndCrits: 'Botín y Críticos',
        calculatedStats: 'ESTADÍSTICAS CALCULADAS',

        // Rewards Screen
        marketplace: 'MERCADO',
        noItemsInStock: 'No hay artículos en stock.',
        purchaseSuccess: '¡Comprado! Oro restante:',
        purchaseFailed: 'Error al comprar recompensa',

        // Inventory
        inventoryTitle: 'INVENTARIO',
        equip: 'EQUIPAR',
        unequip: 'DESEQUIPAR',
        equipped: 'EQUIPADO',
        allItems: 'Todos los Objetos',
        consumables: 'Consumibles',
        weapons: 'Armas',
        armors: 'Armaduras',
        accessories: 'Accesorios',
        equippedGear: 'EQUIPO EQUIPADO',
        manageInventory: 'GESTIONAR INVENTARIO',
        noItemEquipped: 'Ninguno',
        itemEquipped: 'Objeto equipado exitosamente',
        itemUnequipped: 'Objeto desequipado exitosamente',
        failedToLoadInventory: 'Error al cargar inventario',
        failedToEquip: 'Error al equipar objeto',
        failedToUnequip: 'Error al desequipar objeto',
        weapon: 'Arma',
        armorSlot: 'Armadura',
        accessory: 'Accesorio',

        // Skills
        skillsTitle: 'HABILIDADES',
        upgrade: 'MEJORAR',

        // Warrior Skills
        'Heroic Strike': 'Golpe Heroico',
        'Heroic Strike_desc': 'Un golpe poderoso que inflige daño aumentado',
        'Shield Wall': 'Muro de Escudos',
        'Shield Wall_desc': 'Reduce el daño recibido',
        'Battle Cry': 'Grito de Batalla',
        'Battle Cry_desc': 'Aumenta el daño infligido temporalmente',
        'Execute': 'Ejecutar',
        'Execute_desc': 'Daño masivo a enemigos con poca vida',

        // Mage Skills
        'Fireball': 'Bola de Fuego',
        'Fireball_desc': 'Daño mágico con penetración de defensa',
        'Frost Nova': 'Nova de Escarcha',
        'Frost Nova_desc': 'Probabilidad de congelar al enemigo',
        'Arcane Shield': 'Escudo Arcano',
        'Arcane Shield_desc': 'Absorbe daño',
        'Mana Surge': 'Oleada de Maná',
        'Mana Surge_desc': 'Resetea los tiempos de reutilización',

        // Rogue Skills
        'Backstab': 'Puñalada Trasera',
        'Backstab_desc': 'Golpe crítico garantizado',
        'Smoke Bomb': 'Bomba de Humo',
        'Smoke Bomb_desc': 'Evade el próximo ataque',
        'Poison Blade': 'Hoja Envenenada',
        'Poison Blade_desc': 'Daño con el tiempo',
        'Shadow Strike': 'Golpe en las Sombras',
        'Shadow Strike_desc': 'Ataque con potencial de cadena',

        // Combat Skills (New)
        'Bash': 'Golpe Pesado',
        'Bash_desc': 'Golpe pesado (1.5x Daño)',
        'Berserk': 'Furia',
        'Berserk_desc': 'Aumenta FUE (3 turnos)',
        'Execute_skill': 'Ejecutar',
        'Execute_skill_desc': '2.5x Daño si enemigo < 30% PV',
        'Iron Skin': 'Piel de Hierro',
        'Iron Skin_desc': 'Reduce daño 50% (2 turnos)',
        'Fireball_skill': 'Bola de Fuego',
        'Fireball_skill_desc': 'Daño de fuego (1.5x)',
        'Ice Shard': 'Fragmento de Hielo',
        'Ice Shard_desc': 'Daño de hielo (1.2x)',
        'Thunder Strike': 'Golpe de Trueno',
        'Thunder Strike_desc': 'Alto daño (2.0x)',
        'Heal': 'Curar',
        'Heal_desc': 'Restaura PV',
        'Double Stab': 'Doble Puñalada',
        'Double Stab_desc': '2 golpes (0.8x cada uno)',
        'Poison Tip': 'Punta Venenosa',
        'Poison Tip_desc': 'Aplica Veneno',
        'Evasion': 'Evasión',
        'Evasion_desc': 'Esquiva el próximo ataque',
        'Assassinate': 'Asesinar',
        'Assassinate_desc': 'Alta probabilidad de crítico',

        // Forge
        forgeTitle: 'HERRERÍA',
        forgeDesc: 'Mejora tus armas usando Tetranuta',
        forgeButton: 'FORJAR',
        cost: 'Costo',
        current: 'Actual',
        noForgeable: 'No hay objetos para forjar',
        tetranutaOwned: 'Tetranuta Poseída',
        forgeSuccess: '¡Objeto forjado con éxito!',

        // Error Messages
        noTasksAvailable: 'No hay misiones disponibles',
        failedToLoadShop: 'Error al cargar artículos de la tienda',
        failedToLoadProfile: 'Error al cargar perfil',
        failedToLoadTasks: 'Error al cargar misiones',
        failedToLoadStats: 'Error al cargar estadísticas',
        failedToLoadRewards: 'Error al cargar recompensas',
        failedToStartCombat: 'Error al iniciar combate',
        failedToPerformAction: 'Error al realizar acción',
        failedToRest: 'Error al descansar',
        failedToPurchase: 'Error al comprar artículo',
        failedToComplete: 'Error al completar misión',
        failedToAssign: 'Error al asignar punto'
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLang = await AsyncStorage.getItem('language');
            if (savedLang) {
                setLanguage(savedLang);
            }
        } catch (error) {
            console.error('Failed to load language:', error);
        }
    };

    const toggleLanguage = async () => {
        const newLang = language === 'en' ? 'es' : 'en';
        setLanguage(newLang);
        await AsyncStorage.setItem('language', newLang);
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
