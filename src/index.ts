import { wrapAsync } from "./server";

const wait = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
  const newWait = wrapAsync(wait);
  await Promise.all([newWait(5000), newWait(5000), newWait(5000), newWait(5000)]);
};

main().catch(console.error);
