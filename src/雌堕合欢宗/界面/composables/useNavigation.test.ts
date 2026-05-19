// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { useNavigation } from "./useNavigation";

describe("useNavigation", () => {
  it("默认 currentTab 为 home", () => {
    const { currentTab } = useNavigation();
    expect(currentTab.value).toBe("home");
  });

  it("navigateTo 切换 tab", () => {
    const { currentTab, navigateTo } = useNavigation();
    navigateTo("shop");
    expect(currentTab.value).toBe("shop");
  });

  it("支持自定义初始 tab", () => {
    const { currentTab } = useNavigation("gallery");
    expect(currentTab.value).toBe("gallery");
  });
});
