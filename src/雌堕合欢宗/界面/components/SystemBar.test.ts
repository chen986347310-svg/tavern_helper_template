// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SystemBar from "./SystemBar.vue";

describe("SystemBar", () => {
  describe("攻略期模式", () => {
    const npcList = ["白芷", "苏芸", "纪兰", "沈月秋", "柳素衣"] as const;

    it("渲染 5 个太极图标", () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: "攻略期",
          npcList,
          npcStates: {
            白芷: { 状态: "未开始" }, 苏芸: { 状态: "未开始" },
            纪兰: { 状态: "未开始" }, 沈月秋: { 状态: "未开始" },
            柳素衣: { 状态: "未开始" },
          },
        },
      });
      expect(wrapper.findAll(".taiji-icon")).toHaveLength(5);
    });

    it("全未攻略时全蓝", () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: "攻略期",
          npcList,
          npcStates: {
            白芷: { 状态: "未开始" }, 苏芸: { 状态: "未开始" },
            纪兰: { 状态: "未开始" }, 沈月秋: { 状态: "未开始" },
            柳素衣: { 状态: "未开始" },
          },
        },
      });
      const icons = wrapper.findAll(".taiji-icon");
      icons.forEach(icon => expect(icon.classes()).toContain("taiji--unconquered"));
    });

    it("3 个已攻略时 3 粉 2 蓝", () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: "攻略期",
          npcList,
          npcStates: {
            白芷: { 状态: "已完成" }, 苏芸: { 状态: "已完成" },
            纪兰: { 状态: "已完成" }, 沈月秋: { 状态: "未开始" },
            柳素衣: { 状态: "未开始" },
          },
        },
      });
      const conquered = wrapper.findAll(".taiji--conquered");
      const unconquered = wrapper.findAll(".taiji--unconquered");
      expect(conquered).toHaveLength(3);
      expect(unconquered).toHaveLength(2);
    });

    it("全已攻略时全粉", () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: "攻略期",
          npcList,
          npcStates: {
            白芷: { 状态: "已完成" }, 苏芸: { 状态: "已完成" },
            纪兰: { 状态: "已完成" }, 沈月秋: { 状态: "已完成" },
            柳素衣: { 状态: "已完成" },
          },
        },
      });
      const conquered = wrapper.findAll(".taiji--conquered");
      expect(conquered).toHaveLength(5);
    });

    it("图标按攻略链排列", () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: "攻略期",
          npcList,
          npcStates: {
            白芷: { 状态: "未开始" }, 苏芸: { 状态: "未开始" },
            纪兰: { 状态: "未开始" }, 沈月秋: { 状态: "未开始" },
            柳素衣: { 状态: "未开始" },
          },
        },
      });
      const names = wrapper.findAll(".taiji-name").map(w => w.text());
      expect(names).toEqual(["白芷", "苏芸", "纪兰", "沈月秋", "柳素衣"]);
    });

    it("包含 SVG 太极图标", () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: "攻略期",
          npcList,
          npcStates: {
            白芷: { 状态: "未开始" }, 苏芸: { 状态: "未开始" },
            纪兰: { 状态: "未开始" }, 沈月秋: { 状态: "未开始" },
            柳素衣: { 状态: "未开始" },
          },
        },
      });
      const svgs = wrapper.findAll(".taiji-svg");
      expect(svgs).toHaveLength(5);
    });

    it("攻略期有正确的无障碍属性", () => {
      const wrapper = mount(SystemBar, {
        props: {
          mode: "攻略期",
          npcList,
          npcStates: {
            白芷: { 状态: "已完成" }, 苏芸: { 状态: "未开始" },
            纪兰: { 状态: "未开始" }, 沈月秋: { 状态: "未开始" },
            柳素衣: { 状态: "未开始" },
          },
        },
      });
      const bar = wrapper.find(".system-bar");
      expect(bar.attributes("role")).toBe("toolbar");
      expect(bar.attributes("aria-label")).toBe("攻略进度状态栏");
      const firstIcon = wrapper.find(".taiji-icon");
      expect(firstIcon.attributes("role")).toBe("img");
      expect(firstIcon.attributes("aria-label")).toContain("已攻略");
    });
  });

  describe("牝奴期模式", () => {
    it("堕落度=0 时 0 瓣亮起", () => {
      const wrapper = mount(SystemBar, {
        props: { mode: "牝奴期", 堕落度: 0 },
      });
      const litPetals = wrapper.findAll(".blossom-petal.lit");
      expect(litPetals).toHaveLength(0);
    });

    it("堕落度=40 时 2 瓣亮起", () => {
      const wrapper = mount(SystemBar, {
        props: { mode: "牝奴期", 堕落度: 40 },
      });
      const litPetals = wrapper.findAll(".blossom-petal.lit");
      expect(litPetals).toHaveLength(2);
    });

    it("堕落度=100 时 5 瓣亮起", () => {
      const wrapper = mount(SystemBar, {
        props: { mode: "牝奴期", 堕落度: 100 },
      });
      const litPetals = wrapper.findAll(".blossom-petal.lit");
      expect(litPetals).toHaveLength(5);
    });

    it("SVG 圆环进度匹配堕落度", () => {
      const wrapper = mount(SystemBar, {
        props: { mode: "牝奴期", 堕落度: 60 },
      });
      const progress = wrapper.find(".blossom-progress");
      const circumference = 2 * Math.PI * 34;
      const expectedOffset = circumference * (1 - 60 / 100);
      expect(progress.attributes("stroke-dashoffset")).toBeCloseTo(expectedOffset, 1);
    });

    it("显示堕落度百分比", () => {
      const wrapper = mount(SystemBar, {
        props: { mode: "牝奴期", 堕落度: 75 },
      });
      expect(wrapper.find(".blossom-value").text()).toBe("75%");
    });

    it("包含 SVG 樱花圆环", () => {
      const wrapper = mount(SystemBar, {
        props: { mode: "牝奴期", 堕落度: 50 },
      });
      expect(wrapper.find(".blossom-ring-svg").exists()).toBe(true);
      expect(wrapper.findAll(".blossom-petal")).toHaveLength(5);
    });

    it("牝奴期有正确的无障碍属性", () => {
      const wrapper = mount(SystemBar, {
        props: { mode: "牝奴期", 堕落度: 50 },
      });
      const bar = wrapper.find(".system-bar");
      expect(bar.attributes("role")).toBe("toolbar");
      expect(bar.attributes("aria-label")).toBe("牝奴堕落状态栏");
      const progress = wrapper.find(".blossom-ring-wrapper");
      expect(progress.attributes("role")).toBe("progressbar");
      expect(progress.attributes("aria-valuenow")).toBe("50");
    });
  });
});
