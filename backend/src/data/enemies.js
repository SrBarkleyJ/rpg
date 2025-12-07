// Enemy database with detailed characteristics - Using 22 new monster sprites
const ENEMY_DATABASE = {
    // Tier 1: Levels 1-5
    crimson_imp: {
        name: { en: 'Crimson Imp', es: 'Diablillo Carmesí' },
        description: { en: 'A small demonic creature with sharp claws', es: 'Una pequeña criatura demoníaca con garras afiladas' },
        tier: 1,
        hpMod: 0.7,
        dmgMod: 0.8,
        image: 'monster.01.png',
        special: 'quick_attack',
        loot: { gold: [5, 15], tetranuta: 0.05 }
    },
    swamp_zombie: {
        name: { en: 'Swamp Zombie', es: 'Zombi del Pantano' },
        description: { en: 'A rotting corpse risen from the murky depths', es: 'Un cadáver putrefacto que emerge de las profundidades' },
        tier: 1,
        hpMod: 1.0,
        dmgMod: 0.9,
        image: 'monster.02.png',
        special: 'regeneration',
        loot: { gold: [8, 18], tetranuta: 0.08 }
    },
    void_squid: {
        name: { en: 'Void Squid', es: 'Calamar del Vacío' },
        description: { en: 'A tentacled horror from the dark ocean', es: 'Un horror tentacular del océano oscuro' },
        tier: 1,
        hpMod: 0.9,
        dmgMod: 1.0,
        image: 'monster.03.png',
        special: 'ink_cloud',
        loot: { gold: [10, 25], tetranuta: 0.10 }
    },
    serpent_wyrm: {
        name: { en: 'Serpent Wyrm', es: 'Serpiente Wyrm' },
        description: { en: 'A massive sea serpent with venomous fangs', es: 'Una serpiente marina masiva con colmillos venenosos' },
        tier: 1,
        hpMod: 1.1,
        dmgMod: 1.1,
        image: 'monster.04.png',
        special: 'poison_bite',
        loot: { gold: [12, 30], tetranuta: 0.12 }
    },

    // Tier 2: Levels 6-10
    bone_runner: {
        name: { en: 'Bone Runner', es: 'Corredor Óseo' },
        description: { en: 'An undead skeleton that moves with unnatural speed', es: 'Un esqueleto no-muerto que se mueve con velocidad antinatural' },
        tier: 2,
        hpMod: 1.2,
        dmgMod: 1.2,
        image: 'monster.05.png',
        special: 'swift_strike',
        loot: { gold: [20, 45], tetranuta: 0.15 }
    },
    wraith_hound: {
        name: { en: 'Wraith Hound', es: 'Sabueso Espectral' },
        description: { en: 'A spectral beast that hunts in the night', es: 'Una bestia espectral que caza en la noche' },
        tier: 2,
        hpMod: 1.4,
        dmgMod: 1.3,
        image: 'monster.06.png',
        special: 'howl',
        loot: { gold: [25, 55], tetranuta: 0.18 }
    },
    reaper_shade: {
        name: { en: 'Reaper Shade', es: 'Sombra Segadora' },
        description: { en: 'A hooded figure that collects souls', es: 'Una figura encapuchada que recolecta almas' },
        tier: 2,
        hpMod: 1.1,
        dmgMod: 1.5,
        image: 'monster.07.png',
        special: 'life_drain',
        loot: { gold: [30, 65], tetranuta: 0.20 }
    },
    bone_colossus: {
        name: { en: 'Bone Colossus', es: 'Coloso de Huesos' },
        description: { en: 'A towering skeletal giant', es: 'Un gigante esquelético imponente' },
        tier: 2,
        hpMod: 1.8,
        dmgMod: 1.3,
        image: 'monster.08.png',
        special: 'bone_armor',
        loot: { gold: [35, 75], tetranuta: 0.22 }
    },
    shadow_fiend: {
        name: { en: 'Shadow Fiend', es: 'Demonio de las Sombras' },
        description: { en: 'A creature of pure darkness', es: 'Una criatura de oscuridad pura' },
        tier: 2,
        hpMod: 1.3,
        dmgMod: 1.4,
        image: 'monster.09.png',
        special: 'shadow_strike',
        loot: { gold: [40, 85], tetranuta: 0.24 }
    },

    // Tier 3: Levels 11-15
    maw_of_the_deep: {
        name: { en: 'Maw of the Deep', es: 'Fauces de las Profundidades' },
        description: { en: 'A massive worm with insatiable appetite', es: 'Un gusano masivo con apetito insaciable' },
        tier: 3,
        hpMod: 2.0,
        dmgMod: 1.5,
        image: 'monster.10.png',
        special: 'devour',
        loot: { gold: [50, 110], tetranuta: 0.28 }
    },
    rot_hound: {
        name: { en: 'Rot Hound', es: 'Sabueso Putrefacto' },
        description: { en: 'A decaying canine with plague-ridden bite', es: 'Un canino en descomposición con mordida pestilente' },
        tier: 3,
        hpMod: 1.6,
        dmgMod: 1.6,
        image: 'monster.11.png',
        special: 'plague_bite',
        loot: { gold: [55, 125], tetranuta: 0.30 }
    },
    leviathan_maw: {
        name: { en: 'Leviathan Maw', es: 'Fauces del Leviatán' },
        description: { en: 'An abyssal horror with deadly teeth', es: 'Un horror abisal con dientes mortales' },
        tier: 3,
        hpMod: 2.2,
        dmgMod: 1.6,
        image: 'monster.12.png',
        special: 'crushing_bite',
        loot: { gold: [60, 140], tetranuta: 0.32 }
    },
    lurking_horror: {
        name: { en: 'Lurking Horror', es: 'Horror Acechante' },
        description: { en: 'A shadowy predator from darkness', es: 'Un depredador sombrío de la oscuridad' },
        tier: 3,
        hpMod: 1.5,
        dmgMod: 1.8,
        image: 'monster.13.png',
        special: 'ambush',
        loot: { gold: [65, 155], tetranuta: 0.34 }
    },
    arachnid_lord: {
        name: { en: 'Arachnid Lord', es: 'Señor Arácnido' },
        description: { en: 'A giant spider with venomous fangs', es: 'Una araña gigante con colmillos venenosos' },
        tier: 3,
        hpMod: 1.7,
        dmgMod: 1.7,
        image: 'monster.14.png',
        special: 'web_trap',
        loot: { gold: [70, 170], tetranuta: 0.36 }
    },

    // Tier 4: Levels 16-20
    dread_bat: {
        name: { en: 'Dread Bat', es: 'Murciélago Aterrador' },
        description: { en: 'A massive bat with sonic scream', es: 'Un murciélago masivo con grito sónico' },
        tier: 4,
        hpMod: 1.8,
        dmgMod: 1.9,
        image: 'monster.16.png',
        special: 'sonic_scream',
        loot: { gold: [80, 200], tetranuta: 0.38 }
    },
    chrysalis_moth: {
        name: { en: 'Chrysalis Moth', es: 'Polilla Crisálida' },
        description: { en: 'A mystical insect with powerful spells', es: 'Un insecto místico con poderosos hechizos' },
        tier: 4,
        hpMod: 1.6,
        dmgMod: 2.0,
        image: 'monster.18.png',
        special: 'fairy_dust',
        loot: { gold: [90, 220], tetranuta: 0.40 }
    },
    plague_zombie: {
        name: { en: 'Plague Zombie', es: 'Zombi Pestilente' },
        description: { en: 'A grotesque undead covered in sores', es: 'Un no-muerto grotesco cubierto de llagas' },
        tier: 4,
        hpMod: 2.0,
        dmgMod: 1.8,
        image: 'monster.15.png',
        special: 'plague_touch',
        loot: { gold: [100, 240], tetranuta: 0.42 }
    },
    bone_spider: {
        name: { en: 'Bone Spider', es: 'Araña de Huesos' },
        description: { en: 'An arachnid made of animated bones', es: 'Un arácnido hecho de huesos animados' },
        tier: 4,
        hpMod: 1.9,
        dmgMod: 2.0,
        image: 'monster.17.png',
        special: 'bone_trap',
        loot: { gold: [110, 260], tetranuta: 0.45 }
    },

    // Tier 5: Levels 21+
    spike_horror: {
        name: { en: 'Spike Horror', es: 'Horror de Púas' },
        description: { en: 'A demonic entity covered in spikes', es: 'Una entidad demoníaca cubierta de púas' },
        tier: 5,
        hpMod: 2.5,
        dmgMod: 2.2,
        image: 'monster.19.png',
        special: 'spike_burst',
        loot: { gold: [150, 350], tetranuta: 0.50 }
    },
    abyssal_behemoth: {
        name: { en: 'Abyssal Behemoth', es: 'Behemot Abisal' },
        description: { en: 'A colossal deep-sea terror', es: 'Un terror colosal de las profundidades' },
        tier: 5,
        hpMod: 3.0,
        dmgMod: 2.3,
        image: 'monster.20.png',
        special: 'crushing_wave',
        loot: { gold: [180, 420], tetranuta: 0.55 }
    },
    void_stalker: {
        name: { en: 'Void Stalker', es: 'Acechador del Vacío' },
        description: { en: 'A creature from the void between dimensions', es: 'Una criatura del vacío entre dimensiones' },
        tier: 5,
        hpMod: 2.6,
        dmgMod: 2.5,
        image: 'monster.21.png',
        special: 'void_strike',
        loot: { gold: [200, 480], tetranuta: 0.60 }
    },
    eldritch_abomination: {
        name: { en: 'Eldritch Abomination', es: 'Abominación Eldritch' },
        description: { en: 'An incomprehensible horror defying nature', es: 'Un horror incomprensible que desafía la naturaleza' },
        tier: 5,
        hpMod: 2.8,
        dmgMod: 2.6,
        image: 'monster.22.png',
        special: 'madness_aura',
        loot: { gold: [250, 550], tetranuta: 0.65 }
    }
};

// Get enemies for a specific tier
const getEnemiesByTier = (tier) => {
    return Object.entries(ENEMY_DATABASE)
        .filter(([_, enemy]) => enemy.tier === tier)
        .map(([key, enemy]) => ({ ...enemy, id: key }));
};

// Get random enemy for player level
const getRandomEnemyForLevel = (playerLevel) => {
    const tier = Math.min(5, Math.max(1, Math.ceil(playerLevel / 5)));
    const tierEnemies = getEnemiesByTier(tier);
    return tierEnemies[Math.floor(Math.random() * tierEnemies.length)];
};

module.exports = {
    ENEMY_DATABASE,
    getEnemiesByTier,
    getRandomEnemyForLevel
};
