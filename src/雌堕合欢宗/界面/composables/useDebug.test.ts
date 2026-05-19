// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { reactive } from "vue";

vi.mock("../store", () => {
  const mockData = reactive({
    系统: { 阶段: "攻略期", 剩余天数: 30, 灵石: 1000, 已使用阵法: false },
    牝奴: { 堕落度: 50, 牝阴决层数: 3, 上次支配者: "", 支配次数: {}, 改造进度: { 泌乳: true, 肛门: false, 憋尿: true } },
    NPC: {
      白芷: { 好感度: 80, 攻略值: 60, 粘滞计数: 2, 状态: "进行中" },
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

import { useDebug, __resetDebugState } from "./useDebug";
import { __mockData as mockData } from "../store";

describe("useDebug", () => {
  beforeEach(() => {
    __resetDebugState();
    mockData.系统.阶段 = "攻略期";
    mockData.系统.剩余天数 = 30;
    mockData.系统.灵石 = 1000;
    mockData.NPC.白芷 = { 好感度: 80, 攻略值: 60, 粘滞计数: 2, 状态: "进行中" };
    mockData.NPC.苏芸 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" };
    mockData.NPC.纪兰 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" };
    mockData.NPC.沈月秋 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" };
    mockData.NPC.柳素衣 = { 好感度: 0, 攻略值: 0, 粘滞计数: 0, 状态: "未开始" };
    mockData.牝奴.堕落度 = 50;
    mockData.牝奴.牝阴决层数 = 3;
  });

  it("初始 visible 为 false", () => {
    const { visible } = useDebug();
    expect(visible.value).toBe(false);
  });

  it("toggle 切换可见性", () => {
    const { visible, toggle } = useDebug();
    toggle();
    expect(visible.value).toBe(true);
    toggle();
    expect(visible.value).toBe(false);
  });

  it("completeAll 将所有 NPC 设为已完成", () => {
    const { completeAll } = useDebug();
    completeAll();
    for (const npc of ["白芷", "苏芸", "纪兰", "沈月秋", "柳素衣"]) {
      expect(mockData.NPC[npc].状态).toBe("已完成");
      expect(mockData.NPC[npc].好感度).toBe(100);
      expect(mockData.NPC[npc].攻略值).toBe(100);
    }
  });

  it("resetAll 重置所有数据", () => {
    const { resetAll } = useDebug();
    mockData.系统.阶段 = "牝奴期";
    mockData.系统.灵石 = 5000;
    resetAll();
    expect(mockData.系统.阶段).toBe("攻略期");
    expect(mockData.系统.剩余天数).toBe(30);
    expect(mockData.系统.灵石).toBe(0);
    expect(mockData.牝奴.堕落度).toBe(0);
    expect(mockData.牝奴.牝阴决层数).toBe(0);
    for (const npc of ["白芷", "苏芸", "纪兰", "沈月秋", "柳素衣"]) {
      expect(mockData.NPC[npc].状态).toBe("未开始");
      expect(mockData.NPC[npc].好感度).toBe(0);
    }
  });

  it("completeAll 后 resetAll 恢复初始状态", () => {
    const { completeAll, resetAll } = useDebug();
    completeAll();
    resetAll();
    expect(mockData.NPC.白芷.状态).toBe("未开始");
    expect(mockData.NPC.白芷.好感度).toBe(0);
  });

  it("多次调用 useDebug 返回同一个 visible (单例)", () => {
    const a = useDebug();
    const b = useDebug();
    expect(a.visible).toBe(b.visible);
  });

  it("initShortcut 幂等: 多次调用只注册一次监听", () => {
    const spy = vi.spyOn(document, "addEventListener");
    const { initShortcut } = useDebug();
    initShortcut();
    initShortcut();
    initShortcut();
    const keydownCalls = spy.mock.calls.filter(c => c[0] === "keydown");
    expect(keydownCalls).toHaveLength(1);
    spy.mockRestore();
  });

  it("Ctrl+Shift+D 触发 toggle", () => {
    const { visible, initShortcut } = useDebug();
    // 捕获注册的 keydown handler, 直接构造带修饰键的事件调用
    const handler = vi.fn();
    const origAdd = document.addEventListener.bind(document);
    vi.spyOn(document, "addEventListener").mockImplementation((type, cb, opts) => {
      if (type === "keydown") {
        handler.mockImplementation(cb as any);
      }
      return origAdd(type, cb, opts);
    });
    initShortcut();
    // 直接用 handler 调用, 手动构造含修饰键的事件
    const makeEvent = () => {
      const e = new KeyboardEvent("keydown");
      vi.spyOn(e, "ctrlKey", "get").mockReturnValue(true);
      vi.spyOn(e, "shiftKey", "get").mockReturnValue(true);
      vi.spyOn(e, "key", "get").mockReturnValue("D");
      return e;
    };
    handler(makeEvent());
    expect(visible.value).toBe(true);
    handler(makeEvent());
    expect(visible.value).toBe(false);
  });
});
