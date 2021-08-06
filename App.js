import React from 'react';
import Loading from './screens/Loading';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import {createSwitchNavigator, createAppContainer} from 'react-navigation' ;
import firebase from 'firebase';
import {firebaseConfig} from './config';

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}else{
  firebase.app()
}

const AppSwitchNavigator = createSwitchNavigator({
  Loading: Loading,
  Login: Login,
  Dashboard: Dashboard
}) 
const AppNavigator = createAppContainer(AppSwitchNavigator)
export default function App(){
  return(
    <AppNavigator />
  )
}

