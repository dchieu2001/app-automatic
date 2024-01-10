export function examNameValidator(name) {
  const regName =
    /^[0-9 a-z A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/u;
  name = name.trim();
  if (!name) return "Exam name can't be empty.";
  if (name.length > 40) return "Exam name over 40 characters.";
  if (name.length < 2) return "Exam name not enough 2 characters.";
  if (!regName.test(name)) return "Exam name is invalid. Ex: Abc Xyz";
  return "";
}
