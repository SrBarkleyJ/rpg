import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Static Import ONLY for Home (Initial Screen) to ensure fast load
import HomeScreen from '../screens/dashboard/HomeScreen';
import CombatScreen from '../screens/combat/CombatScreen';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import ShopScreen from '../screens/rewards/ShopScreen';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import ForgeScreen from '../screens/forge/ForgeScreen';
import SkillsScreen from '../screens/skills/SkillsScreen';
import StatsScreen from '../screens/stats/StatsScreen';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import ThemeSelector from '../components/UI/ThemeSelector';
import { hapticSelection } from '../utils/haptics';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// Grid Modal Component containing ALL navigation + Settings
const GridModal = ({ visible, onClose, theme, t, logout, language, toggleLanguage }) => {
    const navigation = useNavigation<any>();

    const options = [
        { name: 'Home', label: t.homeTitle || 'Home', icon: 'home', screen: 'Home' }, // Navigate to UserHome to keep history clear or Main
        { name: 'Tasks', label: t.navTasks || 'Tasks', icon: 'list', screen: 'Tasks' },
        { name: 'Combat', label: t.navCombat || 'Combat', icon: 'skull', screen: 'Combat' },
        { name: 'Inventory', label: t.navInventory || 'Inventory', icon: 'briefcase', screen: 'Inventory' },
        { name: 'Shop', label: t.navShop || 'Shop', icon: 'cart', screen: 'Shop' },
        { name: 'Forge', label: t.navForge || 'Forge', icon: 'hammer', screen: 'Forge' },
        { name: 'Skills', label: t.navSkills || 'Skills', icon: 'flash', screen: 'Skills' },
        { name: 'Stats', label: t.navStats || 'Stats', icon: 'stats-chart', screen: 'Stats' },
    ];

    const handleOptionPress = (screen) => {
        hapticSelection();
        onClose();
        navigation.navigate(screen);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.background }]}>

                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Menu</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Navigation Grid */}
                    <FlatGrid
                        data={options}
                        itemDimension={(width - 60) / 3}
                        spacing={10}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.gridItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                onPress={() => handleOptionPress(item.screen)}
                            >
                                <Ionicons name={item.icon as any} size={32} color={theme.primary} />
                                <Text style={[styles.gridLabel, { color: theme.text }]}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                        style={styles.gridList}
                    />

                    {/* Settings Footer */}
                    <View style={[styles.footer, { borderTopColor: theme.border }]}>
                        <View style={styles.settingsRow}>
                            <ThemeSelector />

                            <TouchableOpacity
                                style={[styles.languageButton, { borderColor: theme.border }]}
                                onPress={() => {
                                    hapticSelection();
                                    toggleLanguage();
                                }}
                            >
                                <Text style={{ fontSize: 24 }}>{language === 'en' ? '🇪🇸' : '🇺🇸'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.logoutButton, { backgroundColor: theme.danger, borderColor: theme.border }]}
                                onPress={() => {
                                    hapticSelection();
                                    onClose();
                                    logout();
                                }}
                            >
                                <Ionicons name="log-out-outline" size={24} color={theme.textLight} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

// Main Tab Component
const MainTabs = () => {
    const { theme } = useTheme();
    const { t, language, toggleLanguage } = useLanguage();
    const { user, logout } = useAuth();
    const [menuVisible, setMenuVisible] = useState(false);

    // Dummy component for the Menu Tab
    const MenuComponent = () => null;

    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: theme.background,
                        borderTopColor: theme.border,
                        borderTopWidth: 2,
                        height: 70,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        elevation: 0,
                    },
                    tabBarButton: (props) => {
                        if (props.to && props.to.includes('Menu')) {
                            return (
                                <TouchableOpacity
                                    style={[styles.menuButtonContainer]}
                                    onPress={() => {
                                        hapticSelection();
                                        setMenuVisible(true);
                                    }}
                                >
                                    <View style={[styles.menuButtonCircle, { backgroundColor: theme.primary, borderColor: theme.border }]}>
                                        <Ionicons name="grid" size={30} color={theme.textLight} />
                                    </View>
                                </TouchableOpacity>
                            );
                        }
                        return null; // Hide everything else
                    }
                }}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen
                    name="Menu"
                    component={MenuComponent}
                    options={{ title: 'Menu' }}
                />

                {/* 
                    ALL screens are now strictly inside the TabNavigator 
                    so the Bottom Bar (with the Menu Button) remains visible.
                    Using getComponent for Lazy Loading to safely handle potential init errors.
                */}
                <Tab.Screen name="Combat" component={CombatScreen} />
                <Tab.Screen name="Tasks" component={TaskListScreen} />
                <Tab.Screen name="Shop" component={ShopScreen} />

                <Tab.Screen name="Inventory" component={InventoryScreen} />
                <Tab.Screen name="Forge" component={ForgeScreen} />
                <Tab.Screen name="Skills" component={SkillsScreen} />
                <Tab.Screen name="Stats" component={StatsScreen} />

            </Tab.Navigator>

            <GridModal
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                theme={theme}
                t={t}
                language={language}
                toggleLanguage={toggleLanguage}
                logout={logout}
            />
        </>
    );
};

const styles = StyleSheet.create({
    menuButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: -20,
    },
    menuButtonCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '75%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 15,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    gridList: {
        flex: 1,
    },
    gridItem: {
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 2,
        marginBottom: 10,
    },
    gridLabel: {
        marginTop: 5,
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
    },
    footer: {
        paddingVertical: 20,
        borderTopWidth: 2,
        marginTop: 10,
    },
    settingsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    languageButton: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 12,
        width: 60,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 12,
        width: 60,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MainTabs;