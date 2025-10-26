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
const emailAccess_1 = __importDefault(require("../boundary/emailAccess"));
const databaseControl_1 = __importDefault(require("./databaseControl"));
const serverControl_1 = __importDefault(require("./serverControl"));
class emailControl {
    static feeCalculator(startTime, endTime, vehType, parkingLotID) {
        return __awaiter(this, void 0, void 0, function* () {
            const fee = yield databaseControl_1.default.GetRate({ carparkID: parkingLotID, vehType: vehType });
            if (!fee) {
                console.error("Error getting rate");
                return null;
            }
            if (vehType == "M")
                return fee.toFixed(2);
            const interval = (endTime.getTime() - startTime.getTime()) / (30 * 60 * 1000);
            console.log("Interval:", interval);
            return (interval * fee).toFixed(2);
        });
    }
    static NewTicketNotification(ticketID) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = `New ticket created with ID: ${ticketID}`;
            const res = serverControl_1.default.getOpenTicketByTicketID(ticketID);
            if (res == null) {
                console.error(`No existing ticket with ID: ${ticketID}`);
                return false;
            }
            const fee = yield emailControl.feeCalculator(res.ticketStartTime, res.ticketEndTime, res.vehType, res.parkingLotID);
            if (fee == null) {
                console.error("Failed to obtain fee");
                return false;
            }
            const text = `Dear Customer,
    
        You have created a new ticket with ID: ${ticketID}.\n
        Your ${res.vehType == "M" ? "motorcycle" : "car"}, ${res.licensePlate} is parked at ${yield databaseControl_1.default.ReadCarparkAddress(res.parkingLotID)}
        The ticket starts on ${res.ticketStartTime.toISOString().replace("T", " ").substr(0, 19)} and ends on ${res.ticketEndTime.toISOString().replace("T", " ").substr(0, 19)}.
        Total fee is $${fee}.`;
            const email = yield databaseControl_1.default.ReadUserEmail(res.userID);
            if (email == null) {
                console.error(`No existing email found for user ID: ${res.userID}`);
                return false;
            }
            console.log(email, subject, text);
            return emailAccess_1.default.emailSender(email, subject, text);
        });
    }
    static ExpiryNotification(ticketID) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = `Expiration alert for ticket ID: ${ticketID}`;
            const res = serverControl_1.default.getOpenTicketByTicketID(ticketID);
            if (res == null) {
                console.error(`No existing ticket with ID: ${ticketID}`);
                return false;
            }
            const text = `Dear Customer,
    
        You have a ticket that is expiring soon. Ticket ID: ${ticketID}.\n
        Your ${res.vehType == "M" ? "motorcycle" : "car"}, ${res.licensePlate} is parked at ${yield databaseControl_1.default.ReadCarparkAddress(res.parkingLotID)}
        The ticket ends on ${res.ticketEndTime.toISOString().replace("T", " ").substr(0, 19)}.
        Please extend or close your ticket to avoid fines.`;
            const email = yield databaseControl_1.default.ReadUserEmail(res.userID);
            if (email == null) {
                console.error(`No existing email found for user ID: ${res.userID}`);
                return false;
            }
            console.log(email, subject, text);
            return emailAccess_1.default.emailSender(email, subject, text);
        });
    }
}
exports.default = emailControl;
