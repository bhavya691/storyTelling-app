import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase';
import * as Google from 'expo-google-app-auth';


let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};
export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      fontsLoaded: false,
    };
  }
  async _loadFontAsync() {
    await Font.loadAsync(customFonts);
    this.setState({
      fontsLoaded: true,
    });
  }

  componentDidMount() {
    this._loadFontAsync();
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser) => {
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref('/users/' + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  first_name: result.additionalUserInfo.profile.given_name,
                  last_name: result.additionalUserInfo.profile.family_name,
                  current_theme: 'dark'
                })
                .then(function (snapshot) {});
            }
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMsg = error.message;
            var email = error.email;
            var credential = error.credential;
          });
      } else {
        console.log('User already signed in firebase');
      }
    });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behavior: 'web',
        androidClientId:'741350102264-3q2mo705l5ogqd9btj75m039djbs841n.apps.googleusercontent.com',
        iosClientId:'741350102264-tfnlb3ggd66jpkoen3sf6grgcm7mgmc9.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e.message);
      return { error: true };
    }
  };

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.appIcon}
            />
            <Text style={styles.appTitleTxt}>{'Storytelling-app\nApp'}</Text>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.signInWithGoogleAsync()}>
              <Image
                source={require('../assets/google_icon.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleTxt}>Sign In with Google Account</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cloudContainer}>
            <Image
              source={require('../assets/cloud.png')}
              style={styles.cloudImg}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    width: RFValue(130),
    height: RFValue(130),
    resizeMode: 'contain',
  },
  appTitleTxt: {
    color: '#fff',
    textAlign: 'center',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
  },
  btnContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: RFValue(30),
    backgroundColor: '#fff',
  },
  googleIcon: {
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: 'contain',
  },
  googleTxt: {
    color: '#000',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
  },
  cloudContainer: {
    flex: 0.3,
  },
  cloudImg: {
    position: 'absolute',
    width: '100%',
    resizeMode: 'contain',
    bottom: RFValue(-5),
  },
});
