export function studentNameValidator(name) {
  const regName =
    /^[a-z A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/u;
  name = name.trim();
  if (!name) return "Student name can't be empty.";
  if (name.length > 50) return "Student name over 50 characters.";
  if (name.length < 2) return "Student name not enough 2 characters";
  if (!regName.test(name)) return "Student name is invalid. Ex: Abc Xyz";
  return "";
}
