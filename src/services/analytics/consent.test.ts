import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ANALYTICS_CONSENT_EVENT,
  getAnalyticsConsent,
  setAnalyticsConsent,
} from "./consent";

describe("analytics consent", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.gtag = undefined;
  });

  it("starts pending and persists an explicit choice", () => {
    expect(getAnalyticsConsent()).toBe("pending");
    setAnalyticsConsent("accepted");
    expect(getAnalyticsConsent()).toBe("accepted");
  });

  it("notifies providers when the choice changes", () => {
    const listener = vi.fn();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, listener);
    setAnalyticsConsent("accepted");
    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, listener);
  });

  it("signals denied consent when analytics is rejected", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    setAnalyticsConsent("rejected");
    expect(gtag).toHaveBeenCalledWith(
      "consent",
      "update",
      expect.objectContaining({ analytics_storage: "denied" })
    );
  });
});

