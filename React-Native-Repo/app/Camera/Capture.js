'use strict';

const SERVER_IP = "18.185.131.164:5000"

import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Image
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import ExercisesData from "../data/ExercisesData";
import {onSignIn} from "../auth";
import {Button} from "react-native-elements";
const wait = time => new Promise((resolve) => setTimeout(resolve, time));

export default class Capture extends Component {

    constructor(props){
        super(props);
        this.state = {
            loader: false,
            showImgResponse:false
        }
    }

    render() {
        if(this.state.showImgResponse){
            // TODO add image after getting response from the server
            return(
                <View style={styles.container}>
                    <Button
                        title="back to screen"
                        onPress={() => {
                            this.props.backToScreen();
                        }}
                    />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style = {styles.preview}
                    type={RNCamera.Constants.Type.back}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                />
                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
                    <TouchableOpacity
                        onPress={() =>{
                            this.setState(() => ({loader: true}));
                            // TODO change wait to fetch request to the server
                            this.takePicture().then( (dataUri) => {
                                this.postRequestForServer(dataUri).then((res) =>
                                { console.error("YOu R THE MAN" + res)});
                                // this.setState(() => ({showImgResponse: true}));
                            });


                            // this.props.backToScreen()
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

    postRequestForServer = async function(image_path) {

        try {
            console.log(">>>this is the image path for request: " + image_path);

            const imageData = new FormData();
            imageData.append('name', 'requestFromApp')
            imageData.append('photo', {
                uri: image_path,
                type: 'image/jpeg',
                name: 'ran'
            });

            return  await fetch(SERVER_IP, {
                                        method: 'POST',
                                        body: imageData
                                    });



        } catch (error){
            console.error("error in put request: " + error)
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
