import React from 'react';
import { Dimensions, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CaptureButton from './CaptureButton.js'

export default class Camera extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            identifedAs: '',
            loading: false
        }
    }

    takePicture = async function(){

        if (this.camera) {

            // Pause the camera's preview
            this.camera.pausePreview();

            // Set the activity indicator
            this.setState((previousState, props) => ({
                loading: true
            }));

            // Set options
            const options = {
                base64: true
            };



            // Get the base64 version of the image
            const imageData = await this.camera.takePictureAsync(options)

            // Send image to lambda
            this.putImageToServer(imageData)
            // this.identifyImage(data.base64);
        }
    };

    putImageToServer(imageData){

        this.setState((prevState, props) => ({
            loading:false
        }));

        this.camera.resumePreview();

        return fetch('https://8wpnszhzr7.execute-api.eu-central-1.amazonaws.com/preprod', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstParam: 'Ran',
                secondParam: 'You made it',
                image: imageData.base64
            }),
        }).then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
    }


    render() {
        return (
            <RNCamera ref={ref => {this.camera = ref;}} style={styles.preview}>
                <ActivityIndicator size="large" style={styles.loadingIndicator} color="#fff" animating={this.state.loading}/>
                <CaptureButton buttonDisabled={this.state.loading} onClick={this.takePicture.bind(this)}/>
            </RNCamera>
        );
    }
}

const styles = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    loadingIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
