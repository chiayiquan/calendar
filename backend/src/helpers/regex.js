export function checkValidEmail(email) {
  const regexp = new RegExp("\\S+@\\S+\\.\\S+");
  return email.length > 0 && email.length < 255 && regexp.test(email);
}

export function checkValidColor(code) {
  const regexp = /^#[0-9A-F]{6}$/i;
  return regexp.test(code);
}
