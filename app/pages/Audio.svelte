<stackLayout>
    <label text='audio man' class='h1 text-center' />
    <button on:tap={doRec} text='record' class='-primary' />
    <button on:tap={doPlay} text='play'/>
</stackLayout>

<script>
    const audio = require('nativescript-audio')
    import permissions from 'nativescript-permissions'

    import { File, knownFolders } from 'tns-core-modules/file-system';
    const audioFolder = knownFolders.currentApp().getFolder('recordings')
    const platform = require('tns-core-modules/platform')

    const playerOptions = {
        audioFile: audioFolder.path + '/recording.mp4',
        loop: false,
        completeCallback: function() {
            console.log('finished playing')
        },
        errorCallback: function(errorObject) {
            console.log('error: ', JSON.stringify(errorObject))
        },
        infoCallback: function(args) {
            console.log('info: ', JSON.stringify(args))
        }
    }


    const doRec = async () => {
        let recorder = new audio.TNSRecorder()
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
                console.log('playing... ')
            },
            errorCallback:e => {
                recorder.android.stop()
                console.log('error cb',e);
            }
        }

        try{
            await recorder.start(options)
            console.log('in theory recording')
            setTimeout(() => {
                console.log('calling stop');
                recorder.stop()
                .then(() => {
                    console.log('really done')
                })
                .catch(e => {
                    console.log('error stopping', e);
                });
            }, 3000);
        } catch (err) {
            console.log('catched: ', err)
        }
    }

    const doPlay = () => {
        const player = new audio.TNSPlayer();
        player
            .playFromFile(playerOptions)
            .then(function(res) {
                console.log('should be void', res);
            })
            .catch(function(err) {
                console.log('something went wrong...', err);
            })
    }
    </script>