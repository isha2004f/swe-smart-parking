import React, { useContext, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View, Animated, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TextInput, ScrollView } from "react-native-gesture-handler";
import { AuthContext } from "./AuthContext";
import { mainEntity } from './entity/mainEntity';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, updateEmail } from "firebase/auth";

const auth = getAuth();

class I_EditProfile {
    static Display({ navigation }) {
        const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
        const [firstName, setFirstName] = useState(mainEntity.getUserFirstName());
        const [lastName, setLastName] = useState(mainEntity.getUserLastName());
        const [email, setEmail] = useState(mainEntity.getUserEmail());
        const [phoneNo, setPhoneNo] = useState(mainEntity.getUserPhoneNo());
        const [showConfirmation, setShowConfirmation] = useState(false);
    
        if (!isLoggedIn) {
            navigation.navigate("I_Login");
            return null;
        }
    
        const handleUpdateProfile = async (prompt, logout = false) => {
            // if (!email.match(/^[\w-\.]+[+]?[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
            //     alert("Please enter a valid email address");
            //     return;
            // }
            if (!email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)) {
                alert("Please enter a valid email address");
                return;
            }
            
            if (!phoneNo.match(/^(8|9)([0-9]{7}$)/i)) {
                alert("Please enter a valid Singapore phone number");
                return;
            }
            if (prompt && email !== mainEntity.getUserEmail()) {
                setShowConfirmation(true);
                return;
            }
    
            try {
                const userInfo = {
                    userID: mainEntity.getUserID(),
                    userEmail: email,
                    firstName: firstName,
                    lastName: lastName,
                    userPhoneNo: phoneNo
                };
    
                const updateUserInfoRes = await fetch(`http://localhost:3000/UserInfo`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userInfo)
                });
    
                if (updateUserInfoRes.status === 200) {
                    mainEntity.setUserInformation(userInfo);
                    if (logout) {
                        setIsLoggedIn(false);
                    } else {
                        navigation.goBack();
                    }
                } else {
                    alert("Failed to update profile. Please try again.");
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("An error occurred while updating your profile");
            }
        };
    
        function onConfirm(){
            updateEmail(auth.currentUser, email).then(() => {
                console.log("Email updated successfully");
                alert("Email updated successfully");
                handleUpdateProfile(false, true);
            }).catch((error) => {
                console.log("Error updating email", error);
                alert("Error updating email");
            });
        }
        
        return (
            <SafeAreaProvider>
                <LinearGradient
                    colors={['#4c669f', '#3b5998', '#192f6a']}
                    style={styles.container}
                >
                    <SafeAreaView style={styles.safeArea}>
                        <View style={styles.header}>
                            <TouchableOpacity 
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <MaterialIcons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Edit Profile</Text>
                            <View style={styles.headerRight} />
                        </View>
    
                        <ScrollView 
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.formContainer}>
                                <FormInput
                                    label="First Name"
                                    icon="person"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="Enter your first name"
                                />
    
                                <FormInput
                                    label="Last Name"
                                    icon="person-outline"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    placeholder="Enter your last name"
                                />
    
                                <FormInput
                                    label="Email Address"
                                    icon="email"
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email"
                                />
    
                                <FormInput
                                    label="Phone Number"
                                    icon="phone"
                                    value={phoneNo}
                                    onChangeText={setPhoneNo}
                                    placeholder="Enter your phone number"
                                />
    
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={() => handleUpdateProfile(true)}
                                >
                                    <LinearGradient
                                        colors={['#4CAF50', '#45a049']}
                                        style={styles.saveButtonGradient}
                                    >
                                        <MaterialIcons name="save" size={24} color="#fff" />
                                        <Text style={styles.buttonText}>Save Changes</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
    
                        <ConfirmationModal
                            isOpen={showConfirmation}
                            title="Confirm Edit"
                            message="You will be logged out when changing your email. Are you sure?"
                            //onConfirm={() => handleUpdateProfile(false, true)}
                            onConfirm={() => onConfirm()}
                            onCancel={() => setShowConfirmation(false)}
                        />
                    </SafeAreaView>
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
    
}

export default I_EditProfile.Display;

function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <View style={styles.modalBackdrop}>
            <Animated.View style={styles.modalBox}>
                <View style={styles.modalHeader}>
                    <MaterialIcons name="warning" size={40} color="#ff6b6b" />
                    <Text style={styles.modalTitle}>{title}</Text>
                </View>
                <Text style={styles.modalDescription}>{message}</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={onCancel}
                        style={styles.modalButton}
                    >
                        <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onConfirm}
                        style={[styles.modalButton, styles.confirmButton]}
                    >
                        <Text style={styles.modalButtonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const FormInput = ({ label, icon, value, onChangeText, placeholder }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.inputWrapper}>
            <MaterialIcons name={icon} size={24} color="#4682b4" style={styles.inputIcon} />
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#adb5bd"
            />
        </View>
    </View>
);

// export default function I_EditProfile({ navigation }) {
//     const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
//     const [firstName, setFirstName] = useState(mainEntity.getUserFirstName());
//     const [lastName, setLastName] = useState(mainEntity.getUserLastName());
//     const [email, setEmail] = useState(mainEntity.getUserEmail());
//     const [phoneNo, setPhoneNo] = useState(mainEntity.getUserPhoneNo());
//     const [showConfirmation, setShowConfirmation] = useState(false);

//     if (!isLoggedIn) {
//         navigation.navigate("I_Login");
//         return null;
//     }

//     const handleUpdateProfile = async (prompt, logout = false) => {
//         // if (!email.match(/^[\w-\.]+[+]?[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
//         //     alert("Please enter a valid email address");
//         //     return;
//         // }
//         if (!email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)) {
//             alert("Please enter a valid email address");
//             return;
//         }
        
//         if (!phoneNo.match(/^(8|9)([0-9]{7}$)/i)) {
//             alert("Please enter a valid Singapore phone number");
//             return;
//         }
//         if (prompt && email !== mainEntity.getUserEmail()) {
//             setShowConfirmation(true);
//             return;
//         }

//         try {
//             const userInfo = {
//                 userID: mainEntity.getUserID(),
//                 userEmail: email,
//                 firstName: firstName,
//                 lastName: lastName,
//                 userPhoneNo: phoneNo
//             };

//             const updateUserInfoRes = await fetch(`http://localhost:3000/UserInfo`, {
//                 method: "PUT",
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(userInfo)
//             });

//             if (updateUserInfoRes.status === 200) {
//                 mainEntity.setUserInformation(userInfo);
//                 if (logout) {
//                     setIsLoggedIn(false);
//                 } else {
//                     navigation.goBack();
//                 }
//             } else {
//                 alert("Failed to update profile. Please try again.");
//             }
//         } catch (error) {
//             console.error("Error updating profile:", error);
//             alert("An error occurred while updating your profile");
//         }
//     };

//     function onConfirm(){
//         updateEmail(auth.currentUser, email).then(() => {
//             console.log("Email updated successfully");
//             alert("Email updated successfully");
//             handleUpdateProfile(false, true);
//         }).catch((error) => {
//             console.log("Error updating email", error);
//             alert("Error updating email");
//         });
//     }
    
//     return (
//         <SafeAreaProvider>
//             <LinearGradient
//                 colors={['#4c669f', '#3b5998', '#192f6a']}
//                 style={styles.container}
//             >
//                 <SafeAreaView style={styles.safeArea}>
//                     <View style={styles.header}>
//                         <TouchableOpacity 
//                             style={styles.backButton}
//                             onPress={() => navigation.goBack()}
//                         >
//                             <MaterialIcons name="arrow-back" size={24} color="#fff" />
//                         </TouchableOpacity>
//                         <Text style={styles.headerTitle}>Edit Profile</Text>
//                         <View style={styles.headerRight} />
//                     </View>

//                     <ScrollView 
//                         style={styles.scrollView}
//                         contentContainerStyle={styles.scrollContent}
//                         showsVerticalScrollIndicator={false}
//                     >
//                         <View style={styles.formContainer}>
//                             <FormInput
//                                 label="First Name"
//                                 icon="person"
//                                 value={firstName}
//                                 onChangeText={setFirstName}
//                                 placeholder="Enter your first name"
//                             />

//                             <FormInput
//                                 label="Last Name"
//                                 icon="person-outline"
//                                 value={lastName}
//                                 onChangeText={setLastName}
//                                 placeholder="Enter your last name"
//                             />

//                             <FormInput
//                                 label="Email Address"
//                                 icon="email"
//                                 value={email}
//                                 onChangeText={setEmail}
//                                 placeholder="Enter your email"
//                             />

//                             <FormInput
//                                 label="Phone Number"
//                                 icon="phone"
//                                 value={phoneNo}
//                                 onChangeText={setPhoneNo}
//                                 placeholder="Enter your phone number"
//                             />

//                             <TouchableOpacity
//                                 style={styles.saveButton}
//                                 onPress={() => handleUpdateProfile(true)}
//                             >
//                                 <LinearGradient
//                                     colors={['#4CAF50', '#45a049']}
//                                     style={styles.saveButtonGradient}
//                                 >
//                                     <MaterialIcons name="save" size={24} color="#fff" />
//                                     <Text style={styles.buttonText}>Save Changes</Text>
//                                 </LinearGradient>
//                             </TouchableOpacity>
//                         </View>
//                     </ScrollView>

//                     <ConfirmationModal
//                         isOpen={showConfirmation}
//                         title="Confirm Edit"
//                         message="You will be logged out when changing your email. Are you sure?"
//                         //onConfirm={() => handleUpdateProfile(false, true)}
//                         onConfirm={() => onConfirm()}
//                         onCancel={() => setShowConfirmation(false)}
//                     />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 16,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerRight: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    formContainer: {
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
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#495057',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        marginTop: 10,
        borderRadius: 12,
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
    saveButtonGradient: {
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
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    modalDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#6c757d',
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 5,
    },
    confirmButton: {
        backgroundColor: '#dc3545',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
