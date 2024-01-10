export function studentCodeValidator(name) {
  const regName = /^([{20\21\22\23\24\25\26\27\28}][0-9]{9,10})$/;
  name = name.trim();
  if (!name) return "Student code can't be empty.";
  if (name.length > 11 || name.length < 10)
    return "Student code length is 10 or 11 characters.";

  if (!regName.test(name))
    return "Student code is invalid. Ex: 20xxxxxxxx - 28xxxxxxxxx";
  return "";
}
