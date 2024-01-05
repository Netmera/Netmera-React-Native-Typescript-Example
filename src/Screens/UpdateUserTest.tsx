import React, {useReducer, useState} from "react";
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Colors from "../Colors";
import DatePicker from "react-native-date-picker";

interface UpdateUserEvents {
    email?: string;
    maleFemale?: string;
    msisdn?: string;
    name?: string;
    segments?: string;
    surname?: string;
    uniqueUserID?: string;
}
const placeholders = {
    date: 'Date of Birth (dd-MM-yyyy)',
    email: 'Email',
    maleFemale: 'MALE:0, FEMALE:1, NOYB:2',
    msisdn: 'Msisdn',
    name: 'Name',
    segments: 'Segments i.e seg1, seg2',
    surname: 'Surname',
    uniqueUserID: 'Unique User ID'
}

const UpdateUserTest = () => {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false)
    const [event, updateEvent] = useReducer(
        (prev: UpdateUserEvents, next: UpdateUserEvents) => {
            return {...prev, ...next};
        },
        {
            email: '',
            maleFemale: '',
            msisdn: '',
            name: '',
            segments: '',
            surname: '',
            uniqueUserID: ''
        },
    );

    const formattedDate = (date: Date) => {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    const onSetDatePress = () => {
        setOpen(true);
    }

    const renderTextInput = (placeholder: string, setValue: (text: string) => void, value: string | undefined, ) => {
        return(
            <View style={styles.inputArea}>
                <TextInput
                    value={value}
                    onChangeText={setValue}
                    placeholder={placeholder}
                    style={styles.placeholder}/>
                <View style={styles.divider}/>
            </View>
        );
    }

    const updateUserAsync = () => {

    }

    const updateUserSync = () => {

    }

    return(
        <SafeAreaView style={styles.container}>
            {renderTextInput(placeholders.uniqueUserID, (text: string) => updateEvent({uniqueUserID: text}), event.uniqueUserID)}
            {renderTextInput(placeholders.name, (text: string) => updateEvent({name: text}), event.name)}
            {renderTextInput(placeholders.surname, (text: string) => updateEvent({surname: text}), event.surname)}
            <View style={styles.dateContainer}>
                <Text style={styles.date}>{date !== null ? formattedDate(date): placeholders.date}</Text>
                <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={onSetDatePress}>
                    <Text style={styles.buttonText}>SET DATE</Text>
                </TouchableOpacity>
            </View>
            <DatePicker
                modal
                mode={"date"}
                open={open}
                date={date}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
            {renderTextInput(placeholders.email, (text: string) => updateEvent({email: text}), event.email)}
            {renderTextInput(placeholders.msisdn, (text: string) => updateEvent({msisdn: text}), event.msisdn)}
            {renderTextInput(placeholders.maleFemale, (text: string) => updateEvent({maleFemale: text}), event.maleFemale)}
            {renderTextInput(placeholders.segments, (text: string) => updateEvent({segments: text}), event.segments)}
            <TouchableOpacity style={[styles.button, {marginHorizontal: 15, marginTop: 15}]} activeOpacity={0.6} onPress={updateUserAsync}>
                <Text style={styles.buttonText}>UPDATE USER ASYNC</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {marginHorizontal: 15, marginTop: 15}]} activeOpacity={0.6} onPress={updateUserSync}>
                <Text style={styles.buttonText}>UPDATE USER SYNC</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 4,
        alignItems:"center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal:20,
        backgroundColor: Colors.primary
    },

    buttonText: {
        fontWeight: '600',
        fontSize: 13,
        color: Colors.white
    },

    container: {
        flex: 1
    },

    date: {
        textAlign:"center",
    },

    dateContainer: {
        marginTop: 15,
        marginHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems:"center",
    },

    divider: {
        height: 1,
        backgroundColor: Colors.black,
        opacity: 0.6,
        paddingHorizontal: 50
    },

    inputArea: {
        marginTop: 20,
        paddingHorizontal: 20,
    },

    placeholder: {
        fontWeight: '400',
        fontSize: 15,
        color: Colors.black,
        opacity: 0.7
    }
});

export default UpdateUserTest;
