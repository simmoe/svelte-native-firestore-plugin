<cardView elevation='8' margin='12' shadowRadius='2'>               
<gridLayout columns='*,120' class='book'>
    <stackLayout class='book-info' column='0' on:tap={options}>
        <label text='{book.title}' class='h3' />
        <label text='{book.author}' class='body' />
        <Audio audiofile={book.audiofile} mode='player'/>
        <label text='{new Date(book.year).getFullYear()}' class='footnote' />
        <label text='{book.description}' class='footnote' />
    </stackLayout>
    <stackLayout column='1'>    
    {#if book.img}
        <image src='{book.img}' stretch='cover' />
    {/if}
    </stackLayout>
</gridLayout>     
</cardView>

<script>
    import { showModal } from 'svelte-native'
    import { action } from '@nativescript/core/ui/dialogs'
    import { db } from '../stores/stores'
    import Edit from '../modals/Edit.svelte'
    import Audio  from './Audio.svelte'

    export let book

    const options = async () => {
        let res = await action('Your message', 'Cancel',  ['edit', 'delete'])
        switch(res){
            case 'delete': del();break;
            case 'edit': 
            const edit = await showModal({
                frame:'edit',
                fullscreen:true,
                props:{book:book},
                page:Edit
            })
            break
        }
    }
    const del = () => {
        $db.collection("books").doc(book.id).delete()
    }

</script>

<style>
    .book{
        width:100%;
        background: white;
    }
    .book-info{
        padding:24;
    }
</style>