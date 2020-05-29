<frame id='add'>
<page>
    <actionBar><button text='back' on:tap={closeModal} /></actionBar> 
    <gridLayout rows='60, *'>    
        <textField row='0' on:textChange={auto} bind:text="{query}" hint='title'/>
        <scrollView row='1'>
            <stackLayout>    
                {#each results as item}
                    <cardView elevation='8' margin='12' shadowRadius='2'>                    
                        <stackLayout class='book' on:tap={()=>add(item)}>
                            <label text='{item.title}' class='h3' />
                            {#if item.publishedDate}
                                <label text='{item.publishedDate}' class='body' />
                            {/if}
                            {#if item.authors}
                                <label text='{item.authors.toString()}' class='body' />
                            {/if}
                            {#if item.description}
                                <label text='{item.description}' class='body' />
                            {/if}
                            <image src='{item.thumb}' stretch='none' />
                        </stackLayout>
                    </cardView>
                {:else}
                    <label class='text-center body' text='type three letters..' />
                {/each}
            </stackLayout>    
        </scrollView>
    </gridLayout>
</page>
</frame>

<script>
    import { confirm } from '@nativescript/core/ui/dialogs'
    import { closeModal } from 'svelte-native'
    import { db, user } from '../stores/stores.js'
    import Audio from '../components/Audio.svelte'
    let book = {}
    let selectedTab=0
    let query = ''
    $: encodedQuery = encodeURI(query)
    let results = [] 


    const add = async book => {
        let res = await confirm({
            title: "Add book..",
            message: 'Add ' + book.title + 'to collection?',
            okButtonText: "OK",
            cancelButtonText: "Cancel"
        })
        if(res){
            let nBook = {
                title:book.title,
                year: new Date(Date.parse(book.publishedDate)),
                author: book.authors.toString(),
                description:book.description,                
                img: book.thumb,
                uid: $user.uid
            }
            let addDoc = $db.collection('books').add(nBook).then(ref => {
                console.log('Added document with ID: ', ref.id)
                closeModal()
            })
        }
    }

    const auto = () => {
        if(query.length > 2){
            let res = fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=8`)
            .then(res => {
                if (!res.ok) {
                    throw Error(res);
                }
                return res.json()
            })
            .then(json => {
                results = []
                json.items.forEach(element => {
                    let img = element.volumeInfo.imageLinks
                    ? 'https' + element.volumeInfo.imageLinks.thumbnail.substr(4)
                    : ''
                    results = [...results, {thumb: img,...element.volumeInfo}]  
                })
            })
            .catch(err => console.log('fetch error', err))
            
        }else{
            results = []
        }
    } 
</script>

<style>
</style>