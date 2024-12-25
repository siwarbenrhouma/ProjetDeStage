import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import SignInWithOAuth from './../../components/SignInWithOAuth';
import SignUp from './../../components/SignUp';


const Stack = createStackNavigator();

export default function SignInLayout() {
  return (
      <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen 
            name="SignIn" 
            component={SignInWithOAuth} 
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUp}  
          />
      </Stack.Navigator>
  );
}
