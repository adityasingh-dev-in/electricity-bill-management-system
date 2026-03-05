import { Router } from "express";
import {
    getAllComplaints,
    getComplaintById,
    getConsumerComplaints,
    createComplaint,
    updateComplaint,
    updateComplaintStatus,
    deleteComplaint
} from "../controllers/complaint.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyAdmin } from "../middlewares/admin.middleware";

const router = Router();

// All routes are protected by JWT (Staff/Admin only)
router.use(verifyJWT);

router.get("/", getAllComplaints);
router.get("/:id", getComplaintById);
router.get("/consumer/:meterNumber", getConsumerComplaints);
router.post("/", createComplaint);
router.put("/", updateComplaint);
router.patch("/status", verifyAdmin, updateComplaintStatus);
router.delete("/delete/:complaintID", verifyAdmin, deleteComplaint);

export default router;