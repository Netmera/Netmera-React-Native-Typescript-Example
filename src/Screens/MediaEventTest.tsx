import React from "react";
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../Colors";

const MediaEventTest = () => {

    const eventContentComment = () => {

    }

    const eventContentRate = () => {

    }

    const eventLogin = () => {

    }


    const eventContentView = () => {

    }

    const eventRegister = () => {

    }
    const eventSearch = () => {

    }

    const eventShare = () => {

    }

    const buttons = [
        {
            name: 'EVENT CONTENT COMMENT',
            method: eventContentComment
        },
        {
            name: 'EVENT CONTENT RATE',
            method: eventContentRate
        },
        {
            name: 'EVENT CONTENT VIEW',
            method: eventContentView
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

export default MediaEventTest;
