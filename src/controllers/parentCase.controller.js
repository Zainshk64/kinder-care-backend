import Child from "../models/Child.model.js";
import Case from "../models/Case.model.js";

// POST /api/parent/cases
export const createCase = async (req, res) => {
  const parentId = req.user.id;
  const { childId, clinicId, symptoms, severity, duration, inputType } = req.body;

  if (!clinicId) {
    return res.status(400).json({ success: false, message: "clinicId is required" });
  }

  // Ownership check: child must belong to logged-in parent
  const child = await Child.findOne({ _id: childId, parentId });
  if (!child) return res.status(403).json({ success: false, message: "Invalid child access" });

  const c = await Case.create({
    parentId,
    childId,
    clinicId , 

    symptoms,
    severity,
    duration,
    inputType: inputType || "text",

    status: "SUBMITTED", // ✅ parent always starts with submitted
  });

  return res.status(201).json({ success: true, data: c });
};

// GET /api/parent/cases
export const listCases = async (req, res) => {
  const parentId = req.user.id;
  const { status, childId, clinicId, page = 1, limit = 10 } = req.query;

  const query = { parentId };
  if (status) query.status = status;
  if (childId) query.childId = childId;
  if (clinicId) query.clinicId = String(clinicId);

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Case.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Case.countDocuments(query),
  ]);

  return res.json({
    success: true,
    data: items,
    meta: { total, page: Number(page), limit: Number(limit) },
  });
};

// GET /api/parent/cases/:caseId
export const getCase = async (req, res) => {
  const parentId = req.user.id;
  const { caseId } = req.params;

  const c = await Case.findOne({ _id: caseId, parentId }).populate("childId");
  if (!c) return res.status(404).json({ success: false, message: "Case not found" });

  return res.json({ success: true, data: c });
};

// PATCH /api/parent/cases/:caseId/cancel
export const cancelCase = async (req, res) => {
  const parentId = req.user.id;
  const { caseId } = req.params;

  const c = await Case.findOne({ _id: caseId, parentId });
  if (!c) return res.status(404).json({ success: false, message: "Case not found" });

  if (["CLOSED", "CANCELLED"].includes(c.status)) {
    return res.status(400).json({ success: false, message: "Case cannot be cancelled" });
  }

  c.status = "CANCELLED";
  await c.save();

  return res.json({ success: true, data: c });
};
