import { Role, ChecklistItem, ChecklistData } from "../types";

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

// 通用材料（所有角色）
export const commonItems: ChecklistItem[] = [
  { id: 1, name: "护照", requirement: "原件", isKey: false, notes: "" },
  { id: 2, name: "照片", requirement: "原件", isKey: false, notes: "35x45mm，白底，六个月内近照" },
  { id: 3, name: "VIDEX二维码打印件的第七页", requirement: "原件", isKey: false, notes: "" },
  {
    id: 4,
    name: "德国高校录取通知书或大学预备语言班报名证明",
    requirement: "原件",
    isKey: true,
    notes: ""
  },
  { id: 5, name: "经济来源证明", requirement: "原件", isKey: true, notes: "" },
  { id: 6, name: "入境后医疗保险证明", requirement: "原件", isKey: true, notes: "" },
  { id: 7, name: "留德人员审核部的审核证书/审核证明/审核传真", requirement: "原件", isKey: true, notes: "" },
  { id: 8, name: "语言水平证明", requirement: "原件", isKey: true, notes: "" },
  { id: 9, name: "签证申请表原件", requirement: "复印件", isKey: false, notes: "首页粘贴护照照片，末页亲笔签名" },
  { id: 10, name: "《居留法》条款告知书", requirement: "复印件", isKey: false, notes: "亲笔签名" },
  { id: 11, name: "护照照片页复印件", requirement: "复印件", isKey: false, notes: "" },
  {
    id: 12,
    name: "德国高校录取通知书复印件 或 大学预备语言班报名证明复印件",
    requirement: "复印件",
    isKey: false,
    notes: ""
  },
  { id: 13, name: "大学授课语言和要求达到的语言级别的说明", requirement: "复印件", isKey: false, notes: "" },
  { id: 14, name: "经济来源证明复印件", requirement: "复印件", isKey: false, notes: "" },
  { id: 15, name: "语言水平证明复印件", requirement: "复印件", isKey: false, notes: "中文证明须附德文或英文翻译" },
  { id: 16, name: "德文或英文个人简历", requirement: "复印件", isKey: false, notes: "至今为止无间断经历" },
  { id: 17, name: "德文或英文留学动机说明", requirement: "复印件", isKey: false, notes: "亲笔签名" },
  { id: 18, name: "留德人员审核部审核证书/审核证明/审核传真的复印件", requirement: "复印件", isKey: false, notes: "" },
  { id: 19, name: "入境后医疗保险证明复印件", requirement: "复印件", isKey: false, notes: "" },
];

// 角色特定材料
export const roleSpecificItems = {
  bachelor_in_progress: [
    { id: 20, name: "中国高校在读证明/休学证明/退学证明", requirement: "原件", isKey: true, notes: "适用于中国高校在读生，需翻译" },
    { id: 21, name: "中国高校在读证明/休学证明/退学证明的复印件，并附德文或英文翻译", requirement: "复印件", isKey: false, notes: "" },
  ],
  bachelor_graduated: [
    { id: 20, name: "本科毕业证书和学士学位证书", requirement: "原件+复印件", isKey: true, notes: "需附德文或英文翻译" },
    { id: 21, name: "本科毕业证书和本科学位证书的复印件，并附德文或英文翻译", requirement: "复印件", isKey: false, notes: "" },
  ],
  master_in_progress: [
    { id: 20, name: "本科毕业证书和学士学位证书", requirement: "原件+复印件", isKey: true, notes: "需附德文或英文翻译" },
    { id: 21, name: "本科毕业证书和本科学位证书的复印件，并附德文或英文翻译", requirement: "复印件", isKey: false, notes: "" },
  ],
  master_graduated: [
    { id: 20, name: "本科毕业证书和学士学位证书", requirement: "原件+复印件", isKey: true, notes: "需附德文或英文翻译" },
    { id: 21, name: "硕士毕业证书和硕士学位证书", requirement: "原件+复印件", isKey: true, notes: "需附德文或英文翻译" },
    { id: 22, name: "本科毕业证书和本科学位证书的复印件，并附德文或英文翻译", requirement: "复印件", isKey: false, notes: "" },
    { id: 23, name: "硕士毕业证书和硕士学位证书的复印件，并附德文或英文翻译", requirement: "复印件", isKey: false, notes: "" },
  ],
};

export const checklistData: ChecklistData = {
  common: commonItems,
  roleSpecific: roleSpecificItems as unknown as Record<string, ChecklistItem[]>,
};

export function getChecklistForRole(roleId: string): ChecklistItem[] {
  const common: ChecklistItem[] = [...commonItems];
  const specific: ChecklistItem[] = (roleSpecificItems as any)[roleId] || [];
  return [...common, ...specific];
}
