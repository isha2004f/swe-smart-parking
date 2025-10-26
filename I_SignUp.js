import React, { useContext, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Image, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "./AuthContext";
import authenticationControl from "./controller/authenticationControl";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

class I_SignUp {
    static Display({navigation}) {
        const [FirstName, setFirstName] = useState("");
        const [LastName, setLastName] = useState("");
        const [Phone, setPhone] = useState("");
        const [Email, setEmail] = useState("");
        const [Password, setPassword] = useState("");
        const [secureTextEntryP1, setSecureTextEntryP1] = useState(true);
        const [secureTextEntryP2, setSecureTextEntryP2] = useState(true);
        const [ConfirmPassword, setConfirmPassword] = useState("");
        const {setIsLoggedIn} = useContext(AuthContext);
    
    
    
        return(
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <LinearGradient
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        style={styles.gradientBackground}
                    >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.keyboardAvoidView}
                        >
                            <ScrollView
                                contentContainerStyle={styles.scrollContainer}
                                showsVerticalScrollIndicator={false}
                            >
                                <Image
                                    source={require('../../assets/carpark_logo.png')}
                                    style={styles.logo}
                                />
                                
                                <View style={styles.formContainer}>
                                    <Text style={styles.headerText}>Create Account</Text>
                                    
                                    <FormInput
                                        icon="person"
                                        placeholder="First Name"
                                        value={FirstName}
                                        onChangeText={setFirstName}
                                    />
                                    
                                    <FormInput
                                        icon="person-outline"
                                        placeholder="Last Name"
                                        value={LastName}
                                        onChangeText={setLastName}
                                    />
                                    
                                    <FormInput
                                        icon="phone"
                                        placeholder="Phone No."
                                        value={Phone}
                                        onChangeText={setPhone}
                                    />
                                    
                                    <FormInput
                                        icon="email"
                                        placeholder="Email"
                                        value={Email}
                                        onChangeText={setEmail}
                                    />
    
                                    <View style={styles.inputContainer}>
                                        <MaterialIcons name="lock" size={24} color="#4682b4" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={setPassword}
                                            value={Password}
                                            placeholder="Password"
                                            placeholderTextColor="#666"
                                            secureTextEntry={secureTextEntryP1}
                                        />
                                        <TouchableOpacity 
                                            onPress={() => setSecureTextEntryP1(!secureTextEntryP1)}
                                            style={styles.eyeIcon}
                                        >
                                            <MaterialIcons 
                                                name={secureTextEntryP1 ? "visibility" : "visibility-off"} 
                                                size={24} 
                                                color="#4682b4" 
                                            />
                                        </TouchableOpacity>
                                    </View>
    
                                    <View style={styles.inputContainer}>
                                        <MaterialIcons name="lock-outline" size={24} color="#4682b4" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={setConfirmPassword}
                                            value={ConfirmPassword}
                                            placeholder="Confirm Password"
                                            placeholderTextColor="#666"
                                            secureTextEntry={secureTextEntryP2}
                                        />
                                        <TouchableOpacity 
                                            onPress={() => setSecureTextEntryP2(!secureTextEntryP2)}
                                            style={styles.eyeIcon}
                                        >
                                            <MaterialIcons 
                                                name={secureTextEntryP2 ? "visibility" : "visibility-off"} 
                                                size={24} 
                                                color="#4682b4" 
                                            />
                                        </TouchableOpacity>
                                    </View>
    
                                    <TouchableOpacity 
                                        style={styles.signUpButton}   
                                        onPress={() => {
                                            OnSignUp(FirstName, LastName, Phone, Email, Password, ConfirmPassword)
                                                .then((res) => setIsLoggedIn(res));
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Sign Up</Text>
                                    </TouchableOpacity>
    
                                    <View style={styles.loginContainer}>
                                        <Text style={styles.loginText}>Already have an account?</Text>
                                        <TouchableOpacity
                                            style={styles.loginButton}
                                            onPress={() => navigation.navigate("I_Login")}
                                        >
                                            <Text style={styles.loginButtonText}>Login here</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </LinearGradient>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }
}

export default I_SignUp.Display;

// Password validation functions remain unchanged
function PasswordValidation(Password1, Password2) {
    return Password1 === Password2 ? 1 : 0;
}

function PasswordChecker(Password) {
    const levels = {
        1: "Very Weak",
        2: "Weak",
        3: "Medium",
        4: "Strong",
    };

    if (Password.length > 15) {
        alert(Password + " - Too lengthy");
        return false;
    } else if (Password.length < 8) {
        alert(Password + " - Too short");
        return false;
    }

    const checks = [
        /[a-z]/,     // Lowercase
        /[A-Z]/,     // Uppercase
        /\d/,        // Digit
        /[@.#$!%^&*.?]/ // Special character
    ];
    let score = checks.reduce((acc, rgx) => acc + rgx.test(Password), 0);
    
    const res = [];
    if(!(/[a-z]/).test(Password)) res.push("Lowercase letters missing.");
    if(!(/[A-Z]/).test(Password)) res.push("Uppercase letters missing.");
    if(!(/\d/).test(Password)) res.push("Digits missing.");
    if(!(/[@.#$!%^&*.?]/).test(Password)) res.push("Special characters missing.");
    
    if(res.length > 0) alert(res.join("\n"));
    return score >= 4;
}

async function OnSignUp(FirstName, LastName, Phone, Email, Password, ConfirmPassword) {
    if(!FirstName || !LastName || !Phone || !Email || !Password || !ConfirmPassword) {
        alert("Please fill in all the fields");
        return false;
    }

     if (!Email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)) {
        alert("Please enter a valid email address");
        return false;
    }
    if (!Phone.match(/^(8|9)([0-9]{7}$)/i)) {
        alert("Please enter a valid Singapore phone number");
        return false;
    }

    if(!PasswordValidation(Password, ConfirmPassword)) {
        alert("Password and Confirm Password do not match");
        return false;
    }

    if(!PasswordChecker(Password)) {
        alert("Password is not strong enough");
        return false;
    }

    if(await authenticationControl.VerifySignUp(FirstName, LastName, Phone, Email, Password)) {
        console.log("Sign Up Successful");
        alert("Sign Up Successful");
        return true;
    }
    
    alert("Sign Up Unsuccessful");
    return false;
}

const FormInput = ({ icon, placeholder, value, onChangeText, secureTextEntry }) => (
    <View style={styles.inputContainer}>
        <MaterialIcons name={icon} size={24} color="#4682b4" style={styles.inputIcon} />
        <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#666"
            secureTextEntry={secureTextEntry}
        />
    </View>
);

// export default function I_SignUp({navigation}) {
//     const [FirstName, setFirstName] = useState("");
//     const [LastName, setLastName] = useState("");
//     const [Phone, setPhone] = useState("");
//     const [Email, setEmail] = useState("");
//     const [Password, setPassword] = useState("");
//     const [secureTextEntryP1, setSecureTextEntryP1] = useState(true);
//     const [secureTextEntryP2, setSecureTextEntryP2] = useState(true);
//     const [ConfirmPassword, setConfirmPassword] = useState("");
//     const {setIsLoggedIn} = useContext(AuthContext);



//     return(
//         <SafeAreaProvider>
//             <SafeAreaView style={styles.container}>
//                 <LinearGradient
//                     colors={['#4c669f', '#3b5998', '#192f6a']}
//                     style={styles.gradientBackground}
//                 >
//                     <KeyboardAvoidingView
//                         behavior={Platform.OS === "ios" ? "padding" : "height"}
//                         style={styles.keyboardAvoidView}
//                     >
//                         <ScrollView
//                             contentContainerStyle={styles.scrollContainer}
//                             showsVerticalScrollIndicator={false}
//                         >
//                             <Image
//                                 source={require('../../assets/carpark_logo.png')}
//                                 style={styles.logo}
//                             />
                            
//                             <View style={styles.formContainer}>
//                                 <Text style={styles.headerText}>Create Account</Text>
                                
//                                 <FormInput
//                                     icon="person"
//                                     placeholder="First Name"
//                                     value={FirstName}
//                                     onChangeText={setFirstName}
//                                 />
                                
//                                 <FormInput
//                                     icon="person-outline"
//                                     placeholder="Last Name"
//                                     value={LastName}
//                                     onChangeText={setLastName}
//                                 />
                                
//                                 <FormInput
//                                     icon="phone"
//                                     placeholder="Phone No."
//                                     value={Phone}
//                                     onChangeText={setPhone}
//                                 />
                                
//                                 <FormInput
//                                     icon="email"
//                                     placeholder="Email"
//                                     value={Email}
//                                     onChangeText={setEmail}
//                                 />

//                                 <View style={styles.inputContainer}>
//                                     <MaterialIcons name="lock" size={24} color="#4682b4" style={styles.inputIcon} />
//                                     <TextInput
//                                         style={styles.input}
//                                         onChangeText={setPassword}
//                                         value={Password}
//                                         placeholder="Password"
//                                         placeholderTextColor="#666"
//                                         secureTextEntry={secureTextEntryP1}
//                                     />
//                                     <TouchableOpacity 
//                                         onPress={() => setSecureTextEntryP1(!secureTextEntryP1)}
//                                         style={styles.eyeIcon}
//                                     >
//                                         <MaterialIcons 
//                                             name={secureTextEntryP1 ? "visibility" : "visibility-off"} 
//                                             size={24} 
//                                             color="#4682b4" 
//                                         />
//                                     </TouchableOpacity>
//                                 </View>

//                                 <View style={styles.inputContainer}>
//                                     <MaterialIcons name="lock-outline" size={24} color="#4682b4" style={styles.inputIcon} />
//                                     <TextInput
//                                         style={styles.input}
//                                         onChangeText={setConfirmPassword}
//                                         value={ConfirmPassword}
//                                         placeholder="Confirm Password"
//                                         placeholderTextColor="#666"
//                                         secureTextEntry={secureTextEntryP2}
//                                     />
//                                     <TouchableOpacity 
//                                         onPress={() => setSecureTextEntryP2(!secureTextEntryP2)}
//                                         style={styles.eyeIcon}
//                                     >
//                                         <MaterialIcons 
//                                             name={secureTextEntryP2 ? "visibility" : "visibility-off"} 
//                                             size={24} 
//                                             color="#4682b4" 
//                                         />
//                                     </TouchableOpacity>
//                                 </View>

//                                 <TouchableOpacity 
//                                     style={styles.signUpButton}   
//                                     onPress={() => {
//                                         OnSignUp(FirstName, LastName, Phone, Email, Password, ConfirmPassword)
//                                             .then((res) => setIsLoggedIn(res));
//                                     }}
//                                 >
//                                     <Text style={styles.buttonText}>Sign Up</Text>
//                                 </TouchableOpacity>

//                                 <View style={styles.loginContainer}>
//                                     <Text style={styles.loginText}>Already have an account?</Text>
//                                     <TouchableOpacity
//                                         style={styles.loginButton}
//                                         onPress={() => navigation.navigate("I_Login")}
//                                     >
//                                         <Text style={styles.loginButtonText}>Login here</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>
//                         </ScrollView>
//                     </KeyboardAvoidingView>
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
    keyboardAvoidView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 30,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    formContainer: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4682b4',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#e1e1e1',
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
    signUpButton: {
        backgroundColor: '#4682b4',
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginText: {
        color: '#666',
        fontSize: 16,
    },
    loginButton: {
        marginLeft: 5,
    },
    loginButtonText: {
        color: '#4682b4',
        fontSize: 16,
        fontWeight: 'bold',
    },
    eyeIcon: {
        padding: 10,
    },
});
