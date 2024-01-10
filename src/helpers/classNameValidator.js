export function classNameValidator(name) {
  const regName =
    /^[a-z A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ0-9#]{2,40}$/u;
  name = name.trim();
  if (!name) return "Class name can't be empty.";
  if (name.length > 40) return "Class code over 40 characters";
  if (name.length < 2) return "Class name not enough 2 characters.";
  if (!regName.test(name)) return "Class name is invalid. Ex: Abc Xyz";
  return "";
}
