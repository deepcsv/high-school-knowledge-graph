// 由教材 PDF 目录解析生成 —— 人教版高中物理/生物学全套教材结构 + 跨章知识关联
// 节点编号：<书id>c<章号>，书id: p1-p6 物理, b1-b5 生物；节/子目按索引编号 s/u
const SUBJECTS = [
  { id: 'physics', name: '物理' },
  { id: 'biology', name: '生物学' },
  { id: 'geo', name: '地理' },
];

const BOOKS = [
 {
  "id": "p1",
  "subject": "physics",
  "name": "必修 第一册",
  "full": "普通高中教科书·物理 必修 第一册（人教版）",
  "chapters": [
   {
    "num": 1,
    "title": "运动的描述",
    "sections": [
     {
      "title": "质点 参考系",
      "subs": []
     },
     {
      "title": "时间 位移",
      "subs": []
     },
     {
      "title": "位置变化快慢的描述——速度",
      "subs": []
     },
     {
      "title": "速度变化快慢的描述——加速度",
      "subs": []
     }
    ]
   },
   {
    "num": 2,
    "title": "匀变速直线运动的研究",
    "sections": [
     {
      "title": "实验：探究小车速度随时间变化的规律",
      "subs": []
     },
     {
      "title": "匀变速直线运动的速度与时间的关系",
      "subs": []
     },
     {
      "title": "匀变速直线运动的位移与时间的关系",
      "subs": []
     },
     {
      "title": "自由落体运动",
      "subs": []
     }
    ]
   },
   {
    "num": 3,
    "title": "相互作用——力",
    "sections": [
     {
      "title": "重力与弹力",
      "subs": []
     },
     {
      "title": "摩擦力",
      "subs": []
     },
     {
      "title": "牛顿第三定律",
      "subs": []
     },
     {
      "title": "力的合成和分解",
      "subs": []
     },
     {
      "title": "共点力的平衡",
      "subs": []
     }
    ]
   },
   {
    "num": 4,
    "title": "运动和力的关系",
    "sections": [
     {
      "title": "牛顿第一定律",
      "subs": []
     },
     {
      "title": "实验：探究加速度与力、质量的关系",
      "subs": []
     },
     {
      "title": "牛顿第二定律",
      "subs": []
     },
     {
      "title": "力学单位制",
      "subs": []
     },
     {
      "title": "牛顿运动定律的应用",
      "subs": []
     },
     {
      "title": "超重和失重",
      "subs": []
     }
    ]
   }
  ]
 },
 {
  "id": "p2",
  "subject": "physics",
  "name": "必修 第二册",
  "full": "普通高中教科书·物理 必修 第二册（人教版）",
  "chapters": [
   {
    "num": 5,
    "title": "抛体运动",
    "sections": [
     {
      "title": "曲线运动",
      "subs": []
     },
     {
      "title": "运动的合成与分解",
      "subs": []
     },
     {
      "title": "实验：探究平抛运动的特点",
      "subs": []
     },
     {
      "title": "抛体运动的规律",
      "subs": []
     }
    ]
   },
   {
    "num": 6,
    "title": "圆周运动",
    "sections": [
     {
      "title": "圆周运动",
      "subs": []
     },
     {
      "title": "向心力",
      "subs": []
     },
     {
      "title": "向心加速度",
      "subs": []
     },
     {
      "title": "生活中的圆周运动",
      "subs": []
     }
    ]
   },
   {
    "num": 7,
    "title": "万有引力与宇宙航行",
    "sections": [
     {
      "title": "行星的运动",
      "subs": []
     },
     {
      "title": "万有引力定律",
      "subs": []
     },
     {
      "title": "万有引力理论的成就",
      "subs": []
     },
     {
      "title": "宇宙航行",
      "subs": []
     },
     {
      "title": "相对论时空观与牛顿力学的局限性",
      "subs": []
     }
    ]
   },
   {
    "num": 8,
    "title": "机械能守恒定律",
    "sections": [
     {
      "title": "功与功率",
      "subs": []
     },
     {
      "title": "重力势能",
      "subs": []
     },
     {
      "title": "动能和动能定理",
      "subs": []
     },
     {
      "title": "机械能守恒定律",
      "subs": []
     },
     {
      "title": "实验：验证机械能守恒定律",
      "subs": []
     }
    ]
   }
  ]
 },
 {
  "id": "p3",
  "subject": "physics",
  "name": "必修 第三册",
  "full": "普通高中教科书·物理 必修 第三册（人教版）",
  "chapters": [
   {
    "num": 9,
    "title": "静电场及其应用",
    "sections": [
     {
      "title": "电荷",
      "subs": []
     },
     {
      "title": "库仑定律",
      "subs": []
     },
     {
      "title": "电场 电场强度",
      "subs": []
     },
     {
      "title": "静电的防止与利用",
      "subs": []
     }
    ]
   },
   {
    "num": 10,
    "title": "静电场中的能量",
    "sections": [
     {
      "title": "电势能和电势",
      "subs": []
     },
     {
      "title": "电势差",
      "subs": []
     },
     {
      "title": "电势差与电场强度的关系",
      "subs": []
     },
     {
      "title": "电容器的电容",
      "subs": []
     },
     {
      "title": "带电粒子在电场中的运动",
      "subs": []
     }
    ]
   },
   {
    "num": 11,
    "title": "电路及其应用",
    "sections": [
     {
      "title": "电源和电流",
      "subs": []
     },
     {
      "title": "导体的电阻",
      "subs": []
     },
     {
      "title": "实验：导体电阻率的测量",
      "subs": []
     },
     {
      "title": "串联电路和并联电路",
      "subs": []
     },
     {
      "title": "实验：练习使用多用电表",
      "subs": []
     }
    ]
   },
   {
    "num": 12,
    "title": "电能 能量守恒定律",
    "sections": [
     {
      "title": "电路中的能量转化",
      "subs": []
     },
     {
      "title": "闭合电路的欧姆定律",
      "subs": []
     },
     {
      "title": "实验：电池电动势和内阻的测量",
      "subs": []
     },
     {
      "title": "能源与可持续发展",
      "subs": []
     }
    ]
   },
   {
    "num": 13,
    "title": "电磁感应与电磁波初步",
    "sections": [
     {
      "title": "磁场 磁感线",
      "subs": []
     },
     {
      "title": "磁感应强度 磁通量",
      "subs": []
     },
     {
      "title": "电磁感应现象及应用",
      "subs": []
     },
     {
      "title": "电磁波的发现及应用",
      "subs": []
     },
     {
      "title": "能量量子化",
      "subs": []
     }
    ]
   }
  ]
 },
 {
  "id": "p4",
  "subject": "physics",
  "name": "选择性必修 第一册",
  "full": "普通高中教科书·物理 选择性必修 第一册（人教版）",
  "chapters": [
   {
    "num": 1,
    "title": "动量守恒定律",
    "sections": [
     {
      "title": "动量",
      "subs": []
     },
     {
      "title": "动量定理",
      "subs": []
     },
     {
      "title": "动量守恒定律",
      "subs": []
     },
     {
      "title": "实验：验证动量守恒定律",
      "subs": []
     },
     {
      "title": "弹性碰撞和非弹性碰撞",
      "subs": []
     },
     {
      "title": "反冲现象 火箭",
      "subs": []
     }
    ]
   },
   {
    "num": 2,
    "title": "机械振动",
    "sections": [
     {
      "title": "简谐运动",
      "subs": []
     },
     {
      "title": "简谐运动的描述",
      "subs": []
     },
     {
      "title": "简谐运动的回复力和能量",
      "subs": []
     },
     {
      "title": "单摆",
      "subs": []
     },
     {
      "title": "实验：用单摆测量重力加速度",
      "subs": []
     },
     {
      "title": "受迫振动 共振",
      "subs": []
     }
    ]
   },
   {
    "num": 3,
    "title": "机械波",
    "sections": [
     {
      "title": "波的形成",
      "subs": []
     },
     {
      "title": "波的描述",
      "subs": []
     },
     {
      "title": "波的反射、折射和衍射",
      "subs": []
     },
     {
      "title": "波的干涉",
      "subs": []
     },
     {
      "title": "多普勒效应",
      "subs": []
     }
    ]
   },
   {
    "num": 4,
    "title": "光",
    "sections": [
     {
      "title": "光的折射",
      "subs": []
     },
     {
      "title": "全反射",
      "subs": []
     },
     {
      "title": "光的干涉",
      "subs": []
     },
     {
      "title": "实验：用双缝干涉测量光的波长",
      "subs": []
     },
     {
      "title": "光的衍射",
      "subs": []
     },
     {
      "title": "光的偏振 激光",
      "subs": []
     }
    ]
   }
  ]
 },
 {
  "id": "p5",
  "subject": "physics",
  "name": "选择性必修 第二册",
  "full": "普通高中教科书·物理 选择性必修 第二册（人教版）",
  "chapters": [
   {
    "num": 1,
    "title": "安培力与洛伦兹力",
    "sections": [
     {
      "title": "磁场对通电导线的作用力",
      "subs": []
     },
     {
      "title": "磁场对运动电荷的作用力",
      "subs": []
     },
     {
      "title": "带电粒子在匀强磁场中的运动",
      "subs": []
     },
     {
      "title": "质谱仪与回旋加速器",
      "subs": []
     }
    ]
   },
   {
    "num": 2,
    "title": "电磁感应",
    "sections": [
     {
      "title": "楞次定律",
      "subs": []
     },
     {
      "title": "法拉第电磁感应定律",
      "subs": []
     },
     {
      "title": "涡流、电磁阻尼和电磁驱动",
      "subs": []
     },
     {
      "title": "互感和自感",
      "subs": []
     }
    ]
   },
   {
    "num": 3,
    "title": "交变电流",
    "sections": [
     {
      "title": "交变电流",
      "subs": []
     },
     {
      "title": "交变电流的描述",
      "subs": []
     },
     {
      "title": "变压器",
      "subs": []
     },
     {
      "title": "电能的输送",
      "subs": []
     }
    ]
   },
   {
    "num": 4,
    "title": "电磁振荡与电磁波",
    "sections": [
     {
      "title": "电磁振荡",
      "subs": []
     },
     {
      "title": "电磁场与电磁波",
      "subs": []
     },
     {
      "title": "无线电波的发射和接收",
      "subs": []
     },
     {
      "title": "电磁波谱",
      "subs": []
     }
    ]
   },
   {
    "num": 5,
    "title": "传感器",
    "sections": [
     {
      "title": "认识传感器",
      "subs": []
     },
     {
      "title": "常见传感器的工作原理及应用",
      "subs": []
     },
     {
      "title": "利用传感器制作简单的自动控制装置",
      "subs": []
     }
    ]
   }
  ]
 },
 {
  "id": "p6",
  "subject": "physics",
  "name": "选择性必修 第三册",
  "full": "普通高中教科书·物理 选择性必修 第三册（人教版）",
  "chapters": [
   {
    "num": 1,
    "title": "分子动理论",
    "sections": [
     {
      "title": "分子动理论的基本内容",
      "subs": []
     },
     {
      "title": "实验：用油膜法估测油酸分子的大小",
      "subs": []
     },
     {
      "title": "分子运动速率分布规律",
      "subs": []
     },
     {
      "title": "分子动能和分子势能",
      "subs": []
     }
    ]
   },
   {
    "num": 2,
    "title": "气体、固体和液体",
    "sections": [
     {
      "title": "温度和温标",
      "subs": []
     },
     {
      "title": "气体的等温变化",
      "subs": []
     },
     {
      "title": "气体的等压变化和等容变化",
      "subs": []
     },
     {
      "title": "固体",
      "subs": []
     },
     {
      "title": "液体",
      "subs": []
     }
    ]
   },
   {
    "num": 3,
    "title": "热力学定律",
    "sections": [
     {
      "title": "功、热和内能的改变",
      "subs": []
     },
     {
      "title": "热力学第一定律",
      "subs": []
     },
     {
      "title": "能量守恒定律",
      "subs": []
     },
     {
      "title": "热力学第二定律",
      "subs": []
     }
    ]
   },
   {
    "num": 4,
    "title": "原子结构和波粒二象性",
    "sections": [
     {
      "title": "普朗克黑体辐射理论",
      "subs": []
     },
     {
      "title": "光电效应",
      "subs": []
     },
     {
      "title": "原子的核式结构模型",
      "subs": []
     },
     {
      "title": "氢原子光谱和玻尔的原子模型",
      "subs": []
     },
     {
      "title": "粒子的波动性和量子力学的建立",
      "subs": []
     }
    ]
   },
   {
    "num": 5,
    "title": "原子核",
    "sections": [
     {
      "title": "原子核的组成",
      "subs": []
     },
     {
      "title": "放射性元素的衰变",
      "subs": []
     },
     {
      "title": "核力与结合能",
      "subs": []
     },
     {
      "title": "核裂变与核聚变",
      "subs": []
     },
     {
      "title": "“基本”粒子",
      "subs": []
     }
    ]
   }
  ]
 },
 {
  "id": "b1",
  "subject": "biology",
  "name": "必修1 分子与细胞",
  "full": "普通高中教科书·生物学 必修1 分子与细胞（人教版）",
  "chapters": [
   {
    "num": 1,
    "title": "走近细胞",
    "sections": [
     {
      "title": "细胞是生命活动的基本单位",
      "subs": []
     },
     {
      "title": "细胞的多样性和统一性",
      "subs": []
     }
    ]
   },
   {
    "num": 2,
    "title": "组成细胞的分子",
    "sections": [
     {
      "title": "细胞中的元素和化合物",
      "subs": []
     },
     {
      "title": "细胞中的无机物",
      "subs": []
     },
     {
      "title": "细胞中的糖类和脂质",
      "subs": []
     },
     {
      "title": "蛋白质是生命活动的主要承担者",
      "subs": []
     },
     {
      "title": "核酸是遗传信息的携带者",
      "subs": []
     }
    ]
   },
   {
    "num": 3,
    "title": "细胞的基本结构",
    "sections": [
     {
      "title": "细胞膜的结构和功能",
      "subs": []
     },
     {
      "title": "细胞器之间的分工合作",
      "subs": []
     },
     {
      "title": "细胞核的结构和功能",
      "subs": []
     }
    ]
   },
   {
    "num": 4,
    "title": "细胞的物质输入和输出",
    "sections": [
     {
      "title": "被动运输",
      "subs": []
     },
     {
      "title": "主动运输与胞吞、胞吐",
      "subs": []
     }
    ]
   },
   {
    "num": 5,
    "title": "细胞的能量供应和利用",
    "sections": [
     {
      "title": "降低化学反应活化能的酶",
      "subs": [
       "酶的作用和本质",
       "酶的特性"
      ]
     },
     {
      "title": "细胞的能量“货币”ATP",
      "subs": []
     },
     {
      "title": "细胞呼吸的原理和应用",
      "subs": []
     },
     {
      "title": "光合作用与能量转化",
      "subs": [
       "捕获光能的色素和结构",
       "光合作用的原理和应用"
      ]
     }
    ]
   },
   {
    "num": 6,
    "title": "细胞的生命历程",
    "sections": [
     {
      "title": "细胞的增殖",
      "subs": []
     },
     {
      "title": "细胞的分化",
      "subs": []
     },
     {
      "title": "细胞的衰老和死亡",
      "subs": []
     }
    ]
   }
  ]
 },
 {
  "id": "b2",
  "subject": "biology",
  "name": "必修2 遗传与进化",
  "full": "普通高中教科书·生物学 必修2 遗传与进化（人教版）",
  "chapters": [
   {
    "num": 1,
    "title": "遗传因子的发现",
    "sections": [
     {
      "title": "孟德尔的豌豆杂交实验（一）",
      "subs": []
     },
     {
      "title": "孟德尔的豌豆杂交实验（二）",
      "subs": []
     }
    ]
   },
   {
    "num": 2,
    "title": "基因和染色体的关系",
    "sections": [
     {
      "title": "减数分裂和受精作用",
      "subs": [
       "减数分裂",
       "受精作用"
      ]
     },
     {
      "title": "基因在染色体上",
      "subs": []
     },
     {
      "title": "伴性遗传",
      "subs": []
     }
    ]
   },
   {
    "num": 3,
    "title": "基因的本质",
    "sections": [
     {
      "title": "DNA 是主要的遗传物质",
      "subs": []
     },
     {
      "title": "DNA 的结构",
      "subs": []
     },
     {
      "title": "DNA 的复制",
      "subs": []
     },
     {
      "title": "基因通常是有遗传效应的 DNA 片段",
      "subs": []
     }
    ]
   },
   {
    "num": 4,
    "title": "基因的表达",
    "sections": [
     {
      "title": "基因指导蛋白质的合成",
      "subs": []
     },
     {
      "title": "基因表达与性状的关系",
      "subs": []
     }
    ]
   },
   {
    "num": 5,
    "title": "基因突变及其他变异",
    "sections": [
     {
      "title": "基因突变和基因重组",
      "subs": []
     },
     {
      "title": "染色体变异",
      "subs": []
     },
     {
      "title": "人类遗传病",
      "subs": []
     }
    ]
   },
   {
    "num": 6,
    "title": "生物的进化",
    "sections": [
     {
      "title": "生物有共同祖先的证据",
      "subs": []
     },
     {
      "title": "自然选择与适应的形成",
      "subs": []
     },
     {
      "title": "种群基因组成的变化与物种的形成",
      "subs": [
       "种群基因组成的变化",
       "隔离在物种形成中的作用"
      ]
     },
     {
      "title": "协同进化与生物多样性的形成",
      "subs": []
     }
    ]
   }
  ]
 },
 {
  "id": "b3",
  "subject": "biology",
  "name": "选择性必修1 稳态与调节",
  "full": "普通高中教科书·生物学 选择性必修1 稳态与调节（人教版）",
  "chapters": [
   {
    "num": 1,
    "title": "人体的内环境与稳态",
    "sections": [
     {
      "title": "细胞生活的环境",
      "subs": []
     },
     {
      "title": "内环境的稳态",
      "subs": []
     }
    ]
   },
   {
    "num": 2,
    "title": "神经调节",
    "sections": [
     {
      "title": "神经调节的结构基础",
      "subs": []
     },
     {
      "title": "神经调节的基本方式",
      "subs": []
     },
     {
      "title": "神经冲动的产生和传导",
      "subs": []
     },
     {
      "title": "神经系统的分级调节",
      "subs": []
     },
     {
      "title": "人脑的高级功能",
      "subs": []
     }
    ]
   },
   {
    "num": 3,
    "title": "体液调节",
    "sections": [
     {
      "title": "激素与内分泌系统",
      "subs": []
     },
     {
      "title": "激素调节的过程",
      "subs": []
     },
     {
      "title": "体液调节与神经调节的关系",
      "subs": []
     }
    ]
   },
   {
    "num": 4,
    "title": "免疫调节",
    "sections": [
     {
      "title": "免疫系统的组成和功能",
      "subs": []
     },
     {
      "title": "特异性免疫",
      "subs": []
     },
     {
      "title": "免疫失调",
      "subs": []
     },
     {
      "title": "免疫学的应用",
      "subs": []
     }
    ]
   },
   {
    "num": 5,
    "title": "植物生命活动的调节",
    "sections": [
     {
      "title": "植物生长素",
      "subs": []
     },
     {
      "title": "其他植物激素",
      "subs": []
     },
     {
      "title": "植物生长调节剂的应用",
      "subs": []
     },
     {
      "title": "环境因素参与调节植物的生命活动",
      "subs": []
     }
    ]
   }
  ]
 },
 {
  "id": "b4",
  "subject": "biology",
  "name": "选择性必修2 生物与环境",
  "full": "普通高中教科书·生物学 选择性必修2 生物与环境（人教版）",
  "chapters": [
   {
    "num": 1,
    "title": "种群及其动态",
    "sections": [
     {
      "title": "种群的数量特征",
      "subs": []
     },
     {
      "title": "种群数量的变化",
      "subs": []
     },
     {
      "title": "影响种群数量变化的因素",
      "subs": []
     }
    ]
   },
   {
    "num": 2,
    "title": "群落及其演替",
    "sections": [
     {
      "title": "群落的结构",
      "subs": []
     },
     {
      "title": "群落的主要类型",
      "subs": []
     },
     {
      "title": "群落的演替",
      "subs": []
     }
    ]
   },
   {
    "num": 3,
    "title": "生态系统及其稳定性",
    "sections": [
     {
      "title": "生态系统的结构",
      "subs": []
     },
     {
      "title": "生态系统的能量流动",
      "subs": []
     },
     {
      "title": "生态系统的物质循环",
      "subs": []
     },
     {
      "title": "生态系统的信息传递",
      "subs": []
     },
     {
      "title": "生态系统的稳定性",
      "subs": []
     }
    ]
   },
   {
    "num": 4,
    "title": "人与环境",
    "sections": [
     {
      "title": "人类活动对生态环境的影响",
      "subs": []
     },
     {
      "title": "生物多样性及其保护",
      "subs": []
     },
     {
      "title": "生态工程",
      "subs": [
       "生态工程的基本原理",
       "生态工程的实例和发展前景"
      ]
     }
    ]
   }
  ]
 },
 {
  "id": "b5",
  "subject": "biology",
  "name": "选择性必修3 生物技术与工程",
  "full": "普通高中教科书·生物学 选择性必修3 生物技术与工程（人教版）",
  "chapters": [
   {
    "num": 1,
    "title": "发酵工程",
    "sections": [
     {
      "title": "传统发酵技术的应用",
      "subs": []
     },
     {
      "title": "微生物的培养技术及应用",
      "subs": [
       "微生物的基本培养技术",
       "微生物的选择培养和计数"
      ]
     },
     {
      "title": "发酵工程及其应用",
      "subs": []
     }
    ]
   },
   {
    "num": 2,
    "title": "细胞工程",
    "sections": [
     {
      "title": "植物细胞工程",
      "subs": [
       "植物细胞工程的基本技术",
       "植物细胞工程的应用"
      ]
     },
     {
      "title": "动物细胞工程",
      "subs": [
       "动物细胞培养",
       "动物细胞融合技术与单克隆抗体",
       "动物体细胞核移植技术和克隆动物"
      ]
     },
     {
      "title": "胚胎工程",
      "subs": [
       "胚胎工程的理论基础",
       "胚胎工程技术及其应用"
      ]
     }
    ]
   },
   {
    "num": 3,
    "title": "基因工程",
    "sections": [
     {
      "title": "重组 DNA 技术的基本工具",
      "subs": []
     },
     {
      "title": "基因工程的基本操作程序",
      "subs": []
     },
     {
      "title": "基因工程的应用",
      "subs": []
     },
     {
      "title": "蛋白质工程的原理和应用",
      "subs": []
     }
    ]
   },
   {
    "num": 4,
    "title": "生物技术的安全性与伦理问题",
    "sections": [
     {
      "title": "转基因产品的安全性",
      "subs": []
     },
     {
      "title": "关注生殖性克隆人",
      "subs": []
     },
     {
      "title": "禁止生物武器",
      "subs": []
     }
    ]
   }
  ]
 }
,
{
 "id": "g1",
 "subject": "geo",
 "name": "必修 第一册",
 "full": "普通高中教科书·地理必修第一册（人教版）",
 "chapters": [
  {
   "num": 1,
   "title": "宇宙中的地球",
   "sections": [
    {
     "title": "地球的宇宙环境",
     "subs": []
    },
    {
     "title": "太阳对地球的影响",
     "subs": []
    },
    {
     "title": "地球的历史",
     "subs": []
    },
    {
     "title": "地球的圈层结构",
     "subs": []
    }
   ]
  },
  {
   "num": 2,
   "title": "地球上的大气",
   "sections": [
    {
     "title": "大气的组成和垂直分层",
     "subs": []
    },
    {
     "title": "大气受热过程和大气运动",
     "subs": []
    }
   ]
  },
  {
   "num": 3,
   "title": "地球上的水",
   "sections": [
    {
     "title": "水循环",
     "subs": []
    },
    {
     "title": "海水的性质",
     "subs": []
    },
    {
     "title": "海水的运动",
     "subs": []
    }
   ]
  },
  {
   "num": 4,
   "title": "地貌",
   "sections": [
    {
     "title": "常见地貌类型",
     "subs": []
    },
    {
     "title": "地貌的观察",
     "subs": []
    }
   ]
  },
  {
   "num": 5,
   "title": "植被与土壤",
   "sections": [
    {
     "title": "植被",
     "subs": []
    },
    {
     "title": "土壤",
     "subs": []
    }
   ]
  },
  {
   "num": 6,
   "title": "自然灾害",
   "sections": [
    {
     "title": "气象与地质灾害",
     "subs": []
    },
    {
     "title": "防灾减灾",
     "subs": []
    },
    {
     "title": "地理信息技术在防灾减灾中的应用",
     "subs": []
    }
   ]
  }
 ]
},
{
 "id": "g2",
 "subject": "geo",
 "name": "必修 第二册",
 "full": "普通高中教科书·地理必修第二册（人教版）",
 "chapters": [
  {
   "num": 1,
   "title": "人口",
   "sections": [
    {
     "title": "人口分布",
     "subs": []
    },
    {
     "title": "人口迁移",
     "subs": []
    },
    {
     "title": "人口容量",
     "subs": []
    }
   ]
  },
  {
   "num": 2,
   "title": "乡村和城镇",
   "sections": [
    {
     "title": "乡村和城镇空间结构",
     "subs": []
    },
    {
     "title": "城镇化",
     "subs": []
    },
    {
     "title": "地域文化与城乡景观",
     "subs": []
    }
   ]
  },
  {
   "num": 3,
   "title": "产业区位因素",
   "sections": [
    {
     "title": "农业区位因素及其变化",
     "subs": []
    },
    {
     "title": "工业区位因素及其变化",
     "subs": []
    },
    {
     "title": "服务业区位因素及其变化",
     "subs": []
    }
   ]
  },
  {
   "num": 4,
   "title": "交通运输布局与区域发展",
   "sections": [
    {
     "title": "区域发展对交通运输布局的影响",
     "subs": []
    },
    {
     "title": "交通运输布局对区域发展的影响",
     "subs": []
    }
   ]
  },
  {
   "num": 5,
   "title": "环境与发展",
   "sections": [
    {
     "title": "人类面临的主要环境问题",
     "subs": []
    },
    {
     "title": "走向人地协调——可持续发展",
     "subs": []
    }
   ]
  }
 ]
},
{
 "id": "g3",
 "subject": "geo",
 "name": "选择性必修1 自然地理基础",
 "full": "普通高中教科书·地理选择性必修1 自然地理基础（人教版）",
 "chapters": [
  {
   "num": 1,
   "title": "地球的运动",
   "sections": [
    {
     "title": "地球的自转与公转",
     "subs": []
    },
    {
     "title": "地球运动的地理意义",
     "subs": []
    }
   ]
  },
  {
   "num": 2,
   "title": "地表形态的塑造",
   "sections": [
    {
     "title": "塑造地表形态的力量",
     "subs": []
    },
    {
     "title": "构造地貌的形成",
     "subs": []
    },
    {
     "title": "河流地貌的发育",
     "subs": []
    },
    {
     "title": "综合：地表形态对人类活动的影响",
     "subs": []
    }
   ]
  },
  {
   "num": 3,
   "title": "大气的运动",
   "sections": [
    {
     "title": "常见天气系统",
     "subs": []
    },
    {
     "title": "气压带和风带",
     "subs": []
    },
    {
     "title": "气压带和风带对气候的影响",
     "subs": []
    }
   ]
  },
  {
   "num": 4,
   "title": "水的运动",
   "sections": [
    {
     "title": "陆地水体及其相互关系",
     "subs": []
    },
    {
     "title": "洋流",
     "subs": []
    },
    {
     "title": "海—气相互作用",
     "subs": []
    }
   ]
  },
  {
   "num": 5,
   "title": "自然环境的整体性与差异性",
   "sections": [
    {
     "title": "自然环境的整体性",
     "subs": []
    },
    {
     "title": "自然环境的差异性",
     "subs": []
    },
    {
     "title": "综合：地理过程与综合思维方法",
     "subs": []
    }
   ]
  }
 ]
},
{
 "id": "g4",
 "subject": "geo",
 "name": "选择性必修2 区域发展",
 "full": "普通高中教科书·地理选择性必修2 区域发展（人教版）",
 "chapters": [
  {
   "num": 1,
   "title": "认识区域",
   "sections": [
    {
     "title": "多种多样的区域",
     "subs": []
    },
    {
     "title": "区域整体性和关联性",
     "subs": []
    }
   ]
  },
  {
   "num": 2,
   "title": "资源、环境与区域发展",
   "sections": [
    {
     "title": "区域发展的自然环境基础",
     "subs": []
    },
    {
     "title": "生态脆弱区的综合治理",
     "subs": []
    },
    {
     "title": "资源枯竭型城市的转型发展",
     "subs": []
    }
   ]
  },
  {
   "num": 3,
   "title": "城市、产业与区域发展",
   "sections": [
    {
     "title": "城市的辐射功能",
     "subs": []
    },
    {
     "title": "产业结构转型升级",
     "subs": []
    }
   ]
  },
  {
   "num": 4,
   "title": "区际联系与区域协调发展",
   "sections": [
    {
     "title": "流域内的协作开发与保护",
     "subs": []
    },
    {
     "title": "资源跨区域调配",
     "subs": []
    },
    {
     "title": "产业转移与国际合作",
     "subs": []
    }
   ]
  }
 ]
},
{
 "id": "g5",
 "subject": "geo",
 "name": "选择性必修3 资源、环境与国家安全",
 "full": "普通高中教科书·地理选择性必修3 资源、环境与国家安全（人教版）",
 "chapters": [
  {
   "num": 1,
   "title": "自然资源与人类活动",
   "sections": [
    {
     "title": "自然资源及其利用",
     "subs": []
    }
   ]
  },
  {
   "num": 2,
   "title": "资源安全与国家安全",
   "sections": [
    {
     "title": "耕地资源与国家粮食安全",
     "subs": []
    },
    {
     "title": "水资源与国家安全",
     "subs": []
    },
    {
     "title": "矿产资源与国家安全",
     "subs": []
    },
    {
     "title": "石油资源与能源安全",
     "subs": []
    },
    {
     "title": "海洋空间资源与国家安全",
     "subs": []
    }
   ]
  },
  {
   "num": 3,
   "title": "环境安全与国家安全",
   "sections": [
    {
     "title": "环境安全问题及其影响",
     "subs": []
    },
    {
     "title": "环境污染与污染物跨国转移",
     "subs": []
    },
    {
     "title": "生态退化与国家安全",
     "subs": []
    },
    {
     "title": "全球气候变化与国家安全",
     "subs": []
    }
   ]
  },
  {
   "num": 4,
   "title": "生态文明建设与国家安全",
   "sections": [
    {
     "title": "自然保护区与生态安全",
     "subs": []
    },
    {
     "title": "保障资源环境领域的国家安全",
     "subs": []
    },
    {
     "title": "生态文明建设与人类命运共同体",
     "subs": []
    }
   ]
  }
 ]
}
];

const CROSS_LINKS = [
 {
  "a": "p1c2",
  "b": "p2c5",
  "kind": "发展",
  "note": "匀变速直线规律推广到曲线运动（运动的合成与分解）"
 },
 {
  "a": "p1c3",
  "b": "p1c4",
  "kind": "基础",
  "note": "受力分析是牛顿运动定律应用的前提"
 },
 {
  "a": "p1c4",
  "b": "p4c1",
  "kind": "发展",
  "note": "牛顿定律在碰撞问题中发展为动量守恒定律"
 },
 {
  "a": "p1c1",
  "b": "p2c6",
  "kind": "发展",
  "note": "直线运动的描述方法推广到圆周运动"
 },
 {
  "a": "p1c3",
  "b": "p3c9",
  "kind": "类比",
  "note": "库仑定律与万有引力定律形式相同，均与距离平方成反比"
 },
 {
  "a": "p2c7",
  "b": "p3c9",
  "kind": "类比",
  "note": "引力场与静电场同为平方反比场，规律可类比迁移"
 },
 {
  "a": "p2c8",
  "b": "p3c12",
  "kind": "贯通",
  "note": "机械能守恒推广为普遍的能量守恒定律"
 },
 {
  "a": "p3c13",
  "b": "p5c2",
  "kind": "发展",
  "note": "电磁感应现象深化为法拉第电磁感应定律"
 },
 {
  "a": "p3c13",
  "b": "p5c1",
  "kind": "发展",
  "note": "磁场与磁感线延伸到安培力与洛伦兹力"
 },
 {
  "a": "p4c2",
  "b": "p4c3",
  "kind": "基础",
  "note": "简谐运动是研究机械波的形成与传播的基础"
 },
 {
  "a": "p4c2",
  "b": "p6c4",
  "kind": "类比",
  "note": "从宏观振动到微观世界的周期性与量子化"
 },
 {
  "a": "p4c4",
  "b": "p6c4",
  "kind": "贯通",
  "note": "光的干涉衍射与光电效应共同揭示波粒二象性"
 },
 {
  "a": "p6c4",
  "b": "p4c4",
  "kind": "贯通",
  "note": "波粒二象性统一光的波动性与粒子性"
 },
 {
  "a": "p5c2",
  "b": "p5c3",
  "kind": "基础",
  "note": "电磁感应定律是交变电流产生的原理"
 },
 {
  "a": "p5c4",
  "b": "p3c13",
  "kind": "发展",
  "note": "LC电路电磁振荡产生电磁波"
 },
 {
  "a": "p6c3",
  "b": "p3c12",
  "kind": "贯通",
  "note": "热力学第一定律即包含内能的能量守恒定律"
 },
 {
  "a": "p6c4",
  "b": "p6c5",
  "kind": "发展",
  "note": "原子结构模型引出原子核的组成与变化"
 },
 {
  "a": "p6c5",
  "b": "p4c1",
  "kind": "联系",
  "note": "核反应与碰撞问题都用到动量与能量守恒"
 },
 {
  "a": "b1c1",
  "b": "b1c3",
  "kind": "基础",
  "note": "细胞学说过渡到细胞的显微与亚显微结构"
 },
 {
  "a": "b1c2",
  "b": "b1c5",
  "kind": "基础",
  "note": "蛋白质、核酸等分子是代谢与遗传的物质基础"
 },
 {
  "a": "b1c3",
  "b": "b1c4",
  "kind": "基础",
  "note": "细胞膜结构决定物质进出细胞的方式"
 },
 {
  "a": "b1c5",
  "b": "b1c6",
  "kind": "基础",
  "note": "细胞呼吸与光合作用提供生命活动的能量"
 },
 {
  "a": "b1c6",
  "b": "b2c2",
  "kind": "发展",
  "note": "有丝分裂延伸到减数分裂"
 },
 {
  "a": "b2c1",
  "b": "b2c2",
  "kind": "发展",
  "note": "孟德尔遗传因子后来定位于染色体上"
 },
 {
  "a": "b2c2",
  "b": "b2c3",
  "kind": "发展",
  "note": "基因位于染色体上，DNA是基因的物质实体"
 },
 {
  "a": "b2c3",
  "b": "b2c4",
  "kind": "发展",
  "note": "DNA结构决定复制与转录翻译"
 },
 {
  "a": "b2c4",
  "b": "b2c5",
  "kind": "发展",
  "note": "基因表达的改变体现为基因突变与性状变异"
 },
 {
  "a": "b2c5",
  "b": "b2c6",
  "kind": "发展",
  "note": "突变与基因重组为进化提供原材料"
 },
 {
  "a": "b2c2",
  "b": "b1c6",
  "kind": "联系",
  "note": "减数分裂是特殊的有丝分裂"
 },
 {
  "a": "b3c1",
  "b": "b3c2",
  "kind": "基础",
  "note": "内环境稳态依靠神经-体液-免疫调节网络"
 },
 {
  "a": "b3c2",
  "b": "b3c3",
  "kind": "联系",
  "note": "神经调节与体液调节协同维持稳态"
 },
 {
  "a": "b3c4",
  "b": "b3c1",
  "kind": "联系",
  "note": "免疫系统监控内环境成分的稳定"
 },
 {
  "a": "b3c4",
  "b": "b5c4",
  "kind": "联系",
  "note": "免疫学原理用于评估生物技术的安全性"
 },
 {
  "a": "b4c1",
  "b": "b4c2",
  "kind": "发展",
  "note": "种群动态构成群落的结构基础"
 },
 {
  "a": "b4c2",
  "b": "b4c3",
  "kind": "发展",
  "note": "群落与无机环境构成生态系统"
 },
 {
  "a": "b4c3",
  "b": "b1c5",
  "kind": "联系",
  "note": "生态系统的能量流动源于光合作用固定太阳能"
 },
 {
  "a": "b4c3",
  "b": "b2c6",
  "kind": "联系",
  "note": "生物多样性是协同进化的结果"
 },
 {
  "a": "b5c1",
  "b": "b5c2",
  "kind": "基础",
  "note": "微生物培养技术支撑细胞与基因工程"
 },
 {
  "a": "b5c3",
  "b": "b2c3",
  "kind": "应用",
  "note": "基因工程以DNA结构与功能为理论基础"
 },
 {
  "a": "b5c3",
  "b": "b2c4",
  "kind": "应用",
  "note": "蛋白质工程建立在基因表达原理之上"
 },
 {
  "a": "b5c2",
  "b": "b1c3",
  "kind": "应用",
  "note": "动植物细胞工程以细胞结构与全能性为基础"
 },
 {
  "a": "p3c12",
  "b": "b1c5",
  "kind": "跨科",
  "note": "能量守恒视角下的细胞能量转化"
 },
 {
  "a": "p6c3",
  "b": "b1c5",
  "kind": "跨科",
  "note": "热力学定律约束细胞代谢的能量效率"
 }
];
