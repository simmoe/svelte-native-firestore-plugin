<page>
<actionBar title='Books' backgroundColor='black' color='gray' />
    <gridLayout rows='32, *'>    
        <flexboxLayout row='0' class='sort-menu class' >
            <label text='title' on:tap={()=>order='title'}/>
            <label text='author' on:tap={()=>order='author'} />
        </flexboxLayout>
        <scrollView row='1'>
            <stackLayout class='container'>    
                <stackLayout class='books'>
                    {#each books as book}
                        <Book {book} />
                    {:else}
                        <!-- this block renders when books.length === 0 -->
                        <activityIndicator busy="{true}" class='center' />        
                    {/each}
                </stackLayout>
            </stackLayout>
        </scrollView> 
    </gridLayout>        
</page>

<script>
    //tns plugin add nativescript-plugin-firebase
    //for android and ios add configs to app/ressources
    //for android: android in app.gradle... 
    //     ...multiDexEnabled true
    //tns plugin add @nstudio/nativescript-cardview

    const firebase = require("nativescript-plugin-firebase/app")

    import { registerNativeViewElement } from 'svelte-native/dom'
    registerNativeViewElement("cardView", () => require("@nstudio/nativescript-cardview").CardView);
    
    const sortObjectsArray = require('sort-objects-array')
    import { db } from './stores/stores.js'


    import { onMount } from 'svelte'
    import Book from './components/Book.svelte'
    import Audio from './pages/Audio.svelte'

    let selectedTab = 0
    let books = []
    let order = 'title'
    
    const initFirebase = () => {
        return new Promise(resolve => {
            firebase.initializeApp({
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

    onMount( async () => {
        console.log('App mounts..')
        $db = await initFirebase()
        const booksCollection = $db.collection("books")
            .orderBy(order, "asc")
        const unsubscribe = booksCollection.onSnapshot( snapshot => { 
            books=[]
            snapshot.forEach( book => {
                books = [...books, {id:book.id, ...book.data()}]
            })
        })
    })

    $:  switch(order){
            case 'title': books = sortObjectsArray(books, 'title'); break;
            case 'author': books = sortObjectsArray(books, 'author'); break;
        }
    

</script>

<style>
    .container{
        width:100%;
        padding:16;
        background: lightgray;

    }
    .sort-menu{
        align-items:center;
        justify-content:space-around;
    }

    tabStrip label {
        color:gray; 
    }
    tabStrip{
        background-color: black;
        highlight-color:white;
    }

</style>
