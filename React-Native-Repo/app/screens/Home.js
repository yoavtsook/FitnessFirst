import React from "react";
import { ScrollView, Text, Linking, View } from "react-native";
import { Card, Button } from "react-native-elements";
import ExercisesData from '../data/ExercisesData'


export default () => (
    <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
            {ExercisesData.backExercisesData.map(({ name, image, url, key }) => (
                <Card
                    title={`CARD ${key}`}
                    image={image}
                    key={key}>
                    <Text style={{ marginBottom: 10 }}>
                        Photo by {name}.
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