import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import viewTicketControl from "./controller/viewTicketsControl";
import { FlatList } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

class I_ViewTickets {
  static Display({navigation}) {
    const [ticket, setTicket] = useState(null);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddTimeModal, setAddTimeModal] = useState(false);
    const [showCloseTicketModal, setCloseTicketModal] = useState(false);
    const [showPastTicketModal, setPastTicketModal] = useState(false);
    const [PastTicket, setPastTicket] = useState(null);
    const [pastTickets, setPastTickets] = useState([]);
  
    useEffect(() => {
      async function fetchTicket() {
        setLoading(true);
        try {
          const {address, ticket} = await viewTicketControl.getTicket();
          const ticketArray = await viewTicketControl.getAllClosedTickets();
          setPastTickets(ticketArray);
          setTicket(ticket);
          setAddress(address);
        } catch (error) {
          console.error("Error fetching ticket in I_ViewTickets:", error);
        } finally {
          setLoading(false);
        }
      }
      if (loading) {
        fetchTicket();
      }
    }, [loading]);
  
    if (loading) {
      return (
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4682b4" />
              <Text style={styles.loadingText}>Loading ticket info...</Text>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      );
    }
  
    if (!ticket?.ticketID) {
      return (
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={styles.gradientBackground}
            >
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>No Open Tickets</Text>
              </View>
  
              <FlatList
                style={styles.pastTicketsList}
                data={pastTickets.sort((a, b) => b.ticketID - a.ticketID)}
                keyExtractor={(item) => item.ticketID.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pastTicketCard}
                    onPress={() => {
                      setPastTicket(item);
                      setPastTicketModal(true);
                    }}
                  >
                    <View style={styles.pastTicketHeader}>
                      <Text style={styles.pastTicketId}>Ticket #{item.ticketID}</Text>
                      <AntDesign name="right" size={20} color="#4682b4" />
                    </View>
                    <Text style={styles.pastTicketAddress}>{item.address}</Text>
                  </TouchableOpacity>
                )}
              />
  
              <TouchableOpacity 
                style={styles.mainButton}
                onPress={() => navigation.navigate("I_MainPage")}
              >
                <Text style={styles.buttonText}>Back to Main Page</Text>
              </TouchableOpacity>
  
              <PastTicketModal
                ticket={PastTicket}
                showModal={showPastTicketModal}
                setShowModal={setPastTicketModal}
              />
            </LinearGradient>
          </SafeAreaView>
        </SafeAreaProvider>
      );
    }
  
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.gradientBackground}
          >
            <View style={styles.mainContent}>
              <View style={styles.activeTicketCard}>
                <Text style={styles.activeTicketHeader}>Active Ticket</Text>
                <View style={styles.ticketDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Ticket ID:</Text>
                    <Text style={styles.value}>#{ticket.ticketID}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Parking Lot:</Text>
                    <Text style={styles.value}>{ticket.parkingLotID}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>License Plate:</Text>
                    <Text style={styles.value}>{ticket.licensePlate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Start Time:</Text>
                    <Text style={styles.value}>{ticket.ticketStartTime.replace("T", " ").substr(0, 19)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>End Time:</Text>
                    <Text style={styles.value}>{ticket.ticketEndTime.replace("T", " ").substr(0, 19)}</Text>
                  </View>
                </View>
              </View>
  
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.addTimeButton]}
                  onPress={() => setAddTimeModal(true)}
                >
                  <AntDesign name="clockcircle" size={24} color="white" />
                  <Text style={styles.actionButtonText}>Add Time</Text>
                </TouchableOpacity>
  
                <TouchableOpacity 
                  style={[styles.actionButton, styles.closeTicketButton]}
                  onPress={() => setCloseTicketModal(true)}
                >
                  <AntDesign name="checkcircle" size={24} color="white" />
                  <Text style={styles.actionButtonText}>Close Ticket</Text>
                </TouchableOpacity>
              </View>
  
              <Text style={styles.pastTicketsHeader}>Past Tickets</Text>
              
              <FlatList
                style={styles.pastTicketsList}
                data={pastTickets.sort((a, b) => b.ticketID - a.ticketID)}
                keyExtractor={(item) => item.ticketID.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pastTicketCard}
                    onPress={() => {
                      setPastTicket(item);
                      setPastTicketModal(true);
                    }}
                  >
                    <View style={styles.pastTicketHeader}>
                      <Text style={styles.pastTicketId}>Ticket #{item.ticketID}</Text>
                      <AntDesign name="right" size={20} color="#4682b4" />
                    </View>
                    <Text style={styles.pastTicketAddress}>{item.address}</Text>
                  </TouchableOpacity>
                )}
              />
  
              <TouchableOpacity 
                style={styles.mainButton}
                onPress={() => navigation.navigate("I_MainPage")}
              >
                <Text style={styles.buttonText}>Back to Main Page</Text>
              </TouchableOpacity>
            </View>
  
            <PastTicketModal
              ticket={PastTicket}
              showModal={showPastTicketModal}
              setShowModal={setPastTicketModal}
            />
            <AddTimeModal
              ticketID={ticket.ticketID}
              fee={ticket.fee}
              vehType={ticket.vehType}
              endTime={ticket.ticketEndTime}
              showModal={showAddTimeModal}
              setShowModal={setAddTimeModal}
              setLoading={setLoading}
            />
            <CloseTicketModal
              ticket={ticket}
              showModal={showCloseTicketModal}
              setShowModal={setCloseTicketModal}
              setLoading={setLoading}
            />
          </LinearGradient>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}

export default I_ViewTickets.Display;

// export default function I_ViewTickets({navigation}) {
//   const [ticket, setTicket] = useState(null);
//   const [address, setAddress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showAddTimeModal, setAddTimeModal] = useState(false);
//   const [showCloseTicketModal, setCloseTicketModal] = useState(false);
//   const [showPastTicketModal, setPastTicketModal] = useState(false);
//   const [PastTicket, setPastTicket] = useState(null);
//   const [pastTickets, setPastTickets] = useState([]);

//   useEffect(() => {
//     async function fetchTicket() {
//       setLoading(true);
//       try {
//         const {address, ticket} = await viewTicketControl.getTicket();
//         const ticketArray = await viewTicketControl.getAllClosedTickets();
//         setPastTickets(ticketArray);
//         setTicket(ticket);
//         setAddress(address);
//       } catch (error) {
//         console.error("Error fetching ticket in I_ViewTickets:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (loading) {
//       fetchTicket();
//     }
//   }, [loading]);

//   if (loading) {
//     return (
//       <SafeAreaProvider>
//         <SafeAreaView style={styles.container}>
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#4682b4" />
//             <Text style={styles.loadingText}>Loading ticket info...</Text>
//           </View>
//         </SafeAreaView>
//       </SafeAreaProvider>
//     );
//   }

//   if (!ticket?.ticketID) {
//     return (
//       <SafeAreaProvider>
//         <SafeAreaView style={styles.container}>
//           <LinearGradient
//             colors={['#4c669f', '#3b5998', '#192f6a']}
//             style={styles.gradientBackground}
//           >
//             <View style={styles.headerContainer}>
//               <Text style={styles.headerText}>No Open Tickets</Text>
//             </View>

//             <FlatList
//               style={styles.pastTicketsList}
//               data={pastTickets.sort((a, b) => b.ticketID - a.ticketID)}
//               keyExtractor={(item) => item.ticketID.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.pastTicketCard}
//                   onPress={() => {
//                     setPastTicket(item);
//                     setPastTicketModal(true);
//                   }}
//                 >
//                   <View style={styles.pastTicketHeader}>
//                     <Text style={styles.pastTicketId}>Ticket #{item.ticketID}</Text>
//                     <AntDesign name="right" size={20} color="#4682b4" />
//                   </View>
//                   <Text style={styles.pastTicketAddress}>{item.address}</Text>
//                 </TouchableOpacity>
//               )}
//             />

//             <TouchableOpacity 
//               style={styles.mainButton}
//               onPress={() => navigation.navigate("I_MainPage")}
//             >
//               <Text style={styles.buttonText}>Back to Main Page</Text>
//             </TouchableOpacity>

//             <PastTicketModal
//               ticket={PastTicket}
//               showModal={showPastTicketModal}
//               setShowModal={setPastTicketModal}
//             />
//           </LinearGradient>
//         </SafeAreaView>
//       </SafeAreaProvider>
//     );
//   }

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>
//         <LinearGradient
//           colors={['#4c669f', '#3b5998', '#192f6a']}
//           style={styles.gradientBackground}
//         >
//           <View style={styles.mainContent}>
//             <View style={styles.activeTicketCard}>
//               <Text style={styles.activeTicketHeader}>Active Ticket</Text>
//               <View style={styles.ticketDetails}>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.label}>Ticket ID:</Text>
//                   <Text style={styles.value}>#{ticket.ticketID}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.label}>Parking Lot:</Text>
//                   <Text style={styles.value}>{ticket.parkingLotID}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.label}>Address:</Text>
//                   <Text style={styles.value}>{address}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.label}>License Plate:</Text>
//                   <Text style={styles.value}>{ticket.licensePlate}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.label}>Start Time:</Text>
//                   <Text style={styles.value}>{ticket.ticketStartTime.replace("T", " ").substr(0, 19)}</Text>
//                 </View>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.label}>End Time:</Text>
//                   <Text style={styles.value}>{ticket.ticketEndTime.replace("T", " ").substr(0, 19)}</Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.actionButtonsContainer}>
//               <TouchableOpacity 
//                 style={[styles.actionButton, styles.addTimeButton]}
//                 onPress={() => setAddTimeModal(true)}
//               >
//                 <AntDesign name="clockcircle" size={24} color="white" />
//                 <Text style={styles.actionButtonText}>Add Time</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={[styles.actionButton, styles.closeTicketButton]}
//                 onPress={() => setCloseTicketModal(true)}
//               >
//                 <AntDesign name="checkcircle" size={24} color="white" />
//                 <Text style={styles.actionButtonText}>Close Ticket</Text>
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.pastTicketsHeader}>Past Tickets</Text>
            
//             <FlatList
//               style={styles.pastTicketsList}
//               data={pastTickets.sort((a, b) => b.ticketID - a.ticketID)}
//               keyExtractor={(item) => item.ticketID.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.pastTicketCard}
//                   onPress={() => {
//                     setPastTicket(item);
//                     setPastTicketModal(true);
//                   }}
//                 >
//                   <View style={styles.pastTicketHeader}>
//                     <Text style={styles.pastTicketId}>Ticket #{item.ticketID}</Text>
//                     <AntDesign name="right" size={20} color="#4682b4" />
//                   </View>
//                   <Text style={styles.pastTicketAddress}>{item.address}</Text>
//                 </TouchableOpacity>
//               )}
//             />

//             <TouchableOpacity 
//               style={styles.mainButton}
//               onPress={() => navigation.navigate("I_MainPage")}
//             >
//               <Text style={styles.buttonText}>Back to Main Page</Text>
//             </TouchableOpacity>
//           </View>

//           <PastTicketModal
//             ticket={PastTicket}
//             showModal={showPastTicketModal}
//             setShowModal={setPastTicketModal}
//           />
//           <AddTimeModal
//             ticketID={ticket.ticketID}
//             fee={ticket.fee}
//             vehType={ticket.vehType}
//             endTime={ticket.ticketEndTime}
//             showModal={showAddTimeModal}
//             setShowModal={setAddTimeModal}
//             setLoading={setLoading}
//           />
//           <CloseTicketModal
//             ticket={ticket}
//             showModal={showCloseTicketModal}
//             setShowModal={setCloseTicketModal}
//             setLoading={setLoading}
//           />
//         </LinearGradient>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

const PastTicketModal = ({ticket, showModal, setShowModal}) => {
  if (!ticket) return null;

  const fee = () => {
    switch (ticket.vehType) {
      case "M":
        return (ticket.fee).toFixed(2);
      case "C":
        var interval = Math.ceil(((new Date(ticket.actualEndTime)).getTime() - (new Date(ticket.ticketStartTime)).getTime())/(30*60*1000));
        if (interval == 0) interval += 1;
        return (ticket.fee * interval).toFixed(2);
      default:
        return (0).toFixed(2);
    }
  };

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Past Ticket Details</Text>
          <View style={styles.modalContent}>
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalLabel}>Ticket ID:</Text>
              <Text style={styles.modalValue}>#{ticket.ticketID}</Text>
            </View>
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalLabel}>Address:</Text>
              <Text style={styles.modalValue}>{ticket.address}</Text>
            </View>
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalLabel}>License:</Text>
              <Text style={styles.modalValue}>{ticket.licensePlate}</Text>
            </View>
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalLabel}>Start:</Text>
              <Text style={styles.modalValue}>{ticket.ticketStartTime.replace("T", " ").substr(0, 19)}</Text>
            </View>
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalLabel}>End:</Text>
              <Text style={styles.modalValue}>{ticket.actualEndTime.replace("T", " ").substr(0, 19)}</Text>
            </View>
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalLabel}>Total Fee:</Text>
              <Text style={styles.modalValue}>${fee()}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.modalButton} 
            onPress={() => setShowModal(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const AddTimeModal = ({ticketID, fee, vehType, endTime, showModal, setShowModal, setLoading}) => {
  const intervalTime = 30;
  const [incrementStr, setIncrementStr] = useState("");
  const [increment, setIncrement] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [max, setMax] = useState(false);
  const [min, setMin] = useState(false);

  const curEndTime = new Date(endTime);
  const newEndTime = new Date(endTime);
  newEndTime.setMinutes(curEndTime.getMinutes() + intervalTime*increment);

  const addTime = () => {
    if(increment >= 24) {
      setMax(true);
      return false;
    } else {
      setMin(false);
      setIncrement(increment + 1);
      return true;
    }
  };

  const removeTime = () => {
    if(increment <= 1) {
      setMin(true);
      return false;
    } else {
      setMax(false);
      setIncrement(increment - 1);
      return true;
    }
  };

  useEffect(() => {
    const updateIncrementTime = () => {
      const hour = Math.floor((increment*intervalTime)/60);
      const mins = (increment*intervalTime)%60;
      setIncrementStr(`${hour} Hr${hour > 1? "s":""} ${mins == 0? "00":mins} Mins`);
    };
    updateIncrementTime();
  }, [increment]);

  useEffect(() => {
    if (showModal) {
      setIncrement(1);
      setIncrementStr(`0 Hr 30 Mins`);
    }
  }, [showModal]);

  const handleConfirm = () => {
    if (processing) return;
    setProcessing(true);
    viewTicketControl.addTime(ticketID, newEndTime)
      .then((res) => {
        if (res) {
          setTimeout(() => {
            setShowModal(false);
            setLoading(true);
          }, 1000);
        } else {
          console.log("Error adding time in I_ViewTickets");
        }
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Time</Text>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Current End: {curEndTime.toISOString().replace("T", " ").substr(0,19)}</Text>
            <Text style={styles.modalText}>New End: {newEndTime.toISOString().replace("T", " ").substr(0,19)}</Text>

            <View style={styles.timeAdjustContainer}>
              <TouchableOpacity 
                style={styles.timeAdjustButton} 
                onPress={removeTime}
              >
                <AntDesign name="minuscircle" size={30} color="#4682b4" />
              </TouchableOpacity>
              
              <View style={styles.timeDisplay}>
                <Text style={styles.timeLabel}>Extension</Text>
                <Text style={styles.timeValue}>{incrementStr}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.timeAdjustButton} 
                onPress={addTime}
              >
                <AntDesign name="pluscircle" size={30} color="#4682b4" />
              </TouchableOpacity>
            </View>

            <Text style={styles.feeText}>
              {vehType == "M" 
                ? "No additional fee for motorcycle" 
                : `Additional fee: $${(fee*increment).toFixed(2)}`
              }
            </Text>

            {(min || max) && (
              <Text style={styles.errorText}>
                {min ? "Minimum duration is 30 mins" : "Maximum duration is 12 hours"}
              </Text>
            )}
          </View>

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              style={[styles.modalButton, processing && styles.disabledButton]}
              onPress={handleConfirm}
              disabled={processing}
            >
              <Text style={styles.modalButtonText}>
                {processing ? "Processing..." : "Confirm"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const CloseTicketModal = ({ticket, showModal, setShowModal, setLoading}) => {
  const [processing, setProcessing] = useState(false);

  const ticketID = ticket.ticketID;
  const ticketStartTime = new Date(ticket.ticketStartTime);
  const ticketEndTime = new Date(ticket.ticketEndTime);
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 8);
  const duration = (currentTime - ticketStartTime)/(60*60*1000);
  const totalHalfHours = Math.ceil(duration * 2);
  const hours = Math.floor(totalHalfHours / 2);
  const mins = totalHalfHours % 2 === 0 ? 0 : 30;

  const handleConfirm = () => {
    if (processing) return;
    setProcessing(true);
    viewTicketControl.closeTicket(ticketID, currentTime)
      .then((res) => {
        if (res) {
          setTimeout(() => {
            setShowModal(false);
            setLoading(true);
          }, 1000);
        } else {
          console.log("Error closing ticket in I_ViewTickets");
        }
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Close Ticket</Text>
          
          <View style={styles.modalContent}>
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalLabel}>Start Time:</Text>
              <Text style={styles.modalValue}>
                {ticketStartTime.toISOString().replace("T", " ").substr(0,19)}
              </Text>
            </View>
            
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalLabel}>End Time:</Text>
              <Text style={styles.modalValue}>
                {ticketEndTime.toISOString().replace("T", " ").substr(0,19)}
              </Text>
            </View>
            
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalLabel}>Current Time:</Text>
              <Text style={styles.modalValue}>
                {currentTime.toISOString().replace("T", " ").substr(0,19)}
              </Text>
            </View>
            
            <View style={styles.modalDetailRow}>
              <Text style={styles.modalLabel}>Time Charged:</Text>
              <Text style={styles.modalValue}>
                {hours} Hr{hours > 1 ? "s" : ""} {mins == 0 ? "00" : mins} Mins
              </Text>
            </View>
          </View>

          <Text style={styles.confirmationText}>
            Are you sure you want to close this ticket?
          </Text>

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              style={[styles.modalButton, processing && styles.disabledButton]}
              onPress={handleConfirm}
              disabled={processing}
            >
              <Text style={styles.modalButtonText}>
                {processing ? "Processing..." : "Confirm"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    padding: 16,
  },
  mainContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4682b4',
  },
  headerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  activeTicketCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeTicketHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4682b4',
    marginBottom: 15,
    textAlign: 'center',
  },
  ticketDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    gap: 10,
  },
  addTimeButton: {
    backgroundColor: '#4CAF50',
  },
  closeTicketButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pastTicketsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 15,
  },
  pastTicketsList: {
    flex: 1,
  },
  pastTicketCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  pastTicketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  pastTicketId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4682b4',
  },
  pastTicketAddress: {
    fontSize: 14,
    color: '#666',
  },
  mainButton: {
    backgroundColor: '#4682b4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4682b4',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 20,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalLabel: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  modalValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  timeAdjustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  timeAdjustButton: {
    padding: 10,
  },
  timeDisplay: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4682b4',
  },
  feeText: {
    fontSize: 16,
    color: '#4682b4',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginTop: 10,
  },
  confirmationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#4682b4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});