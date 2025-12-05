import monster01 from '../../../assets/images/enemies/monster.01.png';
import monster02 from '../../../assets/images/enemies/monster.02.png';
import monster03 from '../../../assets/images/enemies/monster.03.png';
import monster04 from '../../../assets/images/enemies/monster.04.png';
import monster05 from '../../../assets/images/enemies/monster.05.png';
import monster06 from '../../../assets/images/enemies/monster.06.png';
import monster07 from '../../../assets/images/enemies/monster.07.png';
import monster08 from '../../../assets/images/enemies/monster.08.png';
import monster09 from '../../../assets/images/enemies/monster.09.png';
import monster10 from '../../../assets/images/enemies/monster.10.png';
import monster11 from '../../../assets/images/enemies/monster.11.png';
import monster12 from '../../../assets/images/enemies/monster.12.png';
import monster13 from '../../../assets/images/enemies/monster.13.png';
import monster14 from '../../../assets/images/enemies/monster.14.png';
import monster15 from '../../../assets/images/enemies/monster.15.png';
import monster16 from '../../../assets/images/enemies/monster.16.png';
import monster17 from '../../../assets/images/enemies/monster.17.png';
import monster18 from '../../../assets/images/enemies/monster.18.png';
import monster19 from '../../../assets/images/enemies/monster.19.png';
import monster20 from '../../../assets/images/enemies/monster.20.png';
import monster21 from '../../../assets/images/enemies/monster.21.png';
import monster22 from '../../../assets/images/enemies/monster.22.png';

import avatar1 from '../../../assets/images/classes/img1.png';
import avatar2 from '../../../assets/images/classes/img2.png';
import avatar3 from '../../../assets/images/classes/img3.png';
import avatar4 from '../../../assets/images/classes/img4.png';
import avatar5 from '../../../assets/images/classes/img5.png';
import avatar6 from '../../../assets/images/classes/img6.png';
import avatar7 from '../../../assets/images/classes/img7.png';
import avatar8 from '../../../assets/images/classes/img8.png';
import avatar9 from '../../../assets/images/classes/img9.png';
import avatar10 from '../../../assets/images/classes/img10.png';

import healthPotionImage from '../../../assets/images/health_potion.jpg';
import manaPotionImage from '../../../assets/images/mana_potion.jpg';

export const AVATAR_MAP = {
    img1: avatar1,
    img2: avatar2,
    img3: avatar3,
    img4: avatar4,
    img5: avatar5,
    img6: avatar6,
    img7: avatar7,
    img8: avatar8,
    img9: avatar9,
    img10: avatar10,
};

export const ENEMY_IMAGES = {
    'monster.01.png': monster01,
    'monster.02.png': monster02,
    'monster.03.png': monster03,
    'monster.04.png': monster04,
    'monster.05.png': monster05,
    'monster.06.png': monster06,
    'monster.07.png': monster07,
    'monster.08.png': monster08,
    'monster.09.png': monster09,
    'monster.10.png': monster10,
    'monster.11.png': monster11,
    'monster.12.png': monster12,
    'monster.13.png': monster13,
    'monster.14.png': monster14,
    'monster.15.png': monster15,
    'monster.16.png': monster16,
    'monster.17.png': monster17,
    'monster.18.png': monster18,
    'monster.19.png': monster19,
    'monster.20.png': monster20,
    'monster.21.png': monster21,
    'monster.22.png': monster22,
};

export const ITEM_IMAGES = {
    'health_potion': healthPotionImage,
    'mana_potion': manaPotionImage,
};

export const getTierColor = (tier: number): string => {
    const colors: Record<number, string> = {
        1: '#4ade80', // Green
        2: '#60a5fa', // Blue
        3: '#a78bfa', // Purple
        4: '#f97316', // Orange
        5: '#ef4444'  // Red
    };
    return colors[tier] || colors[1];
};

export const getClassSkills = (t: any) => ({
    warrior: [
        { id: 'bash', name: t['Bash'] || 'Bash', cost: 10, desc: t['Bash_desc'] || 'Heavy strike (1.5x Dmg)' },
        { id: 'berserk', name: t['Berserk'] || 'Berserk', cost: 20, desc: t['Berserk_desc'] || 'Buff STR (3 turns)' },
        { id: 'execute', name: t['Execute_skill'] || 'Execute', cost: 30, desc: t['Execute_skill_desc'] || '2.5x Dmg if enemy < 30% HP' },
        { id: 'iron_skin', name: t['Iron Skin'] || 'Iron Skin', cost: 15, desc: t['Iron Skin_desc'] || 'Reduce dmg 50% (2 turns)' }
    ],
    mage: [
        { id: 'fireball', name: t['Fireball_skill'] || 'Fireball', cost: 15, desc: t['Fireball_skill_desc'] || 'Fire dmg (1.5x)' },
        { id: 'ice_shard', name: t['Ice Shard'] || 'Ice Shard', cost: 20, desc: t['Ice Shard_desc'] || 'Ice dmg (1.2x)' },
        { id: 'thunder_strike', name: t['Thunder Strike'] || 'Thunder Strike', cost: 35, desc: t['Thunder Strike_desc'] || 'High dmg (2.0x)' },
        { id: 'heal', name: t['Heal'] || 'Heal', cost: 25, desc: t['Heal_desc'] || 'Restore HP' }
    ],
    rogue: [
        { id: 'double_stab', name: t['Double Stab'] || 'Double Stab', cost: 10, desc: t['Double Stab_desc'] || '2 hits (0.8x each)' },
        { id: 'poison_tip', name: t['Poison Tip'] || 'Poison Tip', cost: 15, desc: t['Poison Tip_desc'] || 'Apply Poison' },
        { id: 'evasion', name: t['Evasion'] || 'Evasion', cost: 20, desc: t['Evasion_desc'] || 'Dodge next attack' },
        { id: 'assassinate', name: t['Assassinate'] || 'Assassinate', cost: 40, desc: t['Assassinate_desc'] || 'High Crit chance' }
    ]
});
