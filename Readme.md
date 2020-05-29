# Svelte Native Firestore 
This project handles the basics of hooking a (svelte/nativescript) native app up to firebase. It includes authentication with Google, listening to collection updates and editing/deleting documents.

## plugin setup
```javascript
//first: tns plugin add nativescript-plugin-firebase
const firebase = require("nativescript-plugin-firebase")
const firebaseWebApi = require("nativescript-plugin-firebase/app")
```
For android and ios you need to add firebase config files to their respective app/ressources folder. These files are like package.json files. You get those files by adding the android/ios apps from the firebase console.

For android you also need to add this to the app.gradle file: 
````javascript
//NEW: multiDexEnabled true

android {
  defaultConfig {
    minSdkVersion 17
    multiDexEnabled true
    generatedDensities = []
  }
  aaptOptions {
    additionalParameters "--no-version-vectors"
  }
}

````

Now you should be able to init firebase like this:

```javascript
const initFirebase = () => {
        return new Promise(resolve => {
            firebaseWebApi.initializeApp({
                    persist: false
            }).then(
                () => {
                    console.log('firebase init done')
                    resolve(firebase.firestore()
                )},
                error => {
                    console.log("firebase.init error : " + error);
                }
            )
        })
    }
```
## Authentication with google
To enable this we can get the plugin to do most of the hard work - but we still need some quite painful preparations for it to work. Here they are...

### android
Android has something called a SHA-1 fingerprint you need to equip to your app. 

From google...:

Certain Google Play services (such as Google Sign-in and App Invites) require you to provide the SHA-1 of your signing certificate so we can create an OAuth2 client and API key for your app. To get your SHA-1, follow these instructions:

Open a terminal and run the keytool utility provided with Java to get the SHA-1 fingerprint of the certificate. You should get both the release and debug certificate fingerprints. These must be pasted and saved in your firebase project settings.

#### The (terrible) process of generating keystores
The first thing we will do is to generate a debug keystore. This is used in debug versions of the app, not releases. Open the terminal and hit

````javascript
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
````
From answering the most obvious to the questions that follows, we now get something like 
````javascript
$ keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
What is your first and last name?
  [Unknown]:  simon moe
What is the name of your organizational unit?
  [Unknown]:  simmoe
What is the name of your organization?
  [Unknown]:  simmoe
What is the name of your City or Locality?
  [Unknown]:  oslo
What is the name of your State or Province?
  [Unknown]:  norway
What is the two-letter country code for this unit?
  [Unknown]:  NO
Is CN=simon moe, OU=simmoe, O=simmoe, L=oslo, ST=norway, C=NO correct?
  [no]:  yes

Generating 2 048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 10 000 days
	for: CN=simon moe, OU=simmoe, O=simmoe, L=oslo, ST=norway, C=NO
[Storing debug.keystore]

````
This means that you are now able to locate a hidden folder .android in your computers home directory - and inside that folder, there is a file called debug.keystore. NOW we need the so called SHA1 fingerprints (just some encrypted numbers really, never mind the details). Because - we have to go into the firebase console of the project and paste those values into the project settings - otherwise we cant make stuff like authentication work! 

In order to get the actual (debug) fingerprints, in terminal now type:

````javascript
$ keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
````
This will also print a lot of stuff in your terminal - what you need is the two fingerprint keys - SHA1 and SHA256. I wont print them here since, yea..

Open firebase in your browser, go to the project settings and add those values to your android app. 

Now download the latest google-services.json file from the firebase console, and put it into your app/App_Ressources/Android folder - replace the old one if it exists. <b>Now delete the Platforms folder</b> and build the entire project again using 

````javascript
tns run android 
````
For your release keystore, do the same as above but choose a name, alias, and password that you prefer.




### IOS 
Make sure the URL Scheme for REVERSED_CLIENT_ID is in app/App_Resources/iOS/Info.plist. The value of REVERSED_CLIENT_ID can be found in your App_Resources/iOS/GoogleService-Info.plist :

```javascript
<key>CFBundleURLTypes</key>
	<array>
		<dict>
			<key>CFBundleTypeRole</key>
			<string>Editor</string>
			<key>CFBundleURLName</key>
			<string>REVERSED_CLIENT_ID</string>
			<key>CFBundleURLSchemes</key>
			<array>
				<string>com.googleusercontent.apps.1052836194035-l81fsjai1u40ocnqjcpnoebnnsltt03b</string>
			</array>
		</dict>
    </array>
    ```


