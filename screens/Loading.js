import React from 'react';
import {Text, View} from 'react-native';
import firebase from 'firebase';

export default class Loading extends React.Component{
  
  componentDidMount(){
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.props.navigation.navigate("Dashboard")
      }else{
        this.props.navigation.navigate("Login")
      }
    })
  }

  render(){
    return(
      <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
      <Text>Loading...</Text>
      </View>
    )
  }
}