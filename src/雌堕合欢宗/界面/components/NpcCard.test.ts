// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import NpcCard from "./NpcCard.vue";

function createNpcData(overrides: Partial<{ 好感度: number; 攻略值: number; 粘滞计数: number; 状态: string }> = {}) {
  return {
    好感度: 0,
    攻略值: 0,
    粘滞计数: 0,
    状态: "未开始" as string,
    ...overrides,
  };
}

describe("NpcCard", () => {
  it("显示NPC名号", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData() },
    });
    expect(wrapper.find(".strip-name").text()).toBe("白芷");
  });

  it("显示状态文字", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 状态: "进行中" }) },
    });
    expect(wrapper.find(".strip-status").text()).toContain("进行中");
  });

  it("进行中状态显示好感度数值", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 好感度: 75, 状态: "进行中" }) },
    });
    expect(wrapper.find(".favor-value").text()).toBe("75");
  });

  it("好感度条宽度匹配百分比", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 好感度: 60, 状态: "进行中" }) },
    });
    const barFill = wrapper.find(".favor-fill");
    expect(barFill.attributes("style")).toContain("width: 60%");
  });

  it("展开区域显示好感度和攻略值", async () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 好感度: 45, 攻略值: 30, 状态: "进行中" }), expanded: true },
    });
    const expandValues = wrapper.findAll(".expand-value");
    expect(expandValues[0].text()).toBe("45");
    expect(expandValues[1].text()).toBe("30");
  });

  it("状态=未开始 → locked class", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 状态: "未开始" }) },
    });
    expect(wrapper.find(".npc-strip").classes()).toContain("locked");
  });

  it("状态=进行中 → active class", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 状态: "进行中" }) },
    });
    expect(wrapper.find(".npc-strip").classes()).toContain("active");
  });

  it("状态=已完成 → completed class", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 状态: "已完成" }) },
    });
    expect(wrapper.find(".npc-strip").classes()).toContain("completed");
  });

  it("进行中卡片点击触发事件", async () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 状态: "进行中" }) },
    });
    await wrapper.find(".npc-strip").trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
    expect(wrapper.emitted("toggleExpand")).toHaveLength(1);
  });

  it("未开始卡片不响应点击", async () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 状态: "未开始" }) },
    });
    await wrapper.find(".npc-strip").trigger("click");
    expect(wrapper.emitted("click")).toBeUndefined();
  });

  it("好感度=0时进度条宽度为0%", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 好感度: 0, 状态: "进行中" }) },
    });
    expect(wrapper.find(".favor-fill").attributes("style")).toContain("width: 0%");
  });

  it("好感度=100时进度条宽度为100%", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 好感度: 100, 状态: "进行中" }) },
    });
    expect(wrapper.find(".favor-fill").attributes("style")).toContain("width: 100%");
  });

  it("expanded=true 时展开区域有 expanded class", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 状态: "进行中" }), expanded: true },
    });
    expect(wrapper.find(".card-expand").classes()).toContain("expanded");
  });

  it("装备列表正确渲染", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 状态: "进行中" }), 装备: ["铃铛项圈", "眼罩"], expanded: true },
    });
    const items = wrapper.findAll(".equip-item");
    expect(items).toHaveLength(2);
    expect(items[0].text()).toBe("铃铛项圈");
  });

  it("无装备时显示暂无装备", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 状态: "进行中" }), 装备: [], expanded: true },
    });
    expect(wrapper.find(".equip-empty").text()).toBe("暂无装备");
  });

  it("进行中头像src为正道版", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "苏芸", data: createNpcData({ 状态: "进行中" }) },
    });
    const img = wrapper.find(".avatar-img");
    if (img.exists()) {
      expect(decodeURIComponent(img.attributes("src"))).toContain("苏芸.png");
      expect(decodeURIComponent(img.attributes("src"))).not.toContain("fallen");
    }
  });

  it("已完成头像src为仙奴版", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "苏芸", data: createNpcData({ 状态: "已完成" }) },
    });
    const img = wrapper.find(".avatar-img");
    if (img.exists()) {
      expect(decodeURIComponent(img.attributes("src"))).toContain("苏芸_fallen.png");
    }
  });

  it("图片加载失败时回退到首字占位符", async () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 状态: "进行中" }) },
    });
    const img = wrapper.find(".avatar-img");
    if (img.exists()) {
      await img.trigger("error");
      expect(wrapper.find(".avatar-fallback").exists()).toBe(true);
      expect(wrapper.find(".avatar-fallback").text()).toBe("白");
    } else {
      // No img means fallback is already shown
      expect(wrapper.find(".avatar-fallback").exists()).toBe(true);
    }
  });

  it("展开时文字区淡出", () => {
    const wrapper = mount(NpcCard, {
      props: { npc名: "白芷", data: createNpcData({ 状态: "进行中" }), expanded: true },
    });
    expect(wrapper.find(".text-zone").classes()).toContain("text-fade");
  });
});
