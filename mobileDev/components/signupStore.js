// Keeps the sign-up data between screens.
// It lives in memory only (not in route params), so the password never
// appears in the navigation state or in any deep link.

const INITIAL = {
  method: "email", // "email" | "phone"
  email: "",
  phone: "", // +234XXXXXXXXXX
  password: "",
  fullName: "",
  sex: "", // "Male" | "Female"
  dob: "",
  stateOfOrigin: "",
  lga: "",
  patientId: "",
  address: "",
  photoUri: null,
};

let data = { ...INITIAL };

export const signUpStore = {
  get: () => data,
  set: (patch) => {
    data = { ...data, ...patch };
  },
  reset: () => {
    data = { ...INITIAL };
  },
};
