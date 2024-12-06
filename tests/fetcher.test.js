const ft = require("./../public/fe-app/fetcher");
describe("fetcher test:", () => {
  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });
  test("that fetch gets call with correct url, and on status 200 returns response", async () => {
    const returnObject = [{ id: "1", title: "some title" }]; //implement mock factory in here
    const spy = jest.spyOn(globalThis, "fetch").mockReturnValue(
      Promise.resolve({
        status: 200,
        json: async () => returnObject,
      })
    );
    const result = await ft.fetcher("/blogs");
    let obj = await result.json();
    expect(spy).toHaveBeenCalledWith("/blogs", {});
    expect(obj[0].id).toBe(returnObject[0].id);
  });
  test("that fetch returns an error when status is >= 400", async () => {
    const returnObject = []; //implement mock factory in here
    const spy = jest.spyOn(globalThis, "fetch").mockReturnValue(
      Promise.resolve({
        status: 400,
        json: async () => returnObject,
      })
    );
    let error;
    try {
      const result = await ft.fetcher("/blogs");
    } catch (e) {
      console.log("whats this", e);
      error = e;
    }
    expect(error.name).toBe("Error");
    expect(spy).toHaveBeenCalledWith("/blogs", {});
    //expect(obj[0].id).toBe(returnObject[0].id);
  });
});
