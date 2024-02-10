import { it, expect, describe, vi } from "vitest";

describe("greet", () => {
  it("should mock the greet function", async () => {
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

describe("sendText", () => {
  it("should mock the sendText function", () => {
    const sendText = vi.fn();
    sendText.mockReturnValue("ok");

    const result = sendText("message");
    expect(sendText).toHaveBeenCalledWith("message");
    expect(result).toBe("ok");
  });
});
