import Child from "../models/Child.model.js";

export const createChild = async (req, res) => {
  const parentId = req.user.id;
  const { name, ageMonths, gender, weightKg } = req.body;

  const child = await Child.create({ parentId, name, ageMonths, gender, weightKg });
  return res.status(201).json({ success: true, data: child });
};

export const listChildren = async (req, res) => {
  const parentId = req.user.id;
  const children = await Child.find({ parentId }).sort({ createdAt: -1 });
  return res.json({ success: true, data: children });
};

export const getChild = async (req, res) => {
  const parentId = req.user.id;
  const { childId } = req.params;

  const child = await Child.findOne({ _id: childId, parentId });
  if (!child) return res.status(404).json({ success: false, message: "Child not found" });

  return res.json({ success: true, data: child });
};

export const updateChild = async (req, res) => {
  const parentId = req.user.id;
  const { childId } = req.params;

  const child = await Child.findOneAndUpdate(
    { _id: childId, parentId },
    { $set: req.body },
    { new: true }
  );

  if (!child) return res.status(404).json({ success: false, message: "Child not found" });
  return res.json({ success: true, data: child });
};

export const deleteChild = async (req, res) => {
  const parentId = req.user.id;
  const { childId } = req.params;

  const deleted = await Child.findOneAndDelete({ _id: childId, parentId });
  if (!deleted) return res.status(404).json({ success: false, message: "Child not found" });

  return res.json({ success: true, message: "Child deleted" });
};
