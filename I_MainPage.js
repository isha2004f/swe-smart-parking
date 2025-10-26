
import React, { useContext } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "./AuthContext";
import { LinearGradient } from 'expo-linear-gradient';

class I_MainPage {
    static Display({navigation}) {
        const {setIsLoggedIn} = useContext(AuthContext)
    
        const MenuButton = ({ onPress, title, gradient }) => (
            <TouchableOpacity 
                style={styles.buttonContainer}
                onPress={onPress}
            >
                <LinearGradient
                    colors={gradient}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.buttonText}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    
        return(
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <LinearGradient
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        style={styles.background}
                    >
                        <View style={styles.contentContainer}>
                            <Text style={styles.title}>Main Page</Text>
                            
                            <MenuButton 
                                onPress={() => navigation.navigate("I_Availability")}
                                title="Availability"
                                gradient={['#4facfe', '#00f2fe']}
                            />
                            
                            <MenuButton 
                                onPress={() => navigation.navigate("I_ViewTickets")}
                                title="View Tickets"
                                gradient={['#43e97b', '#38f9d7']}
                            />
                            
                            <MenuButton 
                                onPress={() => navigation.navigate("I_ViewProfile")}
                                title="View Profile"
                                gradient={['#fa709a', '#fee140']}
                            />
                            
                            <MenuButton 
                                onPress={() => setIsLoggedIn(false)}
                                title="Logout"
                                gradient={['#ff6b6b', '#ff8e8e']}
                            />
                        </View>
                    </LinearGradient>
                </SafeAreaView>
            </SafeAreaProvider>
        )
    }
}


export default I_MainPage.Display;

// export default function I_MainPage({navigation}) {
//     const {setIsLoggedIn} = useContext(AuthContext)

//     const MenuButton = ({ onPress, title, gradient }) => (
//         <TouchableOpacity 
//             style={styles.buttonContainer}
//             onPress={onPress}
//         >
//             <LinearGradient
//                 colors={gradient}
//                 style={styles.button}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//             >
//                 <Text style={styles.buttonText}>{title}</Text>
//             </LinearGradient>
//         </TouchableOpacity>
//     );

//     return(
//         <SafeAreaProvider>
//             <SafeAreaView style={styles.container}>
//                 <LinearGradient
//                     colors={['#4c669f', '#3b5998', '#192f6a']}
//                     style={styles.background}
//                 >
//                     <View style={styles.contentContainer}>
//                         <Text style={styles.title}>Main Page</Text>
                        
//                         <MenuButton 
//                             onPress={() => navigation.navigate("I_Availability")}
//                             title="Availability"
//                             gradient={['#4facfe', '#00f2fe']}
//                         />
                        
//                         <MenuButton 
//                             onPress={() => navigation.navigate("I_ViewTickets")}
//                             title="View Tickets"
//                             gradient={['#43e97b', '#38f9d7']}
//                         />
                        
//                         <MenuButton 
//                             onPress={() => navigation.navigate("I_ViewProfile")}
//                             title="View Profile"
//                             gradient={['#fa709a', '#fee140']}
//                         />
                        
//                         <MenuButton 
//                             onPress={() => setIsLoggedIn(false)}
//                             title="Logout"
//                             gradient={['#ff6b6b', '#ff8e8e']}
//                         />
//                     </View>
//                 </LinearGradient>
//             </SafeAreaView>
//         </SafeAreaProvider>
//     )
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: '100%',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 3,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
        marginVertical: 10,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "600",
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});
