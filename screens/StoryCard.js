import React, { Component } from "react";
import { View, Text, StyleSheet, Image, StatusBar, Dimensions, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
 
let customFonts = {"Buublegum-sans": require('../assets/fonts/BubblegumSans-Regular.ttf')};
export default class StoryCard extends Component{
    constructor(props){
        super(props)
        this.state = {
            fontsLoaded: false
        }
    }
    async _loadFontsAsync(){
        await Font.loadAsync(customFonts);
        this.setState({
            fontsLoaded: true
        })
    }

    componentDidMount(){
        this._loadFontsAsync()
    }
    render(){
        if(!this.state.fontsLoaded){
            return <AppLoading />
        }else{
            return(
                <View style={styles.container}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('StoryScreen', {story:this.props.story})}>
                    <View style={styles.cardContainer}>
                        <Image source={require('../assets/story_image_1.png')} style={styles.storyImage} />
                        <View style={styles.titleContainer}>
                            <Text style={styles.storyTitle}>{this.props.story.title}</Text>
                            <Text style={styles.storyAuthor}>{this.props.story.author}</Text>
                            <Text style={styles.storyDescription}>{this.props.story.description}</Text>
                        </View>
                        <View style={styles.actionContainer}>
                            <View style={styles.likeBtn}>
                                <Ionicons name={"heart"} size={RFValue(30)} color={"white"} />
                                <Text style={styles.likeTxt}>12k</Text>
                            </View>
                        </View>
                    </View>
                  </TouchableOpacity>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    cardContainer:{
        margin: RFValue(13),
        backgroundColor: '#2f345d',
        borderRadius: RFValue(20)
    },
    storyImage:{
        resizeMode: 'contain',
        width: '95%',
        alignSelf: 'center',
        height: RFValue(250)
    },
    titleContainer:{
        paddingLeft: RFValue(20),
        justifyContent: "center"
    },
    storyTitle:{
        fontSize: RFValue(25),
        fontFamily: "BubbleGum-sans",
        color: '#fff'
    },
    storyAuthor:{
        fontSize: RFValue(18),
        fontFamily: "BubbleGum-sans",
        color: '#fff'
    },
    storyDescription:{
        fontSize: 13,
        fontFamily: "BubbleGum-sans",
        color: '#fff',
        paddingTop: RFValue(10)
    },
    actionContainer:{
        justifyContent: "center",
        alignItems: "center",
        padding: RFValue(10)
    },
    likeBtn:{
        width: RFValue(160),
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: '#eb3948',
        borderRadius: RFValue(30)
    },
    likeTxt:{
        fontSize: RFValue(25),
        fontFamily: "BubbleGum-sans",
        color: '#fff',
        marginLeft: RFValue(5)
    }
})