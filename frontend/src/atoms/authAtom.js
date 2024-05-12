import { atom } from "recoil";

const createScreenAtom = atom({
	key: "authScreenAtom",
	default: "login",
});

export default createScreenAtom;
