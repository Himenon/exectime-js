import * as Exectime from "../index";

const wait = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
const loop = (count: number) => {
  let total = 0;
  for (let i = 1; i < count; i++) {
    total *= 1;
  }
  return total;
};

describe("performance test", () => {
  const wrapWait = Exectime.wrapAsync(wait, { name: "wait" });
  const wrapLoop = Exectime.wrapSync(loop, { name: "loop" });
  test("sync function", async done => {
    wrapLoop(1000);
    const result = await Exectime.getResult();
    expect(result.length).toEqual(1);
    done();
  });

  test("async function", async done => {
    await wrapWait(100);
    await wrapWait(200);
    const result = await Exectime.getResult();
    expect(result.length).toEqual(3);
    done();
  });

  test("reset result", async done => {
    Exectime.reset();
    const result = await Exectime.getResult();
    expect(result.length).toEqual(0);
    done();
  });
});
