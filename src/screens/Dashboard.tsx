import React, {useEffect, useState} from "react";
import {
    Platform,
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

const enum PopUpPresentationState {
    EnablePopUpPresentation = 'EnablePopUpPresentation',
    DisablePopUpPresentation = 'DisablePopUpPresentation',
}

const Dashboard = ({navigation}: any) => {
    const [pushState, setPushState] = useState<PushState>(PushState.DisablePush);
    const [popUpPresentationState, setPopUpPresentationState] = useState<PopUpPresentationState>(PopUpPresentationState.DisablePopUpPresentation);

    useEffect(() => {
        if (Platform.OS === 'ios') {
            Netmera.requestPushNotificationAuthorization();
        }
    }, [])

    useEffect(() => {
        if(popUpPresentationState === PopUpPresentationState.DisablePopUpPresentation){
            Netmera.disablePopupPresentation();
        } else {
            Netmera.enablePopupPresentation();
        }
    }, [popUpPresentationState]);

    useEffect(() => {
        if(pushState === PushState.DisablePush){
            Netmera.disablePush();
        } else {
            Netmera.enablePush();
        }
    }, [pushState]);

    const coupons = () => {
        navigation.navigate("Coupons");
    }

    const currentExternalId = async () =>
        Toast.show({
            type: 'info',
            text1: "Current External Id: " + await Netmera.currentExternalId(),
            position: "bottom",
        });

    const disableData = () => {
        Netmera.stopDataTransfer();
    }

    const disablePopUpPresentation = () => {
        setPopUpPresentationState(popUpPresentationState === PopUpPresentationState.DisablePopUpPresentation ? PopUpPresentationState.EnablePopUpPresentation: PopUpPresentationState.DisablePopUpPresentation);
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

    const events = () => {
        navigation.navigate("Events");
    }

    const isPushEnabled = async () =>
        Toast.show({
            type: 'info',
            text1: "Is Push Enabled: " + await Netmera.isPushEnabled(),
            position: "bottom",
        });
    const setNetmeraMaxActiveRegion = () => {
        Netmera.setNetmeraMaxActiveRegions(10)
    }

    const toastPushTest = () =>
        Toast.show({
            type: 'info',
            text1: `Pushtoken :: \`${Token?.token?.pushToken}\``,
            position: "bottom",
        });

    const turnOffSendingEventAndUserUpdate = () => {
        Netmera.turnOffSendingEventAndUserUpdate(false)
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
            name: 'CURRENT EXTERNAL ID',
            method: currentExternalId
        },
        {
            name: 'EVENTS',
            method: events
        },
        {
            name: 'IS PUSH ENABLED',
            method: isPushEnabled
        },
        {
            name: pushState === PushState.EnablePush ? 'ENABLE PUSH': 'DISABLE PUSH',
            method: disablePush
        },
        {
            name: popUpPresentationState === PopUpPresentationState.EnablePopUpPresentation ? 'ENABLE PRESENTATION STATE': 'DISABLE PRESENTATION STATE',
            method: disablePopUpPresentation
        },
        {
            name: 'SET NETMERA MAX ACTIVE REGION',
            method: setNetmeraMaxActiveRegion
        },
        {
            name: 'TOAST PUSH TOKEN',
            method: toastPushTest
        },
        {
            name: 'TURN OFF SENDING EVENT AND USER UPDATE',
            method: turnOffSendingEventAndUserUpdate
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
        marginHorizontal: 15,
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
        marginHorizontal: 15,
    }
});
export default Dashboard;
