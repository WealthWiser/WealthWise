import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "react-native-vector-icons/Feather";
import HomeScreen from '../screens/Home/HomeScreen';
import BudgetScreen from '../screens/Budget/BudgetScreen';
import SavingsGoalScreen from '../screens/Goals/SavingsGoalScreen';
import InvestmentScreen from '../screens/Invest/InvestmentScreen';
import { Colors, Fonts } from "../utils/theme";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Budget") {
            iconName = "bar-chart";
          } else if (route.name === "Goals") {
            iconName = "target";
          } else if (route.name === "Invest") {
            iconName = "trending-up";
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary, // your theme primary
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize:12,
          fontFamily: Fonts.primary,
        },
        tabBarStyle:{
          backgroundColor: Colors.neutralBackground,
          // position: 'absolute',
          height: 55,
        }

      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Goals" component={SavingsGoalScreen} />
      <Tab.Screen name="Invest" component={InvestmentScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
