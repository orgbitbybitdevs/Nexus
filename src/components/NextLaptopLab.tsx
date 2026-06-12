import { useMemo, useState } from 'react';

type Lang = 'es' | 'en' | 'zh';
type Tier = {
  name: string;
  processor: string;
  processorExamples: string[];
  ram: string;
  storage: string;
  graphics: string;
  display: string;
  battery: string;
  upgradability: string;
  expected: string;
};

type Option = { id: string; label: string };
type LabCategory = 'academic' | 'programming' | 'engineering' | 'creative' | 'ai';

const panelClass = 'rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]';
const chipBase = 'rounded-full px-4 py-2 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-white/35';
const fieldClass = 'w-full rounded-2xl border border-white/10 bg-white/[0.065] px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-white/32 focus:border-white/30 focus:ring-2 focus:ring-white/10';
const optionClass = 'bg-white text-black';

const processorProfiles: Record<LabCategory, { label: string; note: string; warning?: string; tiers: [string[], string[], string[]] }> = {
  academic: {
    label: 'Uso académico general',
    note: 'Para el uso seleccionado no necesitas un procesador de gama extrema. Conviene priorizar batería, RAM, SSD y una construcción confiable.',
    tiers: [
      ['Intel Core i5-8350U', 'AMD Ryzen 5 4500U', 'Apple M1'],
      ['Intel Core i5-1235U', 'AMD Ryzen 5 PRO 5650U', 'Apple M2'],
      ['Intel Core Ultra 5 125U', 'AMD Ryzen 7 8840U', 'Apple M4'],
    ],
  },
  programming: {
    label: 'Programación y ciencias de la computación',
    note: 'Para desarrollo, bases de datos y Docker ligero, busca buen rendimiento sostenido, 16 GB de RAM y SSD NVMe antes de pagar por una gama extrema.',
    tiers: [
      ['Intel Core i5-10210U', 'AMD Ryzen 5 PRO 4650U', 'Apple M1'],
      ['Intel Core i5-1335U', 'AMD Ryzen 7 7840U', 'Apple M3'],
      ['Intel Core Ultra 7 255H', 'AMD Ryzen AI 9 HX 370', 'Apple M4 Pro'],
    ],
  },
  engineering: {
    label: 'Ingeniería, mecatrónica y electrónica',
    note: 'Para MATLAB, simuladores, programación embebida y CAD ligero, conviene subir a procesadores de clase H/HS cuando el equipo trabajará con cargas largas.',
    warning: 'Para SolidWorks, AutoCAD 3D, simulación pesada o modelado complejo, el procesador no es suficiente: también debe evaluarse la GPU dedicada y la compatibilidad del software.',
    tiers: [
      ['Intel Core i5-11400H', 'AMD Ryzen 5 5600H', 'AMD Ryzen 7 4800H'],
      ['Intel Core i7-12700H', 'AMD Ryzen 7 7840HS', 'Intel Core Ultra 7 155H'],
      ['Intel Core Ultra 9 285H', 'AMD Ryzen AI 9 HX 370', 'AMD Ryzen AI Max 390'],
    ],
  },
  creative: {
    label: 'Diseño, arquitectura y creación de contenido',
    note: 'Para edición de video, 3D y multimedia, el procesador importa, pero la GPU, la pantalla, la RAM y los motores de codificación pueden pesar más en la experiencia real.',
    tiers: [
      ['Intel Core i7-11800H', 'AMD Ryzen 7 5800H', 'Apple M1'],
      ['Intel Core Ultra 7 155H', 'AMD Ryzen 7 8845HS', 'Apple M4'],
      ['Intel Core Ultra 9 285H', 'AMD Ryzen AI Max 390', 'Apple M4 Pro'],
    ],
  },
  ai: {
    label: 'IA local y ciencia de datos',
    note: 'Para IA local, la memoria RAM, la memoria de video y la GPU suelen importar más que subir solamente de Core i7 a Core i9.',
    tiers: [
      ['Intel Core i7-12700H', 'AMD Ryzen 7 6800H', 'Apple M2'],
      ['Intel Core Ultra 7 255H', 'AMD Ryzen AI 9 HX 370', 'Apple M4'],
      ['Intel Core Ultra 9 285HX', 'AMD Ryzen AI Max+ 395', 'Apple M4 Pro'],
    ],
  },
};

const processorProfileText: Record<Lang, Record<LabCategory, { label: string; note: string; warning?: string }>> = {
  es: {
    academic: {
      label: 'Uso académico general',
      note: 'Para el uso seleccionado no necesitas un procesador de gama extrema. Conviene priorizar batería, RAM, SSD y una construcción confiable.',
    },
    programming: {
      label: 'Programación y ciencias de la computación',
      note: 'Para desarrollo, bases de datos y Docker ligero, busca buen rendimiento sostenido, 16 GB de RAM y SSD NVMe antes de pagar por una gama extrema.',
    },
    engineering: {
      label: 'Ingeniería, mecatrónica y electrónica',
      note: 'Para MATLAB, simuladores, programación embebida y CAD ligero, conviene subir a procesadores de clase H/HS cuando el equipo trabajará con cargas largas.',
      warning: 'Para SolidWorks, AutoCAD 3D, simulación pesada o modelado complejo, el procesador no es suficiente: también debe evaluarse la GPU dedicada y la compatibilidad del software.',
    },
    creative: {
      label: 'Diseño, arquitectura y creación de contenido',
      note: 'Para edición de video, 3D y multimedia, el procesador importa, pero la GPU, la pantalla, la RAM y los motores de codificación pueden pesar más en la experiencia real.',
    },
    ai: {
      label: 'IA local y ciencia de datos',
      note: 'Para IA local, la memoria RAM, la memoria de video y la GPU suelen importar más que subir solamente de Core i7 a Core i9.',
    },
  },
  en: {
    academic: {
      label: 'General academic use',
      note: 'For the selected use, you do not need an extreme processor. Prioritize battery life, RAM, SSD storage and reliable construction.',
    },
    programming: {
      label: 'Programming and computer science',
      note: 'For development, databases and light Docker work, look for sustained performance, 16 GB RAM and NVMe SSD before paying for an extreme tier.',
    },
    engineering: {
      label: 'Engineering, mechatronics and electronics',
      note: 'For MATLAB, simulators, embedded programming and light CAD, H/HS-class processors are useful when the laptop will run long workloads.',
      warning: 'For SolidWorks, AutoCAD 3D, heavy simulation or complex modeling, the processor is not enough: dedicated GPU and software compatibility must also be evaluated.',
    },
    creative: {
      label: 'Design, architecture and content creation',
      note: 'For video editing, 3D and multimedia work, the processor matters, but GPU, display, RAM and media engines can matter more in real use.',
    },
    ai: {
      label: 'Local AI and data science',
      note: 'For local AI, RAM, video memory and GPU usually matter more than simply moving from Core i7 to Core i9.',
    },
  },
  zh: {
    academic: {
      label: '通用学习用途',
      note: '根据你的用途，不需要极高端处理器。更应该优先考虑电池、内存、SSD 和可靠的机身做工。',
    },
    programming: {
      label: '编程与计算机科学',
      note: '用于开发、数据库和轻量 Docker 时，先关注持续性能、16 GB 内存和 NVMe SSD，再考虑更高端处理器。',
    },
    engineering: {
      label: '工程、机电与电子',
      note: '用于 MATLAB、仿真、嵌入式编程和轻量 CAD 时，如果需要长时间运行任务，H/HS 级处理器更合适。',
      warning: '对于 SolidWorks、AutoCAD 3D、重型仿真或复杂建模，仅看处理器不够，还需要评估独立显卡和软件兼容性。',
    },
    creative: {
      label: '设计、建筑与内容创作',
      note: '对于视频剪辑、3D 和多媒体工作，处理器很重要，但显卡、屏幕、内存和媒体编码能力也会明显影响体验。',
    },
    ai: {
      label: '本地 AI 与数据科学',
      note: '对于本地 AI，内存、显存和 GPU 通常比单纯从 Core i7 升到 Core i9 更重要。',
    },
  },
};

const copy = {
  es: {
    meta: 'Laboratorio independiente de NEXT',
    title: 'NEXT Laptop Lab',
    subtitle: 'Descubre qué equipo necesitas realmente.',
    positioning: 'Primero entiende qué necesitas. Después decide qué comprar.',
    noBrands: 'Sin marcas. Sin hype. Solo lo que necesitas.',
    profile: 'Perfil',
    area: 'Área',
    use: 'Uso principal',
    lifestyle: 'Estilo de uso',
    software: 'Programas',
    budget: 'Presupuesto y preferencias',
    result: 'Resultado del análisis',
    downloadPng: 'Descargar PNG',
    downloadPdf: 'Descargar PDF',
    share: 'Compartir análisis',
    guidance: 'Solicitar orientación',
    reset: 'Limpiar selección',
    manualCareer: 'Escribe tu carrera o interés',
    manualSoftware: 'Otro programa',
    budgetPlaceholder: 'Presupuesto aproximado',
    refurbished: 'Nuevo, reacondicionado o cualquiera',
    years: 'Vida útil esperada',
    priority: 'Prioridad principal',
    minimum: 'Mínimo funcional',
    recommended: 'Recomendado',
    ideal: 'Ideal a largo plazo',
    component: 'Componente',
    processor: 'Procesador',
    ram: 'RAM',
    storage: 'Almacenamiento',
    graphics: 'Gráficos',
    display: 'Pantalla',
    battery: 'Batería',
    upgradability: 'Actualización',
    expected: 'Vida útil esperada',
    analysis: 'Análisis',
    warning: 'Gastos innecesarios',
    compromise: 'Compromisos por presupuesto',
    selectMultiple: 'Puedes seleccionar varias opciones.',
    shareUnavailable: 'Tu navegador no puede compartir archivos directamente. Descarga el PNG y compártelo manualmente.',
    recommendedSetup: 'Configuración recomendada',
    processorRecommended: 'Procesador recomendado',
    equivalents: 'o equivalentes superiores',
    undefined: 'Por definir',
    priorityCanvas: 'PRIORIDAD',
    analysisId: 'ID DE ANÁLISIS',
    generatedBy: 'Generado por NEXT Laptop Lab',
    memory: 'Memoria',
    expectedUse: 'Uso esperado',
    balancedPriority: 'un equilibrio entre rendimiento, almacenamiento y construcción',
    dedicatedGpu: 'sí conviene evaluar gráficos dedicados y buena ventilación antes de comprar.',
    noDedicatedGpu: 'no necesitas una tarjeta gráfica dedicada; invertir en ella puede aumentar el costo y reducir autonomía sin darte una ventaja clara.',
    unnecessaryGpu: 'Evita pagar por una GPU muy potente si tus proyectos no incluyen render, CAD pesado, video avanzado, 3D, IA local o videojuegos exigentes.',
    appearanceWarning: 'Evita elegir solo por procesador, marca o apariencia. Para tu perfil, batería, RAM, SSD y calidad de pantalla pueden importar más.',
    noBudget: 'Sin presupuesto definido, conviene comparar por especificaciones y vida útil antes de filtrar por precio.',
    budgetCompromiseStart: 'El presupuesto no cambia lo que técnicamente necesitas. Si el monto es limitado, prioriza el nivel recomendado en RAM/SSD y acepta compromisos en pantalla, materiales o potencia gráfica.',
    buyPreference: 'Preferencia de compra',
    mainPriorityLead: 'Tu prioridad principal debe ser',
    selectedActivities: 'Para las actividades seleccionadas',
    recommendAtLeast: 'Recomendamos al menos',
    ramLongLife: '8 GB como mínimo y 16 GB si quieres más vida útil',
    sturdyBuild: 'SSD NVMe y una construcción resistente.',
    priorityRam: 'memoria RAM',
    priorityBatteryWeight: 'batería y peso',
    priorityGraphicsCooling: 'gráficos y enfriamiento',
    priorityPorts: 'puertos y conectividad',
    priorityUpgradeable: 'RAM/SSD actualizables',
    basicGpu: 'GPU dedicada básica si aplica',
    modernIntegrated: 'Integrados modernos',
    midGpu: 'GPU dedicada de gama media',
    premiumIntegrated: 'Integrados premium',
    dedicatedByLoad: 'GPU dedicada según carga',
    desirable: 'Deseable',
    ramSsdDesirable: 'RAM/SSD deseable',
    ramSsdExpandable: 'RAM y SSD ampliables',
    ssdExpandable: 'SSD ampliable preferido',
    priorityUpgrade: 'Prioritaria',
    goodBuildStorage: 'Buena construcción y SSD amplio',
    realHours: 'horas reales',
    betterBrightnessColor: 'Mejor brillo y color',
    efficientDisplay: 'IPS/OLED eficiente',
    largeQualityDisplay: 'Pantalla amplia de buena calidad',
    hours: 'horas',
    ramRecommended: '16 GB recomendado',
    years2to3: '2-3 años',
    years3to4: '3-4 años',
    years4: '4 años',
    years4to6: '4-6 años',
    years5to7: '5-7 años',
  },
  en: {
    meta: 'Independent NEXT tool',
    title: 'NEXT Laptop Lab',
    subtitle: 'Discover what computer you really need.',
    positioning: 'Understand what you need first. Then decide what to buy.',
    noBrands: 'No brands. No hype. Just what you need.',
    profile: 'Profile',
    area: 'Area',
    use: 'Main use',
    lifestyle: 'How you will use it',
    software: 'Programs',
    budget: 'Budget and preferences',
    result: 'Analysis result',
    downloadPng: 'Download PNG',
    downloadPdf: 'Download PDF',
    share: 'Share analysis',
    guidance: 'Request guidance',
    reset: 'Clear selection',
    manualCareer: 'Write your career or interest',
    manualSoftware: 'Other program',
    budgetPlaceholder: 'Approximate budget',
    refurbished: 'New, refurbished or either',
    years: 'Expected useful life',
    priority: 'Main priority',
    minimum: 'Functional minimum',
    recommended: 'Recommended',
    ideal: 'Long-term ideal',
    component: 'Component',
    processor: 'Processor',
    ram: 'RAM',
    storage: 'Storage',
    graphics: 'Graphics',
    display: 'Display',
    battery: 'Battery',
    upgradability: 'Upgradability',
    expected: 'Expected use',
    analysis: 'Analysis',
    warning: 'Unnecessary spending',
    compromise: 'Budget compromises',
    selectMultiple: 'You can select multiple options.',
    shareUnavailable: 'Your browser cannot share files directly. Download the PNG and share it manually.',
    recommendedSetup: 'Recommended setup',
    processorRecommended: 'Recommended processor',
    equivalents: 'or higher equivalents',
    undefined: 'To be defined',
    priorityCanvas: 'PRIORITY',
    analysisId: 'ANALYSIS ID',
    generatedBy: 'Generated by NEXT Laptop Lab',
    memory: 'Memory',
    expectedUse: 'Expected use',
    balancedPriority: 'a balance of performance, storage and build quality',
    dedicatedGpu: 'you should evaluate dedicated graphics and good cooling before buying.',
    noDedicatedGpu: 'you do not need a dedicated graphics card; paying for one can raise cost and reduce battery life without a clear benefit.',
    unnecessaryGpu: 'Avoid paying for a very powerful GPU if your projects do not include rendering, heavy CAD, advanced video, 3D, local AI or demanding games.',
    appearanceWarning: 'Avoid choosing only by processor, brand or appearance. For your profile, battery, RAM, SSD and display quality may matter more.',
    noBudget: 'Without a defined budget, compare specifications and useful life before filtering by price.',
    budgetCompromiseStart: 'Budget does not change what you technically need. If the amount is limited, prioritize the recommended RAM/SSD level and accept compromises in display, materials or graphics power.',
    buyPreference: 'Purchase preference',
    mainPriorityLead: 'Your main priority should be',
    selectedActivities: 'For the selected activities',
    recommendAtLeast: 'We recommend at least',
    ramLongLife: '8 GB minimum and 16 GB if you want longer useful life',
    sturdyBuild: 'NVMe SSD and sturdy construction.',
    priorityRam: 'RAM memory',
    priorityBatteryWeight: 'battery life and weight',
    priorityGraphicsCooling: 'graphics and cooling',
    priorityPorts: 'ports and connectivity',
    priorityUpgradeable: 'upgradeable RAM/SSD',
    basicGpu: 'Basic dedicated GPU if needed',
    modernIntegrated: 'Modern integrated graphics',
    midGpu: 'Mid-range dedicated GPU',
    premiumIntegrated: 'Premium integrated graphics',
    dedicatedByLoad: 'Dedicated GPU according to workload',
    desirable: 'Desirable',
    ramSsdDesirable: 'RAM/SSD desirable',
    ramSsdExpandable: 'Upgradeable RAM and SSD',
    ssdExpandable: 'Upgradeable SSD preferred',
    priorityUpgrade: 'Priority',
    goodBuildStorage: 'Good build and ample SSD',
    realHours: 'real hours',
    betterBrightnessColor: 'Better brightness and color',
    efficientDisplay: 'efficient IPS/OLED',
    largeQualityDisplay: 'Large quality display',
    hours: 'hours',
    ramRecommended: '16 GB recommended',
    years2to3: '2-3 years',
    years3to4: '3-4 years',
    years4: '4 years',
    years4to6: '4-6 years',
    years5to7: '5-7 years',
  },
  zh: {
    meta: 'NEXT 独立工具',
    title: 'NEXT Laptop Lab',
    subtitle: '了解你真正需要的电脑配置。',
    positioning: '先理解需求，再决定购买。',
    noBrands: '无品牌推荐。无噱头。只讲真实需求。',
    profile: '个人情况',
    area: '领域',
    use: '主要用途',
    lifestyle: '使用方式',
    software: '软件',
    budget: '预算与偏好',
    result: '分析结果',
    downloadPng: '下载 PNG',
    downloadPdf: '下载 PDF',
    share: '分享分析',
    guidance: '寻求指导',
    reset: '清除选择',
    manualCareer: '填写专业或兴趣',
    manualSoftware: '其他软件',
    budgetPlaceholder: '大致预算',
    refurbished: '新机、翻新机或都可以',
    years: '预期使用年限',
    priority: '首要优先级',
    minimum: '可用最低配置',
    recommended: '推荐配置',
    ideal: '长期理想配置',
    component: '部件',
    processor: '处理器',
    ram: '内存',
    storage: '存储',
    graphics: '显卡',
    display: '屏幕',
    battery: '电池',
    upgradability: '可升级性',
    expected: '预期使用',
    analysis: '分析',
    warning: '不必要开销',
    compromise: '预算取舍',
    selectMultiple: '可多选。',
    shareUnavailable: '当前浏览器不能直接分享文件。请下载 PNG 后手动分享。',
    recommendedSetup: '推荐配置',
    processorRecommended: '推荐处理器',
    equivalents: '或同级及更高配置',
    undefined: '待确定',
    priorityCanvas: '优先级',
    analysisId: '分析 ID',
    generatedBy: '由 NEXT Laptop Lab 生成',
    memory: '内存',
    expectedUse: '预期使用',
    balancedPriority: '性能、存储和做工之间的平衡',
    dedicatedGpu: '购买前应评估独立显卡和散热能力。',
    noDedicatedGpu: '你不需要独立显卡；为它额外付费可能会增加成本并降低续航，却没有明显收益。',
    unnecessaryGpu: '如果项目不涉及渲染、重型 CAD、高级视频、3D、本地 AI 或高要求游戏，避免为过强的 GPU 付费。',
    appearanceWarning: '不要只按处理器、品牌或外观选择。对你的情况来说，电池、内存、SSD 和屏幕质量可能更重要。',
    noBudget: '如果尚未确定预算，先按规格和使用寿命比较，再按价格筛选。',
    budgetCompromiseStart: '预算不会改变你的技术需求。如果预算有限，优先保证推荐级别的 RAM/SSD，再接受屏幕、材质或图形性能上的取舍。',
    buyPreference: '购买偏好',
    mainPriorityLead: '你的首要优先级应该是',
    selectedActivities: '对于所选用途',
    recommendAtLeast: '建议至少选择',
    ramLongLife: '最低 8 GB；如果想用更久，建议 16 GB',
    sturdyBuild: 'NVMe SSD 和可靠机身做工。',
    priorityRam: '内存',
    priorityBatteryWeight: '续航和重量',
    priorityGraphicsCooling: '图形性能和散热',
    priorityPorts: '接口和连接能力',
    priorityUpgradeable: '可升级 RAM/SSD',
    basicGpu: '需要时选择基础独立显卡',
    modernIntegrated: '现代集成显卡',
    midGpu: '中端独立显卡',
    premiumIntegrated: '高端集成显卡',
    dedicatedByLoad: '按工作负载选择独立显卡',
    desirable: '建议具备',
    ramSsdDesirable: '建议可升级 RAM/SSD',
    ramSsdExpandable: 'RAM 和 SSD 可升级',
    ssdExpandable: '优先选择可升级 SSD',
    priorityUpgrade: '优先考虑',
    goodBuildStorage: '良好做工和充足 SSD',
    realHours: '小时真实续航',
    betterBrightnessColor: '更好的亮度与色彩',
    efficientDisplay: '高效 IPS/OLED',
    largeQualityDisplay: '高质量大屏',
    hours: '小时',
    ramRecommended: '建议 16 GB',
    years2to3: '2-3 年',
    years3to4: '3-4 年',
    years4: '4 年',
    years4to6: '4-6 年',
    years5to7: '5-7 年',
  },
};

const profiles: Option[] = [
  { id: 'secondary', label: 'Estudiante de secundaria' },
  { id: 'high-school', label: 'Estudiante de preparatoria' },
  { id: 'university', label: 'Estudiante universitario' },
  { id: 'professional', label: 'Profesional' },
  { id: 'unknown-study', label: 'Aún no sé qué estudiar' },
  { id: 'other', label: 'Otro' },
];

const areas: Option[] = [
  { id: 'unsure', label: 'No estoy seguro' },
  { id: 'health', label: 'Medicina y ciencias de la salud' },
  { id: 'gastronomy', label: 'Gastronomía' },
  { id: 'business', label: 'Administración y negocios' },
  { id: 'design-architecture', label: 'Diseño y arquitectura' },
  { id: 'communication', label: 'Comunicación y creación de contenido' },
  { id: 'education', label: 'Educación y humanidades' },
  { id: 'engineering', label: 'Ingeniería y manufactura' },
  { id: 'mechatronics', label: 'Mecatrónica, electrónica y robótica' },
  { id: 'software-ai', label: 'Software, IA y ciencia de datos' },
  { id: 'cybersecurity', label: 'Ciberseguridad y redes' },
  { id: 'audiovisual', label: 'Arte y producción audiovisual' },
  { id: 'other', label: 'Otra' },
];

const uses: Option[] = [
  { id: 'docs', label: 'Documentos, presentaciones y navegación' },
  { id: 'online', label: 'Clases en línea e investigación' },
  { id: 'programming', label: 'Programación' },
  { id: 'databases', label: 'Bases de datos' },
  { id: 'virtual-machines', label: 'Máquinas virtuales' },
  { id: 'graphic-design', label: 'Diseño gráfico' },
  { id: 'photo', label: 'Edición de fotografía' },
  { id: 'video', label: 'Edición de video' },
  { id: '3d', label: 'Modelado 3D' },
  { id: 'cad', label: 'CAD y simulación' },
  { id: 'architecture', label: 'Arquitectura' },
  { id: 'data-science', label: 'Ciencia de datos' },
  { id: 'cloud-ai', label: 'Inteligencia artificial en la nube' },
  { id: 'local-ai', label: 'Inteligencia artificial ejecutada localmente' },
  { id: 'iot', label: 'Electrónica, Arduino, ESP32 e IoT' },
  { id: 'music', label: 'Producción musical' },
  { id: 'business-admin', label: 'Administración de negocios' },
  { id: 'gaming', label: 'Videojuegos' },
  { id: 'unknown', label: 'Todavía no lo sé' },
];

const lifestyles: Option[] = [
  { id: 'daily-carry', label: 'La llevaré todos los días' },
  { id: 'home', label: 'Permanecerá principalmente en casa' },
  { id: 'battery', label: 'Necesito mucha batería' },
  { id: 'large-screen', label: 'Prefiero una pantalla grande' },
  { id: 'lightweight', label: 'Necesito algo ligero' },
  { id: 'durable', label: 'Quiero que sea resistente' },
  { id: 'upgradeable', label: 'Quiero actualizar RAM y almacenamiento' },
  { id: 'long-life', label: 'Necesito que dure varios años' },
  { id: 'ports', label: 'Necesito monitores o dispositivos' },
  { id: 'windows', label: 'Prefiero Windows' },
  { id: 'linux', label: 'Prefiero Linux' },
  { id: 'macos', label: 'Prefiero macOS' },
  { id: 'no-os', label: 'No tengo preferencia' },
];

const software: Option[] = [
  { id: 'office', label: 'Office' },
  { id: 'vscode', label: 'Visual Studio Code' },
  { id: 'android-studio', label: 'Android Studio' },
  { id: 'autocad', label: 'AutoCAD' },
  { id: 'solidworks', label: 'SolidWorks' },
  { id: 'matlab', label: 'MATLAB' },
  { id: 'blender', label: 'Blender' },
  { id: 'photoshop', label: 'Adobe Photoshop' },
  { id: 'premiere', label: 'Premiere Pro' },
  { id: 'resolve', label: 'DaVinci Resolve' },
  { id: 'docker', label: 'Docker' },
  { id: 'vms', label: 'Máquinas virtuales' },
  { id: 'ai-tools', label: 'Herramientas de IA' },
];

const budgetOptions = ['Nuevo', 'Reacondicionado', 'Cualquiera'];
const yearOptions = ['2 años', '4 años', '6+ años'];
const priorityOptions = ['precio', 'rendimiento', 'duración', 'portabilidad', 'batería', 'capacidad de actualización'];

const optionLabels: Record<Lang, Record<string, Record<string, string>>> = {
  es: {},
  en: {
    profile: {
      secondary: 'Middle school student',
      'high-school': 'High school student',
      university: 'University student',
      professional: 'Professional',
      'unknown-study': 'I still do not know what to study',
      other: 'Other',
    },
    area: {
      unsure: 'Not sure',
      health: 'Medicine and health sciences',
      gastronomy: 'Gastronomy',
      business: 'Business and administration',
      'design-architecture': 'Design and architecture',
      communication: 'Communication and content creation',
      education: 'Education and humanities',
      engineering: 'Engineering and manufacturing',
      mechatronics: 'Mechatronics, electronics and robotics',
      'software-ai': 'Software, AI and data science',
      cybersecurity: 'Cybersecurity and networks',
      audiovisual: 'Art and audiovisual production',
      other: 'Other',
    },
    use: {
      docs: 'Documents, presentations and browsing',
      online: 'Online classes and research',
      programming: 'Programming',
      databases: 'Databases',
      'virtual-machines': 'Virtual machines',
      'graphic-design': 'Graphic design',
      photo: 'Photo editing',
      video: 'Video editing',
      '3d': '3D modeling',
      cad: 'CAD and simulation',
      architecture: 'Architecture',
      'data-science': 'Data science',
      'cloud-ai': 'Cloud-based artificial intelligence',
      'local-ai': 'Locally executed artificial intelligence',
      iot: 'Electronics, Arduino, ESP32 and IoT',
      music: 'Music production',
      'business-admin': 'Business administration',
      gaming: 'Video games',
      unknown: 'I still do not know',
    },
    lifestyle: {
      'daily-carry': 'I will carry it every day',
      home: 'It will mostly stay at home',
      battery: 'I need long battery life',
      'large-screen': 'I prefer a large screen',
      lightweight: 'I need something lightweight',
      durable: 'I want it to be durable',
      upgradeable: 'I want to upgrade RAM and storage',
      'long-life': 'I need it to last several years',
      ports: 'I need monitors or external devices',
      windows: 'I prefer Windows',
      linux: 'I prefer Linux',
      macos: 'I prefer macOS',
      'no-os': 'No preference',
    },
    software: {
      office: 'Office',
      vscode: 'Visual Studio Code',
      'android-studio': 'Android Studio',
      autocad: 'AutoCAD',
      solidworks: 'SolidWorks',
      matlab: 'MATLAB',
      blender: 'Blender',
      photoshop: 'Adobe Photoshop',
      premiere: 'Premiere Pro',
      resolve: 'DaVinci Resolve',
      docker: 'Docker',
      vms: 'Virtual machines',
      'ai-tools': 'AI tools',
    },
    budget: { Nuevo: 'New', Reacondicionado: 'Refurbished', Cualquiera: 'Either' },
    years: { '2 años': '2 years', '4 años': '4 years', '6+ años': '6+ years' },
    priority: {
      precio: 'price',
      rendimiento: 'performance',
      duración: 'durability',
      portabilidad: 'portability',
      batería: 'battery',
      'capacidad de actualización': 'upgradability',
    },
  },
  zh: {
    profile: {
      secondary: '初中生',
      'high-school': '高中生',
      university: '大学生',
      professional: '专业人士',
      'unknown-study': '还不知道学什么',
      other: '其他',
    },
    area: {
      unsure: '不确定',
      health: '医学与健康科学',
      gastronomy: '烹饪与餐饮',
      business: '管理与商业',
      'design-architecture': '设计与建筑',
      communication: '传播与内容创作',
      education: '教育与人文',
      engineering: '工程与制造',
      mechatronics: '机电、电子与机器人',
      'software-ai': '软件、AI 与数据科学',
      cybersecurity: '网络安全与网络',
      audiovisual: '艺术与影视制作',
      other: '其他',
    },
    use: {
      docs: '文档、演示和浏览',
      online: '在线课程和研究',
      programming: '编程',
      databases: '数据库',
      'virtual-machines': '虚拟机',
      'graphic-design': '平面设计',
      photo: '照片编辑',
      video: '视频剪辑',
      '3d': '3D 建模',
      cad: 'CAD 与仿真',
      architecture: '建筑',
      'data-science': '数据科学',
      'cloud-ai': '云端人工智能',
      'local-ai': '本地运行人工智能',
      iot: '电子、Arduino、ESP32 与 IoT',
      music: '音乐制作',
      'business-admin': '商业管理',
      gaming: '电子游戏',
      unknown: '还不确定',
    },
    lifestyle: {
      'daily-carry': '每天携带',
      home: '主要放在家里',
      battery: '需要长续航',
      'large-screen': '偏好大屏幕',
      lightweight: '需要轻便',
      durable: '希望耐用',
      upgradeable: '希望升级内存和存储',
      'long-life': '需要使用多年',
      ports: '需要连接显示器或设备',
      windows: '偏好 Windows',
      linux: '偏好 Linux',
      macos: '偏好 macOS',
      'no-os': '无偏好',
    },
    software: {
      office: 'Office',
      vscode: 'Visual Studio Code',
      'android-studio': 'Android Studio',
      autocad: 'AutoCAD',
      solidworks: 'SolidWorks',
      matlab: 'MATLAB',
      blender: 'Blender',
      photoshop: 'Adobe Photoshop',
      premiere: 'Premiere Pro',
      resolve: 'DaVinci Resolve',
      docker: 'Docker',
      vms: '虚拟机',
      'ai-tools': 'AI 工具',
    },
    budget: { Nuevo: '新机', Reacondicionado: '翻新机', Cualquiera: '都可以' },
    years: { '2 años': '2 年', '4 años': '4 年', '6+ años': '6 年以上' },
    priority: {
      precio: '价格',
      rendimiento: '性能',
      duración: '耐用性',
      portabilidad: '便携性',
      batería: '电池',
      'capacidad de actualización': '可升级性',
    },
  },
};

function localizeOptions(options: Option[], lang: Lang, group: string) {
  const labels = optionLabels[lang]?.[group] ?? {};
  return options.map((option) => ({ ...option, label: labels[option.id] ?? option.label }));
}

function localizeValue(value: string, lang: Lang, group: string) {
  return optionLabels[lang]?.[group]?.[value] ?? value;
}

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

function hasAny(list: string[], ids: string[]) {
  return ids.some((id) => list.includes(id));
}

function getCategory(area: string, selectedUses: string[], selectedSoftware: string[]): LabCategory {
  if (hasAny(selectedUses, ['local-ai', 'data-science']) || hasAny(selectedSoftware, ['ai-tools'])) return 'ai';
  if (
    hasAny(selectedUses, ['video', '3d', 'graphic-design', 'photo', 'architecture', 'gaming']) ||
    hasAny(selectedSoftware, ['photoshop', 'premiere', 'resolve', 'blender']) ||
    ['design-architecture', 'communication', 'audiovisual'].includes(area)
  ) return 'creative';
  if (
    hasAny(selectedUses, ['cad', 'iot']) ||
    hasAny(selectedSoftware, ['autocad', 'solidworks', 'matlab']) ||
    ['engineering', 'mechatronics'].includes(area)
  ) return 'engineering';
  if (
    hasAny(selectedUses, ['programming', 'databases', 'virtual-machines', 'cloud-ai']) ||
    hasAny(selectedSoftware, ['vscode', 'android-studio', 'docker', 'vms']) ||
    ['software-ai', 'cybersecurity'].includes(area)
  ) return 'programming';
  return 'academic';
}

function lineWrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > width && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = word;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}

function makeId() {
  return `NEXT-${Math.random().toString(16).slice(2, 6).toUpperCase()}${Math.random().toString(16).slice(2, 4).toUpperCase()}`;
}

function buildPdfFromPng(dataUrl: string) {
  const binary = atob(dataUrl.split(',')[1]);
  const imageBytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const encoder = new TextEncoder();
  const content = 'q\n612 0 0 765 0 14 cm\n/Im0 Do\nQ\n';
  const toBuffer = (text: string) => {
    const bytes = encoder.encode(text);
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  };
  type PdfPart = ArrayBuffer;
  const objectParts: PdfPart[][] = [
    [toBuffer('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')],
    [toBuffer('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n')],
    [toBuffer('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n')],
    [
      toBuffer(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width 1080 /Height 1350 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`),
      imageBytes.buffer.slice(imageBytes.byteOffset, imageBytes.byteOffset + imageBytes.byteLength),
      toBuffer('\nendstream\nendobj\n'),
    ],
    [toBuffer(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`)],
  ];

  let offset = 9;
  const chunks: PdfPart[] = [toBuffer('%PDF-1.4\n')];
  const offsets = [0];
  objectParts.forEach((parts) => {
    offsets.push(offset);
    parts.forEach((part) => {
      chunks.push(part);
      offset += part.byteLength;
    });
  });
  const xrefOffset = offset;
  let xref = `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((item) => {
    xref += `${String(item).padStart(10, '0')} 00000 n \n`;
  });
  xref += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  chunks.push(toBuffer(xref));
  return new Blob(chunks, { type: 'application/pdf' });
}

export default function NextLaptopLab({ lang = 'es' }: { lang?: Lang }) {
  const c = copy[lang] ?? copy.es;
  const profileOptions = localizeOptions(profiles, lang, 'profile');
  const areaOptions = localizeOptions(areas, lang, 'area');
  const useOptions = localizeOptions(uses, lang, 'use');
  const lifestyleOptions = localizeOptions(lifestyles, lang, 'lifestyle');
  const softwareOptions = localizeOptions(software, lang, 'software');
  const [profile, setProfile] = useState('university');
  const [area, setArea] = useState('software-ai');
  const [career, setCareer] = useState('');
  const [selectedUses, setSelectedUses] = useState<string[]>(['programming', 'online']);
  const [selectedLife, setSelectedLife] = useState<string[]>(['daily-carry', 'battery', 'long-life']);
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>(['office', 'vscode']);
  const [otherSoftware, setOtherSoftware] = useState('');
  const [budget, setBudget] = useState('');
  const [buyType, setBuyType] = useState('Cualquiera');
  const [years, setYears] = useState('4 años');
  const [priority, setPriority] = useState('duración');
  const [analysisId] = useState(makeId);
  const [message, setMessage] = useState('');

  const selectedUseLabels = useOptions.filter((item) => selectedUses.includes(item.id)).map((item) => item.label);
  const selectedSoftwareLabels = softwareOptions.filter((item) => selectedSoftware.includes(item.id)).map((item) => item.label);

  const result = useMemo(() => {
    const category = getCategory(area, selectedUses, selectedSoftware);
    const processorProfile = { ...processorProfiles[category], ...processorProfileText[lang][category] };
    let intensity = 1;
    if (profile === 'professional' || profile === 'university') intensity += 1;
    if (years === '6+ años') intensity += 1;
    if (hasAny(selectedUses, ['programming', 'databases', 'data-science', 'iot'])) intensity += 1;
    if (hasAny(selectedUses, ['virtual-machines', 'cad', 'architecture', 'video', '3d', 'local-ai', 'gaming'])) intensity += 2;
    if (hasAny(selectedSoftware, ['android-studio', 'docker', 'vms', 'matlab'])) intensity += 1;
    if (hasAny(selectedSoftware, ['autocad', 'solidworks', 'blender', 'premiere', 'resolve'])) intensity += 2;
    intensity = Math.min(intensity, 6);

    const needsGpu = hasAny(selectedUses, ['video', '3d', 'cad', 'architecture', 'local-ai', 'gaming']) || hasAny(selectedSoftware, ['solidworks', 'blender', 'premiere', 'resolve']);
    const needsRam = hasAny(selectedUses, ['virtual-machines', 'data-science', 'local-ai']) || hasAny(selectedSoftware, ['android-studio', 'docker', 'vms']);
    const mobile = hasAny(selectedLife, ['daily-carry', 'battery', 'lightweight']);
    const ports = selectedLife.includes('ports');
    const upgradeable = selectedLife.includes('upgradeable') || selectedLife.includes('long-life');

    const tiers: Tier[] = [
      {
        name: c.minimum,
        processor: `${processorProfile.tiers[0][0]} ${c.equivalents}`,
        processorExamples: processorProfile.tiers[0],
        ram: needsRam ? '16 GB' : '8 GB',
        storage: '256 GB SSD',
        graphics: needsGpu ? c.basicGpu : c.modernIntegrated,
        display: mobile ? '13-14" Full HD' : 'Full HD',
        battery: mobile ? `6+ ${c.realHours}` : `4+ ${c.hours}`,
        upgradability: upgradeable ? c.ramSsdDesirable : c.desirable,
        expected: years === '2 años' ? c.years2to3 : c.years3to4,
      },
      {
        name: c.recommended,
        processor: `${processorProfile.tiers[1][0]} ${c.equivalents}`,
        processorExamples: processorProfile.tiers[1],
        ram: needsRam || intensity >= 4 ? '16 GB' : c.ramRecommended,
        storage: intensity >= 4 ? '1 TB NVMe' : '512 GB NVMe',
        graphics: needsGpu ? c.midGpu : c.modernIntegrated,
        display: mobile ? '14" Full HD IPS' : '15-16" Full HD IPS',
        battery: mobile ? `7+ ${c.realHours}` : `5+ ${c.hours}`,
        upgradability: upgradeable ? c.ramSsdExpandable : c.ssdExpandable,
        expected: years === '6+ años' ? c.years4to6 : c.years4,
      },
      {
        name: c.ideal,
        processor: `${processorProfile.tiers[2][0]} ${c.equivalents}`,
        processorExamples: processorProfile.tiers[2],
        ram: needsRam || intensity >= 4 ? '32 GB' : '16-32 GB',
        storage: '1 TB NVMe',
        graphics: needsGpu ? c.dedicatedByLoad : c.premiumIntegrated,
        display: needsGpu ? c.betterBrightnessColor : mobile ? `14" ${c.efficientDisplay}` : c.largeQualityDisplay,
        battery: mobile ? `8+ ${c.realHours}` : `6+ ${c.hours}`,
        upgradability: upgradeable ? c.priorityUpgrade : c.goodBuildStorage,
        expected: years === '6+ años' ? c.years5to7 : c.years4to6,
      },
    ];

    const priorities = [
      needsRam ? c.priorityRam : null,
      mobile ? c.priorityBatteryWeight : null,
      needsGpu ? c.priorityGraphicsCooling : null,
      ports ? c.priorityPorts : null,
      upgradeable ? c.priorityUpgradeable : null,
    ].filter(Boolean).join(', ');

    const analysis = `${c.mainPriorityLead} ${priorities || c.balancedPriority}. ${processorProfile.note} ${c.selectedActivities}, ${needsGpu ? c.dedicatedGpu : c.noDedicatedGpu} ${c.recommendAtLeast} ${needsRam || intensity >= 4 ? '16 GB RAM' : c.ramLongLife}, ${c.sturdyBuild}`;
    const warning = needsGpu
      ? processorProfile.warning ?? c.unnecessaryGpu
      : c.appearanceWarning;
    const compromise = budget
      ? `${c.budgetCompromiseStart} ${c.buyPreference}: ${localizeValue(buyType, lang, 'budget')}.`
      : c.noBudget;

    return { tiers, analysis, warning, compromise, needsGpu, category, processorProfile };
  }, [area, profile, years, selectedUses, selectedSoftware, selectedLife, budget, buyType, lang, c]);

  function selectedText() {
    return {
      profile: profileOptions.find((item) => item.id === profile)?.label ?? '',
      area: career || areaOptions.find((item) => item.id === area)?.label || '',
      uses: selectedUseLabels.concat(otherSoftware ? [otherSoftware] : []).slice(0, 5).join(' · ') || c.undefined,
      software: selectedSoftwareLabels.concat(otherSoftware ? [otherSoftware] : []).join(' · ') || c.undefined,
    };
  }

  function drawReport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    const info = selectedText();
    const tier = result.tiers[1];
    ctx.fillStyle = '#050506';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 58px Inter, Arial, sans-serif';
    ctx.fillText('NEXT Laptop Lab', 76, 112);
    ctx.fillStyle = 'rgba(255,255,255,0.58)';
    ctx.font = '700 28px Inter, Arial, sans-serif';
    ctx.fillText(c.noBrands, 76, 158);
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 2;
    ctx.strokeRect(64, 205, 952, 980);

    ctx.fillStyle = 'rgba(255,255,255,0.42)';
    ctx.font = '900 21px Inter, Arial, sans-serif';
    ctx.fillText(c.profile.toUpperCase(), 96, 265);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px Inter, Arial, sans-serif';
    lineWrap(ctx, info.area || info.profile, 96, 312, 860, 46);

    ctx.fillStyle = 'rgba(255,255,255,0.42)';
    ctx.font = '900 21px Inter, Arial, sans-serif';
    ctx.fillText(c.use.toUpperCase(), 96, 420);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 27px Inter, Arial, sans-serif';
    lineWrap(ctx, info.uses, 96, 462, 840, 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 34px Inter, Arial, sans-serif';
    ctx.fillText(c.recommendedSetup, 96, 585);
    const rows = [
      [c.processor, tier.processor],
      [c.memory, tier.ram],
      [c.storage, tier.storage],
      [c.graphics, tier.graphics],
      [c.display, tier.display],
      [c.battery, tier.battery],
      [c.upgradability, tier.upgradability],
      [c.expectedUse, tier.expected],
    ];
    let y = 652;
    rows.forEach(([label, value]) => {
      ctx.fillStyle = 'rgba(255,255,255,0.48)';
      ctx.font = '800 24px Inter, Arial, sans-serif';
      ctx.fillText(label, 96, y);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 27px Inter, Arial, sans-serif';
      ctx.fillText(value, 390, y);
      y += 56;
    });

    ctx.fillStyle = 'rgba(255,255,255,0.42)';
    ctx.font = '900 21px Inter, Arial, sans-serif';
    ctx.fillText(c.priorityCanvas, 96, 1115);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px Inter, Arial, sans-serif';
    lineWrap(ctx, priorityOptions.includes(priority) ? localizeValue(priority, lang, 'priority') : localizeValue('duración', lang, 'priority'), 96, 1160, 800, 34);
    ctx.fillStyle = 'rgba(255,255,255,0.42)';
    ctx.font = '900 21px Inter, Arial, sans-serif';
    ctx.fillText(`${c.analysisId}   ${analysisId}`, 96, 1250);
    ctx.fillText(c.generatedBy, 96, 1294);
    return canvas.toDataURL('image/jpeg', 0.95);
  }

  function download(url: string, name: string) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
  }

  async function handleShare() {
    const dataUrl = drawReport();
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `${analysisId}.jpg`, { type: 'image/jpeg' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: 'NEXT Laptop Lab', text: c.noBrands, files: [file] });
    } else {
      setMessage(c.shareUnavailable);
    }
  }

  function reset() {
    setProfile('university');
    setArea('software-ai');
    setCareer('');
    setSelectedUses(['programming', 'online']);
    setSelectedLife(['daily-carry', 'battery', 'long-life']);
    setSelectedSoftware(['office', 'vscode']);
    setOtherSoftware('');
    setBudget('');
    setBuyType('Cualquiera');
    setYears('4 años');
    setPriority('duración');
    setMessage('');
  }

  const reportText = encodeURIComponent(
    lang === 'en'
      ? `Hello, I want guidance with my NEXT Laptop Lab analysis ${analysisId}.`
      : lang === 'zh'
        ? `你好，我想咨询我的 NEXT Laptop Lab 分析 ${analysisId}。`
        : `Hola, quiero orientación con mi análisis ${analysisId} de NEXT Laptop Lab.`
  );

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <section className="px-5 sm:px-6 pt-32 pb-14 sm:pt-40 sm:pb-20">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
                <img src="/next/lab.png" alt="" className="h-full w-full scale-125 object-contain" loading="eager" decoding="async" />
              </div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white/38">{c.meta}</p>
            </div>
            <h1 className="mb-7 text-[clamp(3.2rem,10vw,7.3rem)] font-black leading-[0.92] tracking-normal">{c.title}</h1>
            <p className="mb-8 max-w-[620px] text-[1.1rem] font-medium leading-relaxed text-white/66 md:text-[1.35rem]">{c.subtitle}</p>
            <p className="text-2xl font-black leading-tight md:text-4xl">{c.positioning}</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white p-6 text-black shadow-[0_28px_100px_rgba(0,0,0,0.35)] md:p-8">
            <div className="mb-6 flex items-start justify-between gap-5">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-black/38">{c.result}</p>
                <h2 className="text-3xl font-black leading-tight">{c.recommendedSetup}</h2>
              </div>
              <span className="rounded-full bg-[#050506] px-4 py-2 text-xs font-black text-white">{analysisId}</span>
            </div>
            <div className="grid gap-3 text-sm font-bold text-black/64 sm:grid-cols-2">
              <SummaryPill label="RAM" value={result.tiers[1].ram} />
              <SummaryPill label="SSD" value={result.tiers[1].storage} />
              <SummaryPill label="CPU" value={result.tiers[1].processorExamples[0]} />
              <SummaryPill label="GPU" value={result.tiers[1].graphics} />
            </div>
            <p className="mt-6 rounded-2xl bg-black/[0.04] px-4 py-3 text-sm font-bold leading-relaxed text-black/58">{result.processorProfile.label}</p>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-[1180px] grid-cols-1 gap-7 px-5 pb-24 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-5">
          <Question title={`1. ${c.profile}`} options={profileOptions} value={profile} onChange={setProfile} />
          <Question title={`2. ${c.area}`} options={areaOptions} value={area} onChange={setArea} />
          <input className={fieldClass} value={career} onChange={(event) => setCareer(event.target.value)} placeholder={c.manualCareer} />
          <MultiQuestion title={`3. ${c.use}`} hint={c.selectMultiple} options={useOptions} values={selectedUses} onChange={(id) => setSelectedUses(toggle(selectedUses, id))} />
          <MultiQuestion title={`4. ${c.lifestyle}`} hint={c.selectMultiple} options={lifestyleOptions} values={selectedLife} onChange={(id) => setSelectedLife(toggle(selectedLife, id))} />
          <MultiQuestion title={`5. ${c.software}`} hint={c.selectMultiple} options={softwareOptions} values={selectedSoftware} onChange={(id) => setSelectedSoftware(toggle(selectedSoftware, id))} />
          <input className={fieldClass} value={otherSoftware} onChange={(event) => setOtherSoftware(event.target.value)} placeholder={c.manualSoftware} />
          <div className={panelClass}>
            <h2 className="mb-4 text-xl font-black">6. {c.budget}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={fieldClass} value={budget} onChange={(event) => setBudget(event.target.value)} placeholder={c.budgetPlaceholder} />
              <select className={fieldClass} value={buyType} onChange={(event) => setBuyType(event.target.value)}>
                {budgetOptions.map((item) => <option className={optionClass} key={item} value={item}>{localizeValue(item, lang, 'budget')}</option>)}
              </select>
              <select className={fieldClass} value={years} onChange={(event) => setYears(event.target.value)}>
                {yearOptions.map((item) => <option className={optionClass} key={item} value={item}>{localizeValue(item, lang, 'years')}</option>)}
              </select>
              <select className={fieldClass} value={priority} onChange={(event) => setPriority(event.target.value)}>
                {priorityOptions.map((item) => <option className={optionClass} key={item} value={item}>{localizeValue(item, lang, 'priority')}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white text-black shadow-[0_28px_100px_rgba(0,0,0,0.32)]">
            <div className="border-b border-black/10 p-5 md:p-7">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-black/38">{c.result}</p>
              <h2 className="text-3xl font-black tracking-normal md:text-5xl">{c.title}</h2>
              <p className="mt-3 font-bold text-black/56">{c.noBrands}</p>
            </div>
            <ProcessorRecommendation tiers={result.tiers} title={c.processorRecommended} equivalents={c.equivalents} />
            <div className="overflow-x-auto p-5 md:p-7">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="pb-3 font-black">{c.component}</th>
                    {result.tiers.map((tier) => <th key={tier.name} className="pb-3 font-black">{tier.name}</th>)}
                  </tr>
                </thead>
                <tbody className="[&_td]:border-b [&_td]:border-black/8 [&_td]:py-3 [&_td]:pr-4">
                  {[
                    [c.processor, 'processor'],
                    [c.ram, 'ram'],
                    [c.storage, 'storage'],
                    [c.graphics, 'graphics'],
                    [c.display, 'display'],
                    [c.battery, 'battery'],
                    [c.upgradability, 'upgradability'],
                  ].map(([label, key]) => (
                    <tr key={key}>
                      <td className="font-black text-black">{label}</td>
                      {result.tiers.map((tier) => <td key={tier.name} className="font-semibold text-black/62">{tier[key as keyof Tier]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-4 border-t border-black/10 p-5 md:p-7">
              <TextBlock title={c.analysis} body={result.analysis} />
              <TextBlock title={c.warning} body={result.warning} />
              <TextBlock title={c.compromise} body={result.compromise} />
              <div className="grid gap-3 sm:grid-cols-2">
                <button className="rounded-full bg-[#050506] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-black/85" onClick={() => download(drawReport(), `${analysisId}.jpg`)}>{c.downloadPng}</button>
                <button className="rounded-full bg-[#050506] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-black/85" onClick={() => {
                  const url = URL.createObjectURL(buildPdfFromPng(drawReport()));
                  download(url, `${analysisId}.pdf`);
                  URL.revokeObjectURL(url);
                }}>{c.downloadPdf}</button>
                <button className="rounded-full border border-black/12 px-5 py-3 text-sm font-black text-black transition-colors hover:bg-black/[0.04]" onClick={handleShare}>{c.share}</button>
                <a className="rounded-full border border-black/12 px-5 py-3 text-center text-sm font-black text-black transition-colors hover:bg-black/[0.04]" href={`https://wa.me/525560115704?text=${reportText}`} target="_blank" rel="noreferrer">{c.guidance}</a>
              </div>
              <button className="text-sm font-black text-black/54 underline underline-offset-4" onClick={reset}>{c.reset}</button>
              {message && <p className="text-sm font-bold text-black/58">{message}</p>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Question({ title, options, value, onChange }: { title: string; options: Option[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className={panelClass}>
      <h2 className="mb-4 text-xl font-black">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option.id} className={`${chipBase} ${value === option.id ? 'bg-white text-black shadow-[0_10px_28px_rgba(255,255,255,0.12)]' : 'bg-white/[0.06] text-white/72 hover:bg-white/[0.1] hover:text-white'}`} onClick={() => onChange(option.id)} type="button">
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiQuestion({ title, hint, options, values, onChange }: { title: string; hint: string; options: Option[]; values: string[]; onChange: (id: string) => void }) {
  return (
    <div className={panelClass}>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-black">{title}</h2>
        <p className="text-xs font-bold text-white/38">{hint}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = values.includes(option.id);
          return (
            <button key={option.id} className={`${chipBase} ${active ? 'bg-white text-black shadow-[0_10px_28px_rgba(255,255,255,0.12)]' : 'bg-white/[0.06] text-white/72 hover:bg-white/[0.1] hover:text-white'}`} onClick={() => onChange(option.id)} type="button">
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <p className="rounded-2xl bg-black/[0.045] px-4 py-3 leading-relaxed">
      <span className="block text-xs font-black uppercase tracking-[0.12em] text-black/36">{label}</span>
      <span className="mt-1 block font-black text-black">{value}</span>
    </p>
  );
}

function ProcessorRecommendation({ tiers, title, equivalents }: { tiers: Tier[]; title: string; equivalents: string }) {
  return (
    <div className="border-b border-black/10 p-5 md:p-7">
      <h3 className="mb-4 text-xl font-black">{title}</h3>
      <div className="grid gap-3 md:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.name} className="rounded-[1.25rem] border border-black/8 bg-black/[0.035] p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.13em] text-black/38">{tier.name}</p>
            <div className="space-y-2">
              {tier.processorExamples.map((processor) => (
                <p key={processor} className="text-sm font-black leading-tight text-black">{processor}</p>
              ))}
            </div>
            <p className="mt-3 text-xs font-bold text-black/46">{equivalents}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-black uppercase tracking-[0.14em] text-black/36">{title}</h3>
      <p className="font-semibold leading-relaxed text-black/64">{body}</p>
    </div>
  );
}
