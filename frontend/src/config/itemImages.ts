// Centralized Item Images Configuration
// All item image imports and mappings for Shop, Inventory, and Forge screens

// --- Consumables ---
import healthPotionSmall from '../../assets/images/health_potion_small.png';
import healthPotionMedium from '../../assets/images/health_potion_medium.png';
import healthPotionLarge from '../../assets/images/health_potion_large.png';
import manaPotion from '../../assets/images/mana_potion.jpg';
import elixir from '../../assets/images/elixir.png';

// --- Warrior Weapons ---
import warriorWeapon1 from '../../assets/images/warrior_weapon_1.png';
import warriorWeapon2 from '../../assets/images/warrior_weapon_2.png';
import warriorWeapon3 from '../../assets/images/warrior_weapon_3.png';
import warriorWeapon4 from '../../assets/images/warrior_weapon_4.png';
import warriorWeapon5 from '../../assets/images/warrior_weapon_5.png';

// --- Mage Weapons ---
import mageWeapon1 from '../../assets/images/mage_weapon_1.png';
import mageWeapon2 from '../../assets/images/mage_weapon_2.png';
import mageWeapon3 from '../../assets/images/mage_weapon_3.png';
import mageWeapon4 from '../../assets/images/mage_weapon_4.png';
import mageWeapon5 from '../../assets/images/mage_weapon_5.png';

// --- Rogue Weapons ---
import rogueWeapon1 from '../../assets/images/rogue_weapon_1.png';
import rogueWeapon2 from '../../assets/images/rogue_weapon_2.png';
import rogueWeapon3 from '../../assets/images/rogue_weapon_3.png';
import rogueWeapon4 from '../../assets/images/rogue_weapon_4.png';
import rogueWeapon5 from '../../assets/images/rogue_weapon_5.png';

// --- Armor ---
import leatherArmor from '../../assets/images/leather_armor.png';
import chainmail from '../../assets/images/chainmail.png';
import armorPlate from '../../assets/images/armour_plate.png'; // Note 'armour' spelling in file
import robeNovice from '../../assets/images/robe_novice.png';
import robeMaster from '../../assets/images/robe_master.png';

// --- Accessories (Rings) ---
import ringGold from '../../assets/images/ring_gold.png';
import ringOfPower from '../../assets/images/ring_of_power.png';
import ringGiant from '../../assets/images/ring_giant.png';
import ringIntellect from '../../assets/images/ring_intellect.png';
import ringVitality from '../../assets/images/ring_vitality.png';
import ringAgility from '../../assets/images/ring_agility.png';
import ringFortune from '../../assets/images/ring_fortune.png';
// Note: some ring image files are not yet provided in assets.
// Import closest matching files that exist or fall back to available placeholders
import ringFire from '../../assets/images/ring_phisichal.png';
import ringFrost from '../../assets/images/ring_power.png';
import ringPoison from '../../assets/images/ring_mana.png';
import ringLightning from '../../assets/images/ring_power.png';
import ringHybrid from '../../assets/images/ring_power.png';
import ringDefense from '../../assets/images/ring_defense.png';
import ringMystic from '../../assets/images/ring_power.png';

// --- Legendary / Easter Eggs ---
import legendarySword from '../../assets/images/legendary_sword.png';
import legendaryBook from '../../assets/images/legendary_book.png';
import legendaryDagger from '../../assets/images/legendary_dagger.png';

// Item image key to imported image mapping
export const ITEM_IMAGES: Record<string, any> = {
    // Consumables
    'health_potion_small': healthPotionSmall,
    'health_potion_medium': healthPotionMedium,
    'health_potion_large': healthPotionLarge,
    'mana_potion': manaPotion,
    'elixir': elixir,

    // Warrior
    'warrior_weapon_1': warriorWeapon1,
    'warrior_weapon_2': warriorWeapon2,
    'warrior_weapon_3': warriorWeapon3,
    'warrior_weapon_4': warriorWeapon4,
    'warrior_weapon_5': warriorWeapon5,

    // Mage
    'mage_weapon_1': mageWeapon1,
    'mage_weapon_2': mageWeapon2,
    'mage_weapon_3': mageWeapon3,
    'mage_weapon_4': mageWeapon4,
    'mage_weapon_5': mageWeapon5,

    // Rogue
    'rogue_weapon_1': rogueWeapon1,
    'rogue_weapon_2': rogueWeapon2,
    'rogue_weapon_3': rogueWeapon3,
    'rogue_weapon_4': rogueWeapon4,
    'rogue_weapon_5': rogueWeapon5,

    // Armor
    'leather_armor': leatherArmor,
    'chainmail': chainmail,
    'armour_plate': armorPlate,
    'robe_novice': robeNovice,
    'robe_master': robeMaster,

    // Accessories (Rings)
    'ring_gold': ringGold,
    'ring_of_power': ringOfPower,
    'ring_giant': ringGiant,
    'ring_intellect': ringIntellect,
    'ring_vitality': ringVitality,
    'ring_agility': ringAgility,
    'ring_fortune': ringFortune,
    'ring_fire': ringFire,
    'ring_frost': ringFrost,
    'ring_poison': ringPoison,
    'ring_lightning': ringLightning,
    'ring_hybrid': ringHybrid,
    'ring_defense': ringDefense,
    'ring_mystic': ringMystic,

    // Legendaries
    'legendary_sword': legendarySword,
    'legendary_book': legendaryBook,
    'legendary_dagger': legendaryDagger,
};

/**
 * Get item image by key from database
 * @param imageKey - The image key stored in the database
 * @returns The imported image or null if not found
 */
export const getItemImage = (imageKey: string): any => {
    return ITEM_IMAGES[imageKey] || null;
};
