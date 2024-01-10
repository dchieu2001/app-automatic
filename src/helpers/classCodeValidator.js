export function classCodeValidator(name) {
  const regName = /^[A-Za-z 0-9-|_|(|)]{5,25}$/;
  name = name.trim();
  if (!name) return "Class code can't be empty.";
  if (name.length > 25) return "Class code over 25 characters.";
  if (name.length < 5) return "Class code not enough 5 characters.";
  if (!regName.test(name))
    return "Class code is wrong format. Ex: Abc-123, 234_Xyz";
  return "";
}
