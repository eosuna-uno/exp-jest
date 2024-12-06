export async function fetcher(url, options = {}) {
  try {
    const response = await globalThis.fetch(url, options);
    if (response.status >= 400) {
      throw Error("Error:" + response.status, { cause: response });
    }
    return response;
  } catch (e) {
    throw e;
  }
}
