import * as Ticktack from "./";

export const wait = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const main = async (): Promise<void> => {
  const newWait = Ticktack.wrapAsync(wait, { name: "wait", label: "timer" });
  await Promise.all([newWait(1000), newWait(500), newWait(1200), newWait(1300)]);
  const list = await Ticktack.getResult();
  console.log(list);
};

main();
