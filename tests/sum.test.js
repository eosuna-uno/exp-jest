function div(a, b) {
  return a / b;
}
describe.only("Test divide fn:", () => {
  test("it correctly divides", () => {
    expect(div(4, 2)).toBe(2);
  });
  test("it correctly divides big ints", () => {
    expect(div(4n, 2n)).toBe(2n);
  });
  test("it throws on divides big ints by 0n", () => {
    expect(() => div(4n, 0n)).toThrow();
  });
  test("it correctly returns Infinity on 0 division", () => {
    expect(div(4, 0)).toBe(Infinity);
  });
  test("it correctly returns NaN on Infinity/Infinity", () => {
    expect(div(Infinity, Infinity)).toBe(NaN);
  });
  test("it correctly returns NaN on a undefined/null being use", () => {
    expect(div(null, 0)).toBe(NaN);
    expect(div(null, null)).toBe(NaN);
    expect(div(undefined, 0)).toBe(NaN);
    expect(div(null, undefined)).toBe(NaN);
  });
});
