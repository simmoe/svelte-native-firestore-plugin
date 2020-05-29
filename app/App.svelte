<page>
<actionBar title='Books' backgroundColor='black' color='gray' />
<tabs tabsPosition='bottom' selectedIndex={selectedTab}>
    <tabStrip>    
        <tabStripItem><label text='collection' /></tabStripItem>
        <tabStripItem><label text='profile' /></tabStripItem>
    </tabStrip>
    <tabContentItem>
        <Books />
    </tabContentItem>
    <tabContentItem>
        <Login/>
    </tabContentItem>
</tabs>
</page>

<script>

    import { registerNativeViewElement } from 'svelte-native/dom'
    registerNativeViewElement("cardView", () => require("@nstudio/nativescript-cardview").CardView);
    import { user } from './stores/stores.js'
    import Login from './screens/Login.svelte'
    import Books from './screens/Books.svelte'    
    let selectedTab = 0
</script>

