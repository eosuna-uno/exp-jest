const ft = require("./../public/fe-app/fetcher");
test("check that fetcher is wrapping correctly the fetch function", async () => {
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
