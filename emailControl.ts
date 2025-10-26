import emailRepository from "../boundary/emailAccess";
import databaseControl from "./databaseControl";
import serverControl from "./serverControl";


export default class emailControl {

    static async feeCalculator( startTime:Date, endTime:Date, vehType:string, parkingLotID:string ) {
        const fee = await databaseControl.GetRate( {carparkID: parkingLotID, vehType: vehType})
        if (!fee) {
            console.error("Error getting rate")
            return null
        }
        if (vehType == "M") return fee.toFixed(2)
        const interval = (endTime.getTime() - startTime.getTime())/(30*60*1000)
        console.log("Interval:", interval)
        return (interval*fee).toFixed(2)
    }


    static async NewTicketNotification(ticketID:number) {
        const subject = `New ticket created with ID: ${ticketID}`
        const res = serverControl.getOpenTicketByTicketID(ticketID)
        // console.log(typeof res?.ticketEndTime)
        if (res == null) {
            console.error(`No existing ticket with ID: ${ticketID}`);
            return false;
        } 

        const fee = await emailControl.feeCalculator(res.ticketStartTime, res.ticketEndTime,res.vehType,res.parkingLotID)
        if (fee == null) {
            console.error("Failed to obtain fee")
            return false
        }
        const text =    
    `Dear Customer,
    
        You have created a new ticket with ID: ${ticketID}.\n
        Your ${res.vehType == "M"? "motorcycle" : "car" }, ${res.licensePlate} is parked at ${await databaseControl.ReadCarparkAddress(res.parkingLotID)}
        The ticket starts on ${res.ticketStartTime.toISOString().replace("T", " ").substr(0,19)} and ends on ${res.ticketEndTime.toISOString().replace("T", " ").substr(0,19)}.
        Total fee is $${fee}.`



        const email = await databaseControl.ReadUserEmail(res.userID)
        if (email == null) {
            console.error(`No existing email found for user ID: ${res.userID}`);
            return false;
        } 
        console.log(email,subject,text)
        return emailRepository.emailSender(email as string,subject,text);           
    }
        
    static async ExpiryNotification(ticketID:number) {
        const subject = `Expiration alert for ticket ID: ${ticketID}`
        const res = serverControl.getOpenTicketByTicketID(ticketID)
        if (res == null) {
            console.error(`No existing ticket with ID: ${ticketID}`);
            return false;
        } 
        const text =    
    `Dear Customer,
    
        You have a ticket that is expiring soon. Ticket ID: ${ticketID}.\n
        Your ${res.vehType == "M"? "motorcycle" : "car" }, ${res.licensePlate} is parked at ${await databaseControl.ReadCarparkAddress(res.parkingLotID)}
        The ticket ends on ${res.ticketEndTime.toISOString().replace("T", " ").substr(0,19)}.
        Please extend or close your ticket to avoid fines.`
        const email = await databaseControl.ReadUserEmail(res.userID)
        if (email == null) {
            console.error(`No existing email found for user ID: ${res.userID}`);
            return false;
        } 
        console.log(email,subject,text)
        return emailRepository.emailSender(email as string,subject,text); 
    }
    
}

// export async function NewTicketNotification(ticketID:number) {
//     const subject = `New ticket created with ID: ${ticketID}`
//     const res = serverControl.getOpenTicketByTicketID(ticketID)
//     // console.log(typeof res?.ticketEndTime)
//     if (res == null) {
//         console.error(`No existing ticket with ID: ${ticketID}`);
//         return false;
//     } 
//     const text =    
// `Dear Customer,

//     You have create a new ticket with ID: ${ticketID}.\n
//     The Carpark is ${await dataBaseControl.GetCarparkAddress(res.parkingLotID)}
//     The ticket ends on ${res.ticketEndTime.toISOString().replace("T", " ").substr(0,19)}.`
//     const email = await dataBaseControl.GetUserEmail(res.userID)
//     if (email == null) {
//         console.error(`No existing email found for user ID: ${res.userID}`);
//         return false;
//     } 
//     console.log(email,subject,text)
//     return emailRepository.emailSender(email as string,subject,text);           
// }
    
// export async function ExpiryNotification(ticketID:number) {
//     const subject = `Expiration alert for ticket ID: ${ticketID}`
//     const res = serverControl.getOpenTicketByTicketID(ticketID)
//     if (res == null) {
//         console.error(`No existing ticket with ID: ${ticketID}`);
//         return false;
//     } 
//     const text =    
// `Dear Customer,

//     You have ticket that is expiring soon. Ticket ID: ${ticketID}.
//     The Carpark is ${await dataBaseControl.GetCarparkAddress(res.parkingLotID)}
//     The ticket ends on ${res.ticketEndTime.toISOString().replace("T", " ").substr(0,19)}.`
//     const email = await dataBaseControl.GetUserEmail(res.userID)
//     if (email == null) {
//         console.error(`No existing email found for user ID: ${res.userID}`);
//         return false;
//     } 
//     console.log(email,subject,text)
//     return emailRepository.emailSender(email as string,subject,text); 
// }

