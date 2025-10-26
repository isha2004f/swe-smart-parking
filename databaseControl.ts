import { 
    TableNames_App, ColumnNames_App, TableNames_HDBInfo, ColumnNames_HDBInfo, Operator, 
    ConditionVariable
} from "../boundary/databaseAccess";
import { ClosedTicket, OpenTicket, UserInformation } from "../entity/databaseTypes";
import databaseRepository from "../boundary/databaseAccess";

enum feeTypes {
    motorcycle = 0.65,
    car_CP = 1.2,
    car_NCP = 0.6,
    heavy_vehicle = 1.2
}

function ErrorMsg_MySQL() {
    console.error("MySQL Error")
    return null;
}

function ErrorMsg_NoEntry() {
    console.error("Entry does not exist")
    return null;
}

function ErrorMsg_DeletionFailed() {
    console.error("Entry does not exist")
    return null;
}

// Functions needed for the application

export default class databaseControl {
    /**
     * Function to add new users' FirebaseID to the database and generate a unique user ID
     * @param userFirebaseID FirebaseID to be taken when they first register their account
     * @returns the inserted ID which is their user ID
     */
        static async CreateNewUser( userFirebaseID:String ) : Promise<number|null>{
        const res = await databaseRepository.Create(TableNames_App.UserID, 
            {
                [ColumnNames_App.userFirebaseID] : userFirebaseID
            }
        )
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        return res.insertId;
    }


    /**
     * Function to request for the user ID of the given FirebaseID
     * @param userFirebaseID FirebaseID of the user to be searched
     * @returns user ID of given FirebaseID
     */
    static async ReadUserID( userFirebaseID:String ) : Promise<number|null> {
        const res = await databaseRepository.Read(TableNames_App.UserID, 
            {  
                [ColumnNames_App.userFirebaseID]:
                {
                    [ConditionVariable.operator]: Operator.EqualTo, 
                    [ConditionVariable.values]: userFirebaseID
                }
            }
        );
        
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res[0] === undefined) {
            return ErrorMsg_NoEntry();
        }

        return res[0][ColumnNames_App.userID];
    }



// /**
//  * Function to request for the user email of the given ID
//  * @param userID user ID of the email to be searched
//  * @returns user email of given email
//  */
// export async function GetUserEmail( userID:number ) : Promise<String|null> {
//     const res = await Read(TableNames_App.UserID, 
//         {  
//             [ColumnNames_App.userID]:
//             {
//                 [ConditionVariable.operator]: Operator.EqualTo, 
//                 [ConditionVariable.values]: userID
//             }
//         }
//     );
    
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res[0] === undefined) {
//         return ErrorMsg_NoEntry();
//     }

//     return res[0][ColumnNames_App.userEmail];
// }

// /**
//  * Function to update the user email of the given user ID
//  * @param userID user ID of email to be updated
//  * @param userEmail new email to be written
//  * @returns true if successful
//  */
// export async function UpdateUserEmail(userID:number, userEmail:String) : Promise<boolean|null> {
//     const res = await Update(TableNames_App.UserID, 
//         {  
//             "set":
//             {
//                 [ColumnNames_App.userEmail] : userEmail
//             },
//             "where":
//             {
//                 [ColumnNames_App.userID] : 
//                 {
//                     [ConditionVariable.operator] : Operator.EqualTo,
//                     [ConditionVariable.values] : userID
//                 }
//             }
//         }
//     );
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res.affectedRows === 0) {
//         return ErrorMsg_NoEntry();
//     } 
    
//     return true;
// } 

    /**
     * Function to delete the user email from the database (user is removed from our system)
     * @param userID user to be deleted
     * @returns true if successful
     */
    static async DeleteUser(userID:number) : Promise<boolean|null> {
        const res = await databaseRepository.Delete(TableNames_App.UserID,
            {
                [ColumnNames_App.userID] : 
                {
                    [ConditionVariable.operator] : Operator.EqualTo,
                    [ConditionVariable.values] : userID
                }   
            }
        )
        
        if (res === null) {
            return ErrorMsg_MySQL();
        }

        return true
    } 

    /**
     * Function to add user information by given user ID
     * @param userID user ID to be added
     * @param userEmail email following (name@domain.com.sg etc.)
     * @param firstName first name of user
     * @param lastName last name of user
     * @param userPhoneNo phone number to be added (String of length 8)
     * @returns true if successful
     */
    static async CreateUserInfo( object:any ) : Promise<boolean|null> {
        const {userID, userEmail, firstName, lastName, userPhoneNo} = object;
        if (userPhoneNo.length != 8) { // Phone number is 8 char long
            console.error("Phone number not 8 characters long")
            return null;
        }

        if (!databaseControl.isValidEmail(userEmail)) {
            console.error("Email does not follow the right regex")
            return null;
        }
        console.log(object)
        const res = await databaseRepository.Create(TableNames_App.UserInformation, 
            {
                [ColumnNames_App.userID] : userID,
                [ColumnNames_App.userEmail] : userEmail,
                [ColumnNames_App.firstName] : firstName,
                [ColumnNames_App.lastName] : lastName,
                [ColumnNames_App.userPhoneNo] : userPhoneNo
            }
        )
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        return true;
    }

    /**
     * Function to request for the information of the given user ID
     * @param userID user ID of the informationto be searched
     * @returns UserInfomation object
     */
    static async ReadUserInfo( userID:number ) : Promise<UserInformation|null> {
        const res = await databaseRepository.Read(TableNames_App.UserInformation, 
            {  
                [ColumnNames_App.userID]:
                {
                    [ConditionVariable.operator]: Operator.EqualTo, 
                    [ConditionVariable.values]: userID
                }
            }
        );
        
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res[0] === undefined) {
            return ErrorMsg_NoEntry();
        }

        return res[0] as UserInformation;
    }

    /**
     * Function to request for the user email of the given user ID
     * @param userID user ID of the informationto be searched
     * @returns String of length 8
     */
    static async ReadUserEmail( userID:number ) : Promise<string|null> {
        const res = await databaseRepository.Read(TableNames_App.UserInformation, 
            {  
                [ColumnNames_App.userID]:
                {
                    [ConditionVariable.operator]: Operator.EqualTo, 
                    [ConditionVariable.values]: userID
                }
            }
        );
        
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res[0] === undefined) {
            return ErrorMsg_NoEntry();
        }

        return (res[0] as UserInformation).userEmail;
    }

    /** 
     * Function to update the user info of the given user ID
     * @param userID user ID of phone number to be updated
     * @param userEmail new email to be written
     * @param firstName new name?
     * @param lastName new name?
     * @param userPhoneNo new phone number to be written (String of length 8)
     * @returns 
     */
    static async UpdateUserInfo(object:any) : Promise<boolean|null> {
        const {userID, userEmail, firstName, lastName, userPhoneNo} = object;
        if (userPhoneNo.length != 8) { // Phone number is 8 char long
            console.error("Phone number not 8 characters long")
            return null;
        }

        if (!databaseControl.isValidEmail(userEmail)) {
            console.error("Email does not follow the right regex")
            return null;
        }

        const res = await databaseRepository.Update(TableNames_App.UserInformation, 
            {  
                "set":
                {
                    [ColumnNames_App.userEmail] : userEmail,
                    [ColumnNames_App.firstName] : firstName,
                    [ColumnNames_App.lastName] : lastName,
                    [ColumnNames_App.userPhoneNo] : userPhoneNo
                },
                "where":
                {
                    [ColumnNames_App.userID] : 
                    {
                        [ConditionVariable.operator] : Operator.EqualTo,
                        [ConditionVariable.values] : userID
                    }
                }
            }
        );
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res.affectedRows === 0) {
            return ErrorMsg_NoEntry();
        }
        
        return true;
    } 

// /** Might not need. UserInformation is automatically deleted when user is removed from userID
//  * Function to delete the user phone number from the database (user is removed from our system)
//  * @param userID 
//  * @returns 
//  */
// export const d_UserInformation = async (userID:number) : Promise<boolean> => {
//     const res = await Delete(TableNames.UserInformation,
//         {
//             [ColumnNames.userID] : 
//             {
//                 [ConditionVariable.operator] : Operator.EqualTo,
//                 [ConditionVariable.values] : userID
//             }   
//         }
//     )
    
//     if (res === null) {
//         throw new Error("MySQL Error or Deletion fail");
//     }
//     return true
// }

    /**
     * Function to add user payment method by given user ID
     * @param userID user ID to be added
     * @param customerID customerID to be added (Obtained from Stripe) 
     * @returns true if successful
     */
    static async AddUserPayment( userID:number, customerID:String) : Promise<boolean|null> {
        
        const res = await databaseRepository.Create(TableNames_App.UserPayment, 
            {
                [ColumnNames_App.userID] : userID,
                [ColumnNames_App.customerID] : customerID
            }
        )
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        return true;
    }

    /**
     * Function to request user payment method by given user ID
     * @param userID user ID of the payment method to be searched
     * @returns the customerID for Stripe API
     */
    static async GetUserPayment( userID:number ) : Promise<String|null> {
        const res = await databaseRepository.Read(TableNames_App.UserPayment, 
            {  
                [ColumnNames_App.userID]:
                {
                    [ConditionVariable.operator]: Operator.EqualTo, 
                    [ConditionVariable.values]: userID
                }
            }
        );
        
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res[0] === undefined) {
            return ErrorMsg_NoEntry();
        }

        return res[0][ColumnNames_App.customerID];
    }

    /**
     * Function to update the user phone number of the given user ID
     * @param userID user ID of payment method to be updated
     * @param customerID new customerID to be written (Obtained from Stripe)
     * @returns 
     */
    static async UpdateUserPayment(userID:number, customerID:String) : Promise<boolean|null> {

        const res = await databaseRepository.Update(TableNames_App.UserPayment, 
            {  
                "set":
                {
                    [ColumnNames_App.customerID] : customerID
                },
                "where":
                {
                    [ColumnNames_App.userID] : 
                    {
                        [ConditionVariable.operator] : Operator.EqualTo,
                        [ConditionVariable.values] : userID
                    }
                }
            }
        );
        if (res === null) {
            return ErrorMsg_MySQL();
        }

        if (res.affectedRows === 0) {
            return ErrorMsg_NoEntry();
        }
        
        return true;
    } 

// /** Might not need. UserPayment is automatically deleted when user is removed from userID
//  * Function to delete the user payment method from the database (user is removed from our system)
//  * @param userID 
//  * @returns 
//  */
// export const d_UserPayment = async (userID:number) : Promise<boolean> => {
//     const res = await Delete(TableNames.UserPayment,
//         {
//             [ColumnNames.userID] : 
//             {
//                 [ConditionVariable.operator] : Operator.EqualTo,
//                 [ConditionVariable.values] : userID
//             }   
//         }
//     )
    
//     if (res === null) {
//         throw new Error("MySQL Error or Deletion fail");
//     }
//     return true;
// }

    /**
     * Function to add a open ticket into the database
     * @param parkingLotID Parking Lot ID to be added (Obtained from Carpark Availability API / HDB Carpark CSV) 
     * @param licensePlate License Plate to be added (User input)
     * @param ticketStartTime Time where the ticket was opened
     * @param ticketEndTime End time calculated by start time + duration
     * @param userID user ID of the owner of the ticket
     * @returns the inserted ID which is the ticket ID
     */
    static async CreateOpenTicket( object:any ) : Promise<number|null> {
        const {vehType, parkingLotID, licensePlate, ticketStartTime, ticketEndTime, userID} = object
        console.log(vehType, parkingLotID, licensePlate, ticketStartTime, ticketEndTime, userID)
        const res = await databaseRepository.Create(TableNames_App.OpenTickets, 
            {
                [ColumnNames_App.vehType] : vehType,
                [ColumnNames_App.parkingLotID] : parkingLotID,
                [ColumnNames_App.licensePlate] : licensePlate,
                [ColumnNames_App.ticketStartTime] : databaseControl.dateToString(new Date(ticketStartTime)),
                [ColumnNames_App.ticketEndTime] : databaseControl.dateToString(new Date(ticketEndTime)),
                [ColumnNames_App.userID] : Number(userID)
            }
        )
        if (res === null) {
            return ErrorMsg_MySQL()
        }
        return res.insertId;
    }

    /**
     * Function to find the open ticket of a user
     * @param userID user ID to be filtered
     * @returns an object containing information of the open ticket
     */
    static async ReadOpenTicketByUserID( userID:number ) : Promise<OpenTicket|null> {
        
        const res = await databaseRepository.Read(TableNames_App.OpenTickets, 
            {
                [ColumnNames_App.userID]:
                {
                    [ConditionVariable.operator]: Operator.EqualTo, 
                    [ConditionVariable.values]: userID
                }
            }
        )
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res[0] === undefined) {
            return ErrorMsg_NoEntry();
        }

        const ticket = res[0] as OpenTicket
        ticket.ticketEndTime = databaseControl.dateOffsetPlus(ticket.ticketEndTime)
        ticket.ticketStartTime= databaseControl.dateOffsetPlus(ticket.ticketStartTime)
        const fee = await databaseControl.GetRate({carparkID:ticket.parkingLotID, vehType:ticket.vehType})
        ticket.fee = fee ? fee: 0
        return ticket;
    }

    /**
     * Function to find the open ticket of a ticketID
     * @param ticketID ticketID to be filtered
     * @returns an object containing information of the open ticket
     */
    static async ReadOpenTicketByTicketID( ticketID:number ) : Promise<OpenTicket|null> {
        
        const res = await databaseRepository.Read(TableNames_App.OpenTickets, 
            {
                [ColumnNames_App.ticketID]:
                {
                    [ConditionVariable.operator]: Operator.EqualTo, 
                    [ConditionVariable.values]: ticketID
                }
            }
        )
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res[0] === undefined) {
            return ErrorMsg_NoEntry();
        }
        const ticket = res[0] as OpenTicket
        ticket.ticketEndTime = databaseControl.dateOffsetPlus(ticket.ticketEndTime)
        ticket.ticketStartTime= databaseControl.dateOffsetPlus(ticket.ticketStartTime)
        const fee = await databaseControl.GetRate({carparkID:ticket.parkingLotID, vehType:ticket.vehType})
        ticket.fee = fee ? fee: 0
        return ticket;
    }

    static async ReadOpenTicket() : Promise<OpenTicket[]|null> {
    
        const res = await databaseRepository.Read(TableNames_App.OpenTickets)
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res[0] === undefined) {
            return ErrorMsg_NoEntry();
        }
        const tickets = res as OpenTicket[]
        for (const ticket of tickets) {
            // const ticket = res[0] as OpenTicket
            ticket.ticketEndTime = databaseControl.dateOffsetPlus(ticket.ticketEndTime)
            ticket.ticketStartTime= databaseControl.dateOffsetPlus(ticket.ticketStartTime)
            const fee = await databaseControl.GetRate({carparkID:ticket.parkingLotID, vehType:ticket.vehType})
            ticket.fee = fee ? fee: 0
        }



        return res as OpenTicket[];
    }

    /**
     * Function to update the end time of the open ticket (When the user increase the duration)
     * @param ticketID ticket ID to be updated
     * @param ticketEndTime new ticket end time (Calculated by ticket start time + new duration)
     * @returns true if successful
     */
    static async UpdateOpenTicketEndTime( object:any ) : Promise<boolean|null> {
        const {ticketID,newEndTime} = object
        const res = await databaseRepository.Update(TableNames_App.OpenTickets,
            {
                "set": {
                    [ColumnNames_App.ticketEndTime] : databaseControl.dateToString(new Date(newEndTime))
                },
                "where": {
                    [ColumnNames_App.ticketID]: 
                    {
                        [ConditionVariable.operator] : Operator.EqualTo,
                        [ConditionVariable.values] : ticketID
                    }
                }
            }
        )

        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res.affectedRows === 0) {
            return ErrorMsg_NoEntry();
        }
        
        return true;
    }

    static async UpdateOpenTicketNotified( object: {ticketID:number, value:boolean} ) : Promise<boolean|null> {
        const {ticketID,value} = object
        const res = await databaseRepository.Update(TableNames_App.OpenTickets,
            {
                "set": {
                    [ColumnNames_App.notified] : value
                },
                "where": {
                    [ColumnNames_App.ticketID]: 
                    {
                        [ConditionVariable.operator] : Operator.EqualTo,
                        [ConditionVariable.values] : ticketID
                    }
                }
            }
        )

        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res.affectedRows === 0) {
            return ErrorMsg_NoEntry();
        }
        
        return true;
    }


    /**
     * Function to delete the open ticket (When ticket is closed)
     * @param ticketID ticket ID to be deleted
     * @returns true if ticket is deleted
     */
    static async DeleteOpenTicket(ticketID:number) : Promise<boolean|null> {
        const res = await databaseRepository.Delete(TableNames_App.OpenTickets,
            {
                [ColumnNames_App.ticketID] : 
                {
                    [ConditionVariable.operator] : Operator.EqualTo,
                    [ConditionVariable.values] : ticketID
                }   
            }
        )
        
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        return true;
    }

    /**
     * Function to add a closed ticket into the database for storage
     * 
     * Variables are obtained from the open ticket
     * @param ticketID 
     * @param parkingLotID 
     * @param licensePlate 
     * @param ticketStartTime 
     * @param ticketEndTime 
     * @param actualEndTime Actual time where ticket was closed
     * @returns 
     */
    static async CreateClosedTicket( object:any ) : Promise<boolean|null> {
        const {ticketID, parkingLotID, licensePlate, ticketStartTime, ticketEndTime, actualEndTime} = object
        const res = await databaseRepository.Create(TableNames_App.ClosedTickets, 
            {
                [ColumnNames_App.ticketID] : ticketID,
                [ColumnNames_App.parkingLotID] : parkingLotID,
                [ColumnNames_App.licensePlate] : licensePlate,
                [ColumnNames_App.ticketStartTime] : databaseControl.dateToString(new Date(ticketStartTime)),
                [ColumnNames_App.ticketEndTime] : databaseControl.dateToString(new Date(ticketEndTime)),
                [ColumnNames_App.actualEndTime] : databaseControl.dateToString(new Date(actualEndTime))
            }
        )
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        return true;
    }

    /**
     * Function to return all the past closed tickets of the given user ID
     * @param userID user ID to be queried
     */
    static async ReadAllClosedTicket(userID:number) {
        // Get all ticketIDs
        const res = await databaseRepository.Read(TableNames_App.UserClosedTickets,
            {
                [ColumnNames_App.userID]:
                {
                    [ConditionVariable.operator]: Operator.EqualTo, 
                    [ConditionVariable.values]: userID
                }
            }

        )
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res[0] === undefined) {
            return ErrorMsg_NoEntry();
        }

        const ticketIDs = res.map(item => item.ticketID)

        const allTickets = await databaseRepository.Read(TableNames_App.ClosedTickets,
            {
                [ColumnNames_App.ticketID]:
                {
                    [ConditionVariable.operator] : Operator.In,
                    [ConditionVariable.values] : ticketIDs
                }
            }
        )

        if (allTickets === null) {
            return ErrorMsg_MySQL();
        }
        if (allTickets[0] === undefined) {
            return ErrorMsg_NoEntry();
        }

        for (const ticket of allTickets){
            ticket.address = await databaseControl.ReadCarparkAddress(ticket.parkingLotID)
            ticket.fee = await databaseControl.GetRate({ carparkID: ticket.parkingLotID , vehType: ticket.vehType })
        }


        // console.log(allTickets)

        return allTickets

    }

    /**
     * Function to request for user's past tickets
     * @param ticketID ticket ID to be returned
     * @returns an object with the information of the closed tickets
     */
    static async ReadClosedTicket( ticketID:number ) : Promise<ClosedTicket|null> {
        
        const res = await databaseRepository.Read(TableNames_App.ClosedTickets, 
            {
                [ColumnNames_App.ticketID]:
                {
                    [ConditionVariable.operator]: Operator.EqualTo, 
                    [ConditionVariable.values]: ticketID
                }
            }
        )
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res[0] === undefined) {
            return ErrorMsg_NoEntry();
        }
        return res[0] as ClosedTicket;
    }


    /**
     * Function to create a (userID,ticketID) pair to map user ID to all its closed tickets
     * @param ticketID ticket ID to be added (Closed Ticket) 
     * @param userID user ID to be added 
     * @returns true if successful
     */
    static async CreateUserClosedTicket(object:any): Promise<boolean|null> {
        const {ticketID, userID} = object
        const res = await databaseRepository.Create(TableNames_App.UserClosedTickets,
            {
                [ColumnNames_App.userID] : userID,
                [ColumnNames_App.ticketID] : ticketID
            }
        )
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        return true;
    }

    /**
     * Function to request for all the closed tickets of a user
     * @param userID user ID to be searched
     * @returns an array of (userID,ticketID)
     */
    static async ReadUserClosedTicket(userID: number): Promise<object|null> {
        const res = await databaseRepository.Read(TableNames_App.UserClosedTickets,
            {
                [ColumnNames_App.userID]:
                {
                    [ConditionVariable.operator]: Operator.EqualTo, 
                    [ConditionVariable.values]: userID
                }
            }
        )

        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res[0] === undefined) {
            return ErrorMsg_NoEntry();
        }

        return res;
    }

    /**
     * Function to check regex of email
     * @param email email to be checked
     * @returns true if valid
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    /**
     * Function to convert Date to String
     * @param date Date to be converted
     * @returns Formatted string
     */
    static dateToString( date:Date ) : String {
        date.setSeconds(0); // Remove the seconds
        const TimeZoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - TimeZoneOffset).toISOString().replace('T', " ").slice(0,19);
    }

    static dateOffsetPlus( date:Date ) : Date {
        const TimeZoneOffset = 8 * 60 * 60000;
        // console.log(date)
        // console.log(new Date(date.getTime() + TimeZoneOffset))
        return new Date(date.getTime() + TimeZoneOffset)
    }


    /**
     * Function to obtain the carpark address with the given carparkID
     * @param carparkID carparkID to be searched
     * @returns address of the carparkID
     */
    static async ReadCarparkAddress(carparkID: string): Promise<String|null> {
        const res = await databaseRepository.Read(TableNames_HDBInfo.HDBCarpark, {
            [ColumnNames_HDBInfo.carparkNo] : {
                [ConditionVariable.operator] : Operator.EqualTo,
                [ConditionVariable.values] : carparkID
            }
        })
        if (res === null) {
            return ErrorMsg_MySQL();
        }
        if (res[0] === undefined) {
            return ErrorMsg_NoEntry();
        }
        return res[0].address;
    } 

    /**
     * Function to obtain the rates of the carpark
     * @param carparkID carparkID to be searched
     * @param vehType type of vehicle that is parking
     * @returns rate per half-hour (Car/Heavy Vehicles) / lot (MCycle)
     */
    static async GetRate(object:any) : Promise<number|null> {
        const { carparkID, vehType } = object
        if (vehType == "M")
            return feeTypes.motorcycle;
        else if (vehType == "HV")
            return feeTypes.heavy_vehicle;
        else if (vehType == "C") {
            const res = await databaseRepository.Read(TableNames_HDBInfo.WithinCtrlArea, {
                [ColumnNames_HDBInfo.carparkNo] : {
                    [ConditionVariable.operator] : Operator.EqualTo,
                    [ConditionVariable.values] : carparkID
                } 
            })
            if (res === null) {
                return ErrorMsg_MySQL();
            }
            if (res[0] === undefined) {
                return feeTypes.car_NCP;
            } else return feeTypes.car_CP;

        }
        return null
    }
}


// /**
//  * Function to add new users' FirebaseID to the database and generate a unique user ID
//  * @param userFirebaseID FirebaseID to be taken when they first register their account
//  * @returns the inserted ID which is their user ID
//  */
// export async function AddNewUser( userFirebaseID:String ) : Promise<number|null>{
//     const res = await Create(TableNames_App.UserID, 
//         {
//             [ColumnNames_App.userFirebaseID] : userFirebaseID
//         }
//     )
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     return res.insertId;
// }


// /**
//  * Function to request for the user ID of the given FirebaseID
//  * @param userFirebaseID FirebaseID of the user to be searched
//  * @returns user ID of given FirebaseID
//  */
// export async function GetUserID( userFirebaseID:String ) : Promise<number|null> {
//     const res = await Read(TableNames_App.UserID, 
//         {  
//             [ColumnNames_App.userFirebaseID]:
//             {
//                 [ConditionVariable.operator]: Operator.EqualTo, 
//                 [ConditionVariable.values]: userFirebaseID
//             }
//         }
//     );
    
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res[0] === undefined) {
//         return ErrorMsg_NoEntry();
//     }

//     return res[0][ColumnNames_App.userID];
// }



// // /**
// //  * Function to request for the user email of the given ID
// //  * @param userID user ID of the email to be searched
// //  * @returns user email of given email
// //  */
// // export async function GetUserEmail( userID:number ) : Promise<String|null> {
// //     const res = await Read(TableNames_App.UserID, 
// //         {  
// //             [ColumnNames_App.userID]:
// //             {
// //                 [ConditionVariable.operator]: Operator.EqualTo, 
// //                 [ConditionVariable.values]: userID
// //             }
// //         }
// //     );
    
// //     if (res === null) {
// //         return ErrorMsg_MySQL();
// //     }
// //     if (res[0] === undefined) {
// //         return ErrorMsg_NoEntry();
// //     }

// //     return res[0][ColumnNames_App.userEmail];
// // }

// // /**
// //  * Function to update the user email of the given user ID
// //  * @param userID user ID of email to be updated
// //  * @param userEmail new email to be written
// //  * @returns true if successful
// //  */
// // export async function UpdateUserEmail(userID:number, userEmail:String) : Promise<boolean|null> {
// //     const res = await Update(TableNames_App.UserID, 
// //         {  
// //             "set":
// //             {
// //                 [ColumnNames_App.userEmail] : userEmail
// //             },
// //             "where":
// //             {
// //                 [ColumnNames_App.userID] : 
// //                 {
// //                     [ConditionVariable.operator] : Operator.EqualTo,
// //                     [ConditionVariable.values] : userID
// //                 }
// //             }
// //         }
// //     );
// //     if (res === null) {
// //         return ErrorMsg_MySQL();
// //     }
// //     if (res.affectedRows === 0) {
// //         return ErrorMsg_NoEntry();
// //     } 
    
// //     return true;
// // } 

// /**
//  * Function to delete the user email from the database (user is removed from our system)
//  * @param userID user to be deleted
//  * @returns true if successful
//  */
// export async function DeleteUser(userID:number) : Promise<boolean|null> {
//     const res = await Delete(TableNames_App.UserID,
//         {
//             [ColumnNames_App.userID] : 
//             {
//                 [ConditionVariable.operator] : Operator.EqualTo,
//                 [ConditionVariable.values] : userID
//             }   
//         }
//     )
    
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }

//     return true
// } 

// /**
//  * Function to add user information by given user ID
//  * @param userID user ID to be added
//  * @param userEmail email following (name@domain.com.sg etc.)
//  * @param firstName first name of user
//  * @param lastName last name of user
//  * @param userPhoneNo phone number to be added (String of length 8)
//  * @returns true if successful
//  */
// export async function AddUserInfo( object:any ) : Promise<boolean|null> {
//     const {userID, userEmail, firstName, lastName, userPhoneNo} = object;
//     if (userPhoneNo.length != 8) { // Phone number is 8 char long
//         console.error("Phone number not 8 characters long")
//         return null;
//     }

//     if (!isValidEmail(userEmail)) {
//         console.error("Email does not follow the right regex")
//         return null;
//     }
//     console.log(object)
//     const res = await Create(TableNames_App.UserInformation, 
//         {
//             [ColumnNames_App.userID] : userID,
//             [ColumnNames_App.userEmail] : userEmail,
//             [ColumnNames_App.firstName] : firstName,
//             [ColumnNames_App.lastName] : lastName,
//             [ColumnNames_App.userPhoneNo] : userPhoneNo
//         }
//     )
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     return true;
// }

// /**
//  * Function to request for the information of the given user ID
//  * @param userID user ID of the informationto be searched
//  * @returns UserInfomation object
//  */
// export async function GetUserInfo( userID:number ) : Promise<UserInformation|null> {
//     const res = await Read(TableNames_App.UserInformation, 
//         {  
//             [ColumnNames_App.userID]:
//             {
//                 [ConditionVariable.operator]: Operator.EqualTo, 
//                 [ConditionVariable.values]: userID
//             }
//         }
//     );
    
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res[0] === undefined) {
//         return ErrorMsg_NoEntry();
//     }

//     return res[0] as UserInformation;
// }

// /**
//  * Function to request for the user email of the given user ID
//  * @param userID user ID of the informationto be searched
//  * @returns String of length 8
//  */
// export async function GetUserEmail( userID:number ) : Promise<string|null> {
//     const res = await Read(TableNames_App.UserInformation, 
//         {  
//             [ColumnNames_App.userID]:
//             {
//                 [ConditionVariable.operator]: Operator.EqualTo, 
//                 [ConditionVariable.values]: userID
//             }
//         }
//     );
    
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res[0] === undefined) {
//         return ErrorMsg_NoEntry();
//     }

//     return (res[0] as UserInformation).userEmail;
// }

// /** 
//  * Function to update the user info of the given user ID
//  * @param userID user ID of phone number to be updated
//  * @param userEmail new email to be written
//  * @param firstName new name?
//  * @param lastName new name?
//  * @param userPhoneNo new phone number to be written (String of length 8)
//  * @returns 
//  */
// export async function UpdateUserInfo(object:any) : Promise<boolean|null> {
//     const {userID, userEmail, firstName, lastName, userPhoneNo} = object;
//     if (userPhoneNo.length != 8) { // Phone number is 8 char long
//         console.error("Phone number not 8 characters long")
//         return null;
//     }

//     if (!isValidEmail(userEmail)) {
//         console.error("Email does not follow the right regex")
//         return null;
//     }

//     const res = await Update(TableNames_App.UserInformation, 
//         {  
//             "set":
//             {
//                 [ColumnNames_App.userEmail] : userEmail,
//                 [ColumnNames_App.firstName] : firstName,
//                 [ColumnNames_App.lastName] : lastName,
//                 [ColumnNames_App.userPhoneNo] : userPhoneNo
//             },
//             "where":
//             {
//                 [ColumnNames_App.userID] : 
//                 {
//                     [ConditionVariable.operator] : Operator.EqualTo,
//                     [ConditionVariable.values] : userID
//                 }
//             }
//         }
//     );
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res.affectedRows === 0) {
//         return ErrorMsg_NoEntry();
//     }
    
//     return true;
// } 

// // /** Might not need. UserInformation is automatically deleted when user is removed from userID
// //  * Function to delete the user phone number from the database (user is removed from our system)
// //  * @param userID 
// //  * @returns 
// //  */
// // export const d_UserInformation = async (userID:number) : Promise<boolean> => {
// //     const res = await Delete(TableNames.UserInformation,
// //         {
// //             [ColumnNames.userID] : 
// //             {
// //                 [ConditionVariable.operator] : Operator.EqualTo,
// //                 [ConditionVariable.values] : userID
// //             }   
// //         }
// //     )
    
// //     if (res === null) {
// //         throw new Error("MySQL Error or Deletion fail");
// //     }
// //     return true
// // }

// /**
//  * Function to add user payment method by given user ID
//  * @param userID user ID to be added
//  * @param customerID customerID to be added (Obtained from Stripe) 
//  * @returns true if successful
//  */
// export async function AddUserPayment( userID:number, customerID:String) : Promise<boolean|null> {
    
//     const res = await Create(TableNames_App.UserPayment, 
//         {
//             [ColumnNames_App.userID] : userID,
//             [ColumnNames_App.customerID] : customerID
//         }
//     )
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     return true;
// }

// /**
//  * Function to request user payment method by given user ID
//  * @param userID user ID of the payment method to be searched
//  * @returns the customerID for Stripe API
//  */
// export async function GetUserPayment( userID:number ) : Promise<String|null> {
//     const res = await Read(TableNames_App.UserPayment, 
//         {  
//             [ColumnNames_App.userID]:
//             {
//                 [ConditionVariable.operator]: Operator.EqualTo, 
//                 [ConditionVariable.values]: userID
//             }
//         }
//     );
    
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res[0] === undefined) {
//         return ErrorMsg_NoEntry();
//     }

//     return res[0][ColumnNames_App.customerID];
// }

// /**
//  * Function to update the user phone number of the given user ID
//  * @param userID user ID of payment method to be updated
//  * @param customerID new customerID to be written (Obtained from Stripe)
//  * @returns 
//  */
// export async function UpdateUserPayment(userID:number, customerID:String) : Promise<boolean|null> {

//     const res = await Update(TableNames_App.UserPayment, 
//         {  
//             "set":
//             {
//                 [ColumnNames_App.customerID] : customerID
//             },
//             "where":
//             {
//                 [ColumnNames_App.userID] : 
//                 {
//                     [ConditionVariable.operator] : Operator.EqualTo,
//                     [ConditionVariable.values] : userID
//                 }
//             }
//         }
//     );
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }

//     if (res.affectedRows === 0) {
//         return ErrorMsg_NoEntry();
//     }
    
//     return true;
// } 

// // /** Might not need. UserPayment is automatically deleted when user is removed from userID
// //  * Function to delete the user payment method from the database (user is removed from our system)
// //  * @param userID 
// //  * @returns 
// //  */
// // export const d_UserPayment = async (userID:number) : Promise<boolean> => {
// //     const res = await Delete(TableNames.UserPayment,
// //         {
// //             [ColumnNames.userID] : 
// //             {
// //                 [ConditionVariable.operator] : Operator.EqualTo,
// //                 [ConditionVariable.values] : userID
// //             }   
// //         }
// //     )
    
// //     if (res === null) {
// //         throw new Error("MySQL Error or Deletion fail");
// //     }
// //     return true;
// // }

// /**
//  * Function to add a open ticket into the database
//  * @param parkingLotID Parking Lot ID to be added (Obtained from Carpark Availability API / HDB Carpark CSV) 
//  * @param licensePlate License Plate to be added (User input)
//  * @param ticketStartTime Time where the ticket was opened
//  * @param ticketEndTime End time calculated by start time + duration
//  * @param userID user ID of the owner of the ticket
//  * @returns the inserted ID which is the ticket ID
//  */
// export async function CreateOpenTicket( object:any ) : Promise<number|null> {
//     const {parkingLotID, licensePlate, ticketStartTime, ticketEndTime, userID} = object

//     const res = await Create(TableNames_App.OpenTickets, 
//         {
//             [ColumnNames_App.parkingLotID] : parkingLotID,
//             [ColumnNames_App.licensePlate] : licensePlate,
//             [ColumnNames_App.ticketStartTime] : dateToString(new Date(ticketStartTime)),
//             [ColumnNames_App.ticketEndTime] : dateToString(new Date(ticketEndTime)),
//             [ColumnNames_App.userID] : Number(userID)
//         }
//     )
//     if (res === null) {
//         return ErrorMsg_MySQL()
//     }
//     return res.insertId;
// }

// /**
//  * Function to find the open ticket of a user
//  * @param userID user ID to be filtered
//  * @returns an object containing information of the open ticket
//  */
// export async function GetOpenTicketByUserID( userID:number ) : Promise<OpenTicket|null> {
    
//     const res = await Read(TableNames_App.OpenTickets, 
//         {
//             [ColumnNames_App.userID]:
//             {
//                 [ConditionVariable.operator]: Operator.EqualTo, 
//                 [ConditionVariable.values]: userID
//             }
//         }
//     )
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res[0] === undefined) {
//         return ErrorMsg_NoEntry();
//     }

//     const ticket = res[0] as OpenTicket
//     ticket.ticketEndTime = dateOffsetPlus(ticket.ticketEndTime)
//     ticket.ticketStartTime= dateOffsetPlus(ticket.ticketStartTime)
//     return ticket;
// }

// /**
//  * Function to find the open ticket of a ticketID
//  * @param ticketID ticketID to be filtered
//  * @returns an object containing information of the open ticket
//  */
// export async function GetOpenTicketByTicketID( ticketID:number ) : Promise<OpenTicket|null> {
    
//     const res = await Read(TableNames_App.OpenTickets, 
//         {
//             [ColumnNames_App.ticketID]:
//             {
//                 [ConditionVariable.operator]: Operator.EqualTo, 
//                 [ConditionVariable.values]: ticketID
//             }
//         }
//     )
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res[0] === undefined) {
//         return ErrorMsg_NoEntry();
//     }
//     const ticket = res[0] as OpenTicket
//     ticket.ticketEndTime = dateOffsetPlus(ticket.ticketEndTime)
//     ticket.ticketStartTime= dateOffsetPlus(ticket.ticketStartTime)
//     return ticket;
// }

// export async function GetOpenTicket() : Promise<OpenTicket[]|null> {
    
//     const res = await Read(TableNames_App.OpenTickets)
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res[0] === undefined) {
//         return ErrorMsg_NoEntry();
//     }
//     const tickets = res as OpenTicket[]
//     for (const ticket of tickets) {
//         const ticket = res[0] as OpenTicket
//         ticket.ticketEndTime = dateOffsetPlus(ticket.ticketEndTime)
//         ticket.ticketStartTime= dateOffsetPlus(ticket.ticketStartTime)
//     }

//     return res as OpenTicket[];
// }

// /**
//  * Function to update the end time of the open ticket (When the user increase the duration)
//  * @param ticketID ticket ID to be updated
//  * @param ticketEndTime new ticket end time (Calculated by ticket start time + new duration)
//  * @returns true if successful
//  */
// export async function UpdateOpenTicketEndTime( object:any ) : Promise<boolean|null> {
//     const {ticketID,newEndTime} = object
//     const res = await Update(TableNames_App.OpenTickets,
//         {
//             "set": {
//                 [ColumnNames_App.ticketEndTime] : dateToString(newEndTime)
//             },
//             "where": {
//                 [ColumnNames_App.ticketID]: 
//                 {
//                     [ConditionVariable.operator] : Operator.EqualTo,
//                     [ConditionVariable.values] : ticketID
//                 }
//             }
//         }
//     )

//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res.affectedRows === 0) {
//         return ErrorMsg_NoEntry();
//     }
    
//     return true;
// }

// export async function UpdateOpenTicketNotified( object: {ticketID:number, value:boolean} ) : Promise<boolean|null> {
//     const {ticketID,value} = object
//     const res = await Update(TableNames_App.OpenTickets,
//         {
//             "set": {
//                 [ColumnNames_App.notified] : value
//             },
//             "where": {
//                 [ColumnNames_App.ticketID]: 
//                 {
//                     [ConditionVariable.operator] : Operator.EqualTo,
//                     [ConditionVariable.values] : ticketID
//                 }
//             }
//         }
//     )

//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res.affectedRows === 0) {
//         return ErrorMsg_NoEntry();
//     }
    
//     return true;
// }


// /**
//  * Function to delete the open ticket (When ticket is closed)
//  * @param ticketID ticket ID to be deleted
//  * @returns true if ticket is deleted
//  */
// export async function DeleteOpenTicket(ticketID:number) : Promise<boolean|null> {
//     const res = await Delete(TableNames_App.OpenTickets,
//         {
//             [ColumnNames_App.ticketID] : 
//             {
//                 [ConditionVariable.operator] : Operator.EqualTo,
//                 [ConditionVariable.values] : ticketID
//             }   
//         }
//     )
    
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     return true;
// }

// /**
//  * Function to add a closed ticket into the database for storage
//  * 
//  * Variables are obtained from the open ticket
//  * @param ticketID 
//  * @param parkingLotID 
//  * @param licensePlate 
//  * @param ticketStartTime 
//  * @param ticketEndTime 
//  * @param actualEndTime Actual time where ticket was closed
//  * @returns 
//  */
// export async function CreateClosedTicket( object:any ) : Promise<boolean|null> {
//     const {ticketID, parkingLotID, licensePlate, ticketStartTime, ticketEndTime, actualEndTime} = object
//     const res = await Create(TableNames_App.ClosedTickets, 
//         {
//             [ColumnNames_App.ticketID] : ticketID,
//             [ColumnNames_App.parkingLotID] : parkingLotID,
//             [ColumnNames_App.licensePlate] : licensePlate,
//             [ColumnNames_App.ticketStartTime] : dateToString(ticketStartTime),
//             [ColumnNames_App.ticketEndTime] : dateToString(ticketEndTime),
//             [ColumnNames_App.actualEndTime] : dateToString(actualEndTime)
//         }
//     )
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     return true;
// }

// /**
//  * Function to request for user's past tickets
//  * @param ticketID ticket ID to be returned
//  * @returns an object with the information of the closed tickets
//  */
// export async function GetClosedTicket( ticketID:number ) : Promise<ClosedTicket|null> {
    
//     const res = await Read(TableNames_App.ClosedTickets, 
//         {
//             [ColumnNames_App.ticketID]:
//             {
//                 [ConditionVariable.operator]: Operator.EqualTo, 
//                 [ConditionVariable.values]: ticketID
//             }
//         }
//     )
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res[0] === undefined) {
//         return ErrorMsg_NoEntry();
//     }

//     // const ticket = res[0] as ClosedTicket
//     // ticket.ticketEndTime = dateOffsetPlus(ticket.ticketEndTime)
//     // ticket.ticketStartTime= dateOffsetPlus(ticket.ticketEndTime)
//     // ticket.actualEndTime = dateOffsetPlus(ticket.actualEndTime)
//     return res[0] as ClosedTicket;
// }

// // Not needed. Will not be deleting ClosedTicket
// // export const d_ClosedTicket = async (ticketID:number) : Promise<boolean> => {
// //     const res = await Delete(TableNames.ClosedTickets,
// //         {
// //             [ColumnNames.ticketID] : 
// //             {
// //                 [ConditionVariable.operator] : Operator.EqualTo,
// //                 [ConditionVariable.values] : ticketID
// //             }   
// //         }
// //     )
    
// //     if (res === null) {
// //         throw new Error("MySQL Error or Deletion fail");
// //     }
// //     return true;
// // }

// /**
//  * Function to create a (userID,ticketID) pair to map user ID to all its closed tickets
//  * @param ticketID ticket ID to be added (Closed Ticket) 
//  * @param userID user ID to be added 
//  * @returns true if successful
//  */
// export async function CreateUserClosedTicket(object:any): Promise<boolean|null> {
//     const {ticketID, userID} = object
//     const res = await Create(TableNames_App.UserClosedTickets,
//         {
//             [ColumnNames_App.userID] : userID,
//             [ColumnNames_App.ticketID] : ticketID
//         }
//     )
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     return true;
// }

// /**
//  * Function to request for all the closed tickets of a user
//  * @param userID user ID to be searched
//  * @returns an array of (userID,ticketID)
//  */
// export async function GetUserClosedTicket(userID: number): Promise<object|null> {
//     const res = await Read(TableNames_App.UserClosedTickets,
//         {
//             [ColumnNames_App.userID]:
//             {
//                 [ConditionVariable.operator]: Operator.EqualTo, 
//                 [ConditionVariable.values]: userID
//             }
//         }
//     )

//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res[0] === undefined) {
//         return ErrorMsg_NoEntry();
//     }

//     return res;
// }

// /**
//  * Function to check regex of email
//  * @param email email to be checked
//  * @returns true if valid
//  */
// function isValidEmail(email: string): boolean {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailRegex.test(email);
// }

// /**
//  * Function to convert Date to String
//  * @param date Date to be converted
//  * @returns Formatted string
//  */
// export function dateToString( date:Date ) : String {
//     date.setSeconds(0); // Remove the seconds
//     const TimeZoneOffset = date.getTimezoneOffset() * 60000;
//     return new Date(date.getTime() - TimeZoneOffset).toISOString().replace('T', " ").slice(0,19);
// }

// export function dateOffsetPlus( date:Date ) : Date {
//     const TimeZoneOffset = 8 * 60 * 60000;
//     return new Date(date.getTime() + TimeZoneOffset)
// }


// /**
//  * Function to obtain the carpark address with the given carparkID
//  * @param carparkID carparkID to be searched
//  * @returns address of the carparkID
//  */
// export async function GetCarparkAddress(carparkID: string): Promise<String|null> {
//     const res = await Read(TableNames_HDBInfo.HDBCarpark, {
//         [ColumnNames_HDBInfo.carparkNo] : {
//             [ConditionVariable.operator] : Operator.EqualTo,
//             [ConditionVariable.values] : carparkID
//         }
//     })
//     if (res === null) {
//         return ErrorMsg_MySQL();
//     }
//     if (res[0] === undefined) {
//         return ErrorMsg_NoEntry();
//     }
//     return res[0].address;
// } 

// /**
//  * Function to obtain the rates of the carpark
//  * @param carparkID carparkID to be searched
//  * @param vehType type of vehicle that is parking
//  * @returns rate per half-hour (Car/Heavy Vehicles) / lot (MCycle)
//  */
// export async function GetRate(object:any) : Promise<number|null> {
//     const { carparkID, vehType } = object
//     if (vehType == "M")
//         return feeTypes.motorcycle;
//     else if (vehType == "HV")
//         return feeTypes.heavy_vehicle;
//     else if (vehType == "C") {
//         const res = await Read(TableNames_HDBInfo.WithinCtrlArea, {
//             [ColumnNames_HDBInfo.carparkNo] : {
//                 [ConditionVariable.operator] : Operator.EqualTo,
//                 [ConditionVariable.values] : carparkID
//             } 
//         })
//         if (res === null) {
//             return ErrorMsg_MySQL();
//         }
//         if (res[0] === undefined) {
//             return feeTypes.car_NCP;
//         } else return feeTypes.car_CP;

//     }
//     return null
// }

// // Testing
// // try {
// //     console.log(await AddUserEmail("tim@gm.com"))
// // } catch (e) {
// //     console.log(e)
// // }

// // console.log(11)

// // console.log(await DeleteUser(2))

// // console.log(await UpdateUserEmail(1, "tim@gmail.com"))

// // console.log(await AddUserInfo(5,"12345678"))

// // Loading in the HDB Information
// // import * as fs from "fs";
// // const csvParser = await import('csv-parser');

// // const data1 = {
// //     carparkNo: 'ACB',
// //     address: 'BLK 270/271 ALBERT CENTRE BASEMENT CAR PARK',
// //     xCoord: '30314.7936',
// //     yCoord: '31490.4942',
// //     carparkType: '0',
// //     parkingSystemType: '0',
// //     shortTermParking: '1',
// //     freeParking: '0',
// //     nightParking: 'Y',
// //     carparkDecks: '1',
// //     gantryHeight: '1.8',
// //     carparkBasement: 'Y'
// //   }
// // const HDBAdd = async (data:any): Promise<Boolean> => {
// //     console.log(await Create(TableNames_HDBInfo.HDBCarpark, {
// //         [ColumnNames_HDBInfo.carparkNo] : data.carparkNo,
// //         [ColumnNames_HDBInfo.address] : data.address,
// //         [ColumnNames_HDBInfo.xCoord] : Number(data.xCoord),
// //         [ColumnNames_HDBInfo.yCoord] : Number(data.yCoord),
// //         [ColumnNames_HDBInfo.cpType] : Number(data.carparkType),
// //         [ColumnNames_HDBInfo.parkingSysType] : Number(data.parkingSystemType),
// //         [ColumnNames_HDBInfo.stParking] : Number(data.shortTermParking),
// //         [ColumnNames_HDBInfo.freeP] : Number(data.freeParking),
// //         [ColumnNames_HDBInfo.nightP] : data.nightParking,
// //         [ColumnNames_HDBInfo.cpDecks] : data.carparkDecks,
// //         [ColumnNames_HDBInfo.gantryH] : data.gantryHeight,
// //         [ColumnNames_HDBInfo.cpBasment] : data.carparkBasement
// //     }))
// //     return true;
// // }

// // await HDBAdd(data1)
// // const a = async () => {
// //     fs.createReadStream("../HDBInput.csv")
// //         .pipe(csvParser.default())
// //         .on("data",async (row:any)=>{
// //             console.log(row)
// //             // await HDBAdd(row)
// //             for(var i = 0; i < 1000000000;i++) {}
// //         }).on("end",() => {
// //             console.log("finished")
// //         })
// // }

// // await a();

// // console.log(await GetCarparkAddress("Y16"))

// // console.log(await GetRate("Y16","MCycle"))

// // console.log(isValidEmail("test@example.com")); // true
// // console.log(isValidEmail("invalid-email")); // false
// // console.log(isValidEmail("user@domain.")); // false
// // console.log(isValidEmail("user@domain.c")); // false
// // console.log(isValidEmail("user@ntu.edu.sg")); // true

// // const res1 = await AddNewUser("ADAWDA"); 

// // const res = await AddUserInfo(1,"tim@gmai.com","Tim","Ong","88881111")

// // console.log((await GetUserInfo(1))?.firstName)

// // endDBConnection()