import { describe, expect, it, vi } from "vitest";
import { registerAccount } from "./signup";

describe("account registration", () => {
  it("requires email confirmation when signup has no session", async () => {
    const signUp = vi.fn().mockResolvedValue({ data: { session: null }, error: null });
    expect(await registerAccount({ signUp }, "person@example.org", "fictional-test-password", "https://portal.example.org")).toBe("confirm-email");
  });
  it("does not allow the registration form to request administrator privileges", async () => {
    const signUp = vi.fn().mockResolvedValue({ data: { session: null }, error: null });
    await registerAccount({ signUp }, "person@example.org", "fictional-test-password", "https://portal.example.org");
    expect(signUp).toHaveBeenCalledWith({ email: "person@example.org", password: "fictional-test-password", options: { emailRedirectTo: "https://portal.example.org" } });
  });
  it("does not grant access when registration fails", async () => {
    const signUp = vi.fn().mockResolvedValue({ data: { session: null }, error: { code: "signup_disabled", message: "disabled" } });
    await expect(registerAccount({ signUp }, "person@example.org", "fictional-test-password", "https://portal.example.org")).rejects.toThrow();
  });
});