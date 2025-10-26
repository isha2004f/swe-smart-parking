"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverEntity_1 = require("../entity/serverEntity");
const databaseControl_1 = __importDefault(require("./databaseControl"));
const expiryControl_1 = __importDefault(require("./expiryControl"));
class serverControl {
    static serverInitialiser() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield databaseControl_1.default.ReadOpenTicket();
            if (res != null)
                serverEntity_1.serverEntity.setTickets(res);
            expiryControl_1.default.expiryInitialiser();
        });
    }
    static getOpenTicketByTicketID(ticketID) {
        return serverEntity_1.serverEntity.getTicket(true, ticketID);
    }
    static getOpenTicketByUserID(userID) {
        return serverEntity_1.serverEntity.getTicket(false, userID);
    }
    static getAllOpenTickets() {
        return serverEntity_1.serverEntity.getTickets();
    }
    static createOpenTicket(object) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield databaseControl_1.default.CreateOpenTicket(object);
            if (res == null)
                console.error("Server fail to create open ticket");
            return res;
        });
    }
    static addOpenTicketToServer(ticketID) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield databaseControl_1.default.ReadOpenTicketByTicketID(ticketID);
            if (res == null)
                console.error("Server fail to retrieve open ticket");
            else {
                serverEntity_1.serverEntity.addTicket(res);
                console.log("New Ticket Added to server");
            }
        });
    }
    static updateOpenTicketEndTime(object) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ticketID, newEndTime } = object;
            if (!ticketID || !newEndTime) {
                console.error("Incorrect data passed into update open ticket");
                return false;
            }
            const res = databaseControl_1.default.UpdateOpenTicketEndTime(object).then((res) => {
                if (!res)
                    console.error("Server failed to update database open ticket");
                else {
                    const ticket = serverControl.getOpenTicketByTicketID(ticketID);
                    if (!ticket)
                        console.error("Open ticket does not exist in server");
                    else {
                        ticket.ticketEndTime = new Date(newEndTime);
                        ticket.notified = false;
                        return true;
                    }
                }
                return false;
            });
            return yield res;
        });
    }
    static closeTicket(object) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ticketID, closeTime } = object;
            if (!ticketID || !closeTime) {
                console.error("Incorrect data passed into update open ticket");
                return false;
            }
            const ticket = serverControl.getOpenTicketByTicketID(ticketID);
            if (!ticket) {
                console.error("No existing open ticket");
                return false;
            }
            ticket.actualEndTime = closeTime;
            let res = yield databaseControl_1.default.CreateClosedTicket(ticket);
            if (!res) {
                console.error("Fail to create closed ticket");
                return false;
            }
            res = yield databaseControl_1.default.CreateUserClosedTicket(ticket);
            if (!res) {
                console.error("Fail to create user closed ticket");
                return false;
            }
            res = yield databaseControl_1.default.DeleteOpenTicket(ticketID);
            if (!res) {
                console.error("Fail to delete open ticket");
                return false;
            }
            serverEntity_1.serverEntity.removeTicket(ticketID);
            return true;
        });
    }
}
exports.default = serverControl;
