'use strict';

const SERVER_IP = "http://18.195.153.19:5000/";
const IMG_DIR_IP = SERVER_IP + "uploads/";
const IMG_NAME = "great.jpeg"
const IMG_TO_GET = IMG_DIR_IP + IMG_NAME

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Image
} from 'react-native';
import { RNCamera } from 'react-native-camera';

const wait = time => new Promise((resolve) => setTimeout(resolve, time));

export default class Capture extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader: false,
            showImgResponse: false,
            showLoadingImg: false
        }
    }

    render() {
        if(this.state.showImgResponse){
            return(
                //TODO: Both buttons take back to capture mode - needs to implement "back to home screen"
                <View style={styles.container}>
                    <Image ref={"responseImage"}
                           style={ styles.preview }
                           source={{ uri: IMG_TO_GET }}
                    />
                    <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
                        <TouchableOpacity
                            title="Take Again"
                            onPress={() => {
                                this.setState(() => ({
                                    showImgResponse: false,
                                    loader: false

                                }));
                            }}
                            style = {styles.capture}
                            >
                            <Text style={{fontSize: 14}}> Take Again </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            title="back to Home Screen"
                            onPress={() => {
                                // this.props.backToScreen();
                                this.setState(() => ({
                                    showImgResponse: false,
                                    loader: false

                                }));
                            }}
                            style = {styles.capture}
                        >
                            <Text style={{fontSize: 14}}> Back To Screen </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                {this.state.showLoadingImg ? <Image
                    style={styles.preview}
                    source={require('../data/images/loading-image.jpg')}
                /> :
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style = {styles.preview}
                    type={RNCamera.Constants.Type.back}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                /> }
                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
                    <TouchableOpacity
                        onPress={() =>{
                            this.setState(() => ({
                                loader: true,
                                // showLoadingImg: true
                            }));

                            this.takePicture().then( (dataUri) => {
                                this.setState(() => ({
                                    showLoadingImg: true
                                }));
                                this.postRequestForServer(dataUri, IMG_NAME).then((response) => {
                                        this.setState(() => ({
                                            showLoadingImg: false,
                                            showImgResponse: true
                                        }));
                                    });
                            });
                            }
                        }

                        // onPress={this.takePicture.bind(this)}
                        style = {styles.capture}
                    >
                        <Text style={{fontSize: 14}}> Pump it up! </Text>
                    </TouchableOpacity>
                    {this.state.loader ? <ActivityIndicator size="large" color="#0000ff" /> : false}
                </View>
            </View>
        );
    }

    takePicture = async function() {
        if (this.camera) {
            const options = {base64: true };
            const data = await this.camera.takePictureAsync(options)
            return data.uri;
        }
    };


    postRequestForServer = async function(image_path, image_name) {

        try {
            console.log(">>>this is the image path for request: " + image_path);

            const imageData = new FormData();
            imageData.append('name', 'requestFromApp')
            imageData.append('file', {
                uri: image_path,
                type: 'image/jpeg',
                name: image_name
            });


            return await fetch(SERVER_IP, {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'image/webp',
                                            'Accept-Encoding': 'gzip',
                                            'Content-Type': 'multipart/form-data',
                                            'Enctype' : 'multipart/form-data',
                                            'secret_key': 'postpc'
                                        },
                                        body: imageData
                                    });

        } catch (error){
            console.error("error in post request: " + error)
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    }
});
