export function scalePointExams(name) {
  const regName = /^[+-]?\d+(\.\d+)?$/;
  name = name.trim();
  if (!name) return "Scale can't be empty.";
  if (!regName.test(name)) return "Scale is wrong format. Ex: 0.01, 0.2, 0.33";
  return "";
}
