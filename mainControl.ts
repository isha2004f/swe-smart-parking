import { mainEntity } from "../entity/mainEntity";

export default class mainControl {
    // MC1
    static InitialiseUser(UserID:number) {
        // ME1 - Add user ID/ information into the entity
        
        try {
            fetch(`http://localhost:3000/UserInfo?userID=${UserID}`, {
                method: "GET"
            }).then(res => res.json()).then((object)=> {
                // console.log(object)
                if (object.userInfo != null) mainEntity.setUserInformation(object.userInfo)
            })
    
            fetch(`http://localhost:3000/OpenTicket/UserID?userID=${UserID}`,{
                method: "GET"
            }).then(res => res.json()).then((object) => {
                // console.log(object)
                if (object.openTicket != null) mainEntity.setTicket(object.openTicket)
            })
        } catch (error) {
            console.error("Fail to load user data")
        }
    }

    static async UpdateTicket(ticketID:number) {
        try {
            fetch(`http://localhost:3000/OpenTicket/TicketID?ticketID=${ticketID}`,{
                method: "GET"
            }).then(res => res.json()).then((object) => {
                // console.log(object)
                if (object.openTicket != null) {
                    mainEntity.setTicket(object.openTicket)
                }
            })
        } catch (error) {
            console.error("Fail to load user open ticket")
        }
    }

    static RemoveTicket() {
        console.log(mainEntity.getTicket())
        mainEntity.setTicket(null)
    }

}