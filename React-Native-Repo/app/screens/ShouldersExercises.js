import React from "react";
import { ScrollView, Text, Linking, View } from "react-native";
import { Card, Button } from "react-native-elements";
import ExercisesData from '../data/ExercisesData'
import Capture from '../Camera/Capture'
import {CreateRootNavigator} from '../router'
import Camera from "../Camera/Camera";
import {isSignedIn} from "../auth";

export default class ShouldersExercises extends React.Component
{
    constructor(props){
        super(props);
        this.state = {
            showCamera: false
        }
    }



    render() {
        if(this.state.showCamera){
            return <Capture backToScreen={() => this.setState({showCamera:false})}/>
        }
        return (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingVertical: 20}}>
                {ExercisesData.shouldersExercisesData.map(({name, image, url, key}) => (
                    <Card
                        title={name}
                        image={image}
                        key={key}>
                        <Button
                            backgroundColor="#03A9F4"
                            title="CAPTURE YOURSELF"
                            onPress={() => this.setState({showCamera:true})}
                        />
                        <View/>
                        <Button
                            backgroundColor="#03A9F4"
                            title="WATCH INSTRUCTOR VIDEO"
                            onPress={() => Linking.openURL(url)}
                        />
                    </Card>
                ))}
            </ScrollView>
        </View>
        )}
}