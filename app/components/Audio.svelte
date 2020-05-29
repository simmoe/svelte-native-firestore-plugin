{#if audiofile}
        {#if !playing}
            <button on:tap={doPlayURL} class='text-left'>
                <span  text="&#xf144;" class="fas fa-play-circle black" />
            </button>
        {:else}
            <button on:tap={doPlayURL} class='text-left'>
                <span  text="&#xf28d;" class="fas fa-stop-circle black" />
            </button>
        {/if}
    {#if mode != 'player'}
        <button class='-outline' on:tap={ () => audiofile = null} text='delete recording'/>
    {/if}
{:else if mode != 'player'}
<flexboxLayout class='centered'>
    <button on:tap={ () => recording = !recording }>
        <formattedString>
            <span text="&#xf130;" class="fas mic {recording?'rec':''}" />
        </formattedString>
    </button>
    {#if recfinished}
         <!-- content here -->
        <button on:tap={doPlayLocal} text='play'/>
    {/if}

</flexboxLayout>
<stackLayout class='{recfinished ? 'show' : 'hide'}'>
    <button text='upload' on:tap={doUpload} />
</stackLayout>
{/if}

<script>
    var firebase = require("nativescript-plugin-firebase")
    const audio = require('nativescript-audio')
    import permissions from 'nativescript-permissions'
    import { File, knownFolders } from 'tns-core-modules/file-system';
    const audioFolder = knownFolders.currentApp().getFolder('recordings')
    const platform = require('tns-core-modules/platform')
    export let audiofile
    //if the module is only used to play files, mode is set to 'player'
    export let mode 

    let recording = false
    let playing = false
    // let exists = fileSystemModule.File.exists(audioFolder.path + '/recording.mp4')

    $: if(recording)  doRec() 
    $: if(!recording && recorder)  doStop() 

    let recfinished = false

    let player 
    const doPlayLocal = () => {
        let playerOptions = {
            audioFile: audioFolder.path + '/recording.mp4',
            loop: false,
            completeCallback: () => playing = false,
            errorCallback: errorObject => console.log('error: ', JSON.stringify(errorObject)),
            infoCallback: args => console.log('info: ', JSON.stringify(args))
        }
        player = new audio.TNSPlayer();
        player
        .playFromFile(playerOptions)
        .then( res => playing = true)
        .catch( err => console.log('something went wrong...', playerOptions))
    }
    const doPlayURL = () => {
        if(player && player.isAudioPlaying()){
            playing = false
            player.pause()
            return
        }
        let playerOptions = {
            audioFile: audiofile,
            loop: false,
            completeCallback: () => playing = false,
            errorCallback: errorObject => console.log('error: ', JSON.stringify(errorObject)),
            infoCallback: args => console.log('info: ', JSON.stringify(args))
        }
        player = new audio.TNSPlayer();
        playing = true
        player
        .playFromUrl(playerOptions)
        .then( res =>  playing = true)
        .catch( err => console.log('something went wrong...', playerOptions))
    }

    let recorder
    const doRec = async () => {
        recorder = new audio.TNSRecorder()
        let androidFormat;
        let androidEncoder;
        if (platform.device.os == 'Android') {
            permissions.requestPermission(android.Manifest.permission.RECORD_AUDIO, "I need these permissions because I'm cool")
            .then( () => {
                console.log("Woo Hoo, I have the power!");
            })
            .catch( () => {
                console.log("Uh oh, no permissions - plan B time!");
            });
            androidFormat = 2
            androidEncoder = 3        
        }

        let options = {
            filename:audioFolder.path + '/recording.mp4',
            format:androidFormat,
            encoder:androidEncoder,
            infoCallback:info => {
                //for some reason this callback must be impplemented
            },
            errorCallback:e => {
                recorder.android.stop()
                console.log('error cb',e);
            }
        }

        try{
            await recorder.start(options)
        } catch (err) {
            console.log('catched: ', err)
        }
}

const doStop = () => {
    console.log('calling stop');
    recorder.stop()
    .then(() => {
        console.log('really done')
        recfinished = true
    })
    .catch(e => {
        console.log('error stopping', e);
    });

}

const doUpload = () => {
    let metadata = {
        contentType: "audio/mp4",
        contentLanguage: "da",
    }
  let filename = new Date()
  // now upload the file with either of the options below:
  firebase.storage.uploadFile({
    // the full path of the file in your Firebase storage (folders will be created)
    remoteFullPath: 'audio/' + filename + '.mp4',
    // option 2: a full file path (ignored if 'localFile' is set)
    localFullPath: audioFolder.path + '/recording.mp4',
    // get notified of file upload progress
    metadata,
    onProgress: function(status) {
      console.log("Uploaded fraction: " + status.fractionCompleted);
      console.log("Percentage complete: " + status.percentageCompleted);
    }
  }).then(
      function (uploadedFile) {
        console.log("File uploaded: " + JSON.stringify(uploadedFile));
        firebase.storage.getDownloadUrl({
            // the full path of an existing file in your Firebase storage
            remoteFullPath: 'audio/' + filename + '.mp4',
        }).then(
            function (url) {
                console.log("Remote URL: " + url);
                audiofile = url
            },
            function (error) {
                console.log("Error: " + error);
            }
        );
      },
      function (error) {
        console.log("File upload error: " + error);
      }
  );
}



</script>

<style>
    .hide{
        visibility:collapsed;
    }
    .show{
        visibility:visible;
    }
    .mic{
        font-size:32;
    }
    .rec{
        color:orangered;
    }
</style>