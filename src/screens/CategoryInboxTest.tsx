import React, {useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Colors from "../Colors";

export interface DoubleButtonGroup {
    firstButtonText: string;
    firstButtonEvent: () => void;
    secondButtonText: string;
    secondButtonEvent: () => void
}

const CategoryInboxTest = () => {

    const numbersArray = Array.from({ length: 20 }, (_, index) => index + 1);
    const [categoryState, setCategoryState] = useState(1)
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const squareCheckBoxes = [
        {
            isCircle: false,
            label: 'READ'
        },
        {
            isCircle: false,
            label: 'UNREAD'
        }
    ];

    const circleCheckBoxes = [
        {
            isCircle: true,
            label: 'READ'
        },
        {
            isCircle: true,
            label: 'UNREAD'
        },
        {
            isCircle: true,
            label: 'DELETED'
        },
    ];

    const fetchInbox = () => {

    }

    const fetchNextPage = () => {

    }

    const setInboxStatusForCategories = () => {

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

    return(
        <View style={styles.container}>
            <View style={styles.verticalComponentGroup}>
                {
                    squareCheckBoxes.map((item, index)=>{
                        return(
                            <CheckBox isChecked={isChecked} isCircle={item.isCircle} key={index} label={item.label} onCheckPress={()=>setIsChecked(!isChecked)}/>
                        );
                    })
                }
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
                {
                    circleCheckBoxes.map((item, index)=> {
                        return(
                            <CheckBox isChecked={isChecked} isCircle={item.isCircle} key={index} label={item.label} onCheckPress={()=>setIsChecked(!isChecked)}/>
                        );
                    })
                }
            </View>
            <TouchableOpacity style={[styles.button, {flex: 0, marginHorizontal: 15}]} activeOpacity={0.6} onPress={setInboxStatusForCategories}>
                <Text style={styles.buttonText}>SET INBOX STATUS FOR CATEGORIES</Text>
            </TouchableOpacity>
        </View>
    );
}
const CheckBox = (props:{isChecked: boolean, isCircle: boolean, key:number, label:string, onCheckPress: () => void}) => {
    return(
        <View style={[styles.checkBoxContainer, props.isChecked ? {borderColor: Colors.orange}:{borderColor: Colors.black}]}>
            <TouchableOpacity style={props.isCircle? styles.circle :styles.checkBoxSquare} onPress={props.onCheckPress}>
                {
                    //TODO: Icon will be added
                }
            </TouchableOpacity>
            <Text style={styles.checkBoxText}>{props.label}</Text>
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

export default CategoryInboxTest;
