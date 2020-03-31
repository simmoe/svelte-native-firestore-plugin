<cardView elevation='8' margin='12' shadowRadius='2'>                    
    <stackLayout class='book' on:tap={options}>
        <label text='{book.title}' class='h3' />
        <label text='{book.author}' class='body' />
        <label text='{new Date(book.year).getFullYear()}' class='footnote' />
        <label text='{book.description}' class='footnote' />
    </stackLayout>
</cardView>

<script>
    import { showModal } from 'svelte-native'
    import { action } from '@nativescript/core/ui/dialogs'
    import { db } from '../stores/stores'
    import Edit from '../modals/Edit.svelte'

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
        console.log('deleting: ', book.title)
        $db.collection("books").doc(book.id).delete()
    }

</script>

<style>
    .book {
        width:100%;
        animation: fadeIn 1s;
        /* animation-name: leftIn; */
        /* animation-name: scaleIn; */
        padding:24;
        background: white;
    }

</style>