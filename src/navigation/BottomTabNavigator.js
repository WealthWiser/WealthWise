import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Colors} from '../utils/theme';

const Tab = createBottomTabNavigator();


// Bottom tab navigator for authenticated users
const BottomTabNavigator = () => {


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.blueDark, // iOS blue
        tabBarInactiveTintColor: Colors.grayDark,
        tabBarStyle:{
          backgroundColor: Colors.neutralBackground,
          borderTopColor: Colors.blueDark,
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen}  />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;