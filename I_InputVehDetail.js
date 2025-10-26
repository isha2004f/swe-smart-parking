import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

class I_InputVehDetail{
    static Display({ navigation }) {
        const [selectedVeh, setSelectedVeh] = useState(null);
    
        return (
            <SafeAreaProvider>
                <SafeAreaView>
                    <VehDropDown onSelect={setSelectedVeh} />
                    <VehLicensePlate />
                    <NextButton navigation={navigation} selectedVeh={selectedVeh} />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }
}

export default I_InputVehDetail.Display;

// To simplify the code, for button
const GoToAvailability = (navigation, selectedVeh) => {
    // AvC2- Get the array of carpark

    // Example
    const data = [
        { carkparkID: "A1", carparkAddress: "Carpark1" },
        { carkparkID: "A2", carparkAddress: "Carpark2" },
    ];
    navigation.navigate("I_Availability", { carparkList: data, vehicleType: selectedVeh });
};

const VehType = [
    { label: "Car", value: "Car" },
    { label: "Motorcycle", value: "Motorcycle" }
];

const VehDropDown = ({ onSelect }) => {
    const [selectedVeh, setSelectedVeh] = useState(null);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Vehicle Type:</Text>
            
            <Dropdown
                style={styles.dropdown}
                data={VehType}
                labelField="label"
                valueField="value"
                placeholder="Select vehicle"
                value={selectedVeh}
                onChange={(item) => {
                    setSelectedVeh(item.value);
                    onSelect(item.value);
                }}
            />
    
            {selectedVeh && (
                <Text style={styles.selectedText}>Selected: {selectedVeh}</Text>
            )}
        </View>
    );
};

const VehLicensePlate = () => {
    const [licensePlate, setLicensePlate] = useState("");

    return (
        <TextInput
            style={styles.input}
            onChangeText={setLicensePlate}
            value={licensePlate}
            placeholder="License Plate"
        />
    );
};

const NextButton = ({ navigation, selectedVeh }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => { GoToAvailability(navigation, selectedVeh) }}>
            <Text>Continue</Text>
        </TouchableOpacity>
    );
};

// export default function I_InputVehDetail({ navigation }) {
//     const [selectedVeh, setSelectedVeh] = useState(null);

//     return (
//         <SafeAreaProvider>
//             <SafeAreaView>
//                 <VehDropDown onSelect={setSelectedVeh} />
//                 <VehLicensePlate />
//                 <NextButton navigation={navigation} selectedVeh={selectedVeh} />
//             </SafeAreaView>
//         </SafeAreaProvider>
//     );
// }

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        margin: 5,
        padding: 10,
        backgroundColor: "lightblue",
        width: 100,
        borderWidth: 1,
    },
    container: {
        margin: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    dropdown: {
        height: 50,
        width: 200,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,  
    },
    selectedText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "blue",
    },
});