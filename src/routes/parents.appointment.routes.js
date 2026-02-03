import { Router } from "express";
import authJwt from "../middlewares/auth.js";
import {
  requestAppointment, listAppointments, getAppointment, cancelAppointment
} from "../controllers/parentAppointment.controller.js";

const router = Router();

router.use(authJwt);

router.post("/", requestAppointment);
router.get("/", listAppointments);
router.get("/:id", getAppointment);
router.patch("/:id/cancel", cancelAppointment);

export default router;
