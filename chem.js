// 高中化学知识图谱数据（参考人教版：必修第一/二册、选择性必修1/2/3）
// 结构：化学 → 无机化学 / 有机化学 → 专题 → 物质与概念节点；反应类型作为节点间连线
"use strict";

const CHEM = {
  subject: { id: "chemistry", name: "化学" },
  branches: [
    { id: "chem-inorg", name: "无机化学", color: "#4da3ff",
      desc: "物质分类、离子反应、氧化还原、元素化合物、反应原理（必修第一/二册·选择性必修1/2）",
      topics: [
        { id: "c-classify", name: "物质的分类及转化", items: [
          { id: "c-geliao", label: "胶体", cat: "概念", info: "分散质粒子直径在 1~100 nm 之间的分散系；可用丁达尔效应鉴别。", wrong: "溶液、胶体、浊液的本质区别是分散质粒子大小，不是外观" },
          { id: "c-tongshu", label: "同素异形体", cat: "概念", info: "同种元素形成的性质不同的单质，如 O₂ 与 O₃、金刚石与石墨、红磷与白磷。" },
          { id: "c-yanghuawu", label: "酸性/碱性氧化物", cat: "概念", info: "酸性氧化物与碱反应生成盐和水（如 CO₂、SO₂）；碱性氧化物与酸反应生成盐和水（如 Na₂O、CaO）。" },
        ]},
        { id: "c-mol", name: "物质的量", items: [
          { id: "c-na", label: "物质的量 n 与 NA", cat: "概念", info: "物质的量是七个基本物理量之一，单位 mol；NA≈6.02×10²³ /mol。", wrong: "物质的量只用于微观粒子，不能说“1 mol 苹果”" },
          { id: "c-mm", label: "摩尔质量 M", cat: "公式", info: "M=m/n，单位 g/mol；数值上等于相对分子质量。" },
          { id: "c-vm", label: "气体摩尔体积 Vm", cat: "公式", info: "标况（0℃、101 kPa）下 Vm=22.4 L/mol，只适用于气态物质。", wrong: "22.4 L/mol 必须是标准状况且物质为气体" },
          { id: "c-cb", label: "物质的量浓度 c", cat: "公式", info: "c=n/V，单位 mol/L；配制一定浓度溶液用容量瓶。" },
        ]},
        { id: "c-ionrxn", name: "离子反应", items: [
          { id: "c-dianjiezhi", label: "电解质与非电解质", cat: "概念", info: "在水溶液中或熔融状态下能导电的化合物是电解质（酸、碱、盐、活泼金属氧化物）；二者均为化合物，单质和混合物既不是电解质也不是非电解质。", wrong: "能导电的不一定是电解质（如石墨、铜）；CO₂ 溶液导电但 CO₂ 是非电解质" },
          { id: "c-lizifc", label: "离子方程式", cat: "方法", info: "用实际参加反应的离子符号表示反应的式子；写、拆、删、查四步。" },
          { id: "c-gongcun", label: "离子共存", cat: "方法", info: "生成沉淀、气体、弱电解质或发生氧化还原的离子不能大量共存。" },
        ]},
        { id: "c-redox", name: "氧化还原反应", items: [
          { id: "c-redox-bz", label: "本质与特征", cat: "概念", info: "特征：元素化合价升降；本质：电子转移（得失或偏移）。不一定有氧参加。" },
          { id: "c-redox-j", label: "氧化剂与还原剂", cat: "概念", info: "得电子（化合价降低）被还原的是氧化剂；失电子（化合价升高）被氧化的是还原剂。" },
          { id: "c-redox-cj", label: "常见氧化剂与还原剂", cat: "方法", info: "常见氧化剂：O₂、Cl₂、浓硫酸、HNO₃、KMnO₄、Fe³⁺；常见还原剂：活泼金属、C、H₂、CO、I⁻、Fe²⁺。" },
        ]},
        { id: "c-na-fam", name: "钠及其化合物", items: [
          { id: "c-na-el", label: "Na", cat: "金属单质", info: "银白色活泼金属，质软密度小；保存在煤油中；与水剧烈反应浮、熔、游、响、红。" },
          { id: "c-na2o", label: "Na₂O", cat: "化合物", info: "白色固体，碱性氧化物，与水反应生成 NaOH。" },
          { id: "c-na2o2", label: "Na₂O₂", cat: "化合物", info: "淡黄色固体，与水和 CO₂ 反应都放出 O₂，是呼吸面具/潜艇供氧剂。", wrong: "1 mol Na₂O₂ 与足量 CO₂ 反应转移 1 mol 电子、生成 0.5 mol O₂（歧化反应）" },
          { id: "c-naoh", label: "NaOH", cat: "化合物", info: "俗称烧碱、火碱、苛性钠，强碱，易潮解。" },
          { id: "c-na2co3", label: "Na₂CO₃", cat: "化合物", info: "纯碱、苏打；热稳定性强；与盐酸反应分步放气较慢。" },
          { id: "c-nahco3", label: "NaHCO₃", cat: "化合物", info: "小苏打；受热易分解；与盐酸反应放气更快；等质量消耗酸更多。",
            example: { q: "如何鉴别 Na₂CO₃ 和 NaHCO₃ 固体？", a: "加热：能产生使澄清石灰水变浑浊气体的是 NaHCO₃（2NaHCO₃=Δ=Na₂CO₃+H₂O+CO₂↑）；也可滴加盐酸比较剧烈程度。" } },
        ]},
        { id: "c-cl-fam", name: "氯及其化合物", items: [
          { id: "c-cl2", label: "Cl₂", cat: "非金属单质", info: "黄绿色有毒气体，能溶于水（1:2）；强氧化性，可用于自来水消毒。" },
          { id: "c-hcl", label: "HCl", cat: "化合物", info: "无色刺激性气体，极易溶于水得盐酸；工业制盐酸、制漂白粉原料。" },
          { id: "c-hclo", label: "HClO", cat: "化合物", info: "弱酸性、强氧化性，漂白杀菌；见光分解 2HClO=光照=2HCl+O₂↑。氯水久置变稀盐酸。", wrong: "干燥的 Cl₂ 没有漂白性，起漂白作用的是 HClO" },
          { id: "c-piaobaifen", label: "漂白粉", cat: "化合物", info: "主要成分 Ca(ClO)₂ 和 CaCl₂，有效成分 Ca(ClO)₂；遇酸或空气中 CO₂+H₂O 生成 HClO 起漂白作用。" },
        ]},
        { id: "c-fe-fam", name: "铁及其化合物", items: [
          { id: "c-fe-el", label: "Fe", cat: "金属单质", info: "变价金属（+2、+3）；与强氧化剂（Cl₂）成 Fe³⁺，与弱氧化剂（盐酸）成 Fe²⁺。" },
          { id: "c-fecl2", label: "Fe²⁺（FeCl₂）", cat: "化合物", info: "浅绿色；既有氧化性又有还原性；检验：先加 KSCN 不变红，再加氯水变红。" },
          { id: "c-fecl3", label: "Fe³⁺（FeCl₃）", cat: "化合物", info: "黄色；较强氧化性；检验：加 KSCN 溶液变红。腐蚀铜电路板：2FeCl₃+Cu=2FeCl₂+CuCl₂。" },
          { id: "c-feoh3", label: "Fe(OH)₂ → Fe(OH)₃", cat: "化合物", info: "Fe(OH)₂ 白色沉淀迅速变灰绿最终变红褐色：4Fe(OH)₂+O₂+2H₂O=4Fe(OH)₃；制备需将胶头滴管插入液面以下。" },
        ]},
        { id: "c-s-fam", name: "硫及其化合物", items: [
          { id: "c-s-el", label: "S", cat: "非金属单质", info: "淡黄色固体；与变价金属反应生成低价态硫化物（如 FeS、Cu₂S），说明氧化性较弱。" },
          { id: "c-so2", label: "SO₂", cat: "化合物", info: "刺激性气味有毒气体；酸性氧化物、还原性为主，也有弱氧化性；漂白性可逆（品红褪色加热恢复）；形成酸雨的主因之一。",
            wrong: "SO₂ 的漂白是化合型可逆漂白，与 HClO 的氧化漂白原理不同；使品红褪色的气体不一定是 Cl₂" },
          { id: "c-so3", label: "SO₃", cat: "化合物", info: "与水剧烈反应生成硫酸；工业制硫酸的中间产物。" },
          { id: "c-h2so4", label: "浓硫酸", cat: "化合物", info: "三大特性：吸水性（干燥剂）、脱水性（炭化）、强氧化性（加热下与 Cu、C 反应）；常温下使 Fe、Al 钝化。" },
        ]},
        { id: "c-n-fam", name: "氮及其化合物", items: [
          { id: "c-n2", label: "N₂", cat: "非金属单质", info: "含氮氮三键，性质稳定；放电条件下与 O₂ 化合；与 H₂ 可逆合成氨。" },
          { id: "c-no", label: "NO", cat: "化合物", info: "无色不溶于水的气体；极易与 O₂ 化合生成红棕色 NO₂；只能用排水法收集。", wrong: "NO 不能用排空气法收集（会被氧化），也不能与 O₂ 共存" },
          { id: "c-no2", label: "NO₂", cat: "化合物", info: "红棕色刺激性气味有毒气体；与水反应生成 HNO₃ 和 NO；是光化学烟雾成因之一。" },
          { id: "c-nh3", label: "NH₃", cat: "化合物", info: "极易溶于水（喷泉实验）；唯一碱性气体；催化氧化是工业制硝酸的基础；检验用湿润红色石蕊试纸变蓝。" },
          { id: "c-nyan", label: "铵盐（NH₄⁺）", cat: "化合物", info: "易溶于水，受热易分解；与碱共热放出氨气（NH₄⁺ 检验）；尿素、碳铵是重要氮肥。" },
          { id: "c-hno3", label: "HNO₃", cat: "化合物", info: "强氧化性酸；浓硝酸生成 NO₂、稀硝酸生成 NO；常温下使 Fe、Al 钝化；见光分解需棕色瓶保存。" },
        ]},
        { id: "c-struct", name: "物质结构与元素周期律", items: [
          { id: "c-yzjg", label: "原子结构与同位素", cat: "概念", info: "质子数=核电荷数=原子序数；质量数=质子数+中子数；同位素质子数相同中子数不同（¹H ²H ³H）。" },
          { id: "c-zqb", label: "元素周期表", cat: "概念", info: "7 周期 16 族；周期数=电子层数，主族序数=最外层电子数。" },
          { id: "c-zqlv", label: "元素周期律", cat: "概念", info: "随原子序数递增，原子半径、金属性、非金属性呈周期性变化；同周期从左到右金属性减弱非金属性增强。" },
          { id: "c-hxj", label: "化学键", cat: "概念", info: "离子键（阴阳离子静电作用，含活泼金属+活泼非金属）；共价键（共用电子对，非金属间）；化学反应的本质是旧键断裂新键形成。" },
        ]},
        { id: "c-energy", name: "化学反应与能量", items: [
          { id: "c-fangre", label: "放热与吸热反应", cat: "概念", info: "放热：燃烧、中和、金属与酸、大多数化合；吸热：Ba(OH)₂·8H₂O+NH₄Cl、C+CO₂、分解反应等。能量守恒：ΔH=生成物总能量−反应物总能量。" },
          { id: "c-yuanbianchi", label: "原电池", cat: "模型", info: "化学能→电能；负极失电子被氧化，正极得电子被还原；电子经外电路移动，电流方向与电子相反。",
            img: ["yuandianchi"], wrong: "电子不能在电解质溶液中移动，溶液中靠阴阳离子定向移动导电" },
        ]},
        { id: "c-rate", name: "化学反应速率与平衡", items: [
          { id: "c-sudu", label: "反应速率 v", cat: "公式", info: "v=Δc/Δt，单位 mol/(L·s)；影响因数：浓度、温度、压强、催化剂、接触面积。" },
          { id: "c-pingheng", label: "可逆反应与化学平衡", cat: "概念", info: "可逆反应同一条件下正逆同时进行（如 N₂+3H₂⇌2NH₃）；平衡状态的本质特征 v正=v逆≠0。" },
          { id: "c-cuihuaji", label: "催化剂", cat: "概念", info: "改变反应速率而本身质量和化学性质不变；同等程度加快正逆反应速率，不改变平衡转化率。" },
        ]},
      ]},
    { id: "chem-org", name: "有机化学", color: "#ffb36b",
      desc: "有机化合物的结构、烃及其衍生物、生物大分子与合成高分子（必修第二册第七章·选择性必修3）",
      topics: [
        { id: "c-orgintro", name: "有机化合物的结构特点", items: [
          { id: "c-chengjian", label: "碳原子的成键特点", cat: "概念", info: "碳 4 价，可形成单键、双键、三键；可连成链或环——有机物种类繁多的根源。" },
          { id: "c-guannengtuan", label: "官能团与分类", cat: "概念", info: "决定有机物特性的原子或原子团：-OH 羟基、-CHO 醛基、-COOH 羧基、C=C 双键、-X 卤素原子、-COOR 酯基等。" },
        ]},
        { id: "c-alkane", name: "烷烃（甲烷）", items: [
          { id: "c-ch4", label: "CH₄ 甲烷", cat: "有机物", info: "正四面体结构；天然气、沼气主要成分；光照下与氯气发生取代反应。", wrong: "CH₄ 是正四面体而非平面正方形（二氯甲烷只有一种结构可证明）" },
          { id: "c-wanting", label: "烷烃 CnH2n+2", cat: "概念", info: "饱和链烃，与卤素单质光照取代；同系物结构相似组成相差 CH₂。" },
        ]},
        { id: "c-alkene", name: "烯烃 炔烃（乙烯）", items: [
          { id: "c-yixi", label: "CH₂=CH₂ 乙烯", cat: "有机物", info: "含碳碳双键的平面形分子；植物生长调节剂（催熟）；加成、加聚、氧化反应。" },
          { id: "c-juhexi", label: "聚乙烯", cat: "有机物", info: "乙烯加聚产物，常见塑料；单体是乙烯。" },
        ]},
        { id: "c-benzene", name: "芳香烃（苯）", items: [
          { id: "c-ben", label: "苯", cat: "有机物", info: "平面正六边形，碳碳键介于单键和双键之间；取代（溴代、硝化）比加成容易。", wrong: "苯不能使溴水和酸性 KMnO₄ 溶液褪色（无典型双键），使溴水褪色是萃取" },
        ]},
        { id: "c-halo", name: "卤代烃", items: [
          { id: "c-xiuyiwan", label: "溴乙烷", cat: "有机物", info: "官能团 -Br；NaOH 水溶液加热发生水解（取代）生成醇；NaOH 乙醇溶液加热发生消去生成烯烃。",
            wrong: "水解与消去的试剂差别：水溶液→取代，醇溶液→消去" },
        ]},
        { id: "c-alcohol", name: "醇 酚", items: [
          { id: "c-yichun", label: "乙醇", cat: "有机物", info: "官能团 -OH；与钠反应放出 H₂；催化氧化生成乙醛；与乙酸酯化。检验酒驾用重铬酸钾变色或 Breathalyzer。" },
          { id: "c-benfen", label: "苯酚", cat: "有机物", info: "俗称石炭酸，弱酸性（俗称碳酸强）；遇 FeCl₃ 溶液显紫色；浓溶液有毒、杀菌防腐。" },
        ]},
        { id: "c-aldehyde", name: "醛 酮", items: [
          { id: "c-yiquan", label: "乙醛", cat: "有机物", info: "官能团 -CHO；银镜反应、与新制 Cu(OH)₂ 共热生成砖红色沉淀（检验醛基）；加氢还原成醇。",
            wrong: "银镜反应必须水浴加热，试管要洁净；1 mol -CHO 对应 2 mol Ag" },
        ]},
        { id: "c-acid", name: "羧酸 酯", items: [
          { id: "c-yisuan", label: "乙酸", cat: "有机物", info: "官能团 -COOH，弱酸性（比碳酸强）；与乙醇酯化；食醋主要成分。" },
          { id: "c-zhi", label: "乙酸乙酯（酯）", cat: "有机物", info: "有芳香气味、密度小于水；酯化与水解都是可逆反应；碱性条件下水解更彻底（皂化）。" },
        ]},
        { id: "c-biomol", name: "糖类 蛋白质 油脂", items: [
          { id: "c-putaotang", label: "葡萄糖", cat: "有机物", info: "多羟基醛；能发生银镜反应；人体重要供能物质（血糖）。" },
          { id: "c-dianfen", label: "淀粉与纤维素", cat: "有机物", info: "多糖 (C₆H₁₀O₅)ₙ；淀粉遇碘变蓝；水解最终产物都是葡萄糖；纤维素不供能但促进肠蠕动。" },
          { id: "c-danbz", label: "蛋白质", cat: "有机物", info: "氨基酸缩聚天然高分子；变性（加热、重金属盐）、颜色反应（浓硝酸显黄）、灼烧有焦羽毛味；水解得氨基酸。" },
          { id: "c-youzhi", label: "油脂", cat: "有机物", info: "高级脂肪酸甘油酯；碱性水解称皂化反应，得高级脂肪酸钠（肥皂主要成分）和甘油。" },
        ]},
        { id: "c-polymer", name: "合成高分子", items: [
          { id: "c-juhelfx", label: "加聚与缩聚", cat: "概念", info: "加聚：含 C=C 打开双键连接（聚乙烯、聚氯乙烯）；缩聚：缩去小分子（酚醛树脂、涤纶、蛋白质）。" },
          { id: "c-gaofencailiao", label: "三大合成材料", cat: "概念", info: "塑料、合成橡胶、合成纤维；白色污染治理与可降解材料。" },
        ]},
      ]},
  ],
  /* 反应：反应类型作为连线，eq 为化学（离子）方程式 */
  reactions: [
    // ---- 无机：钠 ----
    { a: "c-na-el", b: "c-na2o", kind: "化合反应", eq: "4Na + O₂ = 2Na₂O（不加热，白色固体）" },
    { a: "c-na-el", b: "c-na2o2", kind: "化合反应", eq: "2Na + O₂ =点燃= Na₂O₂（淡黄色固体）" },
    { a: "c-na-el", b: "c-naoh", kind: "置换反应", eq: "2Na + 2H₂O = 2NaOH + H₂↑（浮熔游响红）" },
    { a: "c-na2o", b: "c-naoh", kind: "化合反应", eq: "Na₂O + H₂O = 2NaOH" },
    { a: "c-na2o2", b: "c-naoh", kind: "氧化还原反应", eq: "2Na₂O₂ + 2H₂O = 4NaOH + O₂↑（歧化）" },
    { a: "c-na2co3", b: "c-nahco3", kind: "化合反应", eq: "Na₂CO₃ + CO₂ + H₂O = 2NaHCO₃" },
    { a: "c-nahco3", b: "c-na2co3", kind: "分解反应", eq: "2NaHCO₃ =Δ= Na₂CO₃ + H₂O + CO₂↑" },
    { a: "c-naoh", b: "c-na2co3", kind: "复分解反应", eq: "2NaOH + CO₂ = Na₂CO₃ + H₂O" },
    { a: "c-na2co3", b: "c-hcl", kind: "复分解反应", eq: "Na₂CO₃ + 2HCl = 2NaCl + H₂O + CO₂↑" },
    // ---- 氯 ----
    { a: "c-cl2", b: "c-hcl", kind: "化合反应", eq: "Cl₂ + H₂ =点燃= 2HCl" },
    { a: "c-cl2", b: "c-hclo", kind: "氧化还原反应", eq: "Cl₂ + H₂O ⇌ HCl + HClO（歧化）" },
    { a: "c-cl2", b: "c-piaobaifen", kind: "化合反应", eq: "2Cl₂ + 2Ca(OH)₂ = Ca(ClO)₂ + CaCl₂ + 2H₂O" },
    { a: "c-cl2", b: "c-fecl3", kind: "化合反应", eq: "2Fe + 3Cl₂ =点燃= 2FeCl₃（变价金属被氧化到高价）" },
    { a: "c-cl2", b: "c-fecl2", kind: "氧化还原反应", eq: "Cl₂ + 2FeCl₂ = 2FeCl₃" },
    { a: "c-hcl", b: "c-na-el", kind: "置换反应", eq: "2Na + 2HCl = 2NaCl + H₂↑（同 Na 与水本质）" },
    // ---- 铁 ----
    { a: "c-fe-el", b: "c-fecl2", kind: "置换反应", eq: "Fe + 2HCl = FeCl₂ + H₂↑" },
    { a: "c-fecl2", b: "c-fecl3", kind: "氧化还原反应", eq: "2FeCl₂ + Cl₂ = 2FeCl₃（Fe²⁺ 被氧化）" },
    { a: "c-fecl3", b: "c-fecl2", kind: "氧化还原反应", eq: "2FeCl₃ + Fe = 3FeCl₂（Fe³⁺ 被还原，除杂原理）" },
    { a: "c-fecl3", b: "c-feoh3", kind: "复分解反应", eq: "FeCl₃ + 3NaOH = Fe(OH)₃↓ + 3NaCl（红褐色沉淀）" },
    { a: "c-feoh3", b: "c-fecl2", kind: "氧化还原反应", eq: "4Fe(OH)₂ + O₂ + 2H₂O = 4Fe(OH)₃（白→灰绿→红褐）" },
    // ---- 硫 ----
    { a: "c-s-el", b: "c-so2", kind: "化合反应", eq: "S + O₂ =点燃= SO₂（淡蓝色火焰）" },
    { a: "c-so2", b: "c-so3", kind: "氧化还原反应", eq: "2SO₂ + O₂ ⇌(催化剂,Δ)= 2SO₃（工业制硫酸关键步）" },
    { a: "c-so3", b: "c-h2so4", kind: "化合反应", eq: "SO₃ + H₂O = H₂SO₄" },
    { a: "c-h2so4", b: "c-so2", kind: "氧化还原反应", eq: "Cu + 2H₂SO₄(浓) =Δ= CuSO₄ + SO₂↑ + 2H₂O（浓硫酸强氧化性）" },
    // ---- 氮 ----
    { a: "c-n2", b: "c-nh3", kind: "化合反应", eq: "N₂ + 3H₂ ⇌(催化剂,高温高压)= 2NH₃（工业合成氨）" },
    { a: "c-n2", b: "c-no", kind: "化合反应", eq: "N₂ + O₂ =放电= 2NO（汽车引擎/雷雨固氮）" },
    { a: "c-no", b: "c-no2", kind: "化合反应", eq: "2NO + O₂ = 2NO₂（无色变红棕色）" },
    { a: "c-no2", b: "c-hno3", kind: "氧化还原反应", eq: "3NO₂ + H₂O = 2HNO₃ + NO（工业制硝酸）" },
    { a: "c-nh3", b: "c-no", kind: "氧化还原反应", eq: "4NH₃ + 5O₂ =催化剂,Δ= 4NO + 6H₂O（氨的催化氧化）" },
    { a: "c-nh3", b: "c-nyan", kind: "化合反应", eq: "NH₃ + HCl = NH₄Cl（白烟，氨的检验）" },
    { a: "c-nyan", b: "c-nh3", kind: "分解反应", eq: "NH₄Cl =Δ= NH₃↑ + HCl↑（类似升华，实为分解）" },
    { a: "c-hno3", b: "c-no2", kind: "氧化还原反应", eq: "Cu + 4HNO₃(浓) = Cu(NO₃)₂ + 2NO₂↑ + 2H₂O" },
    // ---- 有机 ----
    { a: "c-ch4", b: "c-wanting", kind: "取代反应", eq: "CH₄ + Cl₂ →光照→ CH₃Cl + HCl（逐步取代可得 CH₂Cl₂ 等）" },
    { a: "c-wanting", b: "c-ch4", kind: "氧化反应", eq: "CH₄ + 2O₂ =点燃= CO₂ + 2H₂O（甲烷是清洁燃料）" },
    { a: "c-yixi", b: "c-juhexi", kind: "加聚反应", eq: "nCH₂=CH₂ →催化剂→ (CH₂—CH₂)ₙ（聚乙烯塑料）" },
    { a: "c-yixi", b: "c-yichun", kind: "加成反应", eq: "CH₂=CH₂ + H₂O →催化剂→ CH₃CH₂OH（工业制乙醇）" },
    { a: "c-yixi", b: "c-xiuyiwan", kind: "加成反应", eq: "CH₂=CH₂ + Br₂ → BrCH₂—CH₂Br（溴水褪色，检验双键）" },
    { a: "c-xiuyiwan", b: "c-yichun", kind: "水解反应", eq: "C₂H₅Br + NaOH →(水,Δ)= C₂H₅OH + NaBr（取代/水解）" },
    { a: "c-xiuyiwan", b: "c-yixi", kind: "消去反应", eq: "C₂H₅Br + NaOH(乙醇) →Δ→ CH₂=CH₂↑ + NaBr + H₂O" },
    { a: "c-yichun", b: "c-yiquan", kind: "氧化反应", eq: "2CH₃CH₂OH + O₂ →Cu,Δ= 2CH₃CHO + 2H₂O（催化氧化）" },
    { a: "c-yiquan", b: "c-yichun", kind: "加成反应", eq: "CH₃CHO + H₂ →催化剂→ CH₃CH₂OH（还原/加氢）" },
    { a: "c-yiquan", b: "c-yisuan", kind: "氧化反应", eq: "CH₃CHO + 2Ag(NH₃)₂OH →水浴Δ= CH₃COONH₄ + 2Ag↓ + 3NH₃ + H₂O（银镜反应）" },
    { a: "c-yisuan", b: "c-zhi", kind: "酯化反应", eq: "CH₃COOH + C₂H₅OH ⇌(浓硫酸,Δ)= CH₃COOC₂H₅ + H₂O（酸脱羟基醇脱氢）" },
    { a: "c-zhi", b: "c-yisuan", kind: "水解反应", eq: "CH₃COOC₂H₅ + H₂O ⇌(稀硫酸,Δ)= CH₃COOH + C₂H₅OH（可逆）" },
    { a: "c-dianfen", b: "c-putaotang", kind: "水解反应", eq: "(C₆H₁₀O₅)ₙ + nH₂O →催化剂= nC₆H₁₂O₆（淀粉水解最终得葡萄糖）" },
    { a: "c-naoh", b: "c-hcl", kind: "中和反应", eq: "NaOH + HCl = NaCl + H₂O（酸碱中和，复分解的特例）" },
  ],
};
