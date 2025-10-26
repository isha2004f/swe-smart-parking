
export type UserInformation = {
    "userID":number,
    "userEmail": string,
    "firstName": string,
    "lastName": string,
    "userPhoneNo": string
}


export type OpenTicket = {
    "ticketID":number,
    "parkingLotID":string,
    "licensePlate":string,
    "ticketStartTime":Date,
    "ticketEndTime":Date,
    "userID":number,
    "notified":boolean
}

class MainEntity {
    private userInformation: UserInformation|null;
    private openTicket: OpenTicket|null;

    constructor() {
        this.userInformation =null;
        this.openTicket =null;
    }

    public setUserInformation(object:UserInformation) {
        this.userInformation = object
    }

    public getUserID() {
        return this.userInformation?.userID ?? null;
    }

    public getUserEmail() {
        return this.userInformation?.userEmail ?? null;
    }

    public getUserName() {
        const name = [this.userInformation?.firstName ?? '', this.userInformation?.lastName ?? ''].join(' ');
        return name.length === 0 ? null : name;
    }

    public getUserFirstName() {
        return this.userInformation?.firstName ?? null;
    }

    public getUserLastName() {
        return this.userInformation?.lastName ?? null;
    }

    public getUserPhoneNo() {
        return this.userInformation?.userPhoneNo ?? null;
    }

    public setTicket(openTicket: OpenTicket|null) {
        this.openTicket = openTicket
        return true;
    }

    public getTicket() {
        return this.openTicket
    }

}

export const mainEntity = new MainEntity()