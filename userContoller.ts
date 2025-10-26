import { Request, Response } from "express";
import databaseControl from "./databaseControl";
import emailControl from "./emailControl";
import serverControl from "./serverControl";

export default class userControl {
    static async E_AddNewUser(req: Request, res:Response) : Promise<void> {
        const {userFirebaseID} = req.body;
    
        if (!userFirebaseID) {
            res.status(400).json({ message: "userFirebaseID is required." });
            return;
        }
    
        const request = await databaseControl.CreateNewUser(userFirebaseID)
    
        if (request == null) res.status(500).json({message: "Failed to add new user."})
        else {
            res.status(201).json({
                        message: "User added sucessfully",
                        userID: request
            }) 
        }
    
    }
    
    static async E_GetUserID(req: Request, res:Response) : Promise<void> {
        const {userFirebaseID} = req.query;
    
        if (!userFirebaseID) {
            res.status(400).json({ message: "userFirebaseID is required." });
            return;
        }
    
        const request = await databaseControl.ReadUserID(userFirebaseID as string)
        if (request == null) res.status(500).json({message: "Failed to get user ID."})
        else {
            res.status(200).json({
                        message: "User ID sucessfully returned",
                        userID: request
            }) 
        }
    
    }
    
    static async E_DeleteUser(req: Request, res:Response) : Promise<void> {
        const {userID} = req.body;
    
        if (!userID) {
            res.status(400).json({ message: "userID is required." });
            return;
        }
    
        const request = await databaseControl.DeleteUser(userID)
        if (request == null) res.status(500).json({message: "Failed to delete user ID."})
        else {
            res.status(200).json({
                        message: "User ID sucessfully deleted",
                        boolean: request
            }) 
        }
    
    }
    
    static async E_AddUserInfo(req: Request, res:Response) : Promise<void> {
        const object = req.body;
    
        if (!object) {
            res.status(400).json({ message: "object is required." });
            return;
        }
    
        const request = await databaseControl.CreateUserInfo(object)
    
        if (request == null) res.status(500).json({message: "Failed to add new user information."})
        else {
            res.status(201).json({
                        message: "User information added sucessfully",
                        userInfo: request
            }) 
        }
    
    }
    
    static async E_GetUserInfo(req: Request, res:Response) : Promise<void> {
        const {userID} = req.query;
    
        if (!userID) {
            res.status(400).json({ message: "userID is required." });
            return;
        }
    
        const request = await databaseControl.ReadUserInfo(Number(userID as String))
    
        if (request == null) res.status(500).json({message: "Failed to get user information."})
        else {
            res.status(200).json({
                        message: "User information sucessfully returned",
                        userInfo: request
            }) 
        }
    
    }
    
    static async E_GetUserEmail(req: Request, res:Response) : Promise<void> {
        const {userID} = req.query;
    
        if (!userID) {
            res.status(400).json({ message: "userID is required." });
            return;
        }
    
        const request = await databaseControl.ReadUserEmail(Number(userID as String))
    
        if (request == null) res.status(500).json({message: "Failed to get user email."})
        else {
            res.status(200).json({
                        message: "User email sucessfully returned",
                        userEmail: request
            }) 
        }
    
    }
    
    static async E_UpdateUserInfo(req: Request, res:Response) : Promise<void> {
        const object = req.body;
    
        if (!object) {
            res.status(400).json({ message: "object is required." });
            return;
        }
    
        const request = await databaseControl.UpdateUserInfo(object)
    
        if (request == null) res.status(500).json({message: "Failed to get user email."})
        else {
            res.status(200).json({
                        message: "User email sucessfully returned",
                        boolean: request
            }) 
        }
    }
    
    static async E_CreateOpenTicket(req: Request, res:Response) : Promise<void> {
        const object = req.body;
    
        if (!object) {
            res.status(400).json({ message: "object is required." });
            return;
        }
    
        console.log(object)
        const request = await serverControl.createOpenTicket(object)
    
        if (request == null) res.status(500).json({message: "Failed to create open ticket."})
        else {
            await serverControl.addOpenTicketToServer(request)
            emailControl.NewTicketNotification(request)
    
            res.status(201).json({
                message: "Open ticket sucessfully created",
                ticketID: request
            }) 
        }
    }
    
    static async E_GetOpenTicketByUserID(req: Request, res:Response) : Promise<void> {
        const {userID} = req.query;
    
        if (!userID) {
            res.status(400).json({ message: "userID is required." });
            return;
        }
        if (typeof userID === "string") {
            const request = serverControl.getOpenTicketByUserID(Number(userID))
            if (request == null)  {
                res.status(200).json({
                message: "Open ticket does not exsist",
                openTicket: {} })      
            }
            else {
                res.status(200).json({
                            message: "Open ticket sucessfully returned",
                            openTicket: request
                }) 
            }
        } else {
            res.status(500).json({message: "Failed to get open ticket."})
        }
    }
    
    static async E_GetOpenTicketByTicketID(req: Request, res:Response) : Promise<void> {
        const {ticketID} = req.query;
    
        if (!ticketID) {
            res.status(400).json({ message: "ticketID is required." });
            return;
        }
        if (typeof ticketID === "string") {
            
            const request = serverControl.getOpenTicketByTicketID(Number(ticketID))
            console.log(request)
            if (request == null) res.status(500).json({message: "Failed to get open ticket."})
            else {
                res.status(200).json({
                            message: "Open ticket sucessfully returned",
                            openTicket: request
                }) 
            }
        } else {
            res.status(500).json({message: "Failed to get open ticket."})
        }
    }
    
    static async E_UpdateOpenTicketEndTime(req: Request, res:Response) : Promise<void> {
        const object = req.body;
    
        if (!object) {
            res.status(400).json({ message: "object is required." });
            return;
        }
    
        const request = await serverControl.updateOpenTicketEndTime(object)
        // console.log("Request for Update endtime: ", request)
    
        if (request == null) res.status(500).json({message: "Failed to update open ticket."})
        else {
            res.status(200).json({
                        message: "Open ticket sucessfully updated",
                        boolean: request
            }) 
        }
    }
    
    static async E_ClosedTicket(req: Request, res:Response) : Promise<void> {
        const object = req.body;
    
        if (!object) {
            res.status(400).json({ message: "object is required." });
            return;
        }
    
        const request = await serverControl.closeTicket(object)
    
        if (request == null) res.status(500).json({message: "Failed to create closed ticket."})
        else {
            res.status(201).json({
                        message: "Closed ticket sucessfully create",
                        boolean: request
            }) 
        }
    }
    
    
    static async E_GetClosedTicketsByUserID(req: Request, res: Response) {
        const {userID} = req.query;
    
        if (!userID) {
            res.status(400).json({ message: "userID is required." });
            return;
        }
    
        const request = await databaseControl.ReadAllClosedTicket(Number(userID as String))
    
        if (request == null) res.status(500).json({message: "Failed to get closed ticket."})
            else {
                res.status(200).json({
                    message: "Closed ticket sucessfully returned",
                    closedTickets: request
            }) 
        }
    
    }
    
    static async E_GetClosedTicket(req: Request, res:Response) : Promise<void> {
        const {ticketID} = req.query;
    
        if (!ticketID) {
            res.status(400).json({ message: "ticketID is required." });
            return;
        }
    
        const request = await databaseControl.ReadClosedTicket(Number(ticketID as String))
    
        if (request == null) res.status(500).json({message: "Failed to get closed ticket."})
        else {
            res.status(200).json({
                        message: "Closed ticket sucessfully returned",
                        closedTicket: request
            }) 
        }
    }
    
    static async E_CreateUserClosedTicket(req: Request, res:Response) : Promise<void> {
        const object = req.body;
    
        if (!object) {
            res.status(400).json({ message: "object is required." });
            return;
        }
    
        const request = await databaseControl.CreateUserClosedTicket(object)
    
        if (request == null) res.status(500).json({message: "Failed to create user closed ticket."})
        else {
            res.status(201).json({
                        message: "User closed ticket sucessfully created",
                        boolean: request
            }) 
        }
    }
    
    static async E_GetUserClosedTicket(req: Request, res:Response) : Promise<void> {
        const {userID} = req.query;
    
        const request = await databaseControl.ReadUserClosedTicket(Number(userID as String))
    
        if (request == null) res.status(500).json({message: "Failed to get user closed ticket."})
        else {
            res.status(200).json({
                        message: "User closed ticket sucessfully returned",
                        clostTicketArray: request
            }) 
        }
    }
    
    static async E_GetCarparkAddress(req: Request, res:Response) : Promise<void> {
        const {carparkID} = req.query;
    
        const request = await databaseControl.ReadCarparkAddress(carparkID as string)
    
        if (request == null) res.status(500).json({message: "Failed to get carpark address."})
        else {
            res.status(200).json({
                        message: "Carpark address sucessfully returned",
                        carparkAddress: request
            }) 
        }
    }
    
    static async E_GetRate(req: Request, res:Response) : Promise<void> {
        const object = req.query;
    
        const request = await databaseControl.GetRate(object)
    
        if (request == null) res.status(500).json({message: "Failed to get carpark rate."})
        else {
            res.status(200).json({
                        message: "Carpark rate sucessfully returned",
                        rate: request
            }) 
        }
    }
}

// export async function E_AddNewUser(req: Request, res:Response) : Promise<void> {
//     const {userFirebaseID} = req.body;

//     if (!userFirebaseID) {
//         res.status(400).json({ message: "userFirebaseID is required." });
//         return;
//     }

//     const request = await dataBaseControl.AddNewUser(userFirebaseID)

//     if (request == null) res.status(500).json({message: "Failed to add new user."})
//     else {
//         res.status(201).json({
//                     message: "User added sucessfully",
//                     userID: request
//         }) 
//     }

// }

// export async function E_GetUserID(req: Request, res:Response) : Promise<void> {
//     const {userFirebaseID} = req.query;

//     if (!userFirebaseID) {
//         res.status(400).json({ message: "userFirebaseID is required." });
//         return;
//     }

//     const request = await dataBaseControl.GetUserID(userFirebaseID as string)
//     if (request == null) res.status(500).json({message: "Failed to get user ID."})
//     else {
//         res.status(200).json({
//                     message: "User ID sucessfully returned",
//                     userID: request
//         }) 
//     }

// }

// export async function E_DeleteUser(req: Request, res:Response) : Promise<void> {
//     const {userID} = req.body;

//     if (!userID) {
//         res.status(400).json({ message: "userID is required." });
//         return;
//     }

//     const request = await dataBaseControl.DeleteUser(userID)
//     if (request == null) res.status(500).json({message: "Failed to delete user ID."})
//     else {
//         res.status(200).json({
//                     message: "User ID sucessfully deleted",
//                     boolean: request
//         }) 
//     }

// }

// export async function E_AddUserInfo(req: Request, res:Response) : Promise<void> {
//     const object = req.body;

//     if (!object) {
//         res.status(400).json({ message: "object is required." });
//         return;
//     }

//     const request = await dataBaseControl.AddUserInfo(object)

//     if (request == null) res.status(500).json({message: "Failed to add new user information."})
//     else {
//         res.status(201).json({
//                     message: "User information added sucessfully",
//                     userInfo: request
//         }) 
//     }

// }

// export async function E_GetUserInfo(req: Request, res:Response) : Promise<void> {
//     const {userID} = req.query;

//     if (!userID) {
//         res.status(400).json({ message: "userID is required." });
//         return;
//     }

//     const request = await dataBaseControl.GetUserInfo(Number(userID as String))

//     if (request == null) res.status(500).json({message: "Failed to get user information."})
//     else {
//         res.status(200).json({
//                     message: "User information sucessfully returned",
//                     userInfo: request
//         }) 
//     }

// }

// export async function E_GetUserEmail(req: Request, res:Response) : Promise<void> {
//     const {userID} = req.query;

//     if (!userID) {
//         res.status(400).json({ message: "userID is required." });
//         return;
//     }

//     const request = await dataBaseControl.GetUserEmail(Number(userID as String))

//     if (request == null) res.status(500).json({message: "Failed to get user email."})
//     else {
//         res.status(200).json({
//                     message: "User email sucessfully returned",
//                     userEmail: request
//         }) 
//     }

// }

// export async function E_UpdateUserInfo(req: Request, res:Response) : Promise<void> {
//     const object = req.body;

//     if (!object) {
//         res.status(400).json({ message: "object is required." });
//         return;
//     }

//     const request = await dataBaseControl.UpdateUserInfo(object)

//     if (request == null) res.status(500).json({message: "Failed to get user email."})
//     else {
//         res.status(200).json({
//                     message: "User email sucessfully returned",
//                     boolean: request
//         }) 
//     }
// }

// export async function E_CreateOpenTicket(req: Request, res:Response) : Promise<void> {
//     const object = req.body;

//     if (!object) {
//         res.status(400).json({ message: "object is required." });
//         return;
//     }

//     console.log(object)
//     const request = await serverControl.createOpenTicket(object)

//     if (request == null) res.status(500).json({message: "Failed to create open ticket."})
//     else {
//         await serverControl.addOpenTicketToServer(request)
//         emailControl.NewTicketNotification(request)

//         res.status(201).json({
//             message: "Open ticket sucessfully created",
//             ticketID: request
//         }) 
//     }
// }

// export async function E_GetOpenTicketByUserID(req: Request, res:Response) : Promise<void> {
//     const {userID} = req.query;

//     if (!userID) {
//         res.status(400).json({ message: "userID is required." });
//         return;
//     }
//     if (typeof userID === "string") {
//         const request = serverControl.getOpenTicketByUserID(Number(userID))
//         if (request == null)  {
//             res.status(200).json({
//             message: "Open ticket does not exsist",
//             openTicket: {} })      
//         }
//         else {
//             res.status(200).json({
//                         message: "Open ticket sucessfully returned",
//                         openTicket: request
//             }) 
//         }
//     } else {
//         res.status(500).json({message: "Failed to get open ticket."})
//     }
// }

// export async function E_GetOpenTicketByTicketID(req: Request, res:Response) : Promise<void> {
//     const {ticketID} = req.query;

//     if (!ticketID) {
//         res.status(400).json({ message: "ticketID is required." });
//         return;
//     }
//     if (typeof ticketID === "string") {
        
//         const request = serverControl.getOpenTicketByTicketID(Number(ticketID))

//         if (request == null) res.status(500).json({message: "Failed to get open ticket."})
//         else {
//             res.status(200).json({
//                         message: "Open ticket sucessfully returned",
//                         openTicket: request
//             }) 
//         }
//     } else {
//         res.status(500).json({message: "Failed to get open ticket."})
//     }
// }

// export async function E_UpdateOpenTicketEndTime(req: Request, res:Response) : Promise<void> {
//     const object = req.body;

//     if (!object) {
//         res.status(400).json({ message: "object is required." });
//         return;
//     }

//     const request = await serverControl.updateOpenTicketEndTime(object)
//     // console.log("Request for Update endtime: ", request)

//     if (request == null) res.status(500).json({message: "Failed to update open ticket."})
//     else {
//         res.status(200).json({
//                     message: "Open ticket sucessfully updated",
//                     boolean: request
//         }) 
//     }
// }

// // export async function E_DeleteOpenTicket(req: Request, res:Response) : Promise<void> {
// //     const {ticketID} = req.body;

// //     if (!ticketID) {
// //         res.status(400).json({ message: "ticketID is required." });
// //         return;
// //     }

// //     const request = await GetOpenTicketByTicketID(ticketID)

// //     if (request == null) res.status(500).json({message: "Failed to delete open ticket."})
// //     else {
// //         res.status(200).json({
// //                     message: "Open ticket sucessfully deleted",
// //                     boolean: request
// //         }) 
// //     }
// // }

// export async function E_ClosedTicket(req: Request, res:Response) : Promise<void> {
//     const object = req.body;

//     if (!object) {
//         res.status(400).json({ message: "object is required." });
//         return;
//     }

//     const request = await serverControl.closeTicket(object)

//     if (request == null) res.status(500).json({message: "Failed to create closed ticket."})
//     else {
//         res.status(201).json({
//                     message: "Closed ticket sucessfully create",
//                     boolean: request
//         }) 
//     }
// }


// export async function E_GetClosedTicketsByUserID(req: Request, res: Response) {
//     const {userID} = req.query;

//     if (!userID) {
//         res.status(400).json({ message: "userID is required." });
//         return;
//     }

//     const request = await dataBaseControl.GetAllClosedTicket(Number(userID as String))

//     if (request == null) res.status(500).json({message: "Failed to get closed ticket."})
//         else {
//             res.status(200).json({
//                 message: "Closed ticket sucessfully returned",
//                 closedTickets: request
//         }) 
//     }

// }

// export async function E_GetClosedTicket(req: Request, res:Response) : Promise<void> {
//     const {ticketID} = req.query;

//     if (!ticketID) {
//         res.status(400).json({ message: "ticketID is required." });
//         return;
//     }

//     const request = await dataBaseControl.GetClosedTicket(Number(ticketID as String))

//     if (request == null) res.status(500).json({message: "Failed to get closed ticket."})
//     else {
//         res.status(200).json({
//                     message: "Closed ticket sucessfully returned",
//                     closedTicket: request
//         }) 
//     }
// }

// export async function E_CreateUserClosedTicket(req: Request, res:Response) : Promise<void> {
//     const object = req.body;

//     if (!object) {
//         res.status(400).json({ message: "object is required." });
//         return;
//     }

//     const request = await dataBaseControl.CreateUserClosedTicket(object)

//     if (request == null) res.status(500).json({message: "Failed to create user closed ticket."})
//     else {
//         res.status(201).json({
//                     message: "User closed ticket sucessfully created",
//                     boolean: request
//         }) 
//     }
// }

// export async function E_GetUserClosedTicket(req: Request, res:Response) : Promise<void> {
//     const {userID} = req.query;

//     const request = await dataBaseControl.GetUserClosedTicket(Number(userID as String))

//     if (request == null) res.status(500).json({message: "Failed to get user closed ticket."})
//     else {
//         res.status(200).json({
//                     message: "User closed ticket sucessfully returned",
//                     clostTicketArray: request
//         }) 
//     }
// }

// export async function E_GetCarparkAddress(req: Request, res:Response) : Promise<void> {
//     const {carparkID} = req.query;

//     const request = await dataBaseControl.GetCarparkAddress(carparkID as string)

//     if (request == null) res.status(500).json({message: "Failed to get carpark address."})
//     else {
//         res.status(200).json({
//                     message: "Carpark address sucessfully returned",
//                     carparkAddress: request
//         }) 
//     }
// }

// export async function E_GetRate(req: Request, res:Response) : Promise<void> {
//     const object = req.query;

//     const request = await dataBaseControl.GetRate(object)

//     if (request == null) res.status(500).json({message: "Failed to get carpark rate."})
//     else {
//         res.status(200).json({
//                     message: "Carpark rate sucessfully returned",
//                     rate: request
//         }) 
//     }
// }
