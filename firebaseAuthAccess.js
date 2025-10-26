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
exports.SignInMethod = exports.SignUpMethod = exports.auth = void 0;
const app_1 = require("firebase/app");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
dotenv_1.default.config();
const firebaseConfig = {
    apiKey: process.env.FIREBASE_KEY,
    authDomain: process.env.FIREBASE_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
console.log(firebaseConfig);
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.getAuth)();
const db = (0, firestore_1.getFirestore)();
const SignUpMethod = (Email, Password) => __awaiter(void 0, void 0, void 0, function* () {
    const firebaseID = (0, auth_1.createUserWithEmailAndPassword)(exports.auth, Email, Password).then((userCredential) => {
        return userCredential.user.uid;
    });
    return yield firebaseID;
});
exports.SignUpMethod = SignUpMethod;
const SignInMethod = (Email, Password) => __awaiter(void 0, void 0, void 0, function* () {
    const firebaseID = (0, auth_1.signInWithEmailAndPassword)(exports.auth, Email, Password).then((userCredential) => {
        return userCredential.user.uid;
    });
    return yield firebaseID;
});
exports.SignInMethod = SignInMethod;
