import React from "react";
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../Colors";

const CommerceEventTest = () => {

    const eventCartAddProduct = () => {

    }

    const eventCartRemoveProduct = () => {

    }

    const eventCartView = () => {

    }

    const eventLogin = () => {

    }

    const eventProductComment = () => {

    }
    const eventProductRate = () => {

    }

    const eventProductView = () => {

    }

    const eventPurchase = () => {

    }

    const buttons = [
        {
            name: 'EVENT CART ADD PRODUCT',
            method: eventCartAddProduct
        },
        {
            name: 'EVENT CARt REMOVE PRODUCT',
            method: eventCartRemoveProduct
        },
        {
            name: 'EVENT CART VIEW',
            method: eventCartView
        },
        {
            name: 'EVENT ORDER CANCEL',
            method: eventLogin
        },
        {
            name: 'EVENT PRODUCT COMMENT',
            method: eventProductComment
        },
        {
            name: 'EVENT PRODUCT RATE',
            method: eventProductRate
        },
        {
            name: 'EVENT PRODUCT VIEW',
            method: eventProductView
        },
        {
            name: 'EVENT PURCHASE',
            method: eventPurchase
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

export default CommerceEventTest;
