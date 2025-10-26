"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = require("./routes/userRoutes");
const cors_1 = __importDefault(require("cors"));
const serverControl_1 = __importDefault(require("./controller/serverControl"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.MYSQL_HOST);
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(userRoutes_1.userRouter);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
serverControl_1.default.serverInitialiser();
