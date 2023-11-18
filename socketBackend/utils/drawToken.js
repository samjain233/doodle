import randomstring from "randomstring";

export const drawToken = async () => {
  return await randomstring.generate(6);
};

export const timeToken = async () => {
  return await randomstring.generate(4);
};
