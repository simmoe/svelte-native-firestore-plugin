<gridLayout rows='32, 32, *'>    
    <flexboxLayout row='0' class='sort-menu' >
    {#if $user}
         <!-- content here -->
        <label text='title' on:tap={()=>order='title'}/>
        <label text='author' on:tap={()=>order='author'} />
    {/if}
    </flexboxLayout>
    <flexboxLayout row='1' class='add-menu centered' on:tap={addBook}>
        <label text="&#xf067;" class="fas fa-plus" />
    </flexboxLayout>
    <scrollView row='2'>
        <stackLayout class='container'>    
            <stackLayout class='books'>
                {#each $books as book}
                    <Book {book} />
                {:else}
                    <flexboxLayout class='centered'>
                    {#if !$user}
                        <label class='text-center' text='sign in to see your collection' />         
                    {:else}
                        <label class='text-center' text='you can now start adding books' />         
                         <!-- else content here -->
                    {/if}
                    </flexboxLayout>
                {/each}
            </stackLayout>
        </stackLayout>
    </scrollView> 
</gridLayout>        

<script>    
    const sortObjectsArray = require('sort-objects-array')
    import { showModal } from 'svelte-native'
    import Book from '../components/Book.svelte'
    import AddBook from '../modals/AddBook.svelte'
    import { books, user } from '../stores/stores.js'
    let order = 'title'

    const addBook = () => {
        showModal({
            frame:'add',
            fullscreen:true,
            page:AddBook

        })
    }

    $:  switch(order){
            case 'title': $books = sortObjectsArray($books, 'title'); break;
            case 'author': $books = sortObjectsArray($books, 'author'); break;
    }

</script>

<style>
    .sort-menu{
        align-items:center;
        justify-content:space-around;
    }
    .add-menu{
        background-color:black;
        color:white;
    }

</style>
