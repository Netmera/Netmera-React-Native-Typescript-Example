import React, {useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../Colors";
import SelectDropdown from "react-native-select-dropdown";
import {NMInboxStatus} from "react-native-netmera";

export interface DoubleButtonGroup {
    firstButtonText: string;
    firstButtonEvent: () => void;
    secondButtonText: string;
    secondButtonEvent: () => void
}

const PushInboxTest = () => {
    const numbersArray = Array.from({ length: 20 }, (_, index) => index + 1);

    const [categoryState, setCategoryState] = useState(1)

    const fetchInbox = () => {

    }

    const fetchNextPage = () => {

    }

    const setAllInboxStatus = () => {

    }

    const setInboxStatus = () => {

    }

    const renderDoubleButtons = (parameters: DoubleButtonGroup) => {
        return(
            <View style={styles.doubleButtonsContainer}>
                <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={parameters.firstButtonEvent}>
                    <Text style={styles.buttonText}>{parameters.firstButtonText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={parameters.secondButtonEvent}>
                    <Text style={styles.buttonText}>{parameters.secondButtonText}</Text>
                </TouchableOpacity>
            </View>

        );
    }

    const renderCheckBox = ( isCircle: boolean, label: string) => {
        return(
            <View style={styles.checkBoxContainer}>
                <TouchableOpacity style={isCircle? styles.circle :styles.checkBoxSquare}>
                    {
                        //TODO: Icon will be added
                    }
                </TouchableOpacity>
                <Text style={styles.checkBoxText}>{label}</Text>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <View style={styles.verticalComponentGroup}>
                {renderCheckBox(false, 'READ')}
                {renderCheckBox( false, 'UNREAD')}
                <Text style={styles.text}>Page Size:</Text>
                <View style={styles.dropdownContainer}>
                    <SelectDropdown
                        data={numbersArray}
                        buttonStyle={styles.dropdown}
                        buttonTextStyle={{fontSize: 13}}
                        rowTextStyle={{fontSize: 13}}
                        dropdownStyle={{width: '10%'}}
                        dropdownIconPosition={"right"}
                        defaultValueByIndex={0}
                        onSelect={(value) => setCategoryState(value)}
                        buttonTextAfterSelection={(item: string) => item}
                        rowTextForSelection={(item) => {
                            return item
                        }}/>
                    {
                        //TODO: Icon will be added
                    }
                </View>
            </View>
            {renderDoubleButtons({
                firstButtonText: 'FETCH INBOX',
                firstButtonEvent: fetchInbox,
                secondButtonText: 'FETCH NEXT PAGE',
                secondButtonEvent: fetchNextPage
            })}
            <View style={[styles.verticalComponentGroup, {marginTop: 7}]}>
                {renderCheckBox(true, 'READ',)}
                {renderCheckBox(true, 'UNREAD')}
                {renderCheckBox(true, 'DELETED')}
            </View>
            {renderDoubleButtons({
                firstButtonText: 'SET ALL INBOX STATUS',
                firstButtonEvent: setAllInboxStatus,
                secondButtonText: 'SET INBOX STATUS',
                secondButtonEvent: setInboxStatus
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 15,
        borderRadius: 4,
        alignItems:"center",
        justifyContent: "center",
        paddingVertical: 10,
        flex:1,
        backgroundColor: Colors.primary
    },

    buttonText: {
        fontWeight: '600',
        fontSize: 13,
        color: Colors.white
    },

    checkBoxContainer: {
        flexDirection: 'row'
    },

    checkBoxText: {
        marginLeft: 8
    },

    checkBoxSquare: {
        width: 15,
        height: 15,
        borderWidth: 1.5,
        borderRadius: 2,
        borderColor: Colors.black
    },

    circle: {
        width: 15,
        height: 15,
        borderWidth: 1.5,
        borderRadius: 15,
        borderColor: Colors.black
    },

    container: {
    },

    doubleButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal:15
    },

    dropdown: {
        width: 80,
        height: 20
    },

    dropdownContainer: {
    },

    text: {

    },

    verticalComponentGroup: {
        marginTop: 15,
        alignItems:"center",
        justifyContent: 'space-evenly',
        flexDirection: "row"
    }
});

export default PushInboxTest;
