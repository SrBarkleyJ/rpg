import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/dashboard/HomeScreen';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import ShopScreen from '../screens/rewards/ShopScreen';
import InventoryScreen from '../screens/inventory/InventoryScreen';
import StatsScreen from '../screens/stats/StatsScreen';
import CombatScreen from '../screens/combat/CombatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // Use Expo vector icons in real app

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Dashboard" component={HomeScreen} />
            <Tab.Screen name="Tasks" component={TaskListScreen} />
            <Tab.Screen name="Shop" component={ShopScreen} />
            <Tab.Screen name="Inventory" component={InventoryScreen} />
            <Tab.Screen name="Combat" component={CombatScreen} />
            <Tab.Screen name="Stats" component={StatsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
