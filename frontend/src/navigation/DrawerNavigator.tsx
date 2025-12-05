import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import ShopScreen from '../screens/rewards/ShopScreen';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import SkillsScreen from '../screens/skills/SkillsScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import CombatScreen from '../screens/combat/CombatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ForgeScreen from '../screens/forge/ForgeScreen';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

// Avatar imports
import avatar1 from '../../assets/images/classes/img1.png';
import avatar2 from '../../assets/images/classes/img2.png';
import avatar3 from '../../assets/images/classes/img3.png';
import avatar4 from '../../assets/images/classes/img4.png';
import avatar5 from '../../assets/images/classes/img5.png';
import avatar6 from '../../assets/images/classes/img6.png';
import avatar7 from '../../assets/images/classes/img7.png';
import avatar8 from '../../assets/images/classes/img8.png';
import avatar9 from '../../assets/images/classes/img9.png';
import avatar10 from '../../assets/images/classes/img10.png';

const AVATAR_MAP = {
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

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const { language, toggleLanguage } = useLanguage();

    const menuItems = [
        { name: 'Profile', label: '👤 Profile', screen: 'Profile' },
        { name: 'Tasks', label: '📋 Tasks', screen: 'Tasks' },
        { name: 'Combat', label: '⚔️ Combat', screen: 'Combat' },
        { name: 'Shop', label: '🛒 Shop', screen: 'Shop' },
        { name: 'Forge', label: '⚒️ Forge', screen: 'Forge' },
        { name: 'Inventory', label: '🎒 Inventory', screen: 'Inventory' },
        { name: 'Skills', label: '🎯 Skills', screen: 'Skills' },
        { name: 'Stats', label: '📊 Stats', screen: 'Stats' },
    ];

    return (
        <View style={[styles.drawerContainer, { backgroundColor: theme.background }]}>
            {/* User Info Header with Avatar Background */}
            <ImageBackground
                source={AVATAR_MAP[user?.avatar] || avatar1}
                style={[styles.drawerHeader, { backgroundColor: theme.primary }]}
                imageStyle={styles.headerBackgroundImage}
                resizeMode="cover"
            >
                {/* Dark overlay for better text readability */}
                <View style={styles.headerOverlay} />

                <Text style={[styles.userName, { color: theme.textLight }]}>
                    {user?.username || 'Player'}
                </Text>
                <Text style={[styles.userClass, { color: theme.textLight }]}>
                    {user?.class ? user.class.charAt(0).toUpperCase() + user.class.slice(1) : 'Adventurer'} • Lvl {user?.level || 1}
                </Text>
                <View style={styles.userStats}>
                    <Text style={[styles.statText, { color: theme.textLight }]}>
                        💰 {user?.gold || 0}
                    </Text>
                    <Text style={[styles.statText, { color: theme.textLight }]}>
                        ⭐ {user?.xp || 0} XP
                    </Text>
                </View>
            </ImageBackground>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.name}
                        style={[
                            styles.menuItem,
                            { backgroundColor: theme.surface, borderColor: theme.border },
                            props.state.routeNames[props.state.index] === item.screen && {
                                backgroundColor: theme.primary,
                            },
                        ]}
                        onPress={() => props.navigation.navigate(item.screen)}
                    >
                        <Text
                            style={[
                                styles.menuLabel,
                                { color: theme.text },
                                props.state.routeNames[props.state.index] === item.screen && {
                                    color: theme.textLight,
                                    fontWeight: 'bold',
                                },
                            ]}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Settings */}
            <View style={[styles.settingsContainer, { borderTopColor: theme.border }]}>
                <TouchableOpacity
                    style={[styles.settingButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    onPress={toggleTheme}
                >
                    <Text style={[styles.settingText, { color: theme.text }]}>
                        {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.settingButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    onPress={toggleLanguage}
                >
                    <Text style={[styles.settingText, { color: theme.text }]}>
                        🌐 {language === 'en' ? 'Español' : 'English'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: theme.danger, borderColor: theme.border }]}
                    onPress={logout}
                >
                    <Text style={[styles.logoutText, { color: theme.textLight }]}>
                        🚪 Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const DrawerNavigator = () => {
    const { theme } = useTheme();

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.primary,
                },
                headerTintColor: theme.textLight,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                drawerStyle: {
                    backgroundColor: theme.background,
                    width: 280,
                },
            }}
        >
            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: '👤 Profile' }}
            />
            <Drawer.Screen
                name="Tasks"
                component={TaskListScreen}
                options={{ title: '📋 Tasks' }}
            />
            <Drawer.Screen
                name="Combat"
                component={CombatScreen}
                options={{ title: '⚔️ Combat' }}
            />
            <Drawer.Screen
                name="Shop"
                component={ShopScreen}
                options={{ title: '🛒 Shop' }}
            />
            <Drawer.Screen
                name="Forge"
                component={ForgeScreen}
                options={{ title: '⚒️ Forge' }}
            />
            <Drawer.Screen
                name="Inventory"
                component={InventoryScreen}
                options={{ title: '🎒 Inventory' }}
            />
            <Drawer.Screen
                name="Skills"
                component={SkillsScreen}
                options={{ title: '🎯 Skills' }}
            />
            <Drawer.Screen
                name="Stats"
                component={StatsScreen}
                options={{ title: '📊 Stats' }}
            />

        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
    },
    drawerHeader: {
        padding: 20,
        paddingTop: 50,
        paddingBottom: 30,
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 210,
        overflow: 'hidden', // Prevent overflow from zoomed image
    },
    headerBackgroundImage: {
        resizeMode: 'cover',
        height: 450,
        width: '100%',
        transform: [{ scale: 1.1 },
            { translateY: 30 },
        ],
        opacity: 0.9,
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        zIndex: 1,
    },
    userClass: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        opacity: 1,
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        zIndex: 1,
    },
    userStats: {
        flexDirection: 'row',
        gap: 15,
        zIndex: 1,
    },
    statText: {
        fontSize: 14,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    menuContainer: {
        flex: 1,
        paddingTop: 10,
    },
    menuItem: {
        padding: 15,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 8,
        borderWidth: 2,
    },
    menuLabel: {
        fontSize: 16,
    },
    settingsContainer: {
        borderTopWidth: 1,
        padding: 10,
    },
    settingButton: {
        padding: 12,
        marginVertical: 5,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
    },
    settingText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 12,
        marginVertical: 5,
        marginTop: 10,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default DrawerNavigator;
