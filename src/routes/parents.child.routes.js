import { Router } from "express";
import authJwt from "../middlewares/auth.js";
import {
  createChild, listChildren, getChild, updateChild, deleteChild
} from "../controllers/parentChild.controller.js";

const router = Router();

router.use(authJwt);

router.post("/", createChild);
router.get("/", listChildren);
router.get("/:childId", getChild);
router.patch("/:childId", updateChild);
router.delete("/:childId", deleteChild);

export default router;
