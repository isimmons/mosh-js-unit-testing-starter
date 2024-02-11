import { it, expect, describe, vi, beforeEach } from "vitest";
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
  signUp,
  submitOrder,
  login,
  isOnline,
  getDiscount,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

// this will mock all exported functions from the currency module
// this line is hoisted so it replaces the functions with the mocked
// version first. So, when getExchangeRate is imported above
// it is actually the mocked version being imported
vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");

// partial mocking
vi.mock("../src/libs/email", async (importOriginal) => {
  const emailModule = await importOriginal();

  return {
    // original functions from email module
    ...emailModule,
    // override and mock only sendEmail
    sendEmail: vi.fn(),
  };
});

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

describe("getShippingInfo", () => {
  it("should return shipping unavailable if quote cannot be fetched", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    const result = getShippingInfo("Kalamazu");
    expect(getShippingQuote).toHaveBeenCalledWith("Kalamazu");
    expect(result).toMatch(/unavailable/i);
  });

  it("should return shipping info if a quote is fetched", () => {
    vi.mocked(getShippingQuote).mockReturnValue({
      cost: 100,
      estimatedDays: 2,
    });

    const result = getShippingInfo("Kalamazu");
    expect(getShippingQuote).toHaveBeenCalledWith("Kalamazu");
    expect(result).toMatch(/shipping cost: \$100 \(2 days\)/i);
  });
});

describe("renderPage", () => {
  it("should return correct content", async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it("should call analytics", async () => {
    await renderPage();
    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  const order = { totalAmount: 10 };
  const creditCard = { creditCardNumber: "1234" };

  it("should charge the customer", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    await submitOrder(order, creditCard);
    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it("should return success when payment is successful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: true });
  });

  it("should return error object when payment is successful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: "payment_error" });
  });
});

describe("signUp", () => {
  // this requires us to remember to clear mocks
  // see ./vitest.config.js where we config vitest
  // to automatically clear all mocks before each test
  // beforeEach(() => {
  //   // clear individual
  //   vi.mocked(sendEmail).mockClear();
  //   // clear multiple mocked functions
  //   vi.clearAllMocks();
  // });

  const validEmail = "foo@foomail.com";
  const invalidEmail = "foo";

  it("should return false if email is not valid", async () => {
    const result = await signUp(invalidEmail);

    expect(result).toBe(false);
  });

  it("should return true if email is valid", async () => {
    const result = await signUp(validEmail);

    expect(result).toBe(true);
  });

  it("should send an email if email is valid v1", async () => {
    const result = await signUp(validEmail);

    expect(sendEmail).toHaveBeenCalledWith(
      validEmail,
      expect.stringMatching(/welcome/i)
    );
  });

  // longer but sometimes useful way
  // getting args from the mock
  it("should send an email if email is valid v2", async () => {
    const result = await signUp(validEmail);

    expect(sendEmail).toHaveBeenCalledOnce();

    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(validEmail);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe("login", () => {
  const email = "foo@foomail.com";

  it("should email the one-time login code", async () => {
    const spy = vi.spyOn(security, "generateCode");

    await login(email);

    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

describe("isOnline", () => {
  // potential candidate for parameterized test
  // but not going to for now
  it("should return false if current hour is outside opening hours", () => {
    // 1 min before opening time 8
    vi.setSystemTime("2024-01-01 07:59");
    expect(isOnline()).toBe(false);

    // 1 min after closing time 8PM or 20:00
    vi.setSystemTime("2024-01-01 20:01");
    expect(isOnline()).toBe(false);
  });

  it("should return true if current hour is within opening hours", () => {
    vi.setSystemTime("2024-01-01 08:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2024-01-01 19:59");
    expect(isOnline()).toBe(true);
  });
});

describe("getDiscount", () => {
  it("should return .2 on Christmas day", () => {
    vi.setSystemTime("2024-12-25 00:01");
    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime("2024-12-25 23:59");
    expect(getDiscount()).toBe(0.2);
  });

  it("should return 0 on any other day", () => {
    vi.setSystemTime("2024-12-24 00:01");
    expect(getDiscount()).toBe(0);

    vi.setSystemTime("2024-12-26 00:01");
    expect(getDiscount()).toBe(0);
  });
});
