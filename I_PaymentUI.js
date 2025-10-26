import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
    Animated, 
    ActivityIndicator 
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import paymentControl from "./controller/paymentControl";
import { LinearGradient } from 'expo-linear-gradient';


class I_PaymentUI {
    static Display({ navigation, route }) {
        const { vehType, licensePlate, carparkType, carparkID, rate } = route.params;
        const intervalTime = 30;
        const [interval, setInterval] = useState(1);
        const [max, setMax] = useState(false);
        const [min, setMin] = useState(false);
        const [paymentErrorMsg, setPaymentErrorMsg] = useState("");
        const [processing, setProcessing] = useState(false);
        
        // Animation values
        const [fadeAnim] = useState(new Animated.Value(0));
        const [slideAnim] = useState(new Animated.Value(50));
    
        useEffect(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                })
            ]).start();
        }, []);
    
        const increase = () => {
            if (interval >= 48) {
                setMax(true);
                return false;
            } else {
                setMin(false);
                setInterval(interval + 1);
                return true;
            }
        };
    
        const decrease = () => {
            if (interval === 1) {
                setMin(true);
                return false;
            } else {
                setMax(false);
                setInterval(interval - 1);
                return true;
            }
        };
    
        const showTime = () => {
            const hour = Math.floor((interval * intervalTime) / 60);
            const mins = (interval * intervalTime) % 60;
            return `${hour} Hr${hour > 1 ? "s" : ""} ${mins === 0 ? "00" : mins} Mins`;
        };
    
        const showFee = () => {
            if (carparkType === "M") return rate.toFixed(2);
            else {
                const hour = Math.floor((interval * intervalTime) / 60);
                const mins = (interval * intervalTime) % 60;
                const totalFee = (hour * 2 + mins / 30) * rate;
                return Number(totalFee.toFixed(2)).toFixed(2);
            }
        };
    
        const handlePayment = () => {
            if (processing) return;
            setProcessing(true);
            setPaymentErrorMsg("");
            
            paymentControl.ProcessPayment({
                vehType: vehType,
                carparkNo: carparkID,
                rate: rate,
                licensePlate: licensePlate,
                duration_hour: Math.floor((interval * intervalTime) / 60),
                duration_min: (interval * intervalTime) % 60
            })
            .then(response => {
                if (response) {
                    navigation.navigate("I_SuccessfulUI");
                } else {
                    setPaymentErrorMsg("Open Ticket already exists");
                }
            })
            .finally(() => {
                setProcessing(false);
            });
        };
    
        return (
            <SafeAreaProvider>
                <LinearGradient
                    colors={['#4c669f', '#3b5998', '#192f6a']}
                    style={styles.container}
                >
                    <SafeAreaView style={styles.safeArea}>
                        <Animated.View 
                            style={[
                                styles.card,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            <View style={styles.headerSection}>
                                <Image
                                    source={require('../../assets/payment_logo.png')}
                                    style={styles.logo}
                                />
                                <Text style={styles.heading}>Parking Payment</Text>
                            </View>
    
                            <View style={styles.infoSection}>
                                <View style={styles.infoRow}>
                                    <MaterialIcons name="local-parking" size={24} color="#4682b4" />
                                    <Text style={styles.infoText}>Carpark: {carparkID}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <MaterialIcons name="directions-car" size={24} color="#4682b4" />
                                    <Text style={styles.infoText}>Vehicle: {licensePlate}</Text>
                                </View>
                            </View>
    
                            <View style={styles.timeSection}>
                                <Text style={styles.timeLabel}>Duration</Text>
                                <View style={styles.timeControl}>
                                    <TouchableOpacity 
                                        style={styles.timeButton} 
                                        onPress={decrease}
                                    >
                                        <MaterialIcons name="remove-circle" size={50} color="#4682b4" />
                                    </TouchableOpacity>
                                    <View style={styles.timeDisplay}>
                                        <Text style={styles.timeText}>{showTime()}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.timeButton} 
                                        onPress={increase}
                                    >
                                        <MaterialIcons name="add-circle" size={50} color="#4682b4" />
                                    </TouchableOpacity>
                                </View>
                                {(min || max) && (
                                    <Text style={styles.errorMsg}>
                                        {min ? "Minimum duration is 30 mins" : "Maximum duration is 24 hours"}
                                    </Text>
                                )}
                            </View>
    
                            <View style={styles.feeSection}>
                                <Text style={styles.feeLabel}>Total Amount</Text>
                                <Text style={styles.feeAmount}>${showFee()}</Text>
                            </View>
    
                            <TouchableOpacity
                                style={[styles.payButton, processing && styles.disabledButton]}
                                onPress={handlePayment}
                                disabled={processing}
                            >
                                <LinearGradient
                                    colors={processing ? ['#cccccc', '#cccccc'] : ['#4facfe', '#00f2fe']}
                                    style={styles.payButtonGradient}
                                >
                                    {processing ? (
                                        <ActivityIndicator color="#ffffff" />
                                    ) : (
                                        <>
                                            <MaterialIcons name="payment" size={24} color="#fff" />
                                            <Text style={styles.payButtonText}>Pay Now</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.payButton, processing && styles.disabledButton]}
                                onPress={() => navigation.goBack()}
                                disabled={processing}
                            >
                                <LinearGradient
                                    colors={processing ? ['#cccccc', '#cccccc'] : ['#4facfe', '#00f2fe']}
                                    style={styles.payButtonGradient}
                                >
                                    {processing ? (
                                        <ActivityIndicator color="#ffffff" />
                                    ) : (
                                        <>
                                            <MaterialIcons name="arrow-back" size={24} color="#fff" />
                                            <Text style={styles.payButtonText}>Go Back</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
    
                            {paymentErrorMsg !== "" && (
                                <View style={styles.errorContainer}>
                                    <MaterialIcons name="error" size={20} color="#dc3545" />
                                    <Text style={styles.errorMsg}>{paymentErrorMsg}</Text>
                                </View>
                            )}
                        </Animated.View>
                    </SafeAreaView>
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
    
}

export default I_PaymentUI.Display

// export default function I_PaymentUI({ navigation, route }) {
//     const { vehType, licensePlate, carparkType, carparkID, rate } = route.params;
//     const intervalTime = 30;
//     const [interval, setInterval] = useState(1);
//     const [max, setMax] = useState(false);
//     const [min, setMin] = useState(false);
//     const [paymentErrorMsg, setPaymentErrorMsg] = useState("");
//     const [processing, setProcessing] = useState(false);
    
//     // Animation values
//     const [fadeAnim] = useState(new Animated.Value(0));
//     const [slideAnim] = useState(new Animated.Value(50));

//     useEffect(() => {
//         Animated.parallel([
//             Animated.timing(fadeAnim, {
//                 toValue: 1,
//                 duration: 800,
//                 useNativeDriver: true,
//             }),
//             Animated.timing(slideAnim, {
//                 toValue: 0,
//                 duration: 800,
//                 useNativeDriver: true,
//             })
//         ]).start();
//     }, []);

//     const increase = () => {
//         if (interval >= 48) {
//             setMax(true);
//             return false;
//         } else {
//             setMin(false);
//             setInterval(interval + 1);
//             return true;
//         }
//     };

//     const decrease = () => {
//         if (interval === 1) {
//             setMin(true);
//             return false;
//         } else {
//             setMax(false);
//             setInterval(interval - 1);
//             return true;
//         }
//     };

//     const showTime = () => {
//         const hour = Math.floor((interval * intervalTime) / 60);
//         const mins = (interval * intervalTime) % 60;
//         return `${hour} Hr${hour > 1 ? "s" : ""} ${mins === 0 ? "00" : mins} Mins`;
//     };

//     const showFee = () => {
//         if (carparkType === "M") return rate.toFixed(2);
//         else {
//             const hour = Math.floor((interval * intervalTime) / 60);
//             const mins = (interval * intervalTime) % 60;
//             const totalFee = (hour * 2 + mins / 30) * rate;
//             return Number(totalFee.toFixed(2)).toFixed(2);
//         }
//     };

//     const handlePayment = () => {
//         if (processing) return;
//         setProcessing(true);
//         setPaymentErrorMsg("");
        
//         paymentControl.ProcessPayment({
//             vehType: vehType,
//             carparkNo: carparkID,
//             rate: rate,
//             licensePlate: licensePlate,
//             duration_hour: Math.floor((interval * intervalTime) / 60),
//             duration_min: (interval * intervalTime) % 60
//         })
//         .then(response => {
//             if (response) {
//                 navigation.navigate("I_SuccessfulUI");
//             } else {
//                 setPaymentErrorMsg("Open Ticket already exists");
//             }
//         })
//         .finally(() => {
//             setProcessing(false);
//         });
//     };

//     return (
//         <SafeAreaProvider>
//             <LinearGradient
//                 colors={['#4c669f', '#3b5998', '#192f6a']}
//                 style={styles.container}
//             >
//                 <SafeAreaView style={styles.safeArea}>
//                     <Animated.View 
//                         style={[
//                             styles.card,
//                             {
//                                 opacity: fadeAnim,
//                                 transform: [{ translateY: slideAnim }]
//                             }
//                         ]}
//                     >
//                         <View style={styles.headerSection}>
//                             <Image
//                                 source={require('../../assets/payment_logo.png')}
//                                 style={styles.logo}
//                             />
//                             <Text style={styles.heading}>Parking Payment</Text>
//                         </View>

//                         <View style={styles.infoSection}>
//                             <View style={styles.infoRow}>
//                                 <MaterialIcons name="local-parking" size={24} color="#4682b4" />
//                                 <Text style={styles.infoText}>Carpark: {carparkID}</Text>
//                             </View>
//                             <View style={styles.infoRow}>
//                                 <MaterialIcons name="directions-car" size={24} color="#4682b4" />
//                                 <Text style={styles.infoText}>Vehicle: {licensePlate}</Text>
//                             </View>
//                         </View>

//                         <View style={styles.timeSection}>
//                             <Text style={styles.timeLabel}>Duration</Text>
//                             <View style={styles.timeControl}>
//                                 <TouchableOpacity 
//                                     style={styles.timeButton} 
//                                     onPress={decrease}
//                                 >
//                                     <MaterialIcons name="remove-circle" size={50} color="#4682b4" />
//                                 </TouchableOpacity>
//                                 <View style={styles.timeDisplay}>
//                                     <Text style={styles.timeText}>{showTime()}</Text>
//                                 </View>
//                                 <TouchableOpacity 
//                                     style={styles.timeButton} 
//                                     onPress={increase}
//                                 >
//                                     <MaterialIcons name="add-circle" size={50} color="#4682b4" />
//                                 </TouchableOpacity>
//                             </View>
//                             {(min || max) && (
//                                 <Text style={styles.errorMsg}>
//                                     {min ? "Minimum duration is 30 mins" : "Maximum duration is 24 hours"}
//                                 </Text>
//                             )}
//                         </View>

//                         <View style={styles.feeSection}>
//                             <Text style={styles.feeLabel}>Total Amount</Text>
//                             <Text style={styles.feeAmount}>${showFee()}</Text>
//                         </View>

//                         <TouchableOpacity
//                             style={[styles.payButton, processing && styles.disabledButton]}
//                             onPress={handlePayment}
//                             disabled={processing}
//                         >
//                             <LinearGradient
//                                 colors={processing ? ['#cccccc', '#cccccc'] : ['#4facfe', '#00f2fe']}
//                                 style={styles.payButtonGradient}
//                             >
//                                 {processing ? (
//                                     <ActivityIndicator color="#ffffff" />
//                                 ) : (
//                                     <>
//                                         <MaterialIcons name="payment" size={24} color="#fff" />
//                                         <Text style={styles.payButtonText}>Pay Now</Text>
//                                     </>
//                                 )}
//                             </LinearGradient>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={[styles.payButton, processing && styles.disabledButton]}
//                             onPress={() => navigation.goBack()}
//                             disabled={processing}
//                         >
//                             <LinearGradient
//                                 colors={processing ? ['#cccccc', '#cccccc'] : ['#4facfe', '#00f2fe']}
//                                 style={styles.payButtonGradient}
//                             >
//                                 {processing ? (
//                                     <ActivityIndicator color="#ffffff" />
//                                 ) : (
//                                     <>
//                                         <MaterialIcons name="arrow-back" size={24} color="#fff" />
//                                         <Text style={styles.payButtonText}>Go Back</Text>
//                                     </>
//                                 )}
//                             </LinearGradient>
//                         </TouchableOpacity>

//                         {paymentErrorMsg !== "" && (
//                             <View style={styles.errorContainer}>
//                                 <MaterialIcons name="error" size={20} color="#dc3545" />
//                                 <Text style={styles.errorMsg}>{paymentErrorMsg}</Text>
//                             </View>
//                         )}
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
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    headerSection: {
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 15,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    infoSection: {
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#495057',
    },
    timeSection: {
        padding: 20,
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 18,
        color: '#495057',
        marginBottom: 15,
    },
    timeControl: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    timeButton: {
        padding: 10,
    },
    timeDisplay: {
        minWidth: 150,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 22,
        fontWeight: '600',
        color: "#4682b4",
    },
    feeSection: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    feeLabel: {
        fontSize: 16,
        color: '#495057',
        marginBottom: 5,
    },
    feeAmount: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#4682b4",
    },
    payButton: {
        margin: 20,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    payButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    payButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    errorMsg: {
        color: "#dc3545",
        marginLeft: 5,
        fontSize: 14,
    },
});