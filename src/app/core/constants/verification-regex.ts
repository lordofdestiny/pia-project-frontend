export const emailRegex: RegExp =
    /^[\w-](?:\.?[\w-]){0,63}@[\w-]{1,63}(?:\.[\w-]{1,63})*$/;
export const usernameRegex: RegExp = /^[_-]*[a-zA-Z][\w-]*$/;
export const phoneRegex: RegExp =
    /^((\+381)|0)?[\s-]*6[\s-]*(([0-6]|[8-9]|(7[\s-]*[7-8]))(?:[ -]*\d[ -]*){6,7})$/;
export const passwordRegex: RegExp =
    /^(?=[a-zA-Z].+$)(?=.{8,14}$)(?=[^A-Z]*[A-Z])(?=[^\d]*[\d])(?=[^\x20-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]*[\x20-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e])(?:([\x20-\x7E])\1?(?!\1))+$/;

export const passwordChecks = [
    {
        error: 'Password must start with a letter',
        regex: /^[a-zA-Z].*$/,
    },
    {
        error: 'Password must be between 8 and 14 characters',
        regex: /^(?=.{8,14}$).*/,
    },
    {
        error: 'Password must contain an uppercase letter',
        regex: /^(?=[^A-Z]*[A-Z]).*/,
    },
    {
        error: 'Password must contain a digit',
        regex: /^(?=[^\d]*[\d]).*/,
    },
    {
        error: 'Password must contain a special character',
        regex: /^(?=[^\x20-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]*[\x20-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]).*/,
    },
    {
        error: 'Password must not contain more than 2 repeating characters',
        regex: /^(?:([\x20-\x7e])\1?(?!\1))+$/,
    },
];
