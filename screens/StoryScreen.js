import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import * as Speech from 'expo-speech';
import firebase from 'firebase';
let customFonts = {
  'Buublegum-sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class StoryScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      fontsLoaded: false,
      speakerColor: 'gray',
      speakerIcon: 'volume-high-outline',
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({
      fontsLoaded: true,
      light_theme: true
    });
  }

  async fetchUser(){
    let theme;
    await firebase.database().ref("/user/" + firebase.auth().currentUser.uid).on("value", function (snapshot){
      theme = snapshot.val().current_theme;
      this.setState({
        light_theme: theme === 'light' ? true : false
      })
    })
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  async initiateTTS(title, author, story, moral) {
    const currentColor = this.state.speakerColor;
    this.setState({
      speakerColor: currentColor === 'gray' ? '#ee8249' : 'gray',
    });
    if (currentColor === 'gray') {
      Speech.speak(`${title} by ${author}`);
      Speech.speak(story);
      Speech.speak('The moral of the story is');
      Speech.speak(moral);
    } else {
      Speech.stop();
    }
  }

  render() {
    if (!this.props.route.params) {
      this.props.navigation.navigate('Home');
    } else if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.iconImage}
              />
              </View>
              <View style={styles.appTitleTxtContainer}>
                <Text style={styles.appTitleTxt}>StoryTellingApp</Text>
                </View>
                </View>
                <View style={styles.storyContainer}>
                <ScrollView style={styles.storyCard}>
                <Image
                source={require('../assets/story_image_1.png')}
                style={styles.image}
                />
                <View style={styles.dataContainer}>
                <View style={styles.titleTxtContainer}>
                <Text style={styles.storyTitleTxt}>
                  {this.props.route.params.story.title}
                </Text>
                <Text style={styles.storyAuthorTxt}>
                  {this.props.route.params.story.author}
                </Text>
                <Text style={styles.storyAuthorTxt}>
                  {this.props.route.params.story.created_on}
                </Text>
              </View>
              <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() =>
              this.initiateTTS(
                this.props.route.params.story.title,
                this.props.route.params.story.author,
                this.props.route.params.story.story,
                this.props.route.params.story.moral
              )
            }>
            <Ionicons
              name={this.state.speakerIcon}
              size={RFValue(30)}
              color={this.state.speakerColor}
              style={{ margin: RFValue(10) }}
            />
          </TouchableOpacity>
        </View>
        </View>
        <View style={styles.storyTxtContainer}>
        <Text style={styles.storyTxt}>
          {this.props.route.params.story.story}
        </Text>
        <Text style={styles.moralTxt}>
          {this.props.route.params.story.moral}
        </Text>
        </View>
        <View style={styles.actionContainer}>
          <View style={styles.likebtn}>
          <Ionicons name={"heart"} size={RFValue(30)} color={"white"} />
          <Text style={styles.likeTxt}>12k</Text>
          </View>
        </View>
        </ScrollView>
        </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  droidSafeArea:{
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row'
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTxtContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleTxt: {
    color: '#000',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  storyContainer: {
    margin: RFValue(13),
    backgroundColor: '#2f345d',
    borderRadius: RFValue(20),
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    alignSelf: 'center',
    height: RFValue(250),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20)
  },
  dataContainer: {
    padding: RFValue(20),
    flexDirection: "row"
  },
  titleTxtContainer: {
    fontSize: RFValue(25),
    fontFamily: 'BubbleGum-sans',
    color: '#fff',
    flex: 0.8
  },
  storyTitleTxt:{
    fontSize: RFValue(18),
    fontFamily: 'BubbleGum-sans',
    color: '#fff',
  },
  storyAuthorTxt: {
    fontSize: RFValue(18),
    fontFamily: 'BubbleGum-sans',
    color: '#fff',
  },
  iconContainer:{
    flex: 0.2
  },
  storyTxtContainer:{
    padding: RFValue(20)
  },
  storyTxt:{
    fontSize: 13,
    fontFamily: 'BubbleGum-sans',
    color: '#fff',
  },
  moralTxt:{
    fontSize: 20,
    fontFamily: 'BubbleGum-sans',
    color: '#fff',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: RFValue(10),
  },
  likebtn: {
    width: RFValue(160),
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    borderRadius: RFValue(30),
  },
  likeTxt: {
    fontSize: RFValue(25),
    fontFamily: 'BubbleGum-sans',
    color: '#fff',
    marginLeft: RFValue(5),
  },
});
