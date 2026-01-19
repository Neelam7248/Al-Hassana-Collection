// utils/generateEmployeeCode.js
const User = require("../models/User");

/**
 * Generate unique employee code
 * Format: DEPT-001, DEPT-002 ...
 */
async function generateEmployeeCode(department) {
  if (!department) throw new Error("Department is required for employee code");

  // Count existing users in that department
  const count = await User.countDocuments({ department });

  // Pad with zeros
  const codeNumber = String(count + 1).padStart(3, "0");

  return `${department}-${codeNumber}`;
}

module.exports = generateEmployeeCode;
