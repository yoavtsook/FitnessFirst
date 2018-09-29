import React from "react";
import { Platform, StatusBar } from "react-native";
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator} from "react-navigation";
import { FontAwesome } from "react-native-vector-icons";
import {backExercisesData} from './data/ExercisesData'


import SignUp from "./screens/SignUpScreen";
import SignIn from "./screens/SignInScreen";
import AbsExercises from "./screens/AbsExercises";
import LegsExercises from "./screens/BackExercises";
import ShouldersExercises from "./screens/ShouldersExercises";
import Profile from "./screens/Profile";
import Capture from "./Camera/Capture";

const headerStyle = {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const SignedOut = createStackNavigator({
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            title: "Sign Up",
            headerStyle
        }
    },
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            title: "Sign In",
            headerStyle
        }
    }
});

export const SignedIn = createBottomTabNavigator(
    {
        AbsExercises: {
            screen: AbsExercises,
            navigationOptions: {
                tabBarLabel: "Abs",
            }
        },
        ShouldersExercises: {
            screen: ShouldersExercises,
            navigationOptions: {
                tabBarLabel: "Shoulders",
            }
        },
        LegsExercises: {
            screen: LegsExercises,
            navigationOptions: {
                tabBarLabel: "Legs",
            }
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                tabBarLabel: "Profile",
                // tabBarIcon: ({ tintColor }) => (
                //     <FontAwesome name="user" size={30} color={tintColor} />
                // )
            }
        }
    },
    {
        tabBarOptions: {
            style: {
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
            }
        }
    }
);

export const CreateRootNavigator = (signedIn = false) => {
    return createSwitchNavigator(
        {
            SignedIn: {
                screen: SignedIn

            },
            SignedOut: {
                screen: SignedOut
            }
        },
        {
            initialRouteName: signedIn ? "SignedIn" : "SignedOut"
        }
    );
};