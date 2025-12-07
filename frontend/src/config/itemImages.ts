// Centralized Item Images Configuration
// All item image imports and mappings for Shop, Inventory, and Forge screens

import healthPotionImage from '../../assets/images/health_potion.jpg';
import manaPotionImage from '../../assets/images/mana_potion.jpg';
import swordBasicImage from '../../assets/images/sword_basic.jpg';
import shieldBasicImage from '../../assets/images/shield_basic.jpg';
import helmetBasicImage from '../../assets/images/helmet_basic.jpg';
import bootsBasicImage from '../../assets/images/boots_basic.jpg';
import ironSwordImage from '../../assets/images/iron_sword.png';
import leatherArmorImage from '../../assets/images/leather_armor.png';
import chainmailArmorImage from '../../assets/images/chainmail_armor.png';
import luckyCharmImage from '../../assets/images/lucky_charm.png';
import swiftBootsImage from '../../assets/images/swift_boots.png';
import ringOfPowerImage from '../../assets/images/ring_of_power.png';
import battleAxeImage from '../../assets/images/battle_axe.png';
import woodenStaffImage from '../../assets/images/wooden_staff.png';
import wornDaggerImage from '../../assets/images/worn_dagger.png';
import steelSwordImage from '../../assets/images/steel_sword.png';
import ironShieldImage from '../../assets/images/iron_shield.png';
import sharpDaggerImage from '../../assets/images/sharp_dagger.png';
import twinBladesImage from '../../assets/images/twin_blades.png';
import shadowstrikeImage from '../../assets/images/shadowstrike.png';
import emberStaffImage from '../../assets/images/ember_staff.png';
import crystalStaffImage from '../../assets/images/crystal_staff.png';
import godStaffImage from '../../assets/images/god_staff.png';

// Item image key to imported image mapping
export const ITEM_IMAGES: Record<string, any> = {
    // Consumables
    'health_potion': healthPotionImage,
    'mana_potion': manaPotionImage,

    // Basic Equipment
    'sword_basic': swordBasicImage,
    'shield_basic': shieldBasicImage,
    'helmet_basic': helmetBasicImage,
    'boots_basic': bootsBasicImage,

    // Warrior Weapons
    'iron_sword': ironSwordImage,
    'steel_sword': steelSwordImage,
    'battle_axe': battleAxeImage,
    'iron_shield': ironShieldImage,

    // Rogue Weapons
    'worn_dagger': wornDaggerImage,
    'sharp_dagger': sharpDaggerImage,
    'twin_blades': twinBladesImage,
    'shadowstrike': shadowstrikeImage,

    // Mage Weapons
    'wooden_staff': woodenStaffImage,
    'ember_staff': emberStaffImage,
    'crystal_staff': crystalStaffImage,
    'god_staff': godStaffImage,

    // Armor
    'leather_armor': leatherArmorImage,
    'chainmail_armor': chainmailArmorImage,

    // Accessories
    'lucky_charm': luckyCharmImage,
    'swift_boots': swiftBootsImage,
    'ring_of_power': ringOfPowerImage,
};

/**
 * Get item image by key from database
 * @param imageKey - The image key stored in the database
 * @returns The imported image or null if not found
 */
export const getItemImage = (imageKey: string): any => {
    return ITEM_IMAGES[imageKey] || null;
};
