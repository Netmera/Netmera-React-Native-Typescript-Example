import React, {useState} from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Toast from 'react-native-toast-message';
import Colors from "../Colors";
import {Netmera} from "react-native-netmera";
import {Token} from "../../NetmeraPushHeadlessTask";

const enum PushState {
    EnablePush= 'EnablePush',
    DisablePush = 'DisablePush'
}

const Dashboard = ({navigation}: any) => {

    const [pushState, setPushState] = useState<PushState>(PushState.DisablePush);

    const categoryInboxTest = () => {
        navigation.navigate("CategoryInboxTest");
    }

    const commerceEventTest = () => {
        navigation.navigate("CommerceEventTest");
    }

    const coupons = () => {
        navigation.navigate("Coupons");
    }

    const disableData = () => {
        Netmera.stopDataTransfer();
    }

    const disablePush = () => {
        setPushState(pushState === PushState.DisablePush ? PushState.EnablePush: PushState.DisablePush)
    }

    const enableData = () => {
        Netmera.startDataTransfer();
    }

    const enableLocationAndGeofence = () => {
        Netmera.requestPermissionsForLocation()
    }

    const enablePushNotification = () => {
        Netmera.enablePush();
    }

    const events = () => {
        navigation.navigate("Events");
    }

    const generalEventTest = () => {
        navigation.navigate("GeneralEventTest");
    }

    const mediaEventTest = () => {
        navigation.navigate("MediaEventTest");
    }

    const pushInboxTest = () => {
        navigation.navigate("PushInboxTest");
    }

    const toastPushTest = () =>
        Toast.show({
            type: 'info',
            text1: `Pushtoken :: \`${Token?.token?.pushToken}\``,
            position: "bottom",
        });


    const updateUserTest = () => {
        navigation.navigate("UpdateUserTest");
    }


    const buttons = [
        {
            name: 'ENABLE LOCATION & GEOFENCE',
            method: enableLocationAndGeofence
        },
        {
            name: 'COUPONS',
            method: coupons
        },
        {
            name: 'ENABLE PUSH NOTIFICATION',
            method: enablePushNotification
        },
        {
            name: 'EVENTS',
            method: events
        },
        {
            name: 'PUSH INBOX TEST',
            method: pushInboxTest
        },
        {
            name: 'CATEGORY INBOX TEST',
            method: categoryInboxTest
        },
        {
            name: 'UPDATE USER TEST',
            method: updateUserTest
        },
        {
            name: 'COMMERCE EVENT TEST',
            method: commerceEventTest
        },
        {
            name: 'MEDIA EVENT TEST',
            method: mediaEventTest
        },
        {
            name: 'GENERAL EVENT TEST',
            method: generalEventTest,
        },
        {
            name: pushState === PushState.EnablePush ? 'ENABLE PUSH': 'DISABLE PUSH',
            method: disablePush
        },
        {
            name: 'TOAST PUSH TOKEN',
            method: toastPushTest
        },
    ];


    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
                    <TouchableOpacity style={[styles.button,{flex: 1}]} activeOpacity={0.6} onPress={enableData}>
                        <Text style={styles.text}>ENABLE DATA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button,{flex: 1}]} activeOpacity={0.6} onPress={disableData}>
                        <Text style={styles.text}>DISABLE DATA</Text>
                    </TouchableOpacity>
                </View>
                {
                    buttons.map((item, index)=> {
                        return(
                            <TouchableOpacity style={styles.button} onPress={item.method} key={index} activeOpacity={0.6}>
                                <Text style={styles.text}>{item.name}</Text>
                            </TouchableOpacity>
                        );
                    })
                }
                <View style={styles.deviceTokenContainer}>
                    <Text style={[styles.text,{color: Colors.black}]}>DEVICE TOKEN</Text>
                </View>
                <Text style={[styles.tokenText]}>{Token?.token?.pushToken}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
        marginHorizontal: 15,
        borderRadius: 4,
        alignItems:"center",
        justifyContent: "center",
        paddingVertical: 10,
        backgroundColor: Colors.primary
    },

    container: {
        flex: 1
    },

    deviceTokenContainer: {
        flexDirection: "row",
        marginLeft: 15,
        marginTop: 5,
    },

    text: {
        fontWeight: '600',
        fontSize: 13,
        color: Colors.white
    },

    tokenText:{
        fontWeight: '300',
        fontSize: 13,
        color: Colors.black,
        marginLeft: 15,
    }
});
export default Dashboard;
