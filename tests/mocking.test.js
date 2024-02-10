import { it, expect, describe, vi } from "vitest";

describe("test suite", () => {
  it("test case", async () => {
    const greet = vi.fn();
    greet.mockImplementation((name) => `Hello ${name}`);
    // greet.mockReturnValue
    // greet.mockResolvedValue
    // const result = await greet("Fred");
    const result = greet("Fred");
    expect(greet).toHaveBeenCalled();
    expect(greet).toHaveBeenCalledOnce();
    expect(greet).toHaveBeenCalledWith("Fred");
    expect(result).toBe("Hello Fred");
  });
});
