import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Linking } from 'react-native';
import carparkData from './HDBCarparkInformation.json';
import { ScrollView } from 'react-native-gesture-handler';
import availabilityControl from './controller/availabilityControl.js';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

class I_Availability {
  static Display({ navigation }) {
    // Preserve existing state declarations
    const [carparks, setCarparks] = useState([]);
    const [carparkAddresses, setCarparkAddresses] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [selectedCarparkType, setSelectedCarparkType] = useState('');
    const [rates, setRates] = useState({});
  
    // Keep existing useEffect hooks and functions
    useEffect(() => {
      const loadCarparkData = async () => {
        const data = await availabilityControl.fetchCarparkData();
        setCarparks(data);
        setLoading(false);
      };
  
      loadCarparkData();
  
      const addressMap = {};
      carparkData.forEach(item => {
        addressMap[item.car_park_no.trim()] = item.address.trim();
      });
      setCarparkAddresses(addressMap);
    }, []);
  
    useEffect(() => {
      const loadRates = async () => {
        for (let item of filteredCarparks) {
          if (rates[item.carpark_number]) continue;
          const rate = await availabilityControl.fetchCarparkRates(item.carpark_number, selectedCarparkType);
          setRates(prevRates => ({
            ...prevRates,
            [item.carpark_number]: rate,
          }));
        }
      };
  
      loadRates();
    }, [searchQuery, selectedCarparkType]);
  
    const filteredCarparks = carparks.filter(carpark => {
      const carparkAddress = carparkAddresses[carpark.carpark_number.trim()];
      return (
        carparkAddress &&
        carparkAddress !== 'N/A' &&
        carparkAddress.trim() !== '' &&
        carpark.carpark_number.toLowerCase().includes(searchQuery.toLowerCase()) &&
        carpark.carpark_info.some(info => info.lot_type === selectedCarparkType)
      );
    });
  
    const isLicensePlateValid = licensePlate.trim().length > 0;
  
    const handleSearchInput = (text) => {
      if (!selectedCarparkType) {
        Alert.alert(
          "Selection Required",
          "Please select a carpark type before searching",
          [{ text: "OK" }]
        );
        return;
      }
      setSearchQuery(text);
    };
  
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find Parking</Text>
        </View>
  
        <View style={styles.mainContent}>
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>
                <MaterialIcons name="directions-car" size={20} color="#4682b4" />
                {" "}License Plate
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter License Plate Number"
                value={licensePlate}
                onChangeText={text => setLicensePlate(text)}
                placeholderTextColor="#adb5bd"
              />
            </View>
  
            {isLicensePlateValid ? (
              <>
                <View style={styles.pickerWrapper}>
                  <Text style={styles.label}>
                    <MaterialIcons name="local-parking" size={20} color="#4682b4" />
                    {" "}Vehicle Type
                  </Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedCarparkType}
                      style={styles.picker}
                      onValueChange={(itemValue) => {
                        setSelectedCarparkType(itemValue);
                        setSearchQuery('');
                      }}
                    >
                      <Picker.Item label="Select Carpark Type" value="" />
                      <Picker.Item label="Motor" value="M" />
                      <Picker.Item label="Car" value="C" />
                    </Picker>
                  </View>
                </View>
  
                {selectedCarparkType && (
                  <View style={styles.inputWrapper}>
                    <Text style={styles.label}>
                      <MaterialIcons name="search" size={20} color="#4682b4" />
                      {" "}Search Carpark
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Search by carpark code..."
                      value={searchQuery}
                      onChangeText={handleSearchInput}
                      placeholderTextColor="#adb5bd"
                    />
                  </View>
                )}
              </>
            ) : (
              <View style={styles.promptContainer}>
                <MaterialIcons name="info-outline" size={24} color="#6c757d" />
                <Text style={styles.promptText}>
                  Please enter your license plate number to continue
                </Text>
              </View>
            )}
          </View>
  
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4682b4" />
              <Text style={styles.loadingText}>Loading available parking spots...</Text>
            </View>
          ) : (
            <View style={styles.resultsContainer}>
              {searchQuery && filteredCarparks.length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <MaterialIcons name="search-off" size={48} color="#dc3545" />
                  <Text style={styles.noResultsText}>No matching carparks found</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredCarparks}
                  keyExtractor={(item) => item.carpark_number}
                  renderItem={({ item }) => {
                    const carparkAddress = carparkAddresses[item.carpark_number.trim()] || 'N/A';
                    const Rate = rates[item.carpark_number];
                    return (Rate && (
                      <TouchableOpacity
                        style={styles.carparkCard}
                        onPress={() => {
                          if (!item.carpark_number || !carparkAddresses[item.carpark_number.trim()]) {
                            Alert.alert("Invalid Carpark ID", "Please input a valid Parking Lot ID");
                            return;
                          }
                          navigation.navigate("I_PaymentUI", {
                            vehType: selectedCarparkType,
                            licensePlate: licensePlate,
                            carparkType: selectedCarparkType,
                            carparkID: item.carpark_number,
                            rate: rates[item.carpark_number],
                          });
                        }}
                      >
                        <LinearGradient
                          colors={['#ffffff', '#f8f9fa']}
                          style={styles.carparkCardContent}
                        >
                          <View style={styles.carparkHeader}>
                            <View style={styles.carparkTitleContainer}>
                              <MaterialIcons name="local-parking" size={24} color="#4682b4" />
                              <Text style={styles.carparkTitle}>Carpark {item.carpark_number}</Text>
                            </View>
                            <View style={styles.rateContainer}>
                              <MaterialIcons name="attach-money" size={20} color="#4682b4" />
                              <Text style={styles.carparkRate}>
                                {Rate.toFixed(2)} {selectedCarparkType === "M" ? "per lot" : "per half-hour"}
                              </Text>
                            </View>
                          </View>
                          
                          <View style={styles.addressContainer}>
                            <MaterialIcons name="location-on" size={20} color="#6c757d" />
                            <Text style={styles.carparkAddress}>{carparkAddress}</Text>
                          </View>
                          
                          {item.carpark_info && item.carpark_info.map((info, index) => (
                            info.lot_type === selectedCarparkType && (
                              <View key={index} style={styles.lotsInfo}>
                                <View style={styles.lotsStat}>
                                  <Text style={styles.lotsLabel}>Available Lots</Text>
                                  <Text style={[
                                    styles.lotsValue,
                                    info.lots_available === 0 ? styles.noLots : styles.hasLots
                                  ]}>
                                    {info.lots_available}
                                  </Text>
                                </View>
                                <View style={styles.lotsDivider} />
                                <View style={styles.lotsStat}>
                                  <Text style={styles.lotsLabel}>Total Lots</Text>
                                  <Text style={styles.lotsValue}>{info.total_lots}</Text>
                                </View>
                              </View>
                            )
                          ))}
                          
                          <View style={styles.selectButton}>
                            <Text style={styles.selectButtonText}>Select Carpark</Text>
                            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    ));
                  }}
                />
              )}
            </View>
          )}
        </View>
      </LinearGradient>
    );
  }
}

export default I_Availability.Display;

// export default function ContactScreen({ navigation }) {
//   // Preserve existing state declarations
//   const [carparks, setCarparks] = useState([]);
//   const [carparkAddresses, setCarparkAddresses] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [licensePlate, setLicensePlate] = useState('');
//   const [selectedCarparkType, setSelectedCarparkType] = useState('');
//   const [rates, setRates] = useState({});

//   // Keep existing useEffect hooks and functions
//   useEffect(() => {
//     const loadCarparkData = async () => {
//       const data = await availabilityControl.fetchCarparkData();
//       setCarparks(data);
//       setLoading(false);
//     };

//     loadCarparkData();

//     const addressMap = {};
//     carparkData.forEach(item => {
//       addressMap[item.car_park_no.trim()] = item.address.trim();
//     });
//     setCarparkAddresses(addressMap);
//   }, []);

//   useEffect(() => {
//     const loadRates = async () => {
//       for (let item of filteredCarparks) {
//         if (rates[item.carpark_number]) continue;
//         const rate = await availabilityControl.fetchCarparkRates(item.carpark_number, selectedCarparkType);
//         setRates(prevRates => ({
//           ...prevRates,
//           [item.carpark_number]: rate,
//         }));
//       }
//     };

//     loadRates();
//   }, [searchQuery, selectedCarparkType]);

//   const filteredCarparks = carparks.filter(carpark => {
//     const carparkAddress = carparkAddresses[carpark.carpark_number.trim()];
//     return (
//       carparkAddress &&
//       carparkAddress !== 'N/A' &&
//       carparkAddress.trim() !== '' &&
//       carpark.carpark_number.toLowerCase().includes(searchQuery.toLowerCase()) &&
//       carpark.carpark_info.some(info => info.lot_type === selectedCarparkType)
//     );
//   });

//   const isLicensePlateValid = licensePlate.trim().length > 0;

//   const handleSearchInput = (text) => {
//     if (!selectedCarparkType) {
//       Alert.alert(
//         "Selection Required",
//         "Please select a carpark type before searching",
//         [{ text: "OK" }]
//       );
//       return;
//     }
//     setSearchQuery(text);
//   };

//   return (
//     <LinearGradient
//       colors={['#4c669f', '#3b5998', '#192f6a']}
//       style={styles.container}
//     >
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={styles.backButton}
//         >
//           <MaterialIcons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Find Parking</Text>
//       </View>

//       <View style={styles.mainContent}>
//         <View style={styles.formContainer}>
//           <View style={styles.inputWrapper}>
//             <Text style={styles.label}>
//               <MaterialIcons name="directions-car" size={20} color="#4682b4" />
//               {" "}License Plate
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter License Plate Number"
//               value={licensePlate}
//               onChangeText={text => setLicensePlate(text)}
//               placeholderTextColor="#adb5bd"
//             />
//           </View>

//           {isLicensePlateValid ? (
//             <>
//               <View style={styles.pickerWrapper}>
//                 <Text style={styles.label}>
//                   <MaterialIcons name="local-parking" size={20} color="#4682b4" />
//                   {" "}Vehicle Type
//                 </Text>
//                 <View style={styles.pickerContainer}>
//                   <Picker
//                     selectedValue={selectedCarparkType}
//                     style={styles.picker}
//                     onValueChange={(itemValue) => {
//                       setSelectedCarparkType(itemValue);
//                       setSearchQuery('');
//                     }}
//                   >
//                     <Picker.Item label="Select Carpark Type" value="" />
//                     <Picker.Item label="Motor" value="M" />
//                     <Picker.Item label="Car" value="C" />
//                   </Picker>
//                 </View>
//               </View>

//               {selectedCarparkType && (
//                 <View style={styles.inputWrapper}>
//                   <Text style={styles.label}>
//                     <MaterialIcons name="search" size={20} color="#4682b4" />
//                     {" "}Search Carpark
//                   </Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Search by carpark code..."
//                     value={searchQuery}
//                     onChangeText={handleSearchInput}
//                     placeholderTextColor="#adb5bd"
//                   />
//                 </View>
//               )}
//             </>
//           ) : (
//             <View style={styles.promptContainer}>
//               <MaterialIcons name="info-outline" size={24} color="#6c757d" />
//               <Text style={styles.promptText}>
//                 Please enter your license plate number to continue
//               </Text>
//             </View>
//           )}
//         </View>

//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#4682b4" />
//             <Text style={styles.loadingText}>Loading available parking spots...</Text>
//           </View>
//         ) : (
//           <View style={styles.resultsContainer}>
//             {searchQuery && filteredCarparks.length === 0 ? (
//               <View style={styles.noResultsContainer}>
//                 <MaterialIcons name="search-off" size={48} color="#dc3545" />
//                 <Text style={styles.noResultsText}>No matching carparks found</Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={filteredCarparks}
//                 keyExtractor={(item) => item.carpark_number}
//                 renderItem={({ item }) => {
//                   const carparkAddress = carparkAddresses[item.carpark_number.trim()] || 'N/A';
//                   const Rate = rates[item.carpark_number];
//                   return (Rate && (
//                     <TouchableOpacity
//                       style={styles.carparkCard}
//                       onPress={() => {
//                         if (!item.carpark_number || !carparkAddresses[item.carpark_number.trim()]) {
//                           Alert.alert("Invalid Carpark ID", "Please input a valid Parking Lot ID");
//                           return;
//                         }
//                         navigation.navigate("I_PaymentUI", {
//                           vehType: selectedCarparkType,
//                           licensePlate: licensePlate,
//                           carparkType: selectedCarparkType,
//                           carparkID: item.carpark_number,
//                           rate: rates[item.carpark_number],
//                         });
//                       }}
//                     >
//                       <LinearGradient
//                         colors={['#ffffff', '#f8f9fa']}
//                         style={styles.carparkCardContent}
//                       >
//                         <View style={styles.carparkHeader}>
//                           <View style={styles.carparkTitleContainer}>
//                             <MaterialIcons name="local-parking" size={24} color="#4682b4" />
//                             <Text style={styles.carparkTitle}>Carpark {item.carpark_number}</Text>
//                           </View>
//                           <View style={styles.rateContainer}>
//                             <MaterialIcons name="attach-money" size={20} color="#4682b4" />
//                             <Text style={styles.carparkRate}>
//                               {Rate.toFixed(2)} {selectedCarparkType === "M" ? "per lot" : "per half-hour"}
//                             </Text>
//                           </View>
//                         </View>
                        
//                         <View style={styles.addressContainer}>
//                           <MaterialIcons name="location-on" size={20} color="#6c757d" />
//                           <Text style={styles.carparkAddress}>{carparkAddress}</Text>
//                         </View>
                        
//                         {item.carpark_info && item.carpark_info.map((info, index) => (
//                           info.lot_type === selectedCarparkType && (
//                             <View key={index} style={styles.lotsInfo}>
//                               <View style={styles.lotsStat}>
//                                 <Text style={styles.lotsLabel}>Available Lots</Text>
//                                 <Text style={[
//                                   styles.lotsValue,
//                                   info.lots_available === 0 ? styles.noLots : styles.hasLots
//                                 ]}>
//                                   {info.lots_available}
//                                 </Text>
//                               </View>
//                               <View style={styles.lotsDivider} />
//                               <View style={styles.lotsStat}>
//                                 <Text style={styles.lotsLabel}>Total Lots</Text>
//                                 <Text style={styles.lotsValue}>{info.total_lots}</Text>
//                               </View>
//                             </View>
//                           )
//                         ))}
                        
//                         <View style={styles.selectButton}>
//                           <Text style={styles.selectButtonText}>Select Carpark</Text>
//                           <MaterialIcons name="arrow-forward" size={20} color="#fff" />
//                         </View>
//                       </LinearGradient>
//                     </TouchableOpacity>
//                   ));
//                 }}
//               />
//             )}
//           </View>
//         )}
//       </View>
//     </LinearGradient>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pickerWrapper: {
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ced4da',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  promptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e9ecef',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  promptText: {
    color: '#6c757d',
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#6c757d',
    fontSize: 16,
    marginTop: 12,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    color: '#dc3545',
    fontSize: 16,
    marginTop: 12,
  },
  carparkCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carparkCardContent: {
    padding: 16,
  },
  carparkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  carparkTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carparkTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginLeft: 8,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(70, 130, 180, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  carparkRate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4682b4',
    marginLeft: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  carparkAddress: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 4,
    flex: 1,
  },
  lotsInfo: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  lotsStat: {
    flex: 1,
    alignItems: 'center',
  },
  lotsDivider: {
    width: 1,
    backgroundColor: '#dee2e6',
    marginHorizontal: 16,
  },
  lotsLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  lotsValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  hasLots: {
    color: '#28a745',
  },
  noLots: {
    color: '#dc3545',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4682b4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});