import Express from 'express';
import userControl from '../controller/userContoller';
const router = Express.Router();

router.post("/UserID", userControl.E_AddNewUser)

router.get("/UserID", userControl.E_GetUserID)

router.delete("/UserID", userControl.E_DeleteUser)

router.post("/UserInfo", userControl.E_AddUserInfo)

router.get("/UserInfo", userControl.E_GetUserInfo)

router.get("/UserInfo/Email", userControl.E_GetUserEmail)

router.put("/UserInfo", userControl.E_UpdateUserInfo)

router.post("/OpenTicket", userControl.E_CreateOpenTicket)

router.get("/OpenTicket/UserID", userControl.E_GetOpenTicketByUserID)

router.get("/OpenTicket/TicketID", userControl.E_GetOpenTicketByTicketID)

router.put("/OpenTicket", userControl.E_UpdateOpenTicketEndTime)

// router.delete("/OpenTicket", E_DeleteOpenTicket)

router.post("/ClosedTicket", userControl.E_ClosedTicket)

router.get("/ClosedTickets", userControl.E_GetClosedTicketsByUserID)

router.get("/ClosedTicket", userControl.E_GetClosedTicket)

router.post("/UserClosedTicket", userControl.E_CreateUserClosedTicket)

router.get("/UserClosedTicket", userControl.E_GetUserClosedTicket)

router.get("/CarparkAddress", userControl.E_GetCarparkAddress)

router.get("/Rate", userControl.E_GetRate)

export { router as userRouter };
