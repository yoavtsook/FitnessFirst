import React from "react";
import { ScrollView, Text, Linking, View } from "react-native";
import { Card, Button } from "react-native-elements";
import ExercisesData from '../data/ExercisesData'


export default () => (
    <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
            {ExercisesData.shouldersExercisesData.map(({ name, image, url, key }) => (
                <Card
                    title={name}
                    image={image}
                    key={key}>
                    <Button
                        backgroundColor="#03A9F4"
                        title="CAPTURE YOURSELF"
                        onPress={() => Linking.openURL(url)}
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
);