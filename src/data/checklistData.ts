import { Role, ChecklistItem, ItemSection, RoleType } from "../types";

// 内部类型：带角色过滤的清单项
type InternalChecklistItem = ChecklistItem & { applicableRoles?: RoleType[] };

export const roles: Role[] = [
  {
    id: "bachelor_in_progress",
    name: "大学在读",
    description: "本科在读，申请德国硕士",
    group: "在读",
  },
  {
    id: "bachelor_graduated",
    name: "大学毕业",
    description: "本科毕业，申请德国硕士",
    group: "毕业",
  },
  {
    id: "master_in_progress",
    name: "硕士在读",
    description: "硕士在读，申请德国博士或二硕",
    group: "在读",
  },
  {
    id: "master_graduated",
    name: "硕士毕业",
    description: "硕士毕业，申请德国博士或二硕",
    group: "毕业",
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
  applicableRoles?: RoleType[]
): InternalChecklistItem {
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

// 前提材料部分 - 必须在所有材料之前确认
const premiseItems: InternalChecklistItem[] = [
  createItem(1, "前提", "准备居住证明", "原件+复印件+翻译", true, "以下材料任选其一或多：", [
    "居住证",
    "近几个月社保证明",
    "上海户籍证明（户口本或户口卡）",
    "以上材料需出示原件，附复印件1份，德文或英文翻译件1份（自行翻译即可，无需公证）"
  ]),
  createItem(2, "前提", "准备居住目的说明", "原件+复印件+翻译", true, "至少需近几个月且开具到递签前，以下材料任选其一或多个：", [
    "在职证明",
    "实习证明",
    "语言班证明",
    "或其他能证明居住目的的材料",
    "以上材料需出示原件，附复印件1份，德文或英文翻译件1份（自行翻译即可，无需公证）"
  ]),
];

// 原件部分 (1-12) - 与PDF编号一致
const originalItems: InternalChecklistItem[] = [
  createItem(1, "原件", "护照", "原件", false, "有效期不少于6个月"),
  createItem(2, "原件", "照片", "原件", false, "2张白底近半年免冠证件照", [
    "1张夹在护照首页",
    "1张贴在签证申请表",
    "35x45mm白底",
    "不可修图精修",
    "模板: china.diplo.de/pdf-fotomustertafel",
  ]),
  createItem(3, "原件", "VIDEX二维码打印件", "原件", false, "清晰打印在A4纸上，不可通过微信/邮件发送", [
    "填写网址: https://videx.diplo.de/videx/visum-erfassung/de/videx-kurzfristiger-aufenthalt",
    "出生地须跟护照保持一致，填写省份",
    "本人电话/手机号码以及电子邮件地址请务必填写",
    "护照签发日期以及有效期需跟护照保持一致",
    "邀请人种类请选择「邀请机构/公司」,并用德语填写德国学校名以及学校地址",
    "请勿用中文填写Videx二维码",
    "直接保存文件按原始尺寸打印，建议多打印几份",
  ]),
  createItem(4, "原件", "德国高校录取通知书或大学预备语言班报名证明", "原件", true, "", [
    "情况一：高校录取通知书 - 需写明注册报到时间",
    "情况二：语言班报名证明+学费收据+大学联系信或者大学申请证明",
    "若入学时间紧张，需跟德国高校联系最晚何时可以注册，出具证明文件或往来邮件放在录取通知书复印件后面",
    "若已成功注册，请提供注册证明/在读证明",
  ]),
  createItem(5, "原件", "经济来源证明", "原件", true, "每月至少 992 欧元（留学申请人每月至少 1091 欧元）", [
    "总额至少 11904 欧元/年（留学申请人 13092 欧元/年）",
    "可选择：奖学金、限制提款账户(Sperrkonto)、正式经济担保函",
    "若需缴纳签证费请带上有银联标志的银行卡",
  ]),
  createItem(6, "原件", "高中毕业证书", "原件", true, "适用于高考程序", undefined, []), // 高考程序专用，当前角色列表中不包含
  createItem(7, "原件", "中国高校在读证明/休学证明/退学证明", "原件", true, "适用于中国高校在读生", undefined, ["bachelor_in_progress", "master_in_progress"]),
  createItem(8, "原件", "本科毕业证书和学士学位证书", "原件", true, "适用于本科毕业生、硕士生在读生以及硕士毕业生", undefined, ["bachelor_graduated", "master_in_progress", "master_graduated"]),
  createItem(9, "原件", "硕士毕业证书和硕士学位证书", "原件", true, "适用于硕士毕业生", undefined, ["master_graduated"]),
  createItem(10, "原件", "入境后医疗保险证明", "原件", true),
  createItem(11, "原件", "留德人员审核部的审核证书/审核证明/审核传真", "原件", true),
  createItem(12, "原件", "语言水平证明", "原件", true, "若是中文证明须附德文或英文翻译"),
];

// 复印件部分 (1-15) - 与PDF编号一致
const copyItems: InternalChecklistItem[] = [
  createItem(1, "复印件", "签证申请表原件", "", false, "首页贴照片，末页申请人亲笔签名（中文加拼音）", [
    "首页粘贴护照照片",
    "末页申请人亲笔签名（中文加拼音），字迹跟护照页上的中文签名一致",
    "第12项拟在德国居留时间：居留开始时间应与VIDEX二维码文件中填写的入境日期一致",
    "居留结束时间为预计完成德国学业的时间",
  ]),
  createItem(2, "复印件", "《居留法》条款告知书", "", false, "申请人亲笔签名（中文加拼音）", [
    "下载: china.diplo.de/blob/2561254/5e9cccec777a2ca0b7aaa019dcd6f670/pdf-belehrung-zum-visumantrag-data.pdf",
    "打印签字后放在签证申请表后",
  ]),
  createItem(3, "复印件", "护照照片页复印件", "复印件", false),
  createItem(4, "复印件", "德国高校录取通知书复印件或大学预备语言班报名证明复印件", "复印件", false, "", [
    "若入学时间紧张，相关证明文件或往来邮件放在此复印件后面",
  ]),
  createItem(5, "复印件", "大学授课语言和要求达到的语言级别的说明", "复印件", false),
  createItem(6, "复印件", "经济来源证明复印件", "复印件", false),
  createItem(7, "复印件", "语言水平证明复印件", "复印件", false, "若是中文证明须附德文或英文翻译"),
  createItem(8, "复印件", "高中毕业证书复印件，并附德文或英文翻译", "复印件+翻译", false, "适用于高考程序", undefined, []), // 高考程序专用
  createItem(9, "复印件", "中国高校在读证明/休学证明/退学证明的复印件，并附德文或英文翻译", "复印件+翻译", false, "适用于中国高校在读生", undefined, ["bachelor_in_progress", "master_in_progress"]),
  createItem(10, "复印件", "本科毕业证书和本科学位证书的复印件，并附德文或英文翻译", "复印件+翻译", false, "适用于本科毕业生、硕士生在读生以及硕士毕业生", undefined, ["bachelor_graduated", "master_in_progress", "master_graduated"]),
  createItem(11, "复印件", "硕士毕业证书和硕士学位证书的复印件，并附德文或英文翻译", "复印件+翻译", false, "适用于硕士毕业生", undefined, ["master_graduated"]),
  createItem(12, "复印件", "德文或英文个人简历", "", false, "至今为止无间断经历"),
  createItem(13, "复印件", "德文或英文留学动机说明", "", false, "申请人亲笔签名（中文加拼音）"),
  createItem(14, "复印件", "留德人员审核部审核证书/审核证明/审核传真的复印件", "复印件", false),
  createItem(15, "复印件", "入境后医疗保险证明复印件", "复印件", false),
];

// 按角色过滤清单项
function filterItemsByRole(items: InternalChecklistItem[], roleId: RoleType): ChecklistItem[] {
  return items
    .filter(item => !item.applicableRoles || item.applicableRoles.includes(roleId))
    .map(({ applicableRoles: _, ...rest }) => rest);
}

// 角色清单缓存
const roleCache = new Map<RoleType, ChecklistItem[]>();

// 获取适用于指定角色的清单
export function getChecklistForRole(roleId: RoleType): ChecklistItem[] {
  if (roleCache.has(roleId)) {
    return roleCache.get(roleId)!;
  }
  const result = [...premiseItems, ...filterItemsByRole(originalItems, roleId), ...filterItemsByRole(copyItems, roleId)];
  roleCache.set(roleId, result);
  return result;
}

// 获取每个角色的总项目数
export function getTotalItemsForRole(roleId: RoleType): number {
  return getChecklistForRole(roleId).length;
}
