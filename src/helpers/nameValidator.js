export function nameValidator(name) {
  const regName = /^[a-z A-Z]{2,30}$/;
  name = name.trim();
  if (!name) return "Name can't be empty.";
  if (name.length > 30) return "Name over 40 characters.";
  if (name.length < 2) return "Name not enough 2 characters.";
  if (!regName.test(name)) return "Name is invalid. Ex: Abc Xyz";
  return "";
}
