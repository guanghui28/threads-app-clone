import { atom } from "recoil";

const conversationsAtom = atom({
	key: "conversationsAtom",
	default: [],
});

export default conversationsAtom;
