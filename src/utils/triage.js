function triageCase({ childAge, severity, symptoms }) {
  const s = (symptoms || "").toLowerCase();
  const redFlags = [];

  if (s.includes("difficulty breathing") || s.includes("breathing")) redFlags.push("Breathing concern");
  if (s.includes("seizure")) redFlags.push("Seizure reported");
  if (s.includes("unconscious") || s.includes("not responding")) redFlags.push("Altered consciousness");
  if (childAge < 3 && s.includes("fever")) redFlags.push("Fever in very young child");

  if (redFlags.length > 0) return { triageResult: "Emergency Care", redFlags };

  if (severity === "High") return { triageResult: "Emergency Care", redFlags };
  if (severity === "Medium") return { triageResult: "GP Visit (24–48 hrs)", redFlags };
  return { triageResult: "Home Care", redFlags };
}

function buildSummary({ childAge, severity, duration, symptoms, triageResult, redFlags }) {
  return [
    `S: Parent reports: ${symptoms}`,
    `O: Age: ${childAge} years | Severity: ${severity} | Duration: ${duration}`,
    `A: Triage suggests: ${triageResult}`,
    `P: Safety guidance + escalation instructions. Red flags: ${redFlags?.length ? redFlags.join(", ") : "None detected"}`,
    `Disclaimer: Decision-support only. Not a diagnosis or prescription.`,
  ].join("\n");
}

module.exports = { triageCase, buildSummary };
