import { Router } from "express";
import authJwt from "../middlewares/auth.js";
import { createCase, listCases, getCase, cancelCase } from "../controllers/parentCase.controller.js";

const router = Router();

router.use(authJwt);

router.post("/", createCase);
router.get("/", listCases);
router.get("/:caseId", getCase);
router.patch("/:caseId/cancel", cancelCase);

export default router;
