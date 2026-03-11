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
  details?: string[],
  applicableRoles?: string[] // 为空表示所有角色都适用
): ChecklistItem & { applicableRoles?: string[] } {
  return {
    id,
    section,
    itemId: `${section}-${id}`,
    name,
    requirement,
    isKey,
    notes,
    details,
    applicableRoles,
  };
}

// 原件部分 (1-12) - 与PDF编号一致
const originalItems: (ChecklistItem & { applicableRoles?: string[] })[] = [
  createItem(1, "原件", "护照", "原件", false),
  createItem(2, "原件", "照片", "原件", false, "一张，用曲别针夹在护照首页", [
    "35x45mm白底",
    "6个月内近照",
    "不可使用任何照片软件进行修饰",
  ]),
  createItem(3, "原件", "VIDEX二维码打印件", "原件", false, "第七页", [
    "填写网址: videx.diplo.de",
    "清晰打印第七页二维码",
  ]),
  createItem(4, "原件", "德国高校录取通知书或大学预备语言班报名证明", "原件", true, "", [
    "情况一：高校录取通知书",
    "情况二：语言班报名证明+学费收据+大学联系信或者大学申请证明",
  ]),
  createItem(5, "原件", "经济来源证明", "原件", true),
  createItem(6, "原件", "高中毕业证书", "原件", true, "适用于高考程序", undefined, []), // 高考程序专用，当前角色列表中不包含
  createItem(7, "原件", "中国高校在读证明/休学证明/退学证明", "原件", true, "适用于中国高校在读生", undefined, ["bachelor_in_progress", "master_in_progress"]),
  createItem(8, "原件", "本科毕业证书和学士学位证书", "原件", true, "需附德文或英文翻译", undefined, ["bachelor_graduated", "master_in_progress", "master_graduated"]),
  createItem(9, "原件", "硕士毕业证书和硕士学位证书", "原件", true, "适用于硕士毕业生", undefined, ["master_graduated"]),
  createItem(10, "原件", "入境后医疗保险证明", "原件", true),
  createItem(11, "原件", "留德人员审核部的审核证书/审核证明/审核传真", "原件", true),
  createItem(12, "原件", "语言水平证明", "原件", true, "若是中文证明须附德文或英文翻译"),
];

// 复印件部分 (1-15) - 与PDF编号一致
const copyItems: (ChecklistItem & { applicableRoles?: string[] })[] = [
  createItem(1, "复印件", "签证申请表原件", "复印件", false, "首页贴照片，末页申请人亲笔签名（中文加拼音）", [
    "首页粘贴护照照片",
    "末页申请人亲笔签名（中文加拼音）",
  ]),
  createItem(2, "复印件", "《居留法》条款告知书", "复印件", false, "申请人亲笔签名（中文加拼音）"),
  createItem(3, "复印件", "护照照片页复印件", "复印件", false),
  createItem(4, "复印件", "德国高校录取通知书复印件或大学预备语言班报名证明复印件", "复印件", false),
  createItem(5, "复印件", "大学授课语言和要求达到的语言级别的说明", "复印件", false),
  createItem(6, "复印件", "经济来源证明复印件", "复印件", false),
  createItem(7, "复印件", "语言水平证明复印件", "复印件", false, "若是中文证明须附德文或英文翻译"),
  createItem(8, "复印件", "高中毕业证书复印件，并附德文或英文翻译", "复印件", false, "适用于高考程序", undefined, []), // 高考程序专用
  createItem(9, "复印件", "中国高校在读证明/休学证明/退学证明的复印件，并附德文或英文翻译", "复印件", false, "适用于中国高校在读生", undefined, ["bachelor_in_progress", "master_in_progress"]),
  createItem(10, "复印件", "本科毕业证书和本科学位证书的复印件，并附德文或英文翻译", "复印件", false, "适用于本科毕业生、硕士生在读生以及硕士毕业生", undefined, ["bachelor_graduated", "master_in_progress", "master_graduated"]),
  createItem(11, "复印件", "硕士毕业证书和硕士学位证书的复印件，并附德文或英文翻译", "复印件", false, "适用于硕士毕业生", undefined, ["master_graduated"]),
  createItem(12, "复印件", "德文或英文个人简历", "复印件", false, "至今为止无间断经历"),
  createItem(13, "复印件", "德文或英文留学动机说明", "复印件", false, "申请人亲笔签名（中文加拼音）"),
  createItem(14, "复印件", "留德人员审核部审核证书/审核证明/审核传真的复印件", "复印件", false),
  createItem(15, "复印件", "入境后医疗保险证明复印件", "复印件", false),
];

// 获取适用于指定角色的清单
export function getChecklistForRole(roleId: string): ChecklistItem[] {
  const filteredOriginals = originalItems
    .filter(item => !item.applicableRoles || item.applicableRoles.length === 0 || item.applicableRoles.includes(roleId))
    .map(({ applicableRoles, ...rest }) => rest);

  const filteredCopies = copyItems
    .filter(item => !item.applicableRoles || item.applicableRoles.length === 0 || item.applicableRoles.includes(roleId))
    .map(({ applicableRoles, ...rest }) => rest);

  return [...filteredOriginals, ...filteredCopies];
}

// 获取每个角色的总项目数
export function getTotalItemsForRole(roleId: string): number {
  return getChecklistForRole(roleId).length;
}
