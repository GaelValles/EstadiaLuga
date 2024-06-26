import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getConductors,
  getConductor,
  postConductores,
  updateConductor,
  deleteConductores
} from "../controllers/conductor.controller.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get('/conductores', getConductors);
router.get('/conductor/:id/search', authRequired, getConductor);
router.post("/conductor", fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }), postConductores);
router.delete('/conductor/:id/delete', authRequired, deleteConductores);
router.put('/conductor/:id/update', authRequired, updateConductor);

export default router;
