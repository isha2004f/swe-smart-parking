import { serverEntity } from "../entity/serverEntity";
import databaseControl from "./databaseControl";
import expiryControl from "./expiryControl";

export default class serverControl {
    static async serverInitialiser() {
        const res = await databaseControl.ReadOpenTicket()
    
        if(res != null) serverEntity.setTickets(res)
        
        // console.log(serverEntity.getTicket())
        // Call the expiry function
        expiryControl.expiryInitialiser()

    }

    static getOpenTicketByTicketID(ticketID:number) {
        return serverEntity.getTicket(true, ticketID)
    }

    static getOpenTicketByUserID(userID:number) {
        return serverEntity.getTicket(false, userID)
    }

    static getAllOpenTickets() {
        return serverEntity.getTickets()
    }

    static async createOpenTicket(object:any ) {
        // console.log("creating open ticket")
        const res = await databaseControl.CreateOpenTicket(object)
        if (res == null) console.error("Server fail to create open ticket")
        return res;
    }

    static async addOpenTicketToServer(ticketID:number) {
        // console.log("Adding open ticket")
        const res = await databaseControl.ReadOpenTicketByTicketID(ticketID)

        if (res == null) console.error("Server fail to retrieve open ticket")
        else {
            serverEntity.addTicket(res)
            console.log("New Ticket Added to server")
        }
    }

    static async updateOpenTicketEndTime(object: any) {

        const {ticketID, newEndTime} = object
        // console.log(typeof newEndTime)

        if (!ticketID || !newEndTime) {
            console.error("Incorrect data passed into update open ticket")
            return false;
        }
        const res = databaseControl.UpdateOpenTicketEndTime(object).then((res) => {
            if (!res) console.error("Server failed to update database open ticket")
            else {
                const ticket = serverControl.getOpenTicketByTicketID(ticketID)
                // console.log(serverControl.getOpenTicketByTicketID(ticketID))
                if (!ticket) console.error("Open ticket does not exist in server")
                else{
                    // console.log(newEndTime)
                    ticket.ticketEndTime = new Date(newEndTime)
                    ticket.notified = false
                    // console.log(serverControl.getOpenTicketByTicketID(ticketID))
                    return true;
                }
            }
            return false;
        })

        return await res;
    }

    static async closeTicket(object:any) {

        const {ticketID, closeTime} = object

        if (!ticketID || !closeTime) {
            console.error("Incorrect data passed into update open ticket")
            return false;
        }

        const ticket = serverControl.getOpenTicketByTicketID(ticketID);

        if (!ticket) {
            console.error("No existing open ticket")
            return false;
        }

        (ticket as any).actualEndTime = closeTime

        let res = await databaseControl.CreateClosedTicket(ticket)
        
        if (!res) {
            console.error("Fail to create closed ticket")
            return false;
        }

        res = await databaseControl.CreateUserClosedTicket(ticket)

        if (!res) {
            console.error("Fail to create user closed ticket")
            return false;
        }

        res = await databaseControl.DeleteOpenTicket(ticketID)

        if (!res) {
            console.error("Fail to delete open ticket")
            return false;
        }

        serverEntity.removeTicket(ticketID)


        return true;

    }


}


