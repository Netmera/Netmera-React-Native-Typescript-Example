import React from "react";
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../Colors";

const GeneralEventTest = () => {

    const eventBannerOpen = () => {

    }

    const eventCategoryView = () => {

    }

    const eventLogin = () => {

    }


    const eventInAppPurchase = () => {

    }

    const eventRegister = () => {

    }
    const eventSearch = () => {

    }

    const eventShare = () => {

    }

    const buttons = [
        {
            name: 'EVENT BANNER OPEN',
            method: eventBannerOpen
        },
        {
            name: 'EVENT CATEGORY VIEW',
            method: eventCategoryView
        },
        {
            name: 'EVENT IN APP PURCHASE',
            method: eventInAppPurchase
        },
        {
            name: 'EVENT LOGIN',
            method: eventLogin
        },
        {
            name: 'EVENT REGISTER',
            method: eventRegister
        },
        {
            name: 'EVENT SEARCH',
            method: eventSearch
        },
        {
            name: 'EVENT SHARE',
            method: eventShare
        },
    ];
    return (
        <SafeAreaView style={styles.container}>
            {
                buttons.map((item, index) => {
                    return (
                        <TouchableOpacity style={styles.button} onPress={item.method} key={index} activeOpacity={0.6}>
                            <Text style={styles.text}>{item.name}</Text>
                        </TouchableOpacity>
                    );
                })
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
        marginHorizontal: 35,
        borderRadius: 4,
        alignItems:"center",
        justifyContent: "center",
        paddingVertical: 10,
        backgroundColor: Colors.primary
    },

    container:{
        flex: 1,
        marginTop: 15
    },

    text: {
        fontWeight: '600',
        fontSize: 13,
        color: Colors.white
    }
});

export default GeneralEventTest;
