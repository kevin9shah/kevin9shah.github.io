export const profile = {
  name: 'Kevin Shah',
  tagline: 'AI/ML Engineer & Data / Backend Engineer',
  eyebrow: 'AI/ML • DATA • BACKEND • CLOUD',
  positioning: 'Software Engineer — AI/ML, DevOps, Backend & Cloud',
  summary:
    "B.Tech IT @ VIT Vellore | Ex AI Research Intern @ IIT Gandhinagar | IEEE Published Researcher | Patent Inventor | Code2Create '25 Winner",
  statement:
    'I build intelligent systems, production-grade data pipelines, and backend infrastructure that turn complex data into useful, explainable products.',
  location: {
    primary: 'Ahmedabad, Gujarat',
    secondary: 'Kutch, Gujarat',
  },
  links: {
    github: 'https://github.com/kevin9shah',
    linkedin: 'https://www.linkedin.com/in/kevinshah19/',
    leetcode: 'https://leetcode.com/u/kevinshah966/',
    email: 'kevinshah966@gmail.com',
    resume: 'https://drive.google.com/file/d/1T6CClyXUMuHeO0dUgE399OcFK3qppABa/view?usp=sharing',
  },
}

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Research', href: '#research' },
  { label: 'Experience', href: '#experience' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
]

export const snapshot = [
  { org: 'VIT Vellore', role: 'B.Tech Information Technology • 9.01 / 10 CGPA' },
  { org: 'IIT Gandhinagar', role: 'AI Research Intern' },
  { org: 'IEEE Xplore', role: 'Published Researcher' },
  { org: 'Indian Patent Office', role: '2 Published Patent Applications' },
  { org: "Code2Create '25", role: '1st Place — 500+ Teams' },
]

export const focusAreas = [
  {
    id: 'ai-ml',
    title: 'AI / ML Systems',
    description: 'RAG pipelines, multimodal inference and explainable models — from research to production.',
  },
  {
    id: 'data',
    title: 'Data Engineering',
    description: 'Medallion architectures and ETL pipelines built for data quality and reliability.',
  },
  {
    id: 'backend',
    title: 'Backend & Cloud',
    description: 'APIs and infrastructure that keep intelligent systems fast, secure and scalable.',
  },
  {
    id: 'research',
    title: 'Research & Community',
    description: 'IEEE-published research, patent filings, hackathons, and leading the Gujarati Literary Association at VIT.',
  },
]

export const skillCategories = [
  {
    id: 'ai-ml',
    label: 'AI / ML',
    tag: 'AI_ML',
    featured: true,
    skills: ['Multimodal AI', 'RAG', 'LangChain', 'AI Agents', 'Ollama', 'NLP', 'SHAP', 'Explainable AI'],
  },
  {
    id: 'data',
    label: 'Data Engineering',
    tag: 'DATA',
    featured: true,
    skills: ['Medallion Architecture', 'ETL', 'Apache Airflow', 'PostgreSQL', 'ChromaDB', 'Parquet', 'Pandera', 'MongoDB', 'MySQL', 'SQLAlchemy'],
  },
  {
    id: 'backend',
    label: 'Backend',
    tag: 'BACKEND',
    featured: false,
    skills: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'JWT Authentication'],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    tag: 'CLOUD',
    featured: false,
    skills: ['Docker', 'GitHub Actions', 'CI/CD', 'AWS', 'Azure', 'GCP', 'Linux'],
  },
  {
    id: 'programming',
    label: 'Programming',
    tag: 'LANG',
    featured: false,
    skills: ['Python', 'Java', 'C++', 'JavaScript', 'SQL'],
  },
]

export type ProjectCategory = 'AI / ML' | 'Data Engineering' | 'Analytics'

export interface Project {
  id: string
  number: string
  category: ProjectCategory
  badge?: string
  title: string
  description: string
  tech: string[]
  highlights: string[]
  architecture: string[]
  metric?: { value: string; label: string }
  github?: string
  demo?: string
  demoLabel?: string
}

export const projects: Project[] = [
  {
    id: 'eagle',
    number: '01',
    category: 'AI / ML',
    title: 'Eagle — Document Intelligence System',
    description:
      'A privacy-first local RAG assistant for semantic search and question answering over personal documents.',
    tech: ['Python', 'LangChain', 'Ollama', 'FastAPI', 'ChromaDB'],
    highlights: [
      'Local LLM inference',
      'Persistent ChromaDB vector store',
      'Document ingestion and indexing',
      'Semantic retrieval',
      'FastAPI backend',
      'Privacy-first architecture',
    ],
    architecture: ['Documents', 'Chunking', 'Embeddings', 'ChromaDB', 'Retriever', 'Ollama LLM', 'Answer'],
    github: 'https://github.com/kevin9shah', // TODO: replace with project repo URL
  },
  {
    id: 'medallion-etl',
    number: '02',
    category: 'Data Engineering',
    title: 'Enterprise Medallion ETL Pipeline',
    description:
      'A production-oriented, automated Medallion data pipeline designed around data quality, idempotency and reliable analytical workloads.',
    tech: ['Python', 'PostgreSQL', 'Apache Airflow', 'Docker', 'Pandera', 'Parquet', 'Pytest'],
    highlights: [
      'Bronze → Silver → Gold architecture',
      'CSV + REST API ingestion',
      'Apache Parquet storage',
      'Pandera validation',
      'Automatic quarantine handling',
      'Transactional PostgreSQL upserts',
      'SQLAlchemy',
      'Automated testing',
      'GitHub Actions CI/CD',
    ],
    architecture: ['CSV / REST APIs', 'Bronze', 'Silver', 'Validation', 'Quarantine', 'Gold', 'PostgreSQL', 'Analytics / BI'],
    github: 'https://github.com/kevin9shah', // TODO: replace with project repo URL
  },
  {
    id: 'crop-yield',
    number: '03',
    category: 'Analytics',
    badge: 'IEEE Xplore Published',
    title: 'Environmental Factor-Oriented Crop Yield Prediction',
    description:
      'Explainable machine learning research focused on environmental-factor-oriented crop yield prediction and crop recommendation. Presented at ICAUC 2026 — the research explores how environmental variables influence crop yield predictions while using explainability techniques such as SHAP to make model decisions more interpretable.',
    tech: ['Random Forest', 'SHAP', 'PDP', 'Explainable AI'],
    highlights: ['Environmental factor analysis', 'Random Forest', 'SHAP', 'Explainable AI', 'Crop recommendation'],
    architecture: [],
    metric: { value: '0.9974', label: 'R²' },
    demo: '#', // TODO: add IEEE Xplore paper URL
    demoLabel: 'Read Research →',
  },
]

export const research = {
  title: 'Environmental Factor-Oriented Crop Yield Prediction and Crop Recommendation Using Explainable Machine Learning',
  badge: 'IEEE Xplore • ICAUC 2026',
  metric: '0.9974 R²',
  points: ['Environmental factor analysis', 'Random Forest', 'SHAP', 'Explainable AI', 'Crop recommendation'],
  url: '#', // TODO: add IEEE Xplore paper URL
}

export interface Patent {
  id: string
  title: string
  applicationNo: string
  description: string
  highlights: string[]
  themes?: string[]
}

export const patents: Patent[] = [
  {
    id: 'climate-risk',
    title: 'A Climate Risk Intelligence System for Rice Cultivation',
    applicationNo: '202641055088',
    description:
      'A machine-learning and climate-data driven system focused on identifying yield instability, environmental stress regimes and climate-related risks in rice cultivation.',
    highlights: [
      'Climate risk intelligence',
      'Yield instability detection',
      'Environmental stress regimes',
      'Critical threshold detection',
      'Actionable risk classification',
      'Sustainable agriculture',
    ],
  },
  {
    id: 'box-office',
    title: 'A Big Data Based Multi-Modal System for Predicting Box Office Performance',
    applicationNo: '202641051636',
    description:
      'A multimodal predictive system combining Big Data, machine learning, sentiment analysis and predictive analytics to forecast movie box office performance.',
    highlights: [],
    themes: ['Big Data', 'Machine Learning', 'Sentiment Analysis', 'Predictive Analytics', 'Multimodal Data'],
  },
]

export const experience = [
  {
    date: 'May 2026',
    org: 'Indian Institute of Technology Gandhinagar',
    role: 'AI Research Intern',
    location: 'Gandhinagar, Gujarat',
    highlights: [
      'Worked with 5-sensor physiological healthcare datasets',
      'Built preprocessing pipelines',
      'Developed an end-to-end multimodal AI inference pipeline',
      'Focused on real-time monitoring',
      'Achieved approximately 88% real-time monitoring accuracy',
    ],
    featured: true,
  },
]

export const achievements = [
  {
    id: 'code2create',
    icon: 'trophy',
    title: "Code2Create '25",
    highlight: '1st Place — 500+ Teams',
    description:
      'Built Awaaz, a VR + AI-powered presentation rehearsal platform featuring simulated audiences, real-time AI coaching and personalized post-session analysis.',
  },
  {
    id: 'ieee',
    icon: 'file-text',
    title: 'IEEE Xplore',
    highlight: 'Published Research Paper',
    description: 'Environmental-factor-oriented crop yield prediction using explainable machine learning.',
  },
  {
    id: 'patents',
    icon: 'scroll',
    title: 'Patent Inventor',
    highlight: '2 Published Patent Applications',
    description: 'Climate risk intelligence for rice cultivation. Big-data multimodal box-office prediction.',
  },
  {
    id: 'academic',
    icon: 'graduation-cap',
    title: 'Academic',
    highlight: '9.01 / 10 CGPA',
    description: 'B.Tech Information Technology, VIT Vellore.',
  },
]

export const leadership = [
  {
    id: 'gla',
    role: 'Vice Chairperson',
    org: 'Gujarati Literary Association — VIT Vellore',
    period: 'Jan 2026 – Present',
    focus: 'Leadership • Management • Events • Community',
  },
  {
    id: 'codechef',
    role: 'Core Member',
    org: 'CodeChef VIT Student Chapter',
    period: '2024 – 2026',
    focus: 'Technical events, hackathons and workshops.',
  },
  {
    id: 'acm',
    role: 'Core Member',
    org: 'ACM-VIT Chapter',
    period: '2024 – 2025',
    focus: 'Technical events, hackathons and workshops.',
  },
]

export const awaaz = {
  title: 'Awaaz — VR × AI Presentation Coach',
  badge: "1st Place • Code2Create '25 • 500+ Teams",
  description:
    'A VR + AI powered presentation rehearsal tool designed to make presentation practice immersive, interactive and intelligent.',
  features: [
    'VR presentation environment',
    'Simulated audience',
    'Realistic background sounds',
    'Real-time AI coaching',
    'Speech analysis',
    'Context-based NPC questions',
    'Personalized performance report',
    'Pronunciation and accuracy analysis',
  ],
  flow: ['Presentation', 'VR Environment', 'AI Audience', 'Speech Analysis', 'Real-Time Coaching', 'Performance Report'],
}
