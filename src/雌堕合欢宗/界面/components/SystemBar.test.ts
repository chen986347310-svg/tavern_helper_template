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

    it("圆环角度匹配堕落度", () => {
      const wrapper = mount(SystemBar, {
        props: { mode: "牝奴期", 堕落度: 60 },
      });
      const track = wrapper.find(".blossom-ring-track");
      expect(track.attributes("style")).toContain("216deg");
    });

    it("显示堕落度百分比", () => {
      const wrapper = mount(SystemBar, {
        props: { mode: "牝奴期", 堕落度: 75 },
      });
      expect(wrapper.find(".blossom-value").text()).toBe("75%");
    });
  });
});
