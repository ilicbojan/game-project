import { saveToStorage, loadFromStorage } from "../storage";

describe("storage utils", () => {
  const key = "test-key";

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe("saveToStorage", () => {
    it("saves data to localStorage as JSON", () => {
      const value = { name: "test", score: 42 };
      const setItemSpy = jest.spyOn(localStorage.__proto__, "setItem");

      saveToStorage(key, value);

      expect(setItemSpy).toHaveBeenCalledWith(key, JSON.stringify(value));
      expect(localStorage.getItem(key)).toEqual(JSON.stringify(value));
    });
  });

  describe("loadFromStorage", () => {
    it("loads and parses data from localStorage if present", () => {
      const value = { language: "TypeScript" };
      localStorage.setItem(key, JSON.stringify(value));

      const result = loadFromStorage<typeof value>(key, {
        language: "",
      });

      expect(result).toEqual(value);
    });

    it("returns fallback if key does not exist", () => {
      const fallback = { fallback: true };

      const result = loadFromStorage<typeof fallback>(
        "nonexistent-key",
        fallback
      );

      expect(result).toEqual(fallback);
    });

    it("returns fallback if stored value is null", () => {
      localStorage.removeItem(key);

      const fallback = { fallback: true };
      const result = loadFromStorage<typeof fallback>(key, fallback);

      expect(result).toEqual(fallback);
    });
  });
});
