import * as Exectime from "../";

export const wait = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const main = async (): Promise<void> => {
  const newWait = Exectime.wrapAsync(wait, { name: "wait" });
  await Promise.all([newWait(1000), newWait(500), newWait(1200), newWait(1300)]);
  const list = await Exectime.getResult();
  console.log(list);
};

main();
