export type OpenTicket = {
    "ticketID":number,
    "parkingLotID":string,
    "licensePlate":string,
    "ticketStartTime":Date,
    "ticketEndTime":Date,
    "userID":number,
    "notified":boolean,
    "vehType":string,
    "fee":number
}

export type ClosedTicket = {
    "ticketID":number,
    "parkingLotID":string,
    "licensePlate":string,
    "ticketStartTime":Date,
    "ticketEndTime":Date,
    "actualEndTime":Date,
    "vehType":string
}

export type UserInformation = {
    "userID":number,
    "userEmail":string,
    "firstName":string,
    "lastName":string,
    "userPhoneNo":string
}