/* ===== 高中物理·生物学 知识图谱 =====
 * 自研力导向布局，Canvas 渲染，无外部依赖。
 * 数据来自 data.js（人教版教材目录解析结果）。 */
"use strict";

/* ---------- 0. 常量与调色 ---------- */
const TYPE = {
  subject: { r: 30, label: "科目",    always: true  },
  book:    { r: 14, label: "教材",    always: true  },
  chapter: { r: 8,  label: "章",      zoom: 0.55    },
  section: { r: 4,  label: "节",      zoom: 1.35    },
  sub:     { r: 2.8,label: "子目",    zoom: 2.4     },
  kp:      { r: 3.4,label: "知识点",  zoom: 1.8     },
};
/* 知识点类型配色 */
const KPTYPE_COLOR = {
  "定义": "#6fd3ff", "公式": "#ffc866", "方程": "#ffc866", "定律": "#ff9d7a",
  "定理": "#ff7ab0", "规律": "#ff9d7a", "原理": "#ff9d7a", "模型": "#b18cff",
  "概念": "#9fb7e8", "方法": "#7ee0a3", "应用": "#7ee0a3", "条件": "#ffd97a",
  "实验": "#ffd97a", "过程": "#63c7e8", "结论": "#4cd68a",
};
const SUBJ_COLOR = {
  physics: { main: "#4da3ff", deep: "#173f66", soft: "#4da3ff26" },
  biology: { main: "#4cd68a", deep: "#14532f", soft: "#4cd68a26" },
  geo:     { main: "#ffab5e", deep: "#6b3f14", soft: "#ffab5e26" },
  chemistry:{ main: "#ffab5e", deep: "#6b3f14", soft: "#ffab5e26" },
};
const KIND_ORDER = ["基础","发展","贯通","类比","联系","应用","跨科"];

/* ---------- 1. 构建图模型 ---------- */
/* 页面可通过 window.PAGE_SUBJECT 指定只展示单科目（"physics" | "biology" | "chemistry"） */
const PAGE_SUBJECT = window.PAGE_SUBJECT || "all";
const IS_CHEM = PAGE_SUBJECT === "chemistry";
const pageSubjects = IS_CHEM ? [CHEM.subject]
  : (PAGE_SUBJECT === "all" ? SUBJECTS : SUBJECTS.filter(s => s.id === PAGE_SUBJECT));
const pageBooks = IS_CHEM ? []
  : (PAGE_SUBJECT === "all" ? BOOKS : BOOKS.filter(b => b.subject === PAGE_SUBJECT));

const nodes = [];          // {id,label,type,subject,book,ch,sec,subIdx,x,y,vx,vy}
const nodeById = new Map();
const links = [];          // {s,t,type:'hier'|'cross',kind,note,visible}

function addNode(n) {
  n.x = (Math.random() - 0.5) * 900;
  n.y = (Math.random() - 0.5) * 700;
  n.vx = n.vy = 0;
  nodes.push(n); nodeById.set(n.id, n);
  return n;
}
function addLink(s, t, type, kind, note) {
  links.push({ s: nodeById.get(s), t: nodeById.get(t), type, kind, note });
}

const subjNode = {};
for (const s of pageSubjects) {
  subjNode[s.id] = addNode({ id: "S:" + s.id, label: s.name, type: "subject", subject: s.id });
}

if (!IS_CHEM) {
for (const book of pageBooks) {
  const bid = book.id;
  addNode({ id: bid, label: book.name, type: "book", subject: book.subject, book: bid, full: book.full });
  addLink("S:" + book.subject, bid, "hier");
  for (const ch of book.chapters) {
    const cid = `${bid}c${ch.num}`;
    const chLabel = `${ch.num === "序" ? "" : "第" + ch.num + "章 "}${ch.title}`;
    addNode({ id: cid, label: chLabel, type: "chapter", subject: book.subject, book: bid, ch: ch.num });
    addLink(bid, cid, "hier");
    ch.sections.forEach((sec, si) => {
      const sid = `${cid}s${si}`;
      addNode({ id: sid, label: sec.title, type: "section", subject: book.subject, book: bid, ch: ch.num, sec: si });
      addLink(cid, sid, "hier");
      (sec.subs || []).forEach((sub, ui) => {
        const uid = `${sid}u${ui}`;
        addNode({ id: uid, label: sub, type: "sub", subject: book.subject, book: bid, ch: ch.num, sec: si, sub: ui });
        addLink(sid, uid, "hier");
      });
    });
  }
}
for (const c of (typeof CROSS_LINKS !== "undefined" ? CROSS_LINKS : [])) {
  if (nodeById.has(c.a) && nodeById.has(c.b)) addLink(c.a, c.b, "cross", c.kind, c.note);
}
}

/* ---------- 1.4 化学模式：反应类型图谱 ---------- */
const REACTION_COLOR = {
  "化合反应": "#4da3ff", "分解反应": "#ff7a88", "置换反应": "#4cd68a", "复分解反应": "#b18cff",
  "中和反应": "#6fd3ff", "氧化还原反应": "#ffc866",
  "取代反应": "#ff9d7a", "加成反应": "#63c7e8", "酯化反应": "#f2a0c8", "水解反应": "#8ee0b8",
  "消去反应": "#d9b36b", "加聚反应": "#a8b6ff", "缩聚反应": "#e6b0ff", "氧化反应": "#ffa07a",
};
let reactionFilter = null;
let chemBranchOf = new Map();     // item/topic id -> branch
let chemTopicOf = new Map();      // item id -> topic
let chemStats = { topics: 0, items: 0, reactions: 0 };

function buildChemGraph() {
  for (const br of CHEM.branches) {
    addNode({ id: br.id, label: br.name, type: "book", subject: "chemistry",
              book: br.id, full: br.desc, fillColor: br.color, branch: br.id });
    addLink("S:" + CHEM.subject.id, br.id, "hier");
    chemBranchOf.set(br.id, br);
    for (const topic of br.topics) {
      addNode({ id: topic.id, label: topic.name, type: "chapter", subject: "chemistry",
                book: topic.id, branch: br.id, fillColor: br.color });
      addLink(br.id, topic.id, "hier");
      chemBranchOf.set(topic.id, br);
      chemTopicOf.set(topic.id, topic);
      chemStats.topics++;
      for (const it of topic.items) {
        const isConcept = it.cat === "概念";
        addNode({ ...it, label: it.label, type: "section", subject: "chemistry", book: topic.id,
                  branch: br.id, topic: topic.id,
                  fillColor: isConcept ? "#9fb7e8" : br.color });
        addLink(topic.id, it.id, "hier");
        chemBranchOf.set(it.id, br);
        chemTopicOf.set(it.id, topic);
        chemStats.items++;
      }
    }
  }
  for (const r of CHEM.reactions) {
    if (nodeById.has(r.a) && nodeById.has(r.b)) addLink(r.a, r.b, "reaction", r.kind, r.eq);
    chemStats.reactions++;
  }
}

/* ---------- 1.5 知识点标注层 ---------- */
const KPS_BY_SEC = new Map();       // 小节节点id -> 知识点节点列表
let showKP = true;
const kpSubjectCount = {};
for (const k of (typeof KNOWLEDGE !== "undefined" ? KNOWLEDGE : [])) {
  const parent = nodeById.get(k.sec);
  if (!parent) continue;
  const n = addNode({ ...k, ktype: k.type, type: "kp",
                      subject: parent.subject, book: parent.book, ch: parent.ch, parent });
  if (!KPS_BY_SEC.has(k.sec)) KPS_BY_SEC.set(k.sec, []);
  KPS_BY_SEC.get(k.sec).push(n);
  addLink(k.sec, k.id, "hier");
  kpSubjectCount[n.subject] = (kpSubjectCount[n.subject] || 0) + 1;
}
for (const l of (typeof KP_LINKS !== "undefined" ? KP_LINKS : [])) {
  if (nodeById.has(l.a) && nodeById.has(l.b)) addLink(l.a, l.b, "rel", l.kind, l.note);
}

/* ---------- 1.6 知识点配图（内置 SVG 图库） ---------- */
const SVG_TXT = 'font-family="PingFang SC,Microsoft YaHei,sans-serif" font-size="11"';
const KP_IMG = {
  vt: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="150" x2="300" y2="150" stroke="#8291b4"/><line x1="40" y1="150" x2="40" y2="20" stroke="#8291b4"/>
    <polygon points="40,120 250,40 250,150 40,150" fill="#4da3ff22"/>
    <line x1="40" y1="120" x2="250" y2="40" stroke="#ffc866" stroke-width="2"/>
    <line x1="250" y1="40" x2="250" y2="150" stroke="#8291b4" stroke-dasharray="4 3"/>
    <line x1="40" y1="120" x2="250" y2="120" stroke="#8291b4" stroke-dasharray="4 3"/>
    <polyline points="175,68 200,58 200,86" fill="none" stroke="#b18cff"/>
    <text x="6" y="16" fill="#8291b4" ${SVG_TXT}>v/m·s⁻¹</text><text x="288" y="166" fill="#8291b4" ${SVG_TXT}>t/s</text>
    <text x="20" y="124" fill="#8291b4" ${SVG_TXT}>v₀</text><text x="256" y="44" fill="#8291b4" ${SVG_TXT}>v</text>
    <text x="204" y="76" fill="#b18cff" ${SVG_TXT}>a=斜率</text>
    <text x="105" y="140" fill="#4da3ff" ${SVG_TXT}>面积 = 位移 x</text>
    <text x="60" y="176" fill="#66748f" ${SVG_TXT}>匀变速直线运动的 v-t 图像</text></svg>`,
  xt: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="150" x2="300" y2="150" stroke="#8291b4"/><line x1="40" y1="150" x2="40" y2="20" stroke="#8291b4"/>
    <path d="M40,138 C 130,136 220,110 275,30" fill="none" stroke="#ffc866" stroke-width="2"/>
    <line x1="160" y1="112" x2="250" y2="72" stroke="#b18cff"/>
    <circle cx="205" cy="92" r="3.5" fill="#4da3ff"/>
    <text x="6" y="16" fill="#8291b4" ${SVG_TXT}>x/m</text><text x="288" y="166" fill="#8291b4" ${SVG_TXT}>t/s</text>
    <text x="238" y="64" fill="#b18cff" ${SVG_TXT}>斜率=瞬时速度</text>
    <text x="60" y="176" fill="#66748f" ${SVG_TXT}>匀变速直线运动的 x-t 图像（抛物线）</text></svg>`,
  pingpao: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="30" x2="40" y2="160" stroke="#8291b4"/><line x1="40" y1="160" x2="300" y2="160" stroke="#8291b4"/>
    <path d="M40,30 Q 160,150 292,158" fill="none" stroke="#ffc866" stroke-width="2"/>
    <circle cx="118" cy="97" r="3.5" fill="#4da3ff"/><circle cx="196" cy="140" r="3.5" fill="#4da3ff"/>
    <line x1="118" y1="97" x2="178" y2="97" stroke="#4da3ff" stroke-dasharray="5 3"/>
    <line x1="118" y1="97" x2="118" y2="147" stroke="#ff7a88" stroke-dasharray="5 3"/>
    <line x1="118" y1="97" x2="188" y2="126" stroke="#b18cff" stroke-width="2"/>
    <text x="182" y="93" fill="#4da3ff" ${SVG_TXT}>v₀（不变）</text>
    <text x="122" y="150" fill="#ff7a88" ${SVG_TXT}>gt</text>
    <text x="192" y="122" fill="#b18cff" ${SVG_TXT}>合速度沿切线</text>
    <text x="52" y="24" fill="#8291b4" ${SVG_TXT}>抛出点</text>
    <text x="60" y="176" fill="#66748f" ${SVG_TXT}>平抛运动：水平匀速 + 竖直自由落体</text></svg>`,
  yuanzhou: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    <circle cx="160" cy="90" r="60" fill="none" stroke="#4da3ff" stroke-width="1.5"/>
    <circle cx="160" cy="90" r="3" fill="#dbe4f5"/>
    <circle cx="220" cy="90" r="4.5" fill="#ffc866"/>
    <line x1="160" y1="90" x2="216" y2="90" stroke="#8291b4" stroke-dasharray="4 3"/>
    <line x1="220" y1="90" x2="220" y2="34" stroke="#4cd68a" stroke-width="2"/>
    <polygon points="220,30 216,40 224,40" fill="#4cd68a"/>
    <line x1="220" y1="90" x2="166" y2="90" stroke="#ff7a88" stroke-width="2"/>
    <polygon points="162,90 172,86 172,94" fill="#ff7a88"/>
    <text x="226" y="42" fill="#4cd68a" ${SVG_TXT}>v（切线方向）</text>
    <text x="170" y="106" fill="#ff7a88" ${SVG_TXT}>F向</text>
    <text x="120" y="170" fill="#66748f" ${SVG_TXT}>向心力由合力提供、指向圆心</text></svg>`,
  dianxian: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    ${[0,45,90,135,180,225,270,315].map(a => {
      const r = a * Math.PI / 180, x = 160 + 120 * Math.cos(r), y = 90 + 62 * Math.sin(r);
      const mx = 160 + 66 * Math.cos(r), my = 90 + 38 * Math.sin(r);
      return `<line x1="${mx}" y1="${my}" x2="${x}" y2="${y}" stroke="#ffc866"/><polygon points="${x},${y} ${x - 8 * Math.cos(r - .3)},${y - 8 * Math.sin(r - .3)} ${x - 8 * Math.cos(r + .3)},${y - 8 * Math.sin(r + .3)}" fill="#ffc866"/>`;
    }).join("")}
    <circle cx="160" cy="90" r="12" fill="#ffc866"/><text x="156" y="95" fill="#0d1220" font-weight="bold" ${SVG_TXT}>+</text>
    <text x="60" y="170" fill="#66748f" ${SVG_TXT}>正点电荷的电场线：由正电荷出发呈辐射状</text></svg>`,
  jsquxian: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="150" x2="300" y2="150" stroke="#8291b4"/><line x1="40" y1="150" x2="40" y2="20" stroke="#8291b4"/>
    <path d="M50,148 C 130,142 200,120 260,30 250,30" fill="none" stroke="#ff9d7a" stroke-width="2"/>
    <path d="M50,148 C 120,136 150,110 185,72 S 250,52 285,58" fill="none" stroke="#4cd68a" stroke-width="2"/>
    <line x1="40" y1="58" x2="290" y2="58" stroke="#8291b4" stroke-dasharray="5 4"/>
    <line x1="40" y1="104" x2="290" y2="104" stroke="#8291b4" stroke-dasharray="3 4"/>
    <text x="6" y="16" fill="#8291b4" ${SVG_TXT}>数量</text><text x="288" y="166" fill="#8291b4" ${SVG_TXT}>t</text>
    <text x="262" y="48" fill="#66748f" ${SVG_TXT}>K值</text><text x="252" y="100" fill="#66748f" ${SVG_TXT}>K/2</text>
    <text x="212" y="30" fill="#ff9d7a" ${SVG_TXT}>J型</text><text x="150" y="66" fill="#4cd68a" ${SVG_TXT}>S型</text>
    <text x="60" y="176" fill="#66748f" ${SVG_TXT}>种群增长曲线：K/2 时增长速率最大</text></svg>`,
  dachangan: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    <rect x="80" y="60" width="160" height="60" rx="30" fill="#14532f55" stroke="#4cd68a" stroke-width="2"/>
    <rect x="86" y="66" width="148" height="48" rx="26" fill="none" stroke="#4cd68a88" stroke-dasharray="4 3"/>
    <path d="M150,90 q 8,-12 16,0 q 8,12 16,0 q 6,-9 12,-2" fill="none" stroke="#ffc866" stroke-width="2"/>
    ${[[110,80],[130,104],[175,78],[205,100],[120,96]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="#6fd3ff"/>`).join("")}
    <path d="M84,74 q -18,-6 -30,4" fill="none" stroke="#ff9d7a" stroke-width="1.6"/>
    <path d="M240,102 q 16,8 34,4" fill="none" stroke="#ff9d7a" stroke-width="1.6"/>
    <line x1="95" y1="62" x2="78" y2="40" stroke="#8291b4"/><line x1="205" y1="104" x2="222" y2="132" stroke="#8291b4"/>
    <line x1="163" y1="86" x2="163" y2="150" stroke="#8291b4"/><line x1="132" y1="70" x2="112" y2="38" stroke="#8291b4"/>
    <text x="34" y="34" fill="#ff9d7a" ${SVG_TXT}>鞭毛</text><text x="228" y="146" fill="#dbe4f5" ${SVG_TXT}>拟核(DNA)</text>
    <text x="152" y="164" fill="#dbe4f5" ${SVG_TXT}>细胞壁/膜</text><text x="66" y="30" fill="#dbe4f5" ${SVG_TXT}></text>
    <text x="118" y="30" fill="#dbe4f5" ${SVG_TXT}>核糖体(蓝点)</text>
    <text x="60" y="176" fill="#66748f" ${SVG_TXT}>大肠杆菌：原核生物的代表（无核膜包被的细胞核）</text></svg>`,
  xibaomo: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    ${Array.from({length: 13}, (_, i) => {
      const x = 30 + i * 22;
      return `<circle cx="${x}" cy="72" r="5" fill="#4da3ff"/><line x1="${x - 4}" y1="78" x2="${x - 4}" y2="94" stroke="#4da3ff88"/><line x1="${x + 4}" y1="78" x2="${x + 4}" y2="94" stroke="#4da3ff88"/>` +
             `<circle cx="${x + 11}" cy="112" r="5" fill="#4cd68a"/><line x1="${x + 7}" y1="90" x2="${x + 7}" y2="106" stroke="#4cd68a88"/><line x1="${x + 15}" y1="90" x2="${x + 15}" y2="106" stroke="#4cd68a88"/>`;
    }).join("")}
    <path d="M120,40 q -6,20 2,42 q 8,22 -2,58" fill="none" stroke="#ffc866" stroke-width="9" stroke-linecap="round" opacity=".9"/>
    <path d="M225,44 q 8,22 -2,44 q -8,22 2,52" fill="none" stroke="#b18cff" stroke-width="9" stroke-linecap="round" opacity=".9"/>
    <path d="M120,40 l -6,-10 M120,40 l 8,-9" stroke="#7ee0a3" stroke-width="2"/><path d="M225,44 l -8,-9 M225,44 l 9,-7" stroke="#7ee0a3" stroke-width="2"/>
    <text x="16" y="24" fill="#8291b4" ${SVG_TXT}>膜外侧（糖蛋白识别）</text>
    <text x="238" y="96" fill="#b18cff" ${SVG_TXT}>蛋白质</text><text x="16" y="132" fill="#4da3ff" ${SVG_TXT}>磷脂双分子层</text>
    <text x="60" y="176" fill="#66748f" ${SVG_TXT}>流动镶嵌模型：磷脂双分子层为基本支架</text></svg>`,
  DNA: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    <path d="M110,14 C 190,40 190,64 110,90 C 190,116 190,140 110,166" fill="none" stroke="#4da3ff" stroke-width="2.5"/>
    <path d="M210,14 C 130,40 130,64 210,90 C 130,116 130,140 210,166" fill="none" stroke="#4cd68a" stroke-width="2.5"/>
    ${[26,44,62,80,98,116,134,152].map((y, i) => {
      const t = (y - 14) / 76, x1 = 110 + 100 * Math.abs(Math.sin(t * Math.PI)) * (i % 2 ? 1 : 1);
      const span = 100 - 60 * Math.abs(Math.cos((y - 14) / 76 * Math.PI));
      const xa = 160 - span / 2, xb = 160 + span / 2;
      const c1 = i % 2 ? "#ffc866" : "#6fd3ff";
      return `<line x1="${xa}" y1="${y}" x2="${160}" y2="${y}" stroke="${c1}" stroke-width="4"/><line x1="${160}" y1="${y}" x2="${xb}" y2="${y}" stroke="${i % 2 ? "#6fd3ff" : "#ffc866"}" stroke-width="4"/>`;
    }).join("")}
    <text x="16" y="60" fill="#4da3ff" ${SVG_TXT}>脱氧核糖</text><text x="232" y="60" fill="#4cd68a" ${SVG_TXT}>磷酸骨架</text>
    <text x="16" y="82" fill="#ffc866" ${SVG_TXT}>碱基对</text>
    <text x="222" y="100" fill="#66748f" ${SVG_TXT}>A=T · G≡C</text>
    <text x="60" y="176" fill="#66748f" ${SVG_TXT}>DNA 双螺旋：两条链反向平行</text></svg>`,
  guanghe: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="34" width="130" height="110" rx="10" fill="#1f9e5e22" stroke="#4cd68a"/>
    <rect x="176" y="34" width="130" height="110" rx="10" fill="#1f6fd022" stroke="#4da3ff"/>
    <text x="26" y="56" fill="#4cd68a" ${SVG_TXT}>光反应（类囊体薄膜）</text>
    <text x="188" y="56" fill="#4da3ff" ${SVG_TXT}>暗反应（叶绿体基质）</text>
    <text x="30" y="86" fill="#dbe4f5" ${SVG_TXT}>H₂O → O₂ + H</text>
    <text x="30" y="110" fill="#dbe4f5" ${SVG_TXT}>ADP+Pi → ATP</text>
    <text x="30" y="132" fill="#dbe4f5" ${SVG_TXT}>NADP⁺ → NADPH</text>
    <text x="192" y="86" fill="#dbe4f5" ${SVG_TXT}>CO₂ → C₃</text>
    <text x="192" y="112" fill="#dbe4f5" ${SVG_TXT}>C₃ → 糖类等有机物</text>
    <path d="M148,92 L172,92" stroke="#ffc866" stroke-width="2"/><polygon points="176,92 166,88 166,96" fill="#ffc866"/>
    <text x="146" y="82" fill="#ffc866" ${SVG_TXT}>供能供氢</text>
    <text x="60" y="170" fill="#66748f" ${SVG_TXT}>光反应为暗反应提供 ATP 和 NADPH</text></svg>`,
  jinzi: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    <polygon points="130,26 190,26 202,56 118,56" fill="#ff9d7a" opacity=".85"/>
    <polygon points="112,62 208,62 226,96 94,96" fill="#ffc866" opacity=".85"/>
    <polygon points="88,102 232,102 252,138 68,138" fill="#4cd68a" opacity=".85"/>
    <text x="128" y="46" fill="#0d1220" ${SVG_TXT}>三级消费者</text>
    <text x="122" y="84" fill="#0d1220" ${SVG_TXT}>次级消费者</text>
    <text x="120" y="126" fill="#0d1220" ${SVG_TXT}>初级消费者/生产者</text>
    <path d="M262,132 L262,32" stroke="#b18cff" stroke-width="1.6"/><polygon points="262,26 258,36 266,36" fill="#b18cff"/>
    <text x="270" y="84" fill="#b18cff" ${SVG_TXT}>10%~20%</text>
    <text x="60" y="170" fill="#66748f" ${SVG_TXT}>能量金字塔：沿食物链逐级递减</text></svg>`,
  geo_time: `<svg viewBox="0 0 340 478" xmlns="http://www.w3.org/2000/svg">
<rect x="8" y="10" width="324" height="438" fill="none"/>
<text x="240" y="14" fill="#8291b4" font-size="10">距今时间/百万年</text>
<line x1="296" y1="20" x2="296" y2="448" stroke="#8291b4" stroke-width="1" stroke-dasharray="2 3"/>
<text x="14" y="12" fill="#8291b4" font-size="10">宙</text><text x="86" y="12" fill="#8291b4" font-size="10">代</text><text x="170" y="12" fill="#8291b4" font-size="10">纪</text>
<rect x="8" y="30" width="72" height="270" fill="#e5393522" stroke="#8291b4" stroke-width="0.6"/>
<text x="30" y="170" fill="#dbe4f5" font-size="13" transform="rotate(-90 30 170)" text-anchor="middle">显 生 宙</text>
<rect x="80" y="30" width="80" height="60" fill="#e8b04b2e" stroke="#8291b4" stroke-width="0.6"/>
<text x="120" y="64" fill="#dbe4f5" font-size="11" text-anchor="middle">新生代</text>
<rect x="80" y="90" width="80" height="90" fill="#4cd68a22" stroke="#8291b4" stroke-width="0.6"/>
<text x="120" y="140" fill="#dbe4f5" font-size="11" text-anchor="middle">中生代</text>
<rect x="80" y="180" width="80" height="120" fill="#4da3ff1f" stroke="#8291b4" stroke-width="0.6"/>
<text x="120" y="245" fill="#dbe4f5" font-size="11" text-anchor="middle">古生代</text>
<rect x="80" y="300" width="200" height="52" fill="#b18cff1e" stroke="#8291b4" stroke-width="0.6"/>
<text x="180" y="330" fill="#dbe4f5" font-size="11" text-anchor="middle">元古宙</text>
<rect x="80" y="352" width="200" height="48" fill="#b18cff16" stroke="#8291b4" stroke-width="0.6"/>
<text x="180" y="380" fill="#dbe4f5" font-size="11" text-anchor="middle">太古宙</text>
<rect x="80" y="400" width="200" height="38" fill="#b18cff10" stroke="#8291b4" stroke-width="0.6"/>
<text x="180" y="423" fill="#dbe4f5" font-size="11" text-anchor="middle">冥古宙</text>
<rect x="160" y="30" width="120" height="20" fill="#e8b04b30" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="44" fill="#dbe4f5" font-size="10.5" text-anchor="middle">第四纪</text>
<rect x="160" y="50" width="120" height="20" fill="#e8b04b28" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="64" fill="#dbe4f5" font-size="10.5" text-anchor="middle">新近纪</text>
<rect x="160" y="70" width="120" height="20" fill="#e8b04b20" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="84" fill="#dbe4f5" font-size="10.5" text-anchor="middle">古近纪</text>
<rect x="160" y="90" width="120" height="30" fill="#4cd68a26" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="109" fill="#dbe4f5" font-size="10.5" text-anchor="middle">白垩纪</text>
<rect x="160" y="120" width="120" height="30" fill="#4cd68a1e" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="139" fill="#dbe4f5" font-size="10.5" text-anchor="middle">侏罗纪</text>
<rect x="160" y="150" width="120" height="30" fill="#4cd68a16" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="169" fill="#dbe4f5" font-size="10.5" text-anchor="middle">三叠纪</text>
<rect x="160" y="180" width="120" height="20" fill="#4da3ff24" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="194" fill="#dbe4f5" font-size="10.5" text-anchor="middle">二叠纪</text>
<rect x="160" y="200" width="120" height="20" fill="#4da3ff1e" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="214" fill="#dbe4f5" font-size="10.5" text-anchor="middle">石炭纪</text>
<rect x="160" y="220" width="120" height="20" fill="#4da3ff18" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="234" fill="#dbe4f5" font-size="10.5" text-anchor="middle">泥盆纪</text>
<rect x="160" y="240" width="120" height="20" fill="#4da3ff14" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="254" fill="#dbe4f5" font-size="10.5" text-anchor="middle">志留纪</text>
<rect x="160" y="260" width="120" height="20" fill="#4da3ff10" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="274" fill="#dbe4f5" font-size="10.5" text-anchor="middle">奥陶纪</text>
<rect x="160" y="280" width="120" height="20" fill="#4da3ff0c" stroke="#8291b4" stroke-width="0.5"/><text x="220" y="294" fill="#dbe4f5" font-size="10.5" text-anchor="middle">寒武纪</text>
<g fill="#8291b4" font-size="9">
<text x="304" y="44">2.6</text><text x="304" y="64">23</text><text x="304" y="84">66</text>
<text x="304" y="109">145</text><text x="304" y="139">201</text><text x="304" y="169">252</text>
<text x="304" y="194">299</text><text x="304" y="214">359</text><text x="304" y="234">419</text>
<text x="304" y="254">444</text><text x="304" y="274">485</text><text x="304" y="294">541</text>
<text x="304" y="330">2500</text><text x="304" y="380">4000</text><text x="304" y="423">4600</text>
</g>
<text x="8" y="456" fill="#ffc866" font-size="10">寒武纪：生命大爆发　·　中生代：爬行动物（恐龙）繁盛</text>
<text x="8" y="472" fill="#ffc866" font-size="10">新生代：哺乳动物繁盛与人类诞生　·　由下往上地层越来越新</text>
</svg>`,
  atm_heat_d: `<svg viewBox="0 0 340 218" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ah1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ffc866"/></marker>
<marker id="ah2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ff7a88"/></marker>
<marker id="ah3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#6fd3ff"/></marker></defs>
<circle cx="34" cy="34" r="15" fill="#ffc866"/>
<g stroke="#ffc866" stroke-width="1.4"><line x1="34" y1="10" x2="34" y2="4"/><line x1="52" y1="18" x2="56" y2="14"/><line x1="14" y1="18" x2="10" y2="14"/></g>
<text x="14" y="66" fill="#ffc866" font-size="11">太阳</text>
<rect x="0" y="178" width="340" height="40" fill="#79554833"/>
<line x1="0" y1="178" x2="340" y2="178" stroke="#8291b4" stroke-width="1"/>
<text x="298" y="196" fill="#b48a72" font-size="11">地面</text>
<text x="96" y="18" fill="#8291b4" font-size="10">大气：吸收 · 反射 · 散射（削弱）</text>
<line x1="48" y1="42" x2="196" y2="120" stroke="#ffc866" stroke-width="2" marker-end="url(#ah1)"/>
<line x1="196" y1="120" x2="196" y2="172" stroke="#ffc866" stroke-width="2" marker-end="url(#ah1)"/>
<text x="70" y="92" fill="#ffc866" font-size="11">①太阳辐射</text>
<line x1="150" y1="60" x2="176" y2="34" stroke="#ffc866" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#ah1)"/>
<text x="128" y="44" fill="#8291b4" font-size="9">反射</text>
<line x1="252" y1="170" x2="252" y2="84" stroke="#ff7a88" stroke-width="2" marker-end="url(#ah2)"/>
<text x="256" y="130" fill="#ff7a88" font-size="11">②地面辐射</text>
<line x1="244" y1="84" x2="216" y2="56" stroke="#8291b4" stroke-width="1.2" stroke-dasharray="3 3"/>
<text x="240" y="70" fill="#8291b4" font-size="10">③大气吸收</text>
<line x1="178" y1="64" x2="122" y2="170" stroke="#6fd3ff" stroke-width="2" marker-end="url(#ah3)"/>
<text x="96" y="132" fill="#6fd3ff" font-size="11">④大气逆辐射</text>
<text x="8" y="214" fill="#7ee0a3" font-size="10">④保温作用：多云的夜晚降温慢；白天削弱弱、晴天昼夜温差大</text>
</svg>`,
  thermal_d: `<svg viewBox="0 0 340 212" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="th1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ff9d7a"/></marker>
<marker id="th2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#6fd3ff"/></marker></defs>
<rect x="0" y="176" width="340" height="36" fill="#79554833"/>
<line x1="0" y1="176" x2="340" y2="176" stroke="#8291b4"/>
<rect x="40" y="176" width="110" height="36" fill="#ff7a8826"/>
<rect x="190" y="176" width="110" height="36" fill="#4da3ff22"/>
<text x="66" y="198" fill="#ff9d7a" font-size="11">城市（受热）</text>
<text x="216" y="198" fill="#6fd3ff" font-size="11">郊区（冷却）</text>
<line x1="95" y1="168" x2="95" y2="58" stroke="#ff9d7a" stroke-width="2" marker-end="url(#th1)"/>
<line x1="245" y1="58" x2="245" y2="168" stroke="#6fd3ff" stroke-width="2" marker-end="url(#th2)"/>
<line x1="106" y1="46" x2="234" y2="46" stroke="#8291b4" stroke-width="1.6" marker-end="url(#th2)"/>
<line x1="234" y1="162" x2="106" y2="162" stroke="#8291b4" stroke-width="1.6" marker-end="url(#th1)"/>
<text x="30" y="106" fill="#ff9d7a" font-size="10">热低压</text>
<text x="284" y="106" fill="#6fd3ff" font-size="10">冷高压</text>
<text x="8" y="18" fill="#8291b4" font-size="10">热力环流：地面冷热不均 → 垂直运动 → 水平气压差 → 水平运动</text>
<text x="8" y="32" fill="#7ee0a3" font-size="10">应用：城市热岛环流、海陆风、山谷风</text>
</svg>`,
  belts_d: `<svg viewBox="0 0 340 236" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="bt1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ffc866"/></marker></defs>
<text x="10" y="14" fill="#8291b4" font-size="10">北半球气压带与风带示意（南半球大致对称）</text>
<rect x="20" y="24" width="200" height="18" fill="#4da3ff26"/><text x="120" y="37" fill="#dbe4f5" font-size="10.5" text-anchor="middle">极地高压带（下沉·干冷）</text>
<rect x="20" y="66" width="200" height="18" fill="#4cd68a24"/><text x="120" y="79" fill="#dbe4f5" font-size="10.5" text-anchor="middle">副极地低压带（上升·温湿）</text>
<rect x="20" y="108" width="200" height="18" fill="#ff9d7a26"/><text x="120" y="121" fill="#dbe4f5" font-size="10.5" text-anchor="middle">副热带高压带（下沉·干热）</text>
<rect x="20" y="150" width="200" height="18" fill="#4cd68a24"/><text x="120" y="163" fill="#dbe4f5" font-size="10.5" text-anchor="middle">赤道低压带（上升·湿热）</text>
<g fill="#8291b4" font-size="10"><text x="228" y="37">90°</text><text x="228" y="79">60°</text><text x="228" y="121">30°</text><text x="232" y="163">0°</text></g>
<line x1="120" y1="64" x2="120" y2="44" stroke="#ffc866" stroke-width="1.8" marker-end="url(#bt1)"/>
<text x="126" y="56" fill="#ffc866" font-size="10">极地东风</text>
<line x1="120" y1="106" x2="120" y2="86" stroke="#ffc866" stroke-width="1.8" marker-end="url(#bt1)"/>
<text x="126" y="98" fill="#ffc866" font-size="10">盛行西风</text>
<line x1="120" y1="148" x2="120" y2="128" stroke="#ffc866" stroke-width="1.8" marker-end="url(#bt1)"/>
<text x="126" y="140" fill="#ffc866" font-size="10">东北信风</text>
<text x="10" y="190" fill="#8291b4" font-size="10">成因：低纬受热上升（热力）+ 高空气流堆积下沉（动力），三圈环流</text>
<text x="10" y="206" fill="#8291b4" font-size="10">移动：随太阳直射点季节移动，北半球夏季偏北、冬季偏南</text>
<text x="10" y="224" fill="#7ee0a3" font-size="10">应用：地中海气候（副高+西风交替控制）、热带草原（赤道低压+信风）</text>
</svg>`,
  currents_d: `<svg viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="cu1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ff7a88"/></marker>
<marker id="cu2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#6fd3ff"/></marker>
<marker id="cu3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#8291b4"/></marker></defs>
<rect x="26" y="26" width="288" height="190" fill="#173f6633" stroke="#26314d"/>
<rect x="150" y="26" width="44" height="190" fill="#79554833"/>
<text x="172" y="122" fill="#b48a72" font-size="11" text-anchor="middle" transform="rotate(-90 172 122)">大 陆</text>
<g fill="#8291b4" font-size="9.5"><text x="2" y="60">60°N</text><text x="8" y="96">30°N</text><text x="12" y="158">0°</text><text x="4" y="186">30°S</text></g>
<line x1="26" y1="56" x2="314" y2="56" stroke="#8291b4" stroke-dasharray="3 4" stroke-width="0.8"/>
<line x1="26" y1="92" x2="314" y2="92" stroke="#8291b4" stroke-dasharray="3 4" stroke-width="0.8"/>
<line x1="26" y1="154" x2="314" y2="154" stroke="#8291b4" stroke-dasharray="3 4" stroke-width="0.8"/>
<line x1="26" y1="182" x2="314" y2="182" stroke="#8291b4" stroke-dasharray="3 4" stroke-width="0.8"/>
<line x1="210" y1="150" x2="296" y2="150" stroke="#ff7a88" stroke-width="2" marker-end="url(#cu1)"/>
<line x1="300" y1="146" x2="300" y2="98" stroke="#ff7a88" stroke-width="2" marker-end="url(#cu1)"/>
<line x1="296" y1="92" x2="210" y2="92" stroke="#ff7a88" stroke-width="2" marker-end="url(#cu1)"/>
<line x1="204" y1="98" x2="204" y2="146" stroke="#6fd3ff" stroke-width="2" marker-end="url(#cu2)"/>
<text x="228" y="128" fill="#dbe4f5" font-size="10">中低纬环流</text>
<text x="282" y="126" fill="#ff7a88" font-size="9">暖</text><text x="208" y="126" fill="#6fd3ff" font-size="9">寒</text>
<line x1="210" y1="60" x2="296" y2="60" stroke="#6fd3ff" stroke-width="2" marker-end="url(#cu2)"/>
<line x1="300" y1="64" x2="300" y2="86" stroke="#6fd3ff" stroke-width="2" marker-end="url(#cu2)"/>
<line x1="296" y1="92" x2="240" y2="92" stroke="#8291b4" stroke-width="1.2"/>
<text x="228" y="52" fill="#dbe4f5" font-size="10">中高纬逆时针</text>
<line x1="196" y1="196" x2="300" y2="196" stroke="#6fd3ff" stroke-width="2" marker-end="url(#cu2)"/>
<text x="238" y="174" fill="#6fd3ff" font-size="10">西风漂流（寒流）</text>
<text x="34" y="44" fill="#8291b4" font-size="10">北半球：中低纬顺时针、中高纬逆时针</text>
<text x="34" y="216" fill="#7ee0a3" font-size="10">记忆：东岸暖、西岸寒；影响气候·渔场·航行·污染</text>
</svg>`,
  rock_cycle_d: `<svg viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="rk1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ffc866"/></marker>
<marker id="rk2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#8291b4"/></marker></defs>
<rect x="130" y="26" width="80" height="30" rx="6" fill="#4da3ff26" stroke="#4da3ff"/>
<text x="170" y="45" fill="#dbe4f5" font-size="12" text-anchor="middle">岩浆岩</text>
<rect x="24" y="108" width="80" height="30" rx="6" fill="#4cd68a26" stroke="#4cd68a"/>
<text x="64" y="127" fill="#dbe4f5" font-size="12" text-anchor="middle">沉积岩</text>
<rect x="236" y="108" width="80" height="30" rx="6" fill="#b18cff26" stroke="#b18cff"/>
<text x="276" y="127" fill="#dbe4f5" font-size="12" text-anchor="middle">变质岩</text>
<rect x="130" y="184" width="80" height="30" rx="6" fill="#ff9d7a26" stroke="#ff9d7a"/>
<text x="170" y="203" fill="#dbe4f5" font-size="12" text-anchor="middle">岩　浆</text>
<line x1="160" y1="182" x2="146" y2="60" stroke="#ffc866" stroke-width="1.8" marker-end="url(#rk1)"/>
<text x="176" y="92" fill="#ffc866" font-size="10.5">冷却凝固</text>
<line x1="122" y1="44" x2="72" y2="104" stroke="#8291b4" stroke-width="1.5" marker-end="url(#rk2)"/>
<text x="56" y="66" fill="#8291b4" font-size="10.5">外力作用</text>
<line x1="106" y1="120" x2="234" y2="120" stroke="#8291b4" stroke-width="1.5" marker-end="url(#rk2)"/>
<text x="146" y="114" fill="#8291b4" font-size="10.5">变质作用</text>
<line x1="240" y1="140" x2="192" y2="182" stroke="#ffc866" stroke-width="1.8" marker-end="url(#rk1)"/>
<text x="228" y="170" fill="#ffc866" font-size="10.5">重熔再生</text>
<line x1="70" y1="140" x2="150" y2="186" stroke="#8291b4" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#rk2)"/>
<line x1="288" y1="104" x2="204" y2="44" stroke="#8291b4" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#rk2)"/>
<text x="252" y="66" fill="#8291b4" font-size="10">外力作用</text>
<text x="12" y="232" fill="#7ee0a3" font-size="10">判读技巧：指向岩浆的箭头是重熔再生，岩浆唯一指向岩浆岩（冷却凝固）</text>
</svg>`,
  water_cycle_d: `<svg viewBox="0 0 340 212" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="wc1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#6fd3ff"/></marker>
<marker id="wc2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ffc866"/></marker></defs>
<rect x="16" y="140" width="140" height="30" fill="#1f6fd055"/>
<polygon points="156,140 250,74 336,150 336,170 156,170" fill="#79554833"/>
<text x="70" y="158" fill="#6fd3ff" font-size="11">海　洋</text>
<text x="256" y="110" fill="#b48a72" font-size="11">山　地</text>
<line x1="76" y1="134" x2="76" y2="92" stroke="#6fd3ff" stroke-width="2" marker-end="url(#wc1)"/>
<text x="30" y="112" fill="#6fd3ff" font-size="11">①蒸发</text>
<line x1="92" y1="76" x2="216" y2="66" stroke="#6fd3ff" stroke-width="2" marker-end="url(#wc1)"/>
<text x="112" y="62" fill="#6fd3ff" font-size="11">②水汽输送</text>
<line x1="238" y1="58" x2="238" y2="86" stroke="#6fd3ff" stroke-width="2" marker-end="url(#wc1)"/>
<text x="246" y="72" fill="#6fd3ff" font-size="11">③降水</text>
<line x1="252" y1="98" x2="188" y2="136" stroke="#ffc866" stroke-width="2" marker-end="url(#wc2)"/>
<text x="196" y="104" fill="#ffc866" font-size="11">④地表径流</text>
<line x1="200" y1="142" x2="200" y2="162" stroke="#8291b4" stroke-width="1.6" marker-end="url(#wc2)"/>
<text x="206" y="156" fill="#8291b4" font-size="11">⑤下渗</text>
<line x1="192" y1="164" x2="96" y2="164" stroke="#8291b4" stroke-width="1.6" stroke-dasharray="5 3" marker-end="url(#wc2)"/>
<text x="98" y="180" fill="#8291b4" font-size="11">⑥地下径流</text>
<text x="12" y="200" fill="#7ee0a3" font-size="10">人类影响最大的环节：地表径流（修水库、跨流域调水、硬化地面减少下渗）</text>
</svg>`,
  obliquity_d: `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg">
<circle cx="56" cy="104" r="18" fill="#ffc866"/>
<text x="40" y="140" fill="#ffc866" font-size="11">太阳</text>
<line x1="76" y1="104" x2="286" y2="104" stroke="#8291b4" stroke-dasharray="4 3"/>
<text x="84" y="92" fill="#8291b4" font-size="10">黄道面（公转轨道面）</text>
<circle cx="238" cy="104" r="40" fill="#1f6fd066" stroke="#4da3ff"/>
<line x1="212" y1="146" x2="264" y2="62" stroke="#dbe4f5" stroke-width="1.6"/>
<text x="262" y="156" fill="#dbe4f5" font-size="10.5">地轴</text>
<line x1="200" y1="127" x2="276" y2="81" stroke="#4cd68a" stroke-dasharray="4 3"/>
<text x="278" y="80" fill="#4cd68a" font-size="10.5">赤道面</text>
<path d="M 206 122 A 44 44 0 0 1 214 92" fill="none" stroke="#ffc866" stroke-width="1.4"/>
<text x="176" y="112" fill="#ffc866" font-size="11">23°26′</text>
<text x="214" y="52" fill="#8291b4" font-size="10">黄赤交角 = 23°26′</text>
<text x="12" y="182" fill="#7ee0a3" font-size="10">黄赤交角的存在 → 太阳直射点南北移动 → 昼夜长短变化与四季更替</text>
</svg>`
};

/* 统计信息 */
const stats = {};
for (const s of (IS_CHEM ? [] : SUBJECTS)) {
  const bs = BOOKS.filter(b => b.subject === s.id);
  stats[s.id] = {
    books: bs.length,
    chapters: bs.reduce((a, b) => a + b.chapters.length, 0),
    sections: bs.reduce((a, b) => a + b.chapters.reduce((x, c) => x + c.sections.length, 0), 0),
  };
}

/* ---------- 2. 可见性 ---------- */
const bookVisible = new Map((typeof BOOKS !== "undefined" ? BOOKS : []).map(b => [b.id, true]));
if (IS_CHEM) {
  for (const br of CHEM.branches) {
    bookVisible.set(br.id, true);
    for (const t of br.topics) {
      bookVisible.set(t.id, true);
      for (const it of t.items) bookVisible.set(it.id, true);
    }
  }
  buildChemGraph();
}
let subjectFilter = "all";
function nodeVisible(n) {
  if (n.type === "kp") return showKP && n.parent.visible;
  if (n.type === "subject") return subjectFilter === "all" || n.subject === subjectFilter;
  if (!bookVisible.get(n.book)) return false;
  if (subjectFilter !== "all" && n.subject !== subjectFilter) return false;
  return true;
}
function refreshVisible() {
  for (const n of nodes) n.visible = nodeVisible(n);
  for (const l of links) l.visible = l.s.visible && l.t.visible;
}

/* ---------- 3. 力导向模拟 ---------- */
const sim = {
  alpha: 1, alphaMin: 0.003, alphaDecay: 0.0028, paused: false,
  repulsion: 2600, linkK: 0.045, gravity: 0.012, damping: 0.86, maxV: 14,
};
const REST = {
  "S:physics": 460, "S:biology": 460, "S:chemistry": 380,   // 科目-教材
  book: 150, chapter: 68, section: 26, sub: 15,   // 层级
  kp: 13,                                          // 知识点挂接
  cross: 340,
};
function restLength(l) {
  if (l.type === "reaction") return 135;           // 反应连线（跨专题）
  if (l.type === "cross") return REST.cross;
  const t = l.t.type;                              // 层级连线的子节点类型
  return REST[t] || 40;
}

function simulateStep() {
  if (sim.paused) return;
  const a = sim.alpha;
  const vis = nodes.filter(n => n.visible);
  // 斥力（O(n²)，节点数百规模足够）
  for (let i = 0; i < vis.length; i++) {
    const n1 = vis[i];
    for (let j = i + 1; j < vis.length; j++) {
      const n2 = vis[j];
      let dx = n2.x - n1.x, dy = n2.y - n1.y;
      let d2 = dx * dx + dy * dy;
      if (d2 < 1) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = 1; }
      const minD = (TYPE[n1.type].r + TYPE[n2.type].r) * 2.2;
      if (d2 > 640000) continue;
      const f = (sim.repulsion * a) / d2 * (d2 < minD * minD ? 4 : 1);
      const d = Math.sqrt(d2), fx = dx / d * f, fy = dy / d * f;
      n1.vx -= fx; n1.vy -= fy; n2.vx += fx; n2.vy += fy;
    }
  }
  // 弹簧
  for (const l of links) {
    if (!l.visible) continue;
    const dx = l.t.x - l.s.x, dy = l.t.y - l.s.y;
    const d = Math.max(Math.hypot(dx, dy), 0.01);
    const rest = restLength(l);
    const f = (d - rest) * sim.linkK * (l.type === "cross" ? 0.35 : l.type === "reaction" ? 0.4 : 1) * (0.3 + a);
    const fx = dx / d * f, fy = dy / d * f;
    const ws = weight(l.s), wt = weight(l.t);
    l.s.vx += fx * ws; l.s.vy += fy * ws;
    l.t.vx -= fx * wt; l.t.vy -= fy * wt;
  }
  // 中心引力 + 积分
  for (const n of vis) {
    n.vx += -n.x * sim.gravity * a; n.vy += -n.y * sim.gravity * a;
    if (n.fixed) { n.vx = n.vy = 0; continue; }
    n.vx *= sim.damping; n.vy *= sim.damping;
    const v = Math.hypot(n.vx, n.vy);
    if (v > sim.maxV) { n.vx *= sim.maxV / v; n.vy *= sim.maxV / v; }
    n.x += n.vx; n.y += n.vy;
  }
  sim.alpha = Math.max(sim.alphaMin, sim.alpha - sim.alphaDecay);
}
function weight(n) {
  return n.type === "subject" ? 0.08 : n.type === "book" ? 0.25 : 0.55;
}
function reheat(v = 1) { sim.alpha = Math.max(sim.alpha, v); }

/* 初始位置：按科目/分支分左右两簇，减少纠缠 */
(function seed() {
  for (const n of nodes) {
    const side = IS_CHEM ? (n.branch === "chem-org" ? 1 : -1)
                         : (n.subject === "physics" ? -1 : 1);
    const r = n.type === "subject" ? 0 : 260;
    const ang = Math.random() * Math.PI * 2;
    n.x = side * r * 0.55 + Math.cos(ang) * (n.type === "book" ? 160 : 420) * (0.35 + Math.random() * 0.65);
    n.y = Math.sin(ang) * (n.type === "book" ? 120 : 320) * (0.35 + Math.random() * 0.65);
  }
})();

/* ---------- 4. 相机与渲染 ---------- */
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const cam = { x: 0, y: 0, scale: 0.62 };
let DPR = 1;
function resize() {
  DPR = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * DPR;
  canvas.height = rect.height * DPR;
}
window.addEventListener("resize", () => { resize(); });
resize();

function toWorld(px, py) {
  return { x: (px - canvas.width / 2) / cam.scale / DPR + cam.x,
           y: (py - canvas.height / 2) / cam.scale / DPR + cam.y };
}
function toScreen(wx, wy) {
  return { x: (wx - cam.x) * cam.scale * DPR + canvas.width / 2,
           y: (wy - cam.y) * cam.scale * DPR + canvas.height / 2 };
}

let hoverNode = null, selectedNode = null, focusMode = false;
let searchHits = new Set(), searchActive = null;

function neighborsOf(n) {
  const set = new Set([n]);
  for (const l of links) {
    if (!l.visible) continue;
    if (l.s === n) set.add(l.t);
    if (l.t === n) set.add(l.s);
  }
  return set;
}

function labelSize(n) {
  const base = { subject: 20, book: 13.5, chapter: 12.5, section: 11.5, sub: 10.5, kp: 10.5 }[n.type];
  return base;
}
function shouldLabel(n) {
  const t = TYPE[n.type];
  if (n === hoverNode || n === selectedNode || searchHits.has(n)) return true;
  if (focusMode && !focusSet.has(n)) return false;
  if (t.always) return true;
  return cam.scale >= (t.zoom || 0);
}

let focusSet = new Set();

function draw() {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  // 背景
  const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
  g.addColorStop(0, "#121a2f"); g.addColorStop(1, "#0a0f1c");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  const emphasize = (hoverNode && hoverNode.visible && hoverNode) ||
                    (selectedNode && selectedNode.visible && selectedNode) || null;
  const emSet = emphasize ? neighborsOf(emphasize) : null;

  /* 连线 */
  for (const l of links) {
    if (!l.visible) continue;
    const p1 = toScreen(l.s.x, l.s.y), p2 = toScreen(l.t.x, l.t.y);
    const active = emphasize && (l.s === emphasize || l.t === emphasize);
    if (l.type === "hier") {
      ctx.strokeStyle = active ? "#ffffff88" : "#2c3a5c";
      ctx.lineWidth = (active ? 1.6 : 1) * DPR;
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    } else if (l.type === "rel") {
      /* 知识点之间的关联：紫色细点线 */
      const dim = emphasize && !active;
      ctx.strokeStyle = dim ? "#b18cff14" : "#b18cff" + (active ? "cc" : "40");
      ctx.lineWidth = (active ? 1.6 : 1) * DPR;
      ctx.setLineDash([2 * DPR, 3.5 * DPR]);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      ctx.setLineDash([]);
    } else if (l.type === "reaction") {
      /* 化学反应连线：按反应类型着色的实线弧 */
      const col = REACTION_COLOR[l.kind] || "#9fb7e8";
      const filtered = reactionFilter && l.kind !== reactionFilter;
      const hit = active || (reactionFilter && l.kind === reactionFilter);
      ctx.globalAlpha = filtered ? 0.07 : 1;
      ctx.strokeStyle = col + (hit ? "ee" : "55");
      ctx.lineWidth = (hit ? 2.2 : 1.3) * DPR;
      const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
      const nx = -(p2.y - p1.y), ny = p2.x - p1.x;
      const len = Math.hypot(nx, ny) || 1;
      const bow = Math.min(34, len * 0.1) * DPR;
      const cx = mx + nx / len * bow, cy = my + ny / len * bow;
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.quadraticCurveTo(cx, cy, p2.x, p2.y); ctx.stroke();
      /* 显示反应方程式 */
      if (hit && cam.scale > 0.35) {
        const qx = (p1.x + 2 * cx + p2.x) / 4, qy = (p1.y + 2 * cy + p2.y) / 4;
        ctx.font = `${11 * DPR}px "PingFang SC","Microsoft YaHei",sans-serif`;
        const eqText = l.eq || l.note || "";
        const tw = ctx.measureText(eqText).width;
        ctx.fillStyle = "#0b111fe8";
        ctx.strokeStyle = col + "88"; ctx.lineWidth = DPR;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(qx - tw / 2 - 6 * DPR, qy - 10 * DPR, tw + 12 * DPR, 20 * DPR, 5 * DPR);
        else ctx.rect(qx - tw / 2 - 6 * DPR, qy - 10 * DPR, tw + 12 * DPR, 20 * DPR);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(eqText, qx, qy);
      }
      ctx.globalAlpha = 1;
    } else {
      const dim = emphasize && !active;
      ctx.strokeStyle = dim ? "#ffc86622" : "#ffc866" + (active ? "cc" : "66");
      ctx.lineWidth = (active ? 2 : 1.2) * DPR;
      ctx.setLineDash([6 * DPR, 5 * DPR]);
      // 控制点取中垂线偏移，弧向固定
      const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
      const nx = -(p2.y - p1.y), ny = p2.x - p1.x;
      const len = Math.hypot(nx, ny) || 1;
      const bow = Math.min(40, len * 0.12) * DPR;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(mx + nx / len * bow, my + ny / len * bow, p2.x, p2.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  /* 节点 */
  for (const n of nodes) {
    if (!n.visible) continue;
    const p = toScreen(n.x, n.y);
    if (p.x < -80 || p.y < -80 || p.x > W + 80 || p.y > H + 80) continue;
    const c = SUBJ_COLOR[n.subject] || (n.fillColor ? { main: n.fillColor } : SUBJ_COLOR.physics);
    const cc = n.fillColor ? { main: n.fillColor, soft: n.fillColor + "26" } : c;
    const r = TYPE[n.type].r * cam.scale * DPR;
    const dimmed = (focusMode && !focusSet.has(n)) ||
                   (emphasize && emSet && !emSet.has(n) && n !== emphasize);
    const isHit = n === hoverNode || n === selectedNode || searchHits.has(n);

    let fill = cc.main, stroke = null, alpha = dimmed ? 0.16 : 1;
    if (n.type === "book") fill = cc.main;
    if (n.type === "section" || n.type === "sub") fill = (n.fillColor || c.main) + "cc";
    if (n.type === "kp") fill = KPTYPE_COLOR[n.ktype] || "#9fb7e8";

    ctx.globalAlpha = alpha;
    if (n.type === "subject" || n.type === "book") {
      const glow = ctx.createRadialGradient(p.x, p.y, r * 0.2, p.x, p.y, r * (n.type === "subject" ? 2.6 : 2));
      glow.addColorStop(0, cc.soft); glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(p.x, p.y, r * (n.type === "subject" ? 2.6 : 2), 0, 7); ctx.fill();
    }
    if (n.type === "kp") {
      /* 知识点画成菱形，与章节圆形区分 */
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(Math.PI / 4);
      ctx.fillStyle = fill;
      ctx.fillRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6);
      ctx.strokeStyle = "#0d1220"; ctx.lineWidth = 1.1 * DPR;
      ctx.strokeRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6);
      ctx.restore();
    } else {
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7);
      ctx.fillStyle = fill; ctx.fill();
      if (n.type === "chapter" || n.type === "book" || n.type === "subject") {
        ctx.strokeStyle = "#0d1220"; ctx.lineWidth = 1.5 * DPR; ctx.stroke();
      }
    }
    if (isHit) {
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.8 * DPR;
      ctx.beginPath(); ctx.arc(p.x, p.y, r + 3.5 * DPR, 0, 7); ctx.stroke();
    }
    if (searchHits.has(n) && n === searchActive) {
      ctx.strokeStyle = "#ffc866"; ctx.lineWidth = 2.2 * DPR;
      ctx.beginPath(); ctx.arc(p.x, p.y, r + 6 * DPR, 0, 7); ctx.stroke();
    }

    /* 标签 */
    if (shouldLabel(n) && !dimmed) {
      const fs = labelSize(n) * DPR * Math.min(Math.max(cam.scale, 0.85), 1.6);
      ctx.font = `${n.type === "subject" ? 700 : 500} ${fs}px "PingFang SC","Microsoft YaHei",sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      const isCentral = n.type === "subject";
      ctx.fillStyle = isCentral ? "#ffffff" : "#c9d6f2";
      ctx.shadowColor = "#000000cc"; ctx.shadowBlur = 4 * DPR;
      const label = n.type === "subject" ? n.label : n.label;
      ctx.fillText(label, p.x, p.y + r + 3 * DPR);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }
}

/* ---------- 5. 主循环 ---------- */
function frame() {
  for (let i = 0; i < 2; i++) simulateStep();
  draw();
  requestAnimationFrame(frame);
}

/* ---------- 6. 交互 ---------- */
let dragNode = null, panning = false, lastMouse = null, mouseDownPos = null;

canvas.addEventListener("mousedown", ev => {
  const rect = canvas.getBoundingClientRect();
  const px = (ev.clientX - rect.left) * DPR, py = (ev.clientY - rect.top) * DPR;
  const w = toWorld(px, py);
  const n = pickNode(w.x, w.y);
  mouseDownPos = { x: ev.clientX, y: ev.clientY };
  if (n) {
    dragNode = n; n.fixed = true;
    canvas.classList.add("dragging");
  } else {
    panning = true;
    canvas.classList.add("dragging");
  }
  lastMouse = { x: ev.clientX, y: ev.clientY };
});
window.addEventListener("mousemove", ev => {
  const rect = canvas.getBoundingClientRect();
  const px = (ev.clientX - rect.left) * DPR, py = (ev.clientY - rect.top) * DPR;
  if (dragNode) {
    const w = toWorld(px, py);
    dragNode.x = w.x; dragNode.y = w.y; reheat(0.35);
    return;
  }
  if (panning && lastMouse) {
    cam.x -= (ev.clientX - lastMouse.x) / cam.scale;
    cam.y -= (ev.clientY - lastMouse.y) / cam.scale;
    lastMouse = { x: ev.clientX, y: ev.clientY };
    return;
  }
  if (ev.target !== canvas) { setHover(null); return; }
  const w = toWorld(px, py);
  setHover(pickNode(w.x, w.y));
});
window.addEventListener("mouseup", () => {
  if (dragNode) { dragNode.fixed = false; dragNode = null; }
  panning = false;
  canvas.classList.remove("dragging");
});
canvas.addEventListener("click", ev => {
  if (mouseDownPos && Math.hypot(ev.clientX - mouseDownPos.x, ev.clientY - mouseDownPos.y) > 4) return;
  const rect = canvas.getBoundingClientRect();
  const w = toWorld((ev.clientX - rect.left) * DPR, (ev.clientY - rect.top) * DPR);
  const n = pickNode(w.x, w.y);
  selectNode(n);
});
canvas.addEventListener("dblclick", ev => {
  const rect = canvas.getBoundingClientRect();
  const w = toWorld((ev.clientX - rect.left) * DPR, (ev.clientY - rect.top) * DPR);
  const n = pickNode(w.x, w.y);
  if (n) { focusSet = neighborsOf(n); focusMode = true; selectNode(n); }
  else focusMode = false;
});
canvas.addEventListener("wheel", ev => {
  ev.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const px = (ev.clientX - rect.left) * DPR, py = (ev.clientY - rect.top) * DPR;
  const before = toWorld(px, py);
  cam.scale *= ev.deltaY < 0 ? 1.12 : 1 / 1.12;
  cam.scale = Math.min(6, Math.max(0.12, cam.scale));
  const after = toWorld(px, py);
  cam.x += before.x - after.x; cam.y += before.y - after.y;
}, { passive: false });

function pickNode(wx, wy) {
  let best = null, bestD = Infinity;
  for (const n of nodes) {
    if (!n.visible) continue;
    const d = Math.hypot(n.x - wx, n.y - wy);
    const rPick = Math.max(TYPE[n.type].r * 1.6, 10 / cam.scale);
    if (d < rPick && d < bestD) { best = n; bestD = d; }
  }
  return best;
}

const tip = document.getElementById("hoverTip");
function setHover(n) {
  if (n !== hoverNode) { hoverNode = n; }
  if (n && n.type !== "subject") {
    const c = typeDesc(n);
    tip.innerHTML = `<b>${esc(n.label)}</b><br><span class="t2">${esc(c)}</span>`;
    tip.classList.remove("hidden");
    const rect = canvas.getBoundingClientRect();
    tip.style.left = Math.min(ev_px(rect), rect.width - 270) + "px";
    tip.style.top = ev_py(rect) + "px";
  } else tip.classList.add("hidden");
}
let lastEv = null;
window.addEventListener("mousemove", e => { lastEv = { x: e.clientX, y: e.clientY }; }, true);
function ev_px(rect) { return lastEv ? lastEv.x - rect.left + 16 : 0; }
function ev_py(rect) { return lastEv ? lastEv.y - rect.top + 16 : 0; }

function typeDesc(n) {
  if (IS_CHEM) {
    if (n.type === "book") return n.full;
    if (n.type === "chapter") {
      const br = chemBranchOf.get(n.id), tp = chemTopicOf.get(n.id);
      return `${br ? br.name : ""} · 专题${tp ? ` · ${tp.items.length} 个节点` : ""}`;
    }
    if (n.type === "section") {
      const tp = chemTopicOf.get(n.id);
      const rn = links.filter(l => l.type === "reaction" && (l.s === n || l.t === n)).length;
      return `${tp ? tp.name + " · " : ""}${n.cat || "节点"}${n.info ? "：" + n.info : ""}${rn ? `（参与 ${rn} 个反应）` : ""}`;
    }
    if (n.type === "subject") return "无机 + 有机 · 以反应类型连接的化学知识图谱";
    return n.label;
  }
  const book = BOOKS.find(b => b.id === n.book);
  if (n.type === "kp") return `【${n.ktype}】${n.text || ""}`;
  if (n.type === "book") return `教材 · ${n.full}`;
  if (n.type === "chapter") {
    const b = BOOKS.find(b => b.id === n.book);
    const ch = b.chapters.find(c => c.num === n.ch);
    return `${b.name} · 第${ch.num}章 · ${ch.sections.length} 节`;
  }
  if (n.type === "section") {
    const b = BOOKS.find(b => b.id === n.book);
    const ch = b.chapters.find(c => c.num === n.ch);
    const sub = ch.sections[n.sec].subs || [];
    const kps = KPS_BY_SEC.get(n.id);
    return `${b.name} 第${ch.num}章 第${n.sec + 1}节`
      + `${sub.length ? " · " + sub.length + " 个子目" : ""}${kps ? " · " + kps.length + " 个知识点" : ""}`;
  }
  if (n.type === "sub") return `${book.name} 内的子知识点`;
  return n.label;
}

/* ---------- 7. 详情面板 ---------- */
const detail = document.getElementById("detail");
const detailBody = document.getElementById("detailBody");
document.getElementById("detailClose").addEventListener("click", () => {
  detail.classList.add("hidden"); selectedNode = null;
});

function selectNode(n) {
  selectedNode = n; focusMode = false;
  if (!n) { detail.classList.add("hidden"); return; }
  renderDetail(n);
  detail.classList.remove("hidden");
}

function renderChemDetail(n) {
  let crumb = "", extra = "";
  const branch = chemBranchOf.get(n.id);
  const tag = n.type === "section"
    ? `<span class="tag" style="color:${n.fillColor};border-color:${n.fillColor}66">${esc(n.cat || "节点")}</span><span class="tag" style="color:${branch ? branch.color : "#dbe4f5"}">${esc(branch ? branch.name : "")}</span>`
    : `<span class="tag">${TYPE[n.type].label}</span><span class="tag" style="color:${branch ? branch.color : "#dbe4f5"}">${esc(branch ? branch.name : "化学")}</span>`;

  if (n.type === "section") {
    const tp = chemTopicOf.get(n.id);
    crumb = `${branch.name} · ${tp.name}`;
    extra = (n.info ? `<div class="kptext">${esc(n.info)}</div>` : "")
      + (n.derive ? `<h4>公式推导</h4><div class="kpderive">` + n.derive.map(d => `<div class="dstep">${esc(d)}</div>`).join("") + `</div>` : "")
      + (n.img && n.img.length ? `<h4>图像解析</h4>` + n.img.map(k => KP_IMG[k] ? `<div class="kpimg">${KP_IMG[k]}</div>` : "").join("") : "")
      + (n.example ? `<h4>经典例题</h4><div class="kpexample"><div class="q">${esc(n.example.q)}</div><details><summary>查看答案</summary><div class="a">${esc(n.example.a)}</div></details></div>` : "")
      + (n.wrong ? `<h4>易错点 · 误区</h4><div class="kpwrong">⚠ ${esc(n.wrong)}</div>` : "");
  } else if (n.type === "chapter") {
    const tp = chemTopicOf.get(n.id);
    crumb = `${branch.name} 专题`;
    extra = `<h4>节点（${tp.items.length}）</h4><ul>` +
      tp.items.map(it => `<li data-target="${it.id}"><span class="kpt" style="color:${it.cat === "概念" ? "#9fb7e8" : branch.color};border-color:${(it.cat === "概念" ? "#9fb7e8" : branch.color) + "55"}">${esc(it.cat || "")}</span>${esc(it.label)}</li>`).join("") + "</ul>";
  } else if (n.type === "book") {
    crumb = branch.desc;
    extra = `<h4>专题（${branch.topics.length}）</h4><ul>` +
      branch.topics.map(t => `<li data-target="${t.id}">${esc(t.name)}</li>`).join("") + "</ul>";
  } else if (n.type === "subject") {
    crumb = "参考人教版高中化学教材（必修两册 + 选择性必修三册）";
    const inorg = CHEM.branches[0], org = CHEM.branches[1];
    const cnt = br => br.topics.reduce((a, t) => a + t.items.length, 0);
    extra = `<h4>分支</h4><ul><li data-target="${inorg.id}">${inorg.name}：${inorg.topics.length} 专题 · ${cnt(inorg)} 节点</li>` +
      `<li data-target="${org.id}">${org.name}：${org.topics.length} 专题 · ${cnt(org)} 节点</li><li>反应连线 ${chemStats.reactions} 条</li></ul>`;
  }

  const rels = links.filter(l => l.type === "reaction" && (l.s === n || l.t === n));
  const relHtml = rels.length ? `<h4>参与的化学反应（${rels.length}）</h4><ul>` +
    rels.map(l => {
      const other = l.s === n ? l.t : l.s;
      const col = REACTION_COLOR[l.kind] || "#9fb7e8";
      return `<li data-target="${other.id}"><span class="kind" style="color:${col};border-color:${col}66">${esc(l.kind)}</span>${esc(other.label)}<br><span class="linknote">${esc(l.note || l.eq || "")}</span></li>`;
    }).join("") + "</ul>" : "";

  detailBody.innerHTML = `${tag}<h3>${esc(n.label)}</h3><div class="crumb">${esc(crumb)}</div>${extra}${relHtml}
    <button class="focusbtn" id="focusBtn">◎ 聚焦该节点</button>`;
  detailBody.querySelectorAll("li[data-target]").forEach(li => {
    li.addEventListener("click", () => {
      const t = nodeById.get(li.dataset.target);
      if (t) { selectNode(t); centerOn(t, 1.4); }
    });
  });
  document.getElementById("focusBtn").addEventListener("click", () => {
    focusSet = neighborsOf(n); focusMode = true; centerOn(n, 1.6);
  });
}

function renderDetail(n) {
  if (IS_CHEM) return renderChemDetail(n);
  const book = BOOKS.find(b => b.id === n.book);
  let crumb = "", extra = "";
  const ktypeBadge = n.type === "kp"
    ? `<span class="tag" style="color:${KPTYPE_COLOR[n.ktype] || "#9fb7e8"};border-color:${(KPTYPE_COLOR[n.ktype] || "#9fb7e8") + "66"}">${n.ktype}</span>` : "";
  const tag = `<span class="tag">${TYPE[n.type].label}</span>${ktypeBadge}<span class="tag" style="color:${SUBJ_COLOR[n.subject].main}">${SUBJECTS.find(s => s.id === n.subject).name}</span>`;

  if (n.type === "chapter") {
    const ch = book.chapters.find(c => c.num === n.ch);
    crumb = `${book.full} · 第${ch.num}章`;
    extra = `<h4>本章小节（${ch.sections.length}）</h4><ul>` +
      ch.sections.map((s, i) => `<li data-target="${n.book}c${n.ch}s${i}">${esc(s.title)}</li>`).join("") + "</ul>";
  } else if (n.type === "section") {
    const ch = book.chapters.find(c => c.num === n.ch);
    const sec = ch.sections[n.sec];
    crumb = `${book.full} · 第${ch.num}章 ${ch.title} · 第${n.sec + 1}节`;
    let inner = (sec.subs && sec.subs.length)
      ? `<h4>子知识点（${sec.subs.length}）</h4><ul>` +
        sec.subs.map((s, i) => `<li data-target="${n.book}c${n.ch}s${n.sec}u${i}">${esc(s)}</li>`).join("") + "</ul>"
      : "";
    const kps = KPS_BY_SEC.get(n.id) || [];
    if (kps.length) {
      inner += `<h4>本节知识点（${kps.length}）</h4><ul>` + kps.map(k =>
        `<li data-target="${k.id}"><span class="kpt" style="color:${KPTYPE_COLOR[k.ktype] || "#9fb7e8"};border-color:${(KPTYPE_COLOR[k.ktype] || "#9fb7e8") + "55"}">${esc(k.ktype)}</span>${esc(k.label)}${k.imp >= 4 ? ' <span style="color:#ffc866" title="高频考点">★</span>' : ""}${k.wrong ? ' <span style="color:#ff7a88" title="含易错点">⚠</span>' : ""}${k.example ? ' <span style="color:#7ee0a3" title="含例题">✎</span>' : ""}${k.derive ? ' <span style="color:#b18cff" title="含推导">ƒ</span>' : ""}${k.img ? ' <span style="color:#4da3ff" title="含图像">▦</span>' : ""}<br><span class="linknote">${esc(k.text || "")}</span></li>`
      ).join("") + "</ul>";
    }
    extra = inner;
  } else if (n.type === "kp") {
    const parent = n.parent;
    const pch = book.chapters.find(c => c.num === n.ch);
    crumb = `${book.full} · 第${n.ch}章 ${pch.title}`;
    extra = `<div class="kptext">${esc(n.text || "")}</div>`;
    if (n.imp) {
      const starBar = "★★★★★".slice(0, n.imp) + "☆☆☆☆☆".slice(0, 5 - n.imp);
      extra += `<h4>考点重要度</h4><div class="kpimp">${starBar}${n.imp >= 4 ? '　<span class="hot">高频考点</span>' : ""}</div>`;
    }
    if (n.exam) {
      extra += `<h4>重要考点 · 常考题型</h4><div class="kpexam">${esc(n.exam)}</div>`;
    }
    if (n.derive && n.derive.length) {
      extra += `<h4>公式推导</h4><div class="kpderive">` +
        n.derive.map((d, i) => `<div class="dstep">${i ? '<span class="darr">⇓</span>' : ""}${esc(d)}</div>`).join("") + `</div>`;
    }
    if (n.img && n.img.length) {
      extra += `<h4>图像解析</h4>` + n.img.map(k => KP_IMG[k] ? `<div class="kpimg">${KP_IMG[k]}</div>` : "").join("");
    }
    if (n.example) {
      extra += `<h4>经典例题</h4><div class="kpexample"><div class="q">${esc(n.example.q)}</div>` +
        `<details><summary>查看答案</summary><div class="a">${esc(n.example.a)}</div></details></div>`;
    }
    if (n.wrong) {
      extra += `<h4>易错点 · 误区</h4><div class="kpwrong">⚠ ${esc(n.wrong)}</div>`;
    }
    extra += `<h4>所属小节</h4><ul><li data-target="${parent.id}">${esc(parent.label)}</li></ul>`;
  } else if (n.type === "book") {
    crumb = "人教版 · 普通高中教科书";
    extra = `<h4>章节（${book.chapters.length}）</h4><ul>` +
      book.chapters.map(c => `<li data-target="${book.id}c${c.num}">第${c.num}章 ${esc(c.title)}</li>`).join("") + "</ul>";
  } else if (n.type === "subject") {
    const st = stats[n.subject];
    const kpN = kpSubjectCount[n.subject] || 0;
    crumb = "全套教材统计";
    extra = `<h4>收录</h4><ul><li>${st.books} 册教材</li><li>${st.chapters} 章</li><li>${st.sections} 节</li><li>${kpN} 个知识点标注</li></ul>`;
  } else if (n.type === "sub") {
    crumb = `${book.full} 子知识点`;
  }

  /* 跨章关联 + 知识点间关联 */
  const rels = links.filter(l => (l.type === "cross" || l.type === "rel") && (l.s === n || l.t === n));
  const relHtml = rels.length ? `<h4>${n.type === "kp" ? "与其他知识点的联系" : "知识关联"}（${rels.length}）</h4><ul>` +
    rels.map((l, i) => {
      const other = l.s === n ? l.t : l.s;
      const color = l.type === "rel" ? "#b18cff" : "#ffc866";
      return `<li data-target="${other.id}"><span class="kind" style="color:${color};border-color:${color}55">${l.kind || "关联"}</span>${esc(other.label)}<br><span class="linknote">${esc(l.note || "")}</span></li>`;
    }).join("") + "</ul>" : "";

  detailBody.innerHTML = `${tag}<h3>${esc(n.label)}</h3><div class="crumb">${esc(crumb)}</div>${extra}${relHtml}
    <button class="focusbtn" id="focusBtn">◎ 聚焦该节点</button>`;
  detailBody.querySelectorAll("li[data-target]").forEach(li => {
    li.addEventListener("click", () => {
      const t = nodeById.get(li.dataset.target);
      if (t) { selectNode(t); centerOn(t, 1.4); }
    });
  });
  document.getElementById("focusBtn").addEventListener("click", () => {
    focusSet = neighborsOf(n); focusMode = true; centerOn(n, 1.6);
  });
}

function centerOn(n, targetScale) {
  cam.x = n.x; cam.y = n.y;
  const from = cam.scale, to = targetScale;
  const t0 = performance.now();
  (function anim(t) {
    const k = Math.min(1, (t - t0) / 350);
    cam.scale = from + (to - from) * (1 - Math.pow(1 - k, 3));
    if (k < 1) requestAnimationFrame(anim);
  })(t0);
}

function fitView() {
  const vis = nodes.filter(n => n.visible);
  if (!vis.length) return;
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  for (const n of vis) {
    minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x);
    minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y);
  }
  const rect = canvas.getBoundingClientRect();
  const pad = 60;
  cam.scale = Math.min((rect.width - pad) / (maxX - minX), (rect.height - pad) / (maxY - minY));
  cam.scale = Math.min(2.2, Math.max(0.12, cam.scale));
  cam.x = (minX + maxX) / 2; cam.y = (minY + maxY) / 2;
}

/* ---------- 8. 侧栏 UI ---------- */
/* 图例 */
if (IS_CHEM) {
  const kinds = [...new Set(links.filter(l => l.type === "reaction").map(l => l.kind))];
  document.getElementById("legend").innerHTML =
    `<div class="row" style="margin-bottom:4px"><span class="dmark" style="background:#4da3ff"></span>物质节点<span style="color:#66748f;font-size:11px">（蓝=无机，橙=有机，灰=概念）</span></div>` +
    kinds.map(k => `<div class="row" data-kind="${k}" style="cursor:pointer"><span class="swatch" style="border-top:2px solid ${REACTION_COLOR[k] || "#9fb7e8"}"></span>${k}</div>`).join("") +
    `<div class="muted" style="margin-top:6px">点击反应类型可只看同类反应；悬停或选中节点时连线上显示化学方程式</div>`;
  document.querySelectorAll("#legend [data-kind]").forEach(el => {
    el.addEventListener("click", () => {
      const k = el.dataset.kind;
      reactionFilter = reactionFilter === k ? null : k;
      document.querySelectorAll("#legend [data-kind]").forEach(e2 => {
        e2.style.background = (reactionFilter && e2.dataset.kind === reactionFilter) ? "#ffc86622" : "";
      });
    });
  });
} else {
if (typeof colorNote === "undefined") {
  var colorNote = PAGE_SUBJECT === "all" ? "（蓝=物理，绿=生物，橙=地理）"
    : PAGE_SUBJECT === "physics" ? "（蓝色系）"
    : PAGE_SUBJECT === "biology" ? "（绿色系）" : "（橙色系）";
}
document.getElementById("legend").innerHTML =
  [["科目", "#ffffff", 10], ["教材", "#4da3ff", 7.5], ["章", "#4da3ff", 5], ["节", "#4da3ffcc", 3], ["子目", "#4da3ffaa", 2.2]]
    .map(([lab, col, r]) => `<div class="row"><span class="dot" style="background:${col};width:${r * 2}px;height:${r * 2}px"></span>${lab}<span style="color:#66748f;font-size:11px">${colorNote}</span></div>`).join("") +
  `<div class="row"><span class="swatch" style="border-top:2px dashed #ffc866"></span>跨章知识关联</div>` +
  `<div class="row"><span class="swatch" style="border-top:2px dotted #b18cff"></span>知识点间联系</div>` +
  `<div class="row" style="margin-top:4px;flex-wrap:wrap;gap:5px">` +
  ["定义", "公式", "定律", "模型", "过程", "方法"].map(t =>
    `<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:#8291b4">` +
    `<span class="dmark" style="background:${KPTYPE_COLOR[t]}"></span>${t}</span>`).join("") +
  `</div>`;
}

/* 统计 */
(function () {
  if (IS_CHEM) {
    document.getElementById("stats").textContent =
      `无机 ${CHEM.branches[0].topics.length} 专题 ｜ 有机 ${CHEM.branches[1].topics.length} 专题 ｜ 节点 ${chemStats.items} · 反应连线 ${chemStats.reactions}`;
    return;
  }
  const base = pageSubjects.map(s => {
    const t = stats[s.id];
    const kp = kpSubjectCount[s.id] || 0;
    return `${s.name} ${t.books} 册 ${t.chapters} 章 ${t.sections} 节 · ${kp} 知识点`;
  });
  document.getElementById("stats").textContent = base.join(" ｜ ");
})();

/* 教材目录树 */
const bookList = document.getElementById("bookList");
for (const book of pageBooks) {
  const item = document.createElement("div");
  item.className = "book-item";
  const color = SUBJ_COLOR[book.subject].main;
  const secs = book.chapters.reduce((a, c) => a + c.sections.length, 0);
  item.innerHTML = `
    <div class="book-head" data-book="${book.id}">
      <span class="chip" style="background:${color}"></span>
      <span>${esc(book.name)}</span>
      <span class="eye" data-eye="${book.id}" title="显示/隐藏">◉</span>
    </div>
    <div class="chapters">
      ${book.chapters.map(c => `
        <div class="ch-item" data-target="${book.id}c${c.num}"><span class="num">${c.num}</span>${esc(c.title)}
          ${c.sections.map((s, i) => `<div class="sec" data-target="${book.id}c${c.num}s${i}">· ${esc(s.title)}</div>`).join("")}
        </div>`).join("")}
    </div>`;
  bookList.appendChild(item);
}

/* 化学模式侧栏：按无机/有机分组列出专题与节点 */
if (IS_CHEM) {
  for (const br of CHEM.branches) {
    const group = document.createElement("div");
    group.style.cssText = `color:${br.color};font-weight:700;font-size:13px;margin:6px 0 2px;letter-spacing:2px`;
    group.textContent = br.name;
    bookList.appendChild(group);
    for (const topic of br.topics) {
      const item = document.createElement("div");
      item.className = "book-item";
      item.innerHTML = `
        <div class="book-head" data-book="${topic.id}">
          <span class="chip" style="background:${br.color}"></span>
          <span>${esc(topic.name)}</span>
          <span class="eye" data-eye="${topic.id}" title="显示/隐藏">◉</span>
        </div>
        <div class="chapters">
          ${topic.items.map(it => `<div class="ch-item" data-target="${it.id}">· ${esc(it.label)} <span class="num">${esc(it.cat || "")}</span></div>`).join("")}
        </div>`;
      bookList.appendChild(item);
    }
  }
}
bookList.querySelector(".book-head .eye");
bookList.addEventListener("click", ev => {
  const eye = ev.target.closest("[data-eye]");
  if (eye) {
    ev.stopPropagation();
    const bid = eye.dataset.eye;
    bookVisible.set(bid, !bookVisible.get(bid));
    eye.textContent = bookVisible.get(bid) ? "◉" : "◌";
    eye.closest(".book-head").classList.toggle("off", !bookVisible.get(bid));
    refreshVisible(); reheat(0.5);
    if (selectedNode && !selectedNode.visible) { selectedNode = null; detail.classList.add("hidden"); }
    [300, 1000, 1900].forEach(t => setTimeout(fitView, t));
    return;
  }
  const head = ev.target.closest(".book-head");
  if (head) { head.parentElement.classList.toggle("open"); return; }
  const chItem = ev.target.closest("[data-target]");
  if (chItem) {
    const n = nodeById.get(chItem.dataset.target);
    if (n) { selectNode(n); centerOn(n, 1.5); }
  }
});

/* 科目页签 */
document.querySelectorAll("#subjectTabs .tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#subjectTabs .tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    subjectFilter = btn.dataset.subject;
    refreshVisible(); reheat(0.6);
    if (selectedNode && !selectedNode.visible) { selectedNode = null; detail.classList.add("hidden"); }
    [300, 1000, 1900].forEach(t => setTimeout(fitView, t));
  });
});

/* 控制按钮 */
document.getElementById("btnFit").addEventListener("click", fitView);
document.getElementById("btnShuffle").addEventListener("click", () => {
  for (const n of nodes) {
    const side = IS_CHEM ? (n.branch === "chem-org" ? 1 : -1)
                         : (n.subject === "physics" ? -1 : 1);
    n.x = side * 200 + (Math.random() - 0.5) * 700;
    n.y = (Math.random() - 0.5) * 600;
    n.vx = n.vy = 0;
  }
  reheat(1);
});
document.getElementById("btnPause").addEventListener("click", function () {
  sim.paused = !sim.paused;
  this.textContent = sim.paused ? "▶ 继续运动" : "⏸ 暂停运动";
});
const btnKP = document.getElementById("btnKP");
if (btnKP) btnKP.addEventListener("click", function () {
  showKP = !showKP;
  this.textContent = showKP ? "◆ 知识点：开" : "◇ 知识点：关";
  refreshVisible(); reheat(0.6);
  setTimeout(fitView, 900);
});

/* 搜索 */
const searchInput = document.getElementById("search");
const searchCount = document.getElementById("searchCount");
let hitsList = [];
searchInput.addEventListener("input", doSearch);
searchInput.addEventListener("keydown", ev => {
  if (ev.key === "Enter" && hitsList.length) {
    const idx = hitsList.indexOf(searchActive);
    searchActive = hitsList[(idx + 1) % hitsList.length];
    selectNode(searchActive); centerOn(searchActive, 1.6);
    searchCount.textContent = `${hitsList.indexOf(searchActive) + 1}/${hitsList.length}`;
  }
  if (ev.key === "Escape") { searchInput.value = ""; doSearch(); searchInput.blur(); }
});
function doSearch() {
  const q = searchInput.value.trim().toLowerCase();
  searchHits = new Set(); searchActive = null; hitsList = [];
  if (!q) { searchCount.textContent = ""; return; }
  for (const n of nodes) {
    if (n.visible && n.label.toLowerCase().includes(q)) { searchHits.add(n); hitsList.push(n); }
  }
  searchCount.textContent = hitsList.length ? `${hitsList.length} 个结果，回车逐个定位` : "无结果";
}

/* 工具 */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- 9. 启动 ---------- */
refreshVisible();
requestAnimationFrame(() => { setTimeout(fitView, 900); });
frame();
