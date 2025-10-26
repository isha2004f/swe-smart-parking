import mysql, {QueryResult, ResultSetHeader, RowDataPacket} from "mysql2";
import dotenv from "dotenv";

dotenv.config();

type TableNames = TableNames_App|TableNames_HDBInfo;

enum TableNames_App {
    UserID = "UserID",
    UserInformation = "UserInformation",
    UserPayment = "UserPayment",
    OpenTickets = "OpenTickets",
    ClosedTickets = "ClosedTickets",
    UserClosedTickets = "UserClosedTickets"
}

enum ColumnNames_App {
    vehType = "vehType",
    userFirebaseID = "userFirebaseID",
    firstName = "firstName",
    lastName = "lastName",
    userID = "userID",
    userEmail = "userEmail",
    userPhoneNo = "userPhoneNo",
    customerID = "customerID",
    ticketID = "ticketID",
    parkingLotID = "parkingLotID",
    licensePlate = "licensePlate",
    ticketStartTime = "ticketStartTime",
    ticketEndTime = "ticketEndTime",
    actualEndTime = "actualEndTime",
    notified = "notified"
}

enum TableNames_HDBInfo {
    WithinCtrlArea = "CarparkWithinCentralArea",
    CarparkSystemType = "CarparkSystemType",
    CarparkType = "CarparkType",
    FreeParkingType = "FreeParkingType",
    ShortTermParkingType = "ShortTermParkingType",
    HDBCarpark = "HDBCarpark"
}

enum ColumnNames_HDBInfo {
    typeID = "typeID",
    category = "category",
    carparkNo = "carparkNo",
    address = "address",
    xCoord = "xCoord",
    yCoord = "yCoord",
    cpType = "carparkType",
    parkingSysType = "parkingSystemType",
    stParking = "shortTermParking",
    freeP = "freeParking",
    nightP = "nightParking",
    cpDecks = "carparkDecks",
    gantryH = "gantryHeight",
    cpBasment = "carparkBasement"
}

enum Operator {
    EqualTo = "=",
    MoreThan = ">",
    LessThan = "<",
    MTorEq = ">=",
    LTorEq = "<=",
    NotEql = "<>",
    In = "IN"
}

enum ConditionVariable {
    operator = "operator",
    values = "values"
}

interface UpdateQueryData {
    "set":object;
    "where":object;
}

const pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: Number(process.env.MYSQL_PORT),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    }).promise();

export default class databaseRepository{

    static async Create( table:TableNames, data:object): Promise<ResultSetHeader|null>{
        const variables = Object.keys(data).join(",");
        const values = Object.values(data);
        const parameter = values.map(() => "?").join(",")
    
    
        try {
            const [result] = await pool.execute<ResultSetHeader>(`
                INSERT INTO ${[table]} (${variables})
                VALUES (${parameter})
                `, values
            );
            return result;
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    
    static async Read( table:TableNames, data?:object, by:"AND" | "OR" = "AND"): Promise<RowDataPacket[]|null>{
        
        const conditionStatment: String[] = [];
        const values: any[] = [];
    
        try {
            var whereStatement:String = "";
                if (typeof data === "object") {
                    // Column names and conidtions will be checked before input (Using Enum)
                    for (const [column, conditions] of Object.entries(data)) {
                        if (conditions.operator == Operator.In) {
                            if (!Array.isArray(conditions.values)) {
                                console.error("No array was given for \"Where variable IN [array]\". Condition skipped ")
                                continue;
                            } else {
                                const placeHolders = conditions.values.map(() => '?').join(", ")
                                conditionStatment.push(`${column} ${[conditions.operator]} (${placeHolders})`)
                                for(const value of conditions.values) {
                                    values.push(value)
                                }
                                continue
                            }
                        }
                        conditionStatment.push(`${column} ${[conditions.operator]} ?`);
                        values.push(conditions.values);
                    }
                    whereStatement = conditionStatment.length? `WHERE ${conditionStatment.join(` ${by} `)}` : "";
                }
    
            const [result] = await pool.execute<RowDataPacket[]>(`
                SELECT * 
                FROM ${[table]}
                ${whereStatement} 
                `, values
            );
            return result;
        } catch (error) {
            console.log(error)
            return null;
        }
    } 
    
    static async Update( table:TableNames, data:UpdateQueryData, by:"AND" | "OR" = "AND"): Promise<ResultSetHeader|null>{
        const variablesStatement: String[] = [];
        const conditionStatment: String[] = [];
        const values: any[] = [];
        var setStatement:String = "";
        var whereStatement:String = "";
    
        try {
            const setData = data.set;
            const whereData = data.where;
            // Columns names will be checked before input (Using Enum)
            for (const [column, value] of Object.entries(setData)) {
                variablesStatement.push(`${column} = ?`);
                values.push(value);
            }
            setStatement = `SET ${variablesStatement.join(",")}`;
    
    
            if (typeof whereData === "object") {
                // Column names and conidtions will be checked before input (Using Enum)
                for (const [column, conditions] of Object.entries(whereData)) {
                    conditionStatment.push(`${column} ${[conditions.operator]} ?`);
                    values.push(conditions.values);
                }
                whereStatement = conditionStatment.length? `WHERE ${conditionStatment.join(` ${by} `)}` : "";
            }
            const [result] = await pool.execute<ResultSetHeader>(`
                UPDATE ${[table]}
                ${setStatement}
                ${whereStatement} 
                `, values
            );
            return result;
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    
    static async Delete(table:TableNames, data:object, by:"AND" | "OR" = "AND") : Promise<ResultSetHeader|null>{
        const conditionStatment: String[] = [];
        const values: any[] = [];
    
        try {
            var whereStatement:String = "";
                if (typeof data === "object") {
                    // Column names and conidtions will be checked before input (Using Enum)
                    for (const [column, conditions] of Object.entries(data)) {
                        conditionStatment.push(`${column} ${[conditions.operator]} ?`);
                        values.push(conditions.values);
                    }
                    whereStatement = conditionStatment.length? `WHERE ${conditionStatment.join(` ${by} `)}` : "";
                }
            const [result] = await pool.execute<ResultSetHeader>(`
                DELETE 
                FROM ${[table]}
                ${whereStatement} 
                `, values
            );
            return result;
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    
    static endDBConnection(){
        pool.end()
    }

}
// async function Create( table:TableNames, data:object): Promise<ResultSetHeader|null>{
//     const variables = Object.keys(data).join(",");
//     const values = Object.values(data);
//     const parameter = values.map(() => "?").join(",")


//     try {
//         const [result] = await pool.execute<ResultSetHeader>(`
//             INSERT INTO ${[table]} (${variables})
//             VALUES (${parameter})
//             `, values
//         );
//         return result;
//     } catch (error) {
//         console.log(error)
//         return null;
//     }
// }

// async function Read( table:TableNames, data?:object, by:"AND" | "OR" = "AND"): Promise<RowDataPacket[]|null>{
    
//     const conditionStatment: String[] = [];
//     const values: any[] = [];

//     try {
//         var whereStatement:String = "";
//             if (typeof data === "object") {
//                 // Column names and conidtions will be checked before input (Using Enum)
//                 for (const [column, conditions] of Object.entries(data)) {
//                     if (conditions.operator == Operator.In) {
//                         if (!Array.isArray(conditions.values)) {
//                             console.error("No array was given for \"Where variable IN [array]\". Condition skipped ")
//                             continue;
//                         } else {
//                             const placeHolders = conditions.values.map(() => '?').join(", ")
//                             conditionStatment.push(`${column} ${[conditions.operator]} (${placeHolders})`)
//                             for(const value of conditions.values) {
//                                 values.push(value)
//                             }
//                             continue
//                         }
//                     }
//                     conditionStatment.push(`${column} ${[conditions.operator]} ?`);
//                     values.push(conditions.values);
//                 }
//                 whereStatement = conditionStatment.length? `WHERE ${conditionStatment.join(` ${by} `)}` : "";
//             }

//         const [result] = await pool.execute<RowDataPacket[]>(`
//             SELECT * 
//             FROM ${[table]}
//             ${whereStatement} 
//             `, values
//         );
//         return result;
//     } catch (error) {
//         console.log(error)
//         return null;
//     }
// } 

// async function Update( table:TableNames, data:UpdateQueryData, by:"AND" | "OR" = "AND"): Promise<ResultSetHeader|null>{
//     const variablesStatement: String[] = [];
//     const conditionStatment: String[] = [];
//     const values: any[] = [];
//     var setStatement:String = "";
//     var whereStatement:String = "";

//     try {
//         const setData = data.set;
//         const whereData = data.where;
//         // Columns names will be checked before input (Using Enum)
//         for (const [column, value] of Object.entries(setData)) {
//             variablesStatement.push(`${column} = ?`);
//             values.push(value);
//         }
//         setStatement = `SET ${variablesStatement.join(",")}`;


//         if (typeof whereData === "object") {
//             // Column names and conidtions will be checked before input (Using Enum)
//             for (const [column, conditions] of Object.entries(whereData)) {
//                 conditionStatment.push(`${column} ${[conditions.operator]} ?`);
//                 values.push(conditions.values);
//             }
//             whereStatement = conditionStatment.length? `WHERE ${conditionStatment.join(` ${by} `)}` : "";
//         }
//         const [result] = await pool.execute<ResultSetHeader>(`
//             UPDATE ${[table]}
//             ${setStatement}
//             ${whereStatement} 
//             `, values
//         );
//         return result;
//     } catch (error) {
//         console.log(error)
//         return null;
//     }
// }

// async function Delete(table:TableNames, data:object, by:"AND" | "OR" = "AND") : Promise<ResultSetHeader|null>{
//     const conditionStatment: String[] = [];
//     const values: any[] = [];

//     try {
//         var whereStatement:String = "";
//             if (typeof data === "object") {
//                 // Column names and conidtions will be checked before input (Using Enum)
//                 for (const [column, conditions] of Object.entries(data)) {
//                     conditionStatment.push(`${column} ${[conditions.operator]} ?`);
//                     values.push(conditions.values);
//                 }
//                 whereStatement = conditionStatment.length? `WHERE ${conditionStatment.join(` ${by} `)}` : "";
//             }
//         const [result] = await pool.execute<ResultSetHeader>(`
//             DELETE 
//             FROM ${[table]}
//             ${whereStatement} 
//             `, values
//         );
//         return result;
//     } catch (error) {
//         console.log(error)
//         return null;
//     }
// }

// function endDBConnection(){
//     pool.end()
// }

export {TableNames_App, ColumnNames_App, TableNames_HDBInfo, ColumnNames_HDBInfo, Operator, ConditionVariable, UpdateQueryData};