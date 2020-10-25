import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
    <App.Navigator
        screenOptions={{
            //headerShown: false,
            /*headerTintColor: '#fff', //Cor do Texto da barra
            headerStyle: {
                backgroundColor: '#7159c1' // Cor do fundo da barra
            },*/
            cardStyle: { backgroundColor: '#312e38' }            
        }}        
    >
        <App.Screen name="Dashboard" component={Dashboard} />
    </App.Navigator>
);

export default AppRoutes;