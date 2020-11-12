import * as Ticktack from "../index";

const wait = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
const loop = (count: number) => {
  let total = 0;
  for (let i = 1; i < count; i++) {
    total *= 1;
  }
  return total;
};

describe("performance test", () => {
  const wrapWait = Ticktack.wrapAsync(wait, { name: "wait" });
  const wrapLoop = Ticktack.wrapSync(loop, { name: "loop" });
  test("sync function", async done => {
    wrapLoop(1000);
    const result = await Ticktack.getResult();
    expect(result.length).toEqual(1);
    done();
  });

  test("async function", async done => {
    await wrapWait(100);
    await wrapWait(200);
    const result = await Ticktack.getResult();
    expect(result.length).toEqual(3);
    done();
  });

  test("reset result", async done => {
    Ticktack.reset();
    const result = await Ticktack.getResult();
    expect(result.length).toEqual(0);
    done();
  });
});
