'use strict';
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
                            wait(3000).then(() => this.setState(() => ({showImgResponse: true})));

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
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options)
            console.log(data.uri);
        }
    };
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
