import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Image, View, ScrollView, Animated } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "./AuthContext";
import { mainEntity } from './entity/mainEntity';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';


class I_ViewProfile {
    static Display({ navigation }) {
        const { isLoggedIn } = useContext(AuthContext);
        const [UserName, setUserName] = useState(mainEntity.getUserName());
        const [UserEmail, setUserEmail] = useState(mainEntity.getUserEmail());
        const [UserPhoneNo, setUserPhoneNo] = useState(mainEntity.getUserPhoneNo());
        const [fadeAnim] = useState(new Animated.Value(0));
    
        useEffect(() => {
            // Check if user is logged in
            if (!isLoggedIn) {
                navigation.navigate("I_Login");
                return;
            }
    
            // Fade in animation
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
    
            return navigation.addListener('focus', (e) => {
                setUserName(mainEntity.getUserName());
                setUserEmail(mainEntity.getUserEmail());
                setUserPhoneNo(mainEntity.getUserPhoneNo());
            });
        }, [isLoggedIn, navigation]);
    
        const handleEditProfile = () => {
            navigation.navigate("I_EditProfile");
        };
    
        const ProfileCard = ({ icon, label, value }) => (
            <Animated.View style={[styles.profileItem, { opacity: fadeAnim }]}>
                <View style={styles.itemIconContainer}>
                    <MaterialIcons name={icon} size={24} color="#4682b4" />
                </View>
                <View style={styles.itemContent}>
                    <Text style={styles.itemLabel}>{label}</Text>
                    <Text style={styles.itemValue}>{value}</Text>
                </View>
            </Animated.View>
        );
    
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <LinearGradient
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        style={styles.gradientBackground}
                    >
                        <ScrollView 
                            contentContainerStyle={styles.scrollContainer}
                            showsVerticalScrollIndicator={false}
                        >
                            <Animated.View 
                                style={[styles.profileHeader, { opacity: fadeAnim }]}
                            >
                                <View style={styles.avatarContainer}>
                                    <LinearGradient
                                        colors={['#64b5f6', '#2196f3']}
                                        style={styles.avatarGradient}
                                    >
                                        <Text style={styles.avatarText}>
                                            {UserName ? UserName.charAt(0).toUpperCase() : '?'}
                                        </Text>
                                    </LinearGradient>
                                </View>
                                <Text style={styles.headerTitle}>Profile</Text>
                                <Text style={styles.profileName}>{UserName}</Text>
                            </Animated.View>
    
                            <View style={styles.profileDetails}>
                                <ProfileCard
                                    icon="email"
                                    label="Email Address"
                                    value={UserEmail}
                                />
                                <ProfileCard
                                    icon="phone"
                                    label="Phone Number"
                                    value={UserPhoneNo}
                                />
                            </View>
    
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    style={[styles.button, styles.editButton]}
                                    onPress={handleEditProfile}
                                >
                                    <MaterialIcons name="edit" size={24} color="white" />
                                    <Text style={styles.buttonText}>Edit Profile</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[styles.button, styles.backButton]}
                                    onPress={() => navigation.goBack()}
                                >
                                    <MaterialIcons name="arrow-back" size={24} color="white" />
                                    <Text style={styles.buttonText}>Back</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </LinearGradient>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }   
}

export default I_ViewProfile.Display

// export default function I_ViewProfile({ navigation }) {
//     const { isLoggedIn } = useContext(AuthContext);
//     const [UserName, setUserName] = useState(mainEntity.getUserName());
//     const [UserEmail, setUserEmail] = useState(mainEntity.getUserEmail());
//     const [UserPhoneNo, setUserPhoneNo] = useState(mainEntity.getUserPhoneNo());
//     const [fadeAnim] = useState(new Animated.Value(0));

//     useEffect(() => {
//         // Check if user is logged in
//         if (!isLoggedIn) {
//             navigation.navigate("I_Login");
//             return;
//         }

//         // Fade in animation
//         Animated.timing(fadeAnim, {
//             toValue: 1,
//             duration: 1000,
//             useNativeDriver: true,
//         }).start();

//         return navigation.addListener('focus', (e) => {
//             setUserName(mainEntity.getUserName());
//             setUserEmail(mainEntity.getUserEmail());
//             setUserPhoneNo(mainEntity.getUserPhoneNo());
//         });
//     }, [isLoggedIn, navigation]);

//     const handleEditProfile = () => {
//         navigation.navigate("I_EditProfile");
//     };

//     const ProfileCard = ({ icon, label, value }) => (
//         <Animated.View style={[styles.profileItem, { opacity: fadeAnim }]}>
//             <View style={styles.itemIconContainer}>
//                 <MaterialIcons name={icon} size={24} color="#4682b4" />
//             </View>
//             <View style={styles.itemContent}>
//                 <Text style={styles.itemLabel}>{label}</Text>
//                 <Text style={styles.itemValue}>{value}</Text>
//             </View>
//         </Animated.View>
//     );

//     return (
//         <SafeAreaProvider>
//             <SafeAreaView style={styles.container}>
//                 <LinearGradient
//                     colors={['#4c669f', '#3b5998', '#192f6a']}
//                     style={styles.gradientBackground}
//                 >
//                     <ScrollView 
//                         contentContainerStyle={styles.scrollContainer}
//                         showsVerticalScrollIndicator={false}
//                     >
//                         <Animated.View 
//                             style={[styles.profileHeader, { opacity: fadeAnim }]}
//                         >
//                             <View style={styles.avatarContainer}>
//                                 <LinearGradient
//                                     colors={['#64b5f6', '#2196f3']}
//                                     style={styles.avatarGradient}
//                                 >
//                                     <Text style={styles.avatarText}>
//                                         {UserName ? UserName.charAt(0).toUpperCase() : '?'}
//                                     </Text>
//                                 </LinearGradient>
//                             </View>
//                             <Text style={styles.headerTitle}>Profile</Text>
//                             <Text style={styles.profileName}>{UserName}</Text>
//                         </Animated.View>

//                         <View style={styles.profileDetails}>
//                             <ProfileCard
//                                 icon="email"
//                                 label="Email Address"
//                                 value={UserEmail}
//                             />
//                             <ProfileCard
//                                 icon="phone"
//                                 label="Phone Number"
//                                 value={UserPhoneNo}
//                             />
//                         </View>

//                         <View style={styles.buttonContainer}>
//                             <TouchableOpacity 
//                                 style={[styles.button, styles.editButton]}
//                                 onPress={handleEditProfile}
//                             >
//                                 <MaterialIcons name="edit" size={24} color="white" />
//                                 <Text style={styles.buttonText}>Edit Profile</Text>
//                             </TouchableOpacity>
                            
//                             <TouchableOpacity 
//                                 style={[styles.button, styles.backButton]}
//                                 onPress={() => navigation.goBack()}
//                             >
//                                 <MaterialIcons name="arrow-back" size={24} color="white" />
//                                 <Text style={styles.buttonText}>Back</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </ScrollView>
//                 </LinearGradient>
//             </SafeAreaView>
//         </SafeAreaProvider>
//     );
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 3,
    },
    avatarContainer: {
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    profileDetails: {
        width: '100%',
        marginBottom: 30,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    itemIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(70, 130, 180, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    itemContent: {
        flex: 1,
    },
    itemLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    itemValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    editButton: {
        backgroundColor: "#4CAF50",
    },
    backButton: {
        backgroundColor: "#4682b4",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10,
    },
});