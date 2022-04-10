import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name='Login' component={LoginScreen} options={{
            title: 'Login',
            headerShown: false
          }}/>
          <Stack.Screen name='Home' component={HomeScreen} options={{
            title: 'Home',
            headerShown: false
          }}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}
