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
const databaseControl_1 = __importDefault(require("./databaseControl"));
const emailControl_1 = __importDefault(require("./emailControl"));
const serverControl_1 = __importDefault(require("./serverControl"));
class userControl {
    static E_AddNewUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userFirebaseID } = req.body;
            if (!userFirebaseID) {
                res.status(400).json({ message: "userFirebaseID is required." });
                return;
            }
            const request = yield databaseControl_1.default.CreateNewUser(userFirebaseID);
            if (request == null)
                res.status(500).json({ message: "Failed to add new user." });
            else {
                res.status(201).json({
                    message: "User added sucessfully",
                    userID: request
                });
            }
        });
    }
    static E_GetUserID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userFirebaseID } = req.query;
            if (!userFirebaseID) {
                res.status(400).json({ message: "userFirebaseID is required." });
                return;
            }
            const request = yield databaseControl_1.default.ReadUserID(userFirebaseID);
            if (request == null)
                res.status(500).json({ message: "Failed to get user ID." });
            else {
                res.status(200).json({
                    message: "User ID sucessfully returned",
                    userID: request
                });
            }
        });
    }
    static E_DeleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID } = req.body;
            if (!userID) {
                res.status(400).json({ message: "userID is required." });
                return;
            }
            const request = yield databaseControl_1.default.DeleteUser(userID);
            if (request == null)
                res.status(500).json({ message: "Failed to delete user ID." });
            else {
                res.status(200).json({
                    message: "User ID sucessfully deleted",
                    boolean: request
                });
            }
        });
    }
    static E_AddUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = req.body;
            if (!object) {
                res.status(400).json({ message: "object is required." });
                return;
            }
            const request = yield databaseControl_1.default.CreateUserInfo(object);
            if (request == null)
                res.status(500).json({ message: "Failed to add new user information." });
            else {
                res.status(201).json({
                    message: "User information added sucessfully",
                    userInfo: request
                });
            }
        });
    }
    static E_GetUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID } = req.query;
            if (!userID) {
                res.status(400).json({ message: "userID is required." });
                return;
            }
            const request = yield databaseControl_1.default.ReadUserInfo(Number(userID));
            if (request == null)
                res.status(500).json({ message: "Failed to get user information." });
            else {
                res.status(200).json({
                    message: "User information sucessfully returned",
                    userInfo: request
                });
            }
        });
    }
    static E_GetUserEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID } = req.query;
            if (!userID) {
                res.status(400).json({ message: "userID is required." });
                return;
            }
            const request = yield databaseControl_1.default.ReadUserEmail(Number(userID));
            if (request == null)
                res.status(500).json({ message: "Failed to get user email." });
            else {
                res.status(200).json({
                    message: "User email sucessfully returned",
                    userEmail: request
                });
            }
        });
    }
    static E_UpdateUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = req.body;
            if (!object) {
                res.status(400).json({ message: "object is required." });
                return;
            }
            const request = yield databaseControl_1.default.UpdateUserInfo(object);
            if (request == null)
                res.status(500).json({ message: "Failed to get user email." });
            else {
                res.status(200).json({
                    message: "User email sucessfully returned",
                    boolean: request
                });
            }
        });
    }
    static E_CreateOpenTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = req.body;
            if (!object) {
                res.status(400).json({ message: "object is required." });
                return;
            }
            console.log(object);
            const request = yield serverControl_1.default.createOpenTicket(object);
            if (request == null)
                res.status(500).json({ message: "Failed to create open ticket." });
            else {
                yield serverControl_1.default.addOpenTicketToServer(request);
                emailControl_1.default.NewTicketNotification(request);
                res.status(201).json({
                    message: "Open ticket sucessfully created",
                    ticketID: request
                });
            }
        });
    }
    static E_GetOpenTicketByUserID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID } = req.query;
            if (!userID) {
                res.status(400).json({ message: "userID is required." });
                return;
            }
            if (typeof userID === "string") {
                const request = serverControl_1.default.getOpenTicketByUserID(Number(userID));
                if (request == null) {
                    res.status(200).json({
                        message: "Open ticket does not exsist",
                        openTicket: {}
                    });
                }
                else {
                    res.status(200).json({
                        message: "Open ticket sucessfully returned",
                        openTicket: request
                    });
                }
            }
            else {
                res.status(500).json({ message: "Failed to get open ticket." });
            }
        });
    }
    static E_GetOpenTicketByTicketID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ticketID } = req.query;
            if (!ticketID) {
                res.status(400).json({ message: "ticketID is required." });
                return;
            }
            if (typeof ticketID === "string") {
                const request = serverControl_1.default.getOpenTicketByTicketID(Number(ticketID));
                console.log(request);
                if (request == null)
                    res.status(500).json({ message: "Failed to get open ticket." });
                else {
                    res.status(200).json({
                        message: "Open ticket sucessfully returned",
                        openTicket: request
                    });
                }
            }
            else {
                res.status(500).json({ message: "Failed to get open ticket." });
            }
        });
    }
    static E_UpdateOpenTicketEndTime(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = req.body;
            if (!object) {
                res.status(400).json({ message: "object is required." });
                return;
            }
            const request = yield serverControl_1.default.updateOpenTicketEndTime(object);
            if (request == null)
                res.status(500).json({ message: "Failed to update open ticket." });
            else {
                res.status(200).json({
                    message: "Open ticket sucessfully updated",
                    boolean: request
                });
            }
        });
    }
    static E_ClosedTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = req.body;
            if (!object) {
                res.status(400).json({ message: "object is required." });
                return;
            }
            const request = yield serverControl_1.default.closeTicket(object);
            if (request == null)
                res.status(500).json({ message: "Failed to create closed ticket." });
            else {
                res.status(201).json({
                    message: "Closed ticket sucessfully create",
                    boolean: request
                });
            }
        });
    }
    static E_GetClosedTicketsByUserID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID } = req.query;
            if (!userID) {
                res.status(400).json({ message: "userID is required." });
                return;
            }
            const request = yield databaseControl_1.default.ReadAllClosedTicket(Number(userID));
            if (request == null)
                res.status(500).json({ message: "Failed to get closed ticket." });
            else {
                res.status(200).json({
                    message: "Closed ticket sucessfully returned",
                    closedTickets: request
                });
            }
        });
    }
    static E_GetClosedTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ticketID } = req.query;
            if (!ticketID) {
                res.status(400).json({ message: "ticketID is required." });
                return;
            }
            const request = yield databaseControl_1.default.ReadClosedTicket(Number(ticketID));
            if (request == null)
                res.status(500).json({ message: "Failed to get closed ticket." });
            else {
                res.status(200).json({
                    message: "Closed ticket sucessfully returned",
                    closedTicket: request
                });
            }
        });
    }
    static E_CreateUserClosedTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = req.body;
            if (!object) {
                res.status(400).json({ message: "object is required." });
                return;
            }
            const request = yield databaseControl_1.default.CreateUserClosedTicket(object);
            if (request == null)
                res.status(500).json({ message: "Failed to create user closed ticket." });
            else {
                res.status(201).json({
                    message: "User closed ticket sucessfully created",
                    boolean: request
                });
            }
        });
    }
    static E_GetUserClosedTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID } = req.query;
            const request = yield databaseControl_1.default.ReadUserClosedTicket(Number(userID));
            if (request == null)
                res.status(500).json({ message: "Failed to get user closed ticket." });
            else {
                res.status(200).json({
                    message: "User closed ticket sucessfully returned",
                    clostTicketArray: request
                });
            }
        });
    }
    static E_GetCarparkAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { carparkID } = req.query;
            const request = yield databaseControl_1.default.ReadCarparkAddress(carparkID);
            if (request == null)
                res.status(500).json({ message: "Failed to get carpark address." });
            else {
                res.status(200).json({
                    message: "Carpark address sucessfully returned",
                    carparkAddress: request
                });
            }
        });
    }
    static E_GetRate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = req.query;
            const request = yield databaseControl_1.default.GetRate(object);
            if (request == null)
                res.status(500).json({ message: "Failed to get carpark rate." });
            else {
                res.status(200).json({
                    message: "Carpark rate sucessfully returned",
                    rate: request
                });
            }
        });
    }
}
exports.default = userControl;
