<flexboxLayout class='centered'>
    {#if !$user}
    <stackLayout>    
        {#if loginProgress}
            <activityIndicator busy='true' />
        {:else}
            <button text='log in' on:tap={emailPassLogin}/>
        {/if}
        <label text='{info}' />
    </stackLayout>
{:else}
    <stackLayout>
        <label text='you are now signed in' />
        <button on:tap={fbLogout} text='Sign out'/>
    </stackLayout>
{/if}
</flexboxLayout>



<script>
    import { user, db, books } from '../stores/stores.js'
    var firebase = require("nativescript-plugin-firebase")
    const firebaseWebApi = require("nativescript-plugin-firebase/app")
    let loginProgress = false
    let info = ''

    firebase.init({   
    // Optionally pass in properties for database, authentication and cloud messaging, i.e
        onAuthStateChanged: function(data) { // optional but useful to immediately re-logon the user when they re-visit your app
        console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
            if (data.loggedIn) {
                console.log('setting user... ')
                $user = data.user
                $db = firebaseWebApi.firestore()
                console.log('setting books')
                $db.collection('books')
                .where('uid', '==', $user.uid)
                .onSnapshot( snapshot => {
                    console.log('got new books')
                    $books = []
                    snapshot.forEach( book => $books = [...$books,{id:book.id, ...book.data()} ] )
                })
            }
        }
    }).then(
        function () {
        console.log("firebase.init done");
        },
        function (error) {
        console.log("firebase.init error: " + error);
        }
    )

    const emailPassLogin = async () => {
        let res = await login ({
            title: "Login",
            message: "Your login message",
            okButtonText: "OK",
            cancelButtonText: "Cancel",
        })
        if(res.result){
            loginProgress = true
            firebase.login(
                {
                    type: firebase.LoginType.PASSWORD,
                        passwordOptions: {
                            email:  res.userName,
                            password: res.password
                    }
                })
                .then(result => {
                    console.log('user logged in')
                    loginProgress = false
                })
                .catch(error => console.log(error));
        }
    }

    const fbLogin = () => {
        loginProgress = true
        firebase.login(
          {
              type: firebase.LoginType.GOOGLE, 
              googleOptions: {
                hostedDomain: "mygsuitedomain.com",
                // NOTE: no need to add 'profile' nor 'email', because they are always provided
                // NOTE 2: requesting scopes means you may access those properties, but they are not automatically fetched by the plugin
                scopes: 
                [
                    'https://www.googleapis.com/auth/user.birthday.read',
                    'https://www.googleapis.com/auth/userinfo.profile',
                ]
                }
      })
      .then(result => {
          loginProgress = false
          console.log('user logged in')
          $user = JSON.stringify(result)
      })
      .catch(error => {
          info = 'Error in log-in flow now: ' +  error
          console.log(error) 
        });
    }

    const fbLogout = () => {
        firebase.logout()
        $books = []
        $user = null
    }
</script>

<style>
</style>
