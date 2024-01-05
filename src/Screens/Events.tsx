import React from "react";
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../Colors";

const Events = () => {

    const customTextEvent = () => {

    }

    const loginEvent = () => {

    }

    const purchaseEvent = () => {

    }

    const registerEvent = () => {

    }

    const viewCardEvent = () => {

    }

    const buttons = [
        {
            name: 'LOGIN EVENT',
            method: loginEvent
        },
        {
            name: 'REGISTER EVENT',
            method: registerEvent
        },
        {
            name: 'VIEW CARD EVENT',
            method: viewCardEvent
        },
        {
            name: 'PURCHASE EVENT',
            method: purchaseEvent
        },
        {
            name: 'CUSTOM TEXT EVENT',
            method: customTextEvent
        },
    ];
    return(
        <SafeAreaView style={styles.container}>
            {
                buttons.map((item, index)=> {
                    return(
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
      justifyContent: "center"
    },

    text: {
        fontWeight: '600',
        fontSize: 13,
        color: Colors.white
    }
});

export default Events;
