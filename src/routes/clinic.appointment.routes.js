import { Router } from "express";
import authJwt from "../middlewares/auth.js";
import requireClinic from "../middlewares/requireClinic.js";
import {
  listClinicAppointments,
  approveAppointment,
  rescheduleAppointment,
  cancelAppointmentByClinic,
} from "../controllers/clinicAppointment.controller.js";

const router = Router();

router.use(authJwt, requireClinic);

router.get("/", listClinicAppointments);
router.patch("/:id/approve", approveAppointment);
router.patch("/:id/reschedule", rescheduleAppointment);
router.patch("/:id/cancel", cancelAppointmentByClinic);

export default router;
