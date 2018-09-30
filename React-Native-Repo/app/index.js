import React from "react";
import {Image} from "react-native";
import { CreateRootNavigator } from "./router";
import { isSignedIn } from "./auth";
import {SignedIn} from "./router"




export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            signedIn: false,
            checkedSignIn: false
        };
    }

    componentDidMount() {
        isSignedIn()
            .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
            .catch(err => alert("An error occurred"));
    }

    render() {
        const { checkedSignIn, signedIn } = this.state;

        // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
        if (!checkedSignIn) {
            return null;
        }

        // const Layout = createRootNavigator(signedIn);
        // return <TakePhoto/>
        // return <Camera/>
        // return <Camera2/>
        // return <Layout />;
        return <SignedIn/>
        // return <Capture/>
    }
}