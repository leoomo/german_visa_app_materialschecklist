import { Role, ChecklistItem, ItemSection } from "../types";

export const roles: Role[] = [
  {
    id: "bachelor_in_progress",
    name: "大学在读",
    description: "本科在读，申请德国硕士",
  },
  {
    id: "bachelor_graduated",
    name: "大学毕业",
    description: "本科毕业，申请德国硕士",
  },
  {
    id: "master_in_progress",
    name: "硕士在读",
    description: "硕士在读，申请德国博士或二硕",
  },
  {
    id: "master_graduated",
    name: "硕士毕业",
    description: "硕士毕业，申请德国博士或二硕",
  },
];

// 创建带section和itemId的item
function createItem(
  id: number,
  section: ItemSection,
  name: string,
  requirement: ChecklistItem["requirement"],
  isKey: boolean,
  notes: string = "",
  details?: string[]
): ChecklistItem {
  return {
    id,
    section,
    itemId: `${section}-${id}`,
    name,
    requirement,
    isKey,
    notes,
    details,
  };
}

// 原件部分 (1-12)
const originalItems: ChecklistItem[] = [
  createItem(1, "原件", "护照", "原件", false),
  createItem(2, "原件", "照片", "原件", false, "2张白底近照", [
    "2张",
    "35x45mm白底",
    "6个月内近照",
    "刘海不遮眉，露耳",
    "无妆、不露齿、不戴眼镜",
    "不可精修"
  ]),
  createItem(3, "原件", "VIDEX二维码打印件", "原件", false, "", [
    "填写网址: videx.diplo.de",
    "出生地填省份",
    "电话邮箱必填",
    "邀请人选机构，德语填学校名",
    "清晰打印第七页二维码"
  ]),
  createItem(4, "原件", "德国高校录取通知书或大学预备语言班报名证明", "原件", true),
  createItem(5, "原件", "关于签证申请的声明书", "原件", false, "打印签字", [
    "china.diplo.de 下载",
    "签字后放在申请表后"
  ]),
  createItem(6, "原件", "经济来源证明", "原件", true),
  createItem(7, "原件", "入境后医疗保险证明", "原件", true),
  createItem(8, "原件", "留德人员审核部的审核证书/审核证明/审核传真", "原件", true),
  createItem(9, "原件", "语言水平证明", "原件", true),
  createItem(10, "原件", "签证申请表原件", "原件", false, "中文+拼音签名", [
    "首页贴照片",
    "末页签名与护照一致",
    "第12项居留时间与VIDEX一致"
  ]),
  createItem(11, "原件", "《居留法》条款告知书", "原件", false, "中文+拼音签名", [
    "中文加拼音亲笔签名"
  ]),
  createItem(12, "原件", "签证费", "原件", false, "银联银行卡", [
    "带银联标志的银行卡"
  ]),
];

// 复印件部分 (1-15)
const copyItems: ChecklistItem[] = [
  createItem(1, "复印件", "护照照片页复印件", "复印件", false),
  createItem(2, "复印件", "德国高校录取通知书复印件 或 大学预备语言班报名证明复印件", "复印件", false),
  createItem(3, "复印件", "大学授课语言和要求达到的语言级别的说明", "复印件", false),
  createItem(4, "复印件", "经济来源证明复印件", "复印件", false),
  createItem(5, "复印件", "语言水平证明复印件", "复印件", false, "中文证明须附德文或英文翻译"),
  createItem(6, "复印件", "德文或英文个人简历", "复印件", false, "至今为止无间断经历"),
  createItem(7, "复印件", "德文或英文留学动机说明", "复印件", false, "亲笔签名"),
  createItem(8, "复印件", "留德人员审核部审核证书/审核证明/审核传真的复印件", "复印件", false),
  createItem(9, "复印件", "入境后医疗保险证明复印件", "复印件", false),
];

// 创建角色特定材料
function createRoleItem(
  id: number,
  section: ItemSection,
  name: string,
  requirement: ChecklistItem["requirement"],
  isKey: boolean,
  notes: string = ""
): ChecklistItem {
  return createItem(id, section, name, requirement, isKey, notes);
}

// 每个角色独立的完整清单
export const checklistsByRole: Record<string, ChecklistItem[]> = {
  bachelor_in_progress: [
    ...originalItems,
    ...copyItems,
    createRoleItem(13, "原件", "中国高校在读证明/休学证明/退学证明", "原件", true, "适用于中国高校在读生，需翻译"),
    createRoleItem(10, "复印件", "中国高校在读证明/休学证明/退学证明的复印件，并附德文或英文翻译", "复印件", false),
  ],
  bachelor_graduated: [
    ...originalItems,
    ...copyItems,
    createRoleItem(13, "原件", "本科毕业证书和学士学位证书", "原件+复印件", true, "需附德文或英文翻译"),
    createRoleItem(10, "复印件", "本科毕业证书和本科学位证书的复印件，并附德文或英文翻译", "复印件", false),
  ],
  master_in_progress: [
    ...originalItems,
    ...copyItems,
    createRoleItem(13, "原件", "本科毕业证书和学士学位证书", "原件+复印件", true, "需附德文或英文翻译"),
    createRoleItem(10, "复印件", "本科毕业证书和本科学位证书的复印件，并附德文或英文翻译", "复印件", false),
  ],
  master_graduated: [
    ...originalItems,
    ...copyItems,
    createRoleItem(13, "原件", "本科毕业证书和学士学位证书", "原件+复印件", true, "需附德文或英文翻译"),
    createRoleItem(14, "原件", "硕士毕业证书和硕士学位证书", "原件+复印件", true, "需附德文或英文翻译"),
    createRoleItem(10, "复印件", "本科毕业证书和本科学位证书的复印件，并附德文或英文翻译", "复印件", false),
    createRoleItem(11, "复印件", "硕士毕业证书和硕士学位证书的复印件，并附德文或英文翻译", "复印件", false),
  ],
};

export function getChecklistForRole(roleId: string): ChecklistItem[] {
  return checklistsByRole[roleId] || [];
}

// 获取每个角色的总项目数
export function getTotalItemsForRole(roleId: string): number {
  return checklistsByRole[roleId]?.length || 0;
}
