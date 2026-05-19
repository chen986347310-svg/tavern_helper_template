// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia } from "pinia";
import { reactive } from "vue";

vi.mock("../store", () => {
  const mockData = reactive({
    系统: { 阶段: "攻略期", 剩余天数: 30, 灵石: 1000, 已使用阵法: false },
    牝奴: { 堕落度: 0, 牝阴决层数: 0, 上次支配者: "", 支配次数: {}, 改造进度: { 泌乳: false, 肛门: false, 憋尿: false } },
    NPC: {
      白芷: { 好感度: 50, 攻略值: 30, 粘滞计数: 1, 状态: "进行中" },
      苏芸: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" },
      纪兰: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" },
      沈月秋: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" },
      柳素衣: { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" },
    },
    道具: { 拥有: {}, 装备: { "玩家": [], "白芷": [], "苏芸": [], "纪兰": [], "沈月秋": [], "柳素衣": [] } },
    场景: { 已解锁: [] },
    剧情: { 已解锁: [] },
  });

  return {
    useDataStore: () => ({ data: mockData }),
    __mockData: mockData,
  };
});

import HomePage from "../pages/HomePage.vue";
import { __mockData as mockData } from "../store";

describe("HomePage", () => {
  beforeEach(() => {
    mockData.系统.阶段 = "攻略期";
    mockData.系统.剩余天数 = 30;
    mockData.系统.灵石 = 1000;
    // 重置 NPC 状态
    mockData.NPC.白芷 = { 好感度: 50, 攻略值: 30, 粘滞计数: 1, 状态: "进行中" };
    mockData.NPC.苏芸 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" };
    mockData.NPC.纪兰 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" };
    mockData.NPC.沈月秋 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" };
    mockData.NPC.柳素衣 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" };
  });

  it("攻略期显示 SystemBar", () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    expect(wrapper.find(".system-bar").exists()).toBe(true);
  });

  it("SystemBar 包含太极图标", () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const icons = wrapper.findAll(".taiji-icon");
    expect(icons).toHaveLength(5);
  });

  it("渲染5个NPC卡片", () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const npcCards = wrapper.findAll(".npc-strip");
    expect(npcCards).toHaveLength(5);
  });

  it("NPC卡片显示正确名字", () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const names = wrapper.findAll(".strip-name").map(w => w.text());
    expect(names).toEqual(["白芷", "苏芸", "纪兰", "沈月秋", "柳素衣"]);
  });

  it("点击进行中卡片展开", async () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll(".npc-strip");
    await cards[0].trigger("click");
    await flushPromises();
    expect(wrapper.findAll(".npc-strip")[0].classes()).toContain("expanded");
  });

  it("再次点击同一卡片收起", async () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll(".npc-strip");
    await cards[0].trigger("click");
    await flushPromises();
    await cards[0].trigger("click");
    await flushPromises();
    expect(wrapper.findAll(".npc-strip")[0].classes()).not.toContain("expanded");
  });

  it("点击不同卡片切换展开", async () => {
    // 设两个进行中卡片以测试切换
    mockData.NPC.苏芸.状态 = "进行中";
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll(".npc-strip");
    await cards[0].trigger("click");
    await flushPromises();
    expect(wrapper.findAll(".npc-strip")[0].classes()).toContain("expanded");
    await cards[1].trigger("click");
    await flushPromises();
    expect(wrapper.findAll(".npc-strip")[0].classes()).not.toContain("expanded");
    expect(wrapper.findAll(".npc-strip")[1].classes()).toContain("expanded");
  });

  it("同时只有一个卡片展开", async () => {
    mockData.NPC.苏芸.状态 = "进行中";
    mockData.NPC.纪兰.状态 = "已完成";
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll(".npc-strip");
    await cards[0].trigger("click");
    await flushPromises();
    await cards[1].trigger("click");
    await flushPromises();
    await cards[2].trigger("click");
    await flushPromises();
    const expandedCount = wrapper.findAll(".npc-strip.expanded").length;
    expect(expandedCount).toBeLessThanOrEqual(1);
  });

  it("全部完成时太极图标全粉", async () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    for (const npc of ["白芷", "苏芸", "纪兰", "沈月秋", "柳素衣"]) {
      mockData.NPC[npc].状态 = "已完成";
    }
    await flushPromises();
    const conquered = wrapper.findAll(".taiji--conquered");
    expect(conquered).toHaveLength(5);
  });

  it("未开始卡片有 locked class", () => {
    const wrapper = mount(HomePage, { global: { plugins: [createPinia()] } });
    const cards = wrapper.findAll(".npc-strip");
    // 苏芸是未开始
    expect(cards[1].classes()).toContain("locked");
  });
});
