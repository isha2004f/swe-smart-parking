import React, { useContext, useState, useEffect } from "react";
import { 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
    View, 
    Animated,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "./AuthContext";
import authenticationControl from "./controller/authenticationControl";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

class I_Login {
    static Display({navigation}) {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const [secureTextEntry, setSecureTextEntry] = useState(true);
        const {setIsLoggedIn} = useContext(AuthContext);
        
        // Animation values
        const [fadeAnim] = useState(new Animated.Value(0));
        const [slideAnim] = useState(new Animated.Value(50));
    
        useEffect(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ]).start();
        }, []);
    
        const handleLogin = async () => {
            if (!email || !password) {
                alert("Please fill in all fields");
                return;
            }
            
            setIsLoading(true);
            try {
                const res = await authenticationControl.VerifyLogin(email, password);
                setIsLoggedIn(res);
                if (!res) {
                    alert("Invalid credentials");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("Login failed. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
    
        return (
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
                            <Animated.View 
                                style={[
                                    styles.contentContainer,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{ translateY: slideAnim }]
                                    }
                                ]}
                            >
                                <Image
                                    source={require('../../assets/carpark_logo.png')}
                                    style={styles.logo}
                                />
                                
                                <View style={styles.formContainer}>
                                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                                    <Text style={styles.subtitleText}>Sign in to continue</Text>
    
                                    <View style={styles.inputContainer}>
                                        <MaterialIcons name="email" size={24} color="#4682b4" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={setEmail}
                                            value={email}
                                            placeholder="Email"
                                            placeholderTextColor="#666"
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                    </View>
    
                                    <View style={styles.inputContainer}>
                                        <MaterialIcons name="lock" size={24} color="#4682b4" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={setPassword}
                                            value={password}
                                            placeholder="Password"
                                            placeholderTextColor="#666"
                                            secureTextEntry={secureTextEntry}
                                        />
                                        <TouchableOpacity 
                                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                                            style={styles.eyeIcon}
                                        >
                                            <MaterialIcons 
                                                name={secureTextEntry ? "visibility" : "visibility-off"} 
                                                size={24} 
                                                color="#4682b4" 
                                            />
                                        </TouchableOpacity>
                                    </View>
    
                                    <TouchableOpacity 
                                        style={styles.loginButton}
                                        onPress={handleLogin}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={styles.buttonText}>Login</Text>
                                        )}
                                    </TouchableOpacity>
    
                                    <View style={styles.signupContainer}>
                                        <Text style={styles.signupText}>Don't have an account?</Text>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate("I_SignUp")}
                                        >
                                            <Text style={styles.signupLink}>Sign up here</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </LinearGradient>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }
    
}

export default I_Login.Display;

// export default function I_Login({navigation}) {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [secureTextEntry, setSecureTextEntry] = useState(true);
//     const {setIsLoggedIn} = useContext(AuthContext);
    
//     // Animation values
//     const [fadeAnim] = useState(new Animated.Value(0));
//     const [slideAnim] = useState(new Animated.Value(50));

//     useEffect(() => {
//         Animated.parallel([
//             Animated.timing(fadeAnim, {
//                 toValue: 1,
//                 duration: 1000,
//                 useNativeDriver: true,
//             }),
//             Animated.timing(slideAnim, {
//                 toValue: 0,
//                 duration: 1000,
//                 useNativeDriver: true,
//             })
//         ]).start();
//     }, []);

//     const handleLogin = async () => {
//         if (!email || !password) {
//             alert("Please fill in all fields");
//             return;
//         }
        
//         setIsLoading(true);
//         try {
//             const res = await authenticationControl.VerifyLogin(email, password);
//             setIsLoggedIn(res);
//             if (!res) {
//                 alert("Invalid credentials");
//             }
//         } catch (error) {
//             console.error("Login error:", error);
//             alert("Login failed. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
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
//                         <Animated.View 
//                             style={[
//                                 styles.contentContainer,
//                                 {
//                                     opacity: fadeAnim,
//                                     transform: [{ translateY: slideAnim }]
//                                 }
//                             ]}
//                         >
//                             <Image
//                                 source={require('../../assets/carpark_logo.png')}
//                                 style={styles.logo}
//                             />
                            
//                             <View style={styles.formContainer}>
//                                 <Text style={styles.welcomeText}>Welcome Back!</Text>
//                                 <Text style={styles.subtitleText}>Sign in to continue</Text>

//                                 <View style={styles.inputContainer}>
//                                     <MaterialIcons name="email" size={24} color="#4682b4" style={styles.inputIcon} />
//                                     <TextInput
//                                         style={styles.input}
//                                         onChangeText={setEmail}
//                                         value={email}
//                                         placeholder="Email"
//                                         placeholderTextColor="#666"
//                                         autoCapitalize="none"
//                                         keyboardType="email-address"
//                                     />
//                                 </View>

//                                 <View style={styles.inputContainer}>
//                                     <MaterialIcons name="lock" size={24} color="#4682b4" style={styles.inputIcon} />
//                                     <TextInput
//                                         style={styles.input}
//                                         onChangeText={setPassword}
//                                         value={password}
//                                         placeholder="Password"
//                                         placeholderTextColor="#666"
//                                         secureTextEntry={secureTextEntry}
//                                     />
//                                     <TouchableOpacity 
//                                         onPress={() => setSecureTextEntry(!secureTextEntry)}
//                                         style={styles.eyeIcon}
//                                     >
//                                         <MaterialIcons 
//                                             name={secureTextEntry ? "visibility" : "visibility-off"} 
//                                             size={24} 
//                                             color="#4682b4" 
//                                         />
//                                     </TouchableOpacity>
//                                 </View>

//                                 <TouchableOpacity 
//                                     style={styles.loginButton}
//                                     onPress={handleLogin}
//                                     disabled={isLoading}
//                                 >
//                                     {isLoading ? (
//                                         <ActivityIndicator color="#fff" />
//                                     ) : (
//                                         <Text style={styles.buttonText}>Login</Text>
//                                     )}
//                                 </TouchableOpacity>

//                                 <View style={styles.signupContainer}>
//                                     <Text style={styles.signupText}>Don't have an account?</Text>
//                                     <TouchableOpacity
//                                         onPress={() => navigation.navigate("I_SignUp")}
//                                     >
//                                         <Text style={styles.signupLink}>Sign up here</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>
//                         </Animated.View>
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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
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
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4682b4',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
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
    eyeIcon: {
        padding: 10,
    },
    loginButton: {
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
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signupText: {
        color: '#666',
        fontSize: 16,
    },
    signupLink: {
        color: '#4682b4',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
});