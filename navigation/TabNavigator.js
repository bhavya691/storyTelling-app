import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import ReadStory from '../screens/ReadStory';
import WriteStory from '../screens/WriteStory';
import {RFValue} from 'react-native-responsive-fontsize';
import firebase from 'firebase';
const Tab = createMaterialBottomTabNavigator()
export default class BottomTabNavigator extends Component{
    constructor(props){
        super(props);
        this.state = {
            light_theme: true
        }
    }
    removeUpdated = () => {
        this.setState({
            isUpdated: false
        })
    }
    changeUpdated = () =>   {
        this.setState({
            isUpdated: true
        })        
    }
    renderFeed = props => {
        return <Feed setUpdateToFalse = {this.removeUpdated}{...props} />
    }
    renderStory = props => {
        return <createStory setUpdateToTrue = {this.changeUpdated}{...props} />
    }
    componentDidMount(){
        let theme;
        firebase.database()
        .ref("/users/" + firebase.auth().currentUser.uid)
        .on("value", function(snapshot){
            theme = snapshot.val().current_theme
        })
        this.setState({
            light_theme: theme === "light" ? true : false

        })
    }
    render(){
        return(
            <Tab.Navigator 
            labled = {false}
            barStyle = {this.state.light_theme ? styles.bottomTabLight : styles.bottomTab}
            screenOptions = {({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    if(route.name === 'ReadStory'){
                        iconName = focused ? 'home' : 'home-outline'
                    }else if(route.name === 'WriteStory'){
                        iconName = focused ? 'add-circle' : 'add-circle-outline'
                    }return <Ionicons name={iconName} size={30} color={color} style={{width: 30}}/>
                },
            })}
                activeColor = {'#eea249'}
                inactiveColor = {'#777'}>
                <Tab.Screen name="ReadStory" component={ReadStory} options={{unmountOnBlur: true}}/>
                <Tab.Screen name="WriteStory" component={WriteStory} options={{unmountOnBlur: true}}/>
            </Tab.Navigator>
        )
    }
}
const styles = StyleSheet.create({
    bottomTabLight:{
        backgroundColor: '#eaeaea',
        height: '8%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
        position: 'absolute'
    },
    bottomTab:{
        backgroundColor: '#2f345b',
        height: '8%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
        position: 'absolute'
    },
    
})