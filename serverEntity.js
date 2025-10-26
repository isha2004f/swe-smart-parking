"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverEntity = void 0;
class ServerEntity {
    constructor() {
        this.openTickets = [];
    }
    setTickets(openTickets) {
        this.openTickets = openTickets.sort((a, b) => {
            return a.ticketEndTime.valueOf() - b.ticketEndTime.valueOf();
        });
    }
    getTicket(ticketID, ID) {
        if (ticketID) {
            for (const ticket of this.openTickets) {
                if (ticket.ticketID == ID)
                    return ticket;
            }
        }
        else {
            for (const ticket of this.openTickets) {
                if (ticket.userID == ID)
                    return ticket;
            }
        }
        return null;
    }
    getTickets() {
        return this.openTickets;
    }
    addTicket(openTicket) {
        this.openTickets.push(openTicket);
        this.openTickets.sort((a, b) => {
            return a.ticketEndTime.valueOf() - b.ticketEndTime.valueOf();
        });
    }
    removeTicket(ticketID) {
        var index = -1;
        var curIndex = 0;
        for (const ticket of this.openTickets) {
            if (ticket.ticketID == ticketID) {
                console.log(ticket);
                index = curIndex;
            }
            curIndex++;
        }
        if (index != -1) {
            this.openTickets.splice(index, 1);
        }
    }
}
exports.serverEntity = new ServerEntity();
