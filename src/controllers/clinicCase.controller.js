import Case from "../models/Case.model.js";

export const listClinicCases = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { status, severity, from, to, page = 1, limit = 20 } = req.query;

    const query = { clinicId };

    if (status) query.status = status;
    if (severity) query.severity = severity;

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Case.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("childId"),
      Case.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: items,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getClinicCase = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { caseId } = req.params;

    const c = await Case.findOne({ _id: caseId, clinicId })
      .populate("childId")
      .populate("parentId", "name email");

    if (!c) return res.status(404).json({ success: false, message: "Case not found" });

    return res.json({ success: true, data: c });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const addClinicNote = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const authorId = req.user.id;
    const { caseId } = req.params;
    const { note } = req.body;

    if (!note?.trim()) {
      return res.status(400).json({ success: false, message: "note is required" });
    }

    const c = await Case.findOne({ _id: caseId, clinicId });
    if (!c) return res.status(404).json({ success: false, message: "Case not found" });

    c.clinicNotes.push({ authorId, note: note.trim() });

    // Optional: auto move to IN_REVIEW if new
    if (c.status === "SUBMITTED") c.status = "IN_REVIEW";

    await c.save();
    return res.json({ success: true, data: c });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateClinicCaseStatus = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { caseId } = req.params;
    const { status } = req.body;

    const allowed = ["IN_REVIEW", "FOLLOWUP_NEEDED", "CLOSED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const c = await Case.findOneAndUpdate(
      { _id: caseId, clinicId },
      { $set: { status } },
      { new: true }
    );

    if (!c) return res.status(404).json({ success: false, message: "Case not found" });

    // TODO: trigger notification to parent (WhatsApp/email) if needed
    return res.json({ success: true, data: c });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
