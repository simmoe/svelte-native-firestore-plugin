<frame id='edit'>
<page actionBarHidden={true}>
<stackLayout class='centered'>
    <textField bind:text="{book.title}" hint='title'/>
    <textField bind:text="{book.author}" hint='author'/>
    <textView style='height:100' bind:text="{book.description}" hint='description'/>
    <datePicker bind:date="{book.year}" />
    <button class='-primary' text='save' on:tap={update}/>
    <button text='cancel' on:tap={closeModal} />
</stackLayout>
</page>>
</frame>

<script>
    import { closeModal } from 'svelte-native'
    import { db } from '../stores/stores.js'
    export let book
    const update = () => {
        $db.collection("books").doc(book.id).update(book)
        closeModal()
    }
</script>

<style>
</style>