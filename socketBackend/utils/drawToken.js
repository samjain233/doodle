import randomstring from "randomstring";

export const drawToken = async () => {
  return await randomstring.generate(6);
};
