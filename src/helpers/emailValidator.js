export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/;
  // email = email.trim();
  if (!email) return "Email can't be empty.";
  // if (!re.test(email)) return "Ooops! We need a valid email address.";
  if (!re.test(email))
    return (
      "Please include '@' in the email address. " + email + " is missing '@'."
    );
  return "";
}
