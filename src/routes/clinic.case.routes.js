import { Router } from "express";
import authJwt from "../middlewares/auth.js";
import requireClinic from "../middlewares/requireClinic.js";
import {
  listClinicCases,
  getClinicCase,
  addClinicNote,
  updateClinicCaseStatus,
} from "../controllers/clinicCase.controller.js";

const router = Router();

router.use(authJwt, requireClinic);

router.get("/", listClinicCases);
router.get("/:caseId", getClinicCase);
router.post("/:caseId/notes", addClinicNote);
router.patch("/:caseId/status", updateClinicCaseStatus);

export default router;
