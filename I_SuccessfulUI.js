import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View, Animated, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { mainEntity } from "./entity/mainEntity";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

class I_SuccessfulUI {
    static Display({navigation}) {
        const ticket = mainEntity.getTicket();
        const [address, setAddress] = useState("");
        const [loading, setLoading] = useState(true);
        
        // Animation values
        const [fadeAnim] = useState(new Animated.Value(0));
        const [scaleAnim] = useState(new Animated.Value(0.9));
    
        useEffect(() => {
            // Fetch address
            fetch(`http://localhost:3000/CarparkAddress?carparkID=${ticket.parkingLotID}`)
                .then(response => response.json())
                .then(data => {
                    setAddress(data.carparkAddress);
                    setLoading(false);
                })
                .catch(error => {
                    setAddress("Error fetching address");
                    setLoading(false);
                });
    
            // Start animations
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                })
            ]).start();
        }, [ticket.parkingLotID]);
    
        const DetailRow = ({ icon, label, value }) => (
            <View style={styles.detailRow}>
                <MaterialIcons name={icon} size={24} color="#4682b4" />
                <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>{label}</Text>
                    <Text style={styles.detailValue}>{value}</Text>
                </View>
            </View>
        );
    
        return(
            <SafeAreaProvider>
                <LinearGradient
                    colors={['#4c669f', '#3b5998', '#192f6a']}
                    style={styles.container}
                >
                    <SafeAreaView style={styles.safeArea}>
                        <Animated.View 
                            style={[
                                styles.contentContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ scale: scaleAnim }]
                                }
                            ]}
                        >
                            <View style={styles.successIconContainer}>
                                <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
                                <Text style={styles.successText}>Payment Successful!</Text>
                            </View>
    
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#4682b4" />
                                    <Text style={styles.loadingText}>Loading ticket details...</Text>
                                </View>
                            ) : (
                                <View style={styles.card}>
                                    <View style={styles.ticketHeader}>
                                        <MaterialIcons name="confirmation-number" size={24} color="#4682b4" />
                                        <Text style={styles.ticketID}>Ticket #{ticket.ticketID}</Text>
                                    </View>
    
                                    <View style={styles.divider} />
    
                                    <DetailRow 
                                        icon="local-parking"
                                        label="Parking Lot"
                                        value={ticket.parkingLotID}
                                    />
                                    <DetailRow 
                                        icon="location-on"
                                        label="Address"
                                        value={address}
                                    />
                                    <DetailRow 
                                        icon="directions-car"
                                        label="License Plate"
                                        value={ticket.licensePlate}
                                    />
                                    <DetailRow 
                                        icon="access-time"
                                        label="Start Time"
                                        value={ticket.ticketStartTime.replace("T", " ").substr(0,19)}
                                    />
                                    <DetailRow 
                                        icon="timer"
                                        label="End Time"
                                        value={ticket.ticketEndTime.replace("T", " ").substr(0,19)}
                                    />
                                </View>
                            )}
    
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={() => navigation.navigate("I_MainPage")}
                            >
                                <LinearGradient
                                    colors={['#4facfe', '#00f2fe']}
                                    style={styles.buttonGradient}
                                >
                                    <MaterialIcons name="home" size={24} color="#fff" />
                                    <Text style={styles.buttonText}>Back to Main Page</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </SafeAreaView>
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
}

export default I_SuccessfulUI.Display;

// export default function I_SuccessfulUI({navigation}) {
//     const ticket = mainEntity.getTicket();
//     const [address, setAddress] = useState("");
//     const [loading, setLoading] = useState(true);
    
//     // Animation values
//     const [fadeAnim] = useState(new Animated.Value(0));
//     const [scaleAnim] = useState(new Animated.Value(0.9));

//     useEffect(() => {
//         // Fetch address
//         fetch(`http://localhost:3000/CarparkAddress?carparkID=${ticket.parkingLotID}`)
//             .then(response => response.json())
//             .then(data => {
//                 setAddress(data.carparkAddress);
//                 setLoading(false);
//             })
//             .catch(error => {
//                 setAddress("Error fetching address");
//                 setLoading(false);
//             });

//         // Start animations
//         Animated.parallel([
//             Animated.timing(fadeAnim, {
//                 toValue: 1,
//                 duration: 800,
//                 useNativeDriver: true,
//             }),
//             Animated.spring(scaleAnim, {
//                 toValue: 1,
//                 friction: 8,
//                 tension: 40,
//                 useNativeDriver: true,
//             })
//         ]).start();
//     }, [ticket.parkingLotID]);

//     const DetailRow = ({ icon, label, value }) => (
//         <View style={styles.detailRow}>
//             <MaterialIcons name={icon} size={24} color="#4682b4" />
//             <View style={styles.detailContent}>
//                 <Text style={styles.detailLabel}>{label}</Text>
//                 <Text style={styles.detailValue}>{value}</Text>
//             </View>
//         </View>
//     );

//     return(
//         <SafeAreaProvider>
//             <LinearGradient
//                 colors={['#4c669f', '#3b5998', '#192f6a']}
//                 style={styles.container}
//             >
//                 <SafeAreaView style={styles.safeArea}>
//                     <Animated.View 
//                         style={[
//                             styles.contentContainer,
//                             {
//                                 opacity: fadeAnim,
//                                 transform: [{ scale: scaleAnim }]
//                             }
//                         ]}
//                     >
//                         <View style={styles.successIconContainer}>
//                             <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
//                             <Text style={styles.successText}>Payment Successful!</Text>
//                         </View>

//                         {loading ? (
//                             <View style={styles.loadingContainer}>
//                                 <ActivityIndicator size="large" color="#4682b4" />
//                                 <Text style={styles.loadingText}>Loading ticket details...</Text>
//                             </View>
//                         ) : (
//                             <View style={styles.card}>
//                                 <View style={styles.ticketHeader}>
//                                     <MaterialIcons name="confirmation-number" size={24} color="#4682b4" />
//                                     <Text style={styles.ticketID}>Ticket #{ticket.ticketID}</Text>
//                                 </View>

//                                 <View style={styles.divider} />

//                                 <DetailRow 
//                                     icon="local-parking"
//                                     label="Parking Lot"
//                                     value={ticket.parkingLotID}
//                                 />
//                                 <DetailRow 
//                                     icon="location-on"
//                                     label="Address"
//                                     value={address}
//                                 />
//                                 <DetailRow 
//                                     icon="directions-car"
//                                     label="License Plate"
//                                     value={ticket.licensePlate}
//                                 />
//                                 <DetailRow 
//                                     icon="access-time"
//                                     label="Start Time"
//                                     value={ticket.ticketStartTime.replace("T", " ").substr(0,19)}
//                                 />
//                                 <DetailRow 
//                                     icon="timer"
//                                     label="End Time"
//                                     value={ticket.ticketEndTime.replace("T", " ").substr(0,19)}
//                                 />
//                             </View>
//                         )}

//                         <TouchableOpacity 
//                             style={styles.button}
//                             onPress={() => navigation.navigate("I_MainPage")}
//                         >
//                             <LinearGradient
//                                 colors={['#4facfe', '#00f2fe']}
//                                 style={styles.buttonGradient}
//                             >
//                                 <MaterialIcons name="home" size={24} color="#fff" />
//                                 <Text style={styles.buttonText}>Back to Main Page</Text>
//                             </LinearGradient>
//                         </TouchableOpacity>
//                     </Animated.View>
//                 </SafeAreaView>
//             </LinearGradient>
//         </SafeAreaProvider>
//     );
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successIconContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 3,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    ticketHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    ticketID: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4682b4',
        marginLeft: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 15,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    detailContent: {
        flex: 1,
        marginLeft: 15,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    button: {
        width: '100%',
        maxWidth: 400,
        marginTop: 20,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});