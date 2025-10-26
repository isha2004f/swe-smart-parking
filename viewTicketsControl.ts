import { mainEntity, OpenTicket } from "../entity/mainEntity";
import mainControl from "./mainControl";


export default class viewTicketControl {
    static async getTicket()  {
        const ticket = mainEntity.getTicket()
        if(!ticket?.ticketID) return {
            ticket: null,
            address: null
        };
        const res = await fetch(`http://localhost:3000/CarparkAddress?carparkID=${ticket.parkingLotID}`)
        const {carparkAddress} = await res.json() 
        const returnObj = {
            ticket: ticket,
            address: carparkAddress 
        }
        // console.log(returnObj)
        return returnObj;
    }

    static async addTime(ticketID: number, newEndTime: Date) {
        const parameter = {
            ticketID: ticketID,
            newEndTime: newEndTime
        }

        const res = await fetch(`http://localhost:3000/OpenTicket`,{
            method: "PUT",
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(parameter)
        })

        const {boolean} = await res.json()

        if (boolean) {  
            mainControl.UpdateTicket(ticketID)
            return true
        }
        return false
    }

    static async closeTicket(ticketID: number, closeTime: Date) {
        const parameter = {
            ticketID: ticketID,
            closeTime: closeTime
        }

        const res = await fetch(`http://localhost:3000/ClosedTicket`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(parameter)
        })

        const {boolean} = await res.json()

        if (boolean) {
            mainControl.RemoveTicket()
            return true
        }
        return false
    }
    
    static async getAllClosedTickets() {

        const userID = mainEntity.getUserID();

        const res = await fetch(`http://localhost:3000/ClosedTickets?userID=${userID}`,{method: "GET"})
        
        const {closedTickets} = await res.json()
        
        // console.log(closedTickets)
        if(!closedTickets) return [];
        return closedTickets
    }
}

