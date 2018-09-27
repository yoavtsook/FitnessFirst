import React from "react";
import { ScrollView, Text, Linking, View } from "react-native";
import { Card, Button } from "react-native-elements";
import ExercisesData from '../data/ExercisesData'


export default () => (
    <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
            {ExercisesData.absExercisesData.map(({ name, image, url, key }) => (
                <Card
                    title={`Exercise ${key}`}
                    image={image}
                    key={key}>
                    <Text style={{ marginBottom: 10 }}>
                        {name}.
                    </Text>
                    <Button
                        backgroundColor="#03A9F4"
                        title="VIEW NOW"
                        onPress={() => Linking.openURL(url)}
                    />
                </Card>
            ))}
        </ScrollView>
    </View>
);