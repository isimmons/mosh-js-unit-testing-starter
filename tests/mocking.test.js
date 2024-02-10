import { it, expect, describe, vi } from "vitest";
import { getPriceInCurrency } from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";

// this will mock all exported functions from the currency module
// this line is hoisted so it replaces the functions with the mocked
// version first. So, when getExchangeRate is imported above
// it is actually the mocked version being imported
vi.mock("../src/libs/currency");

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

describe("getPriceInCurrency", () => {
  it("should return price in target currency", () => {
    // pass reference to the getExchangeRate function and set
    // the mocked return value.
    vi.mocked(getExchangeRate).mockReturnValue(1.5);
    // now whenever getExchangeRate is called it will return 1.5
    // even when getPriceInCurrency calls it
    // remember getPriceInCurrency is the function we are testing
    // we have to mock anything it needs externally in order to do it's job
    const price = getPriceInCurrency(10, "AUD");

    expect(price).toBe(15);
  });
});
