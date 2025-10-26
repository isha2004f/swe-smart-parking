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
exports.ConditionVariable = exports.Operator = exports.ColumnNames_HDBInfo = exports.TableNames_HDBInfo = exports.ColumnNames_App = exports.TableNames_App = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var TableNames_App;
(function (TableNames_App) {
    TableNames_App["UserID"] = "UserID";
    TableNames_App["UserInformation"] = "UserInformation";
    TableNames_App["UserPayment"] = "UserPayment";
    TableNames_App["OpenTickets"] = "OpenTickets";
    TableNames_App["ClosedTickets"] = "ClosedTickets";
    TableNames_App["UserClosedTickets"] = "UserClosedTickets";
})(TableNames_App || (exports.TableNames_App = TableNames_App = {}));
var ColumnNames_App;
(function (ColumnNames_App) {
    ColumnNames_App["vehType"] = "vehType";
    ColumnNames_App["userFirebaseID"] = "userFirebaseID";
    ColumnNames_App["firstName"] = "firstName";
    ColumnNames_App["lastName"] = "lastName";
    ColumnNames_App["userID"] = "userID";
    ColumnNames_App["userEmail"] = "userEmail";
    ColumnNames_App["userPhoneNo"] = "userPhoneNo";
    ColumnNames_App["customerID"] = "customerID";
    ColumnNames_App["ticketID"] = "ticketID";
    ColumnNames_App["parkingLotID"] = "parkingLotID";
    ColumnNames_App["licensePlate"] = "licensePlate";
    ColumnNames_App["ticketStartTime"] = "ticketStartTime";
    ColumnNames_App["ticketEndTime"] = "ticketEndTime";
    ColumnNames_App["actualEndTime"] = "actualEndTime";
    ColumnNames_App["notified"] = "notified";
})(ColumnNames_App || (exports.ColumnNames_App = ColumnNames_App = {}));
var TableNames_HDBInfo;
(function (TableNames_HDBInfo) {
    TableNames_HDBInfo["WithinCtrlArea"] = "CarparkWithinCentralArea";
    TableNames_HDBInfo["CarparkSystemType"] = "CarparkSystemType";
    TableNames_HDBInfo["CarparkType"] = "CarparkType";
    TableNames_HDBInfo["FreeParkingType"] = "FreeParkingType";
    TableNames_HDBInfo["ShortTermParkingType"] = "ShortTermParkingType";
    TableNames_HDBInfo["HDBCarpark"] = "HDBCarpark";
})(TableNames_HDBInfo || (exports.TableNames_HDBInfo = TableNames_HDBInfo = {}));
var ColumnNames_HDBInfo;
(function (ColumnNames_HDBInfo) {
    ColumnNames_HDBInfo["typeID"] = "typeID";
    ColumnNames_HDBInfo["category"] = "category";
    ColumnNames_HDBInfo["carparkNo"] = "carparkNo";
    ColumnNames_HDBInfo["address"] = "address";
    ColumnNames_HDBInfo["xCoord"] = "xCoord";
    ColumnNames_HDBInfo["yCoord"] = "yCoord";
    ColumnNames_HDBInfo["cpType"] = "carparkType";
    ColumnNames_HDBInfo["parkingSysType"] = "parkingSystemType";
    ColumnNames_HDBInfo["stParking"] = "shortTermParking";
    ColumnNames_HDBInfo["freeP"] = "freeParking";
    ColumnNames_HDBInfo["nightP"] = "nightParking";
    ColumnNames_HDBInfo["cpDecks"] = "carparkDecks";
    ColumnNames_HDBInfo["gantryH"] = "gantryHeight";
    ColumnNames_HDBInfo["cpBasment"] = "carparkBasement";
})(ColumnNames_HDBInfo || (exports.ColumnNames_HDBInfo = ColumnNames_HDBInfo = {}));
var Operator;
(function (Operator) {
    Operator["EqualTo"] = "=";
    Operator["MoreThan"] = ">";
    Operator["LessThan"] = "<";
    Operator["MTorEq"] = ">=";
    Operator["LTorEq"] = "<=";
    Operator["NotEql"] = "<>";
    Operator["In"] = "IN";
})(Operator || (exports.Operator = Operator = {}));
var ConditionVariable;
(function (ConditionVariable) {
    ConditionVariable["operator"] = "operator";
    ConditionVariable["values"] = "values";
})(ConditionVariable || (exports.ConditionVariable = ConditionVariable = {}));
const pool = mysql2_1.default.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}).promise();
class databaseRepository {
    static Create(table, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const variables = Object.keys(data).join(",");
            const values = Object.values(data);
            const parameter = values.map(() => "?").join(",");
            try {
                const [result] = yield pool.execute(`
                INSERT INTO ${[table]} (${variables})
                VALUES (${parameter})
                `, values);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    static Read(table_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (table, data, by = "AND") {
            const conditionStatment = [];
            const values = [];
            try {
                var whereStatement = "";
                if (typeof data === "object") {
                    for (const [column, conditions] of Object.entries(data)) {
                        if (conditions.operator == Operator.In) {
                            if (!Array.isArray(conditions.values)) {
                                console.error("No array was given for \"Where variable IN [array]\". Condition skipped ");
                                continue;
                            }
                            else {
                                const placeHolders = conditions.values.map(() => '?').join(", ");
                                conditionStatment.push(`${column} ${[conditions.operator]} (${placeHolders})`);
                                for (const value of conditions.values) {
                                    values.push(value);
                                }
                                continue;
                            }
                        }
                        conditionStatment.push(`${column} ${[conditions.operator]} ?`);
                        values.push(conditions.values);
                    }
                    whereStatement = conditionStatment.length ? `WHERE ${conditionStatment.join(` ${by} `)}` : "";
                }
                const [result] = yield pool.execute(`
                SELECT * 
                FROM ${[table]}
                ${whereStatement} 
                `, values);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    static Update(table_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (table, data, by = "AND") {
            const variablesStatement = [];
            const conditionStatment = [];
            const values = [];
            var setStatement = "";
            var whereStatement = "";
            try {
                const setData = data.set;
                const whereData = data.where;
                for (const [column, value] of Object.entries(setData)) {
                    variablesStatement.push(`${column} = ?`);
                    values.push(value);
                }
                setStatement = `SET ${variablesStatement.join(",")}`;
                if (typeof whereData === "object") {
                    for (const [column, conditions] of Object.entries(whereData)) {
                        conditionStatment.push(`${column} ${[conditions.operator]} ?`);
                        values.push(conditions.values);
                    }
                    whereStatement = conditionStatment.length ? `WHERE ${conditionStatment.join(` ${by} `)}` : "";
                }
                const [result] = yield pool.execute(`
                UPDATE ${[table]}
                ${setStatement}
                ${whereStatement} 
                `, values);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    static Delete(table_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (table, data, by = "AND") {
            const conditionStatment = [];
            const values = [];
            try {
                var whereStatement = "";
                if (typeof data === "object") {
                    for (const [column, conditions] of Object.entries(data)) {
                        conditionStatment.push(`${column} ${[conditions.operator]} ?`);
                        values.push(conditions.values);
                    }
                    whereStatement = conditionStatment.length ? `WHERE ${conditionStatment.join(` ${by} `)}` : "";
                }
                const [result] = yield pool.execute(`
                DELETE 
                FROM ${[table]}
                ${whereStatement} 
                `, values);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    static endDBConnection() {
        pool.end();
    }
}
exports.default = databaseRepository;
