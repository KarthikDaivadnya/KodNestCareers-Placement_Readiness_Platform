/* ============================================================
   KodNest — JD Skill Extractor & Analysis Engine
   Pure JS, no external APIs, works fully offline.
   ============================================================ */

import { buildCompanyIntel } from './companyIntel'

// ── Category definitions with regex patterns ─────────────────
export const CATEGORY_KEYWORDS = {
  'Core CS': [
    { name: 'DSA',      pattern: /\bDSA\b|\bData Structures?\b|\bAlgorithm/i },
    { name: 'OOP',      pattern: /\bOOP\b|\bObject[- ]Oriented\b/i },
    { name: 'DBMS',     pattern: /\bDBMS\b|\bDatabase Management\b/i },
    { name: 'OS',       pattern: /\bOS\b|\bOperating System/i },
    { name: 'Networks', pattern: /\bNetworking?\b|\bComputer Network|\bTCP\/IP\b|\bHTTP\b/i },
  ],
  'Languages': [
    { name: 'Java',       pattern: /\bJava\b(?!Script)/i },
    { name: 'Python',     pattern: /\bPython\b/i },
    { name: 'JavaScript', pattern: /\bJavaScript\b|\bJS\b/i },
    { name: 'TypeScript', pattern: /\bTypeScript\b|\bTS\b/i },
    { name: 'C',          pattern: /\bC\b(?!\+|#|\w)/i },
    { name: 'C++',        pattern: /\bC\+\+\b/i },
    { name: 'C#',         pattern: /\bC#\b/i },
    { name: 'Go',         pattern: /\bGolang\b|\bGo\b(?!\w)/i },
  ],
  'Web': [
    { name: 'React',    pattern: /\bReact(?:\.js|JS)?\b/i },
    { name: 'Next.js',  pattern: /\bNext\.?js\b/i },
    { name: 'Node.js',  pattern: /\bNode\.?js\b/i },
    { name: 'Express',  pattern: /\bExpress(?:\.js)?\b/i },
    { name: 'REST',     pattern: /\bREST(?:ful)?\b|\bREST API/i },
    { name: 'GraphQL',  pattern: /\bGraphQL\b/i },
  ],
  'Data': [
    { name: 'SQL',        pattern: /\bSQL\b/i },
    { name: 'MongoDB',    pattern: /\bMongoDB\b/i },
    { name: 'PostgreSQL', pattern: /\bPostgreSQL\b|\bPostgres\b/i },
    { name: 'MySQL',      pattern: /\bMySQL\b/i },
    { name: 'Redis',      pattern: /\bRedis\b/i },
  ],
  'Cloud/DevOps': [
    { name: 'AWS',        pattern: /\bAWS\b|\bAmazon Web Services\b/i },
    { name: 'Azure',      pattern: /\bAzure\b/i },
    { name: 'GCP',        pattern: /\bGCP\b|\bGoogle Cloud\b/i },
    { name: 'Docker',     pattern: /\bDocker\b/i },
    { name: 'Kubernetes', pattern: /\bKubernetes\b|\bK8s\b/i },
    { name: 'CI/CD',      pattern: /\bCI\/CD\b|\bCI[- ]CD\b|\bContinuous Integration\b/i },
    { name: 'Linux',      pattern: /\bLinux\b|\bUnix\b/i },
  ],
  'Testing': [
    { name: 'Selenium',   pattern: /\bSelenium\b/i },
    { name: 'Cypress',    pattern: /\bCypress\b/i },
    { name: 'Playwright', pattern: /\bPlaywright\b/i },
    { name: 'JUnit',      pattern: /\bJUnit\b/i },
    { name: 'PyTest',     pattern: /\bpy\.?test\b|\bPytest\b/i },
  ],
}

// ── 1. Extract skills from JD text ────────────────────────────
export function extractSkills(jdText) {
  const detected = {} // { 'Core CS': ['DSA', 'OOP'], ... }

  for (const [category, skills] of Object.entries(CATEGORY_KEYWORDS)) {
    const found = skills
      .filter(({ pattern }) => pattern.test(jdText))
      .map(({ name }) => name)
    if (found.length > 0) detected[category] = found
  }

  // Default: no skills detected → use General fallback
  if (Object.keys(detected).length === 0) {
    detected['General'] = [
      'Communication',
      'Problem solving',
      'Basic coding',
      'Projects',
    ]
  }

  return detected
}

// ── 2. Readiness score ────────────────────────────────────────
export function calcReadinessScore({ extractedSkills, company, role, jdText }) {
  let score = 35
  const categoriesFound = Object.keys(extractedSkills).filter(k => k !== 'General')
  score += Math.min(categoriesFound.length * 5, 30)
  if (company && company.trim().length > 0) score += 10
  if (role && role.trim().length > 0)       score += 10
  if (jdText && jdText.trim().length > 800) score += 10
  return Math.min(score, 100)
}

// ── 3. Round-wise checklist ───────────────────────────────────
const QUESTION_BANK = {
  DSA: [
    'How would you find the kth largest element in an unsorted array?',
    'Explain the difference between BFS and DFS and when you would use each.',
    'How do you detect a cycle in a linked list?',
    'Walk me through solving the "merge intervals" problem.',
    'What is dynamic programming? Give an example.',
  ],
  OOP: [
    'Explain the four pillars of OOP with examples.',
    'What is the difference between an abstract class and an interface?',
    'Explain the SOLID principles.',
  ],
  SQL: [
    'Explain indexing and when it helps query performance.',
    'What is the difference between INNER JOIN and LEFT JOIN?',
    'How would you write a query to find duplicate records?',
    'What is a database transaction and what are ACID properties?',
    'How would you optimize a slow SQL query?',
  ],
  React: [
    'Explain state management options in a React app.',
    'What is the difference between useEffect and useLayoutEffect?',
    'How does React\'s virtual DOM work?',
    'Explain controlled vs uncontrolled components.',
  ],
  'Node.js': [
    'How does Node.js handle asynchronous operations?',
    'Explain the event loop in Node.js.',
    'What is middleware in Express?',
  ],
  Docker: [
    'Explain the difference between a Docker image and a container.',
    'How do you reduce Docker image size?',
    'What is Docker Compose used for?',
  ],
  AWS: [
    'Explain the difference between S3, EC2, and Lambda.',
    'How do you set up auto-scaling in AWS?',
    'What is IAM and why is it important?',
  ],
  Python: [
    'What is the GIL in Python and why does it matter?',
    'Explain list comprehensions and generator expressions.',
    'How does Python handle memory management?',
  ],
  Java: [
    'Explain JVM memory areas (heap, stack, method area).',
    'What is the difference between == and .equals() in Java?',
    'How do you implement multithreading in Java?',
  ],
  MongoDB: [
    'How does MongoDB handle schema design differently from SQL?',
    'Explain when you would use embedded documents vs references.',
    'What is aggregation in MongoDB?',
  ],
  REST: [
    'What are RESTful API design best practices?',
    'Explain HTTP status codes and their correct usage.',
    'How do you handle API versioning?',
  ],
  General: [
    'Walk me through a challenging project you worked on.',
    'How do you approach debugging a problem you\'ve never seen before?',
    'Explain the software development lifecycle (SDLC).',
    'What version control system have you used and how?',
    'How do you ensure code quality in your projects?',
    'Describe a time you had to learn a new technology quickly.',
  ],
}

const HR_QUESTIONS = [
  'Tell me about yourself in 2 minutes.',
  'Why do you want to join this company?',
  'Where do you see yourself in 3 years?',
  'Describe a time you failed and what you learned.',
  'How do you handle pressure and tight deadlines?',
]

export function generateQuestions(extractedSkills) {
  const questions = []
  const allSkills = Object.values(extractedSkills).flat()

  // Pick skill-specific questions
  for (const skill of allSkills) {
    if (QUESTION_BANK[skill]) {
      const picks = QUESTION_BANK[skill].slice(0, 2)
      questions.push(...picks)
    }
  }

  // Always add some general questions
  questions.push(...QUESTION_BANK.General.slice(0, 3))
  questions.push(...HR_QUESTIONS.slice(0, 2))

  // Deduplicate and limit to 10
  return [...new Set(questions)].slice(0, 10)
}

// ── 4. Round-wise checklist ───────────────────────────────────
export function generateChecklist(extractedSkills) {
  const allSkills = Object.values(extractedSkills).flat()
  const has = (s) => allSkills.some(sk => sk.toLowerCase() === s.toLowerCase())

  return [
    {
      round: 'Round 1 — Aptitude & Basics',
      items: [
        'Complete 2 timed aptitude mock tests (quantitative)',
        'Revise verbal reasoning and data interpretation',
        'Practice logical reasoning questions (puzzles, patterns)',
        'Solve 5 number series + arrangement problems',
        'Review English comprehension and grammar rules',
        'Take one full-length timed aptitude test',
      ],
    },
    {
      round: 'Round 2 — DSA & Core CS',
      items: [
        has('DSA') ? 'Solve 10 problems on arrays, strings, and sorting' : 'Review fundamental algorithms (sorting, searching)',
        has('DSA') ? 'Practice 5 problems each on stacks, queues, linked lists' : 'Practice basic data structure usage',
        has('DSA') ? 'Solve 3–5 tree/graph traversal problems (BFS, DFS)' : 'Study tree and graph basics',
        has('OOP') ? 'Revise all four OOP pillars with code examples' : 'Study basic programming concepts',
        has('DBMS') ? 'Practice complex SQL queries + normalization (1NF–3NF)' : 'Study relational database basics',
        has('OS')   ? 'Revise process scheduling, memory management, deadlocks' : 'Review OS fundamentals',
        has('Networks') ? 'Revise TCP/IP stack, HTTP/HTTPS, DNS, load balancing' : 'Study basic networking concepts',
        'Practice 2 coding problems on LeetCode/HackerRank per day',
      ],
    },
    {
      round: 'Round 3 — Tech Interview (Projects + Stack)',
      items: [
        'Prepare 3-minute explanation for each project you\'ve built',
        has('React')    ? 'Revise React hooks, state management, component lifecycle' : null,
        has('Node.js')  ? 'Review Node.js event loop, async patterns, Express middleware' : null,
        has('REST')     ? 'Prepare REST API design examples from your projects' : null,
        has('SQL') || has('PostgreSQL') || has('MySQL') ? 'Revise joins, indexes, transactions, query optimization' : null,
        has('MongoDB')  ? 'Revise MongoDB aggregation, indexing, schema design' : null,
        has('Docker')   ? 'Review Docker commands, Dockerfile best practices' : null,
        has('AWS') || has('Azure') || has('GCP') ? 'Prepare cloud architecture examples you\'ve used' : null,
        has('Python')   ? 'Revise Python-specific concepts: GIL, decorators, generators' : null,
        has('Java')     ? 'Revise Java: JVM, collections, multithreading, Spring Boot basics' : null,
        'Prepare answers to "How would you scale this system?" for each project',
        'Review your GitHub repos — ensure README + comments are clean',
      ].filter(Boolean),
    },
    {
      round: 'Round 4 — HR & Managerial',
      items: [
        'Prepare a crisp 2-minute "Tell me about yourself" answer',
        'Research the company\'s mission, recent news, and products',
        'Write down 3 examples of challenges you overcame',
        'Prepare questions to ask the interviewer (show curiosity)',
        'Practice explaining technical concepts in simple language',
        'Mock HR interview with a friend or record yourself',
      ],
    },
  ]
}

// ── 5. 7-day study plan ───────────────────────────────────────
export function generatePlan(extractedSkills) {
  const allSkills = Object.values(extractedSkills).flat()
  const has = (s) => allSkills.some(sk => sk.toLowerCase() === s.toLowerCase())

  return [
    {
      days: 'Day 1–2',
      focus: 'Basics + Core CS',
      tasks: [
        'Revise OOP concepts: inheritance, polymorphism, encapsulation, abstraction',
        has('DBMS') ? 'Practice SQL queries, normalization, and ER diagrams' : 'Study relational database basics',
        has('OS') ? 'Revise OS topics: processes, threads, deadlocks, scheduling' : 'Study fundamental computer science concepts',
        has('Networks') ? 'Revise TCP/IP, HTTP methods, DNS, REST principles' : 'Review networking basics',
        'Complete 5 aptitude practice questions',
      ],
    },
    {
      days: 'Day 3–4',
      focus: 'DSA + Coding Practice',
      tasks: [
        has('DSA') ? 'Solve 5 array/string problems (LeetCode easy→medium)' : 'Practice 5 basic coding problems',
        has('DSA') ? 'Cover linked lists, stacks, queues, trees, binary search' : 'Study core algorithmic thinking',
        has('DSA') ? 'Tackle 2 dynamic programming problems' : 'Practice problem-solving patterns',
        'Time yourself — simulate 45-minute interview coding windows',
        'Review solutions and understand time/space complexity',
      ],
    },
    {
      days: 'Day 5',
      focus: 'Projects + Resume Alignment',
      tasks: [
        'Select your 2–3 strongest projects to discuss in interviews',
        has('React') ? 'Ensure React projects highlight hooks, state management, and responsiveness' : null,
        has('Node.js') || has('Express') ? 'Ensure backend projects show API design, authentication, error handling' : null,
        has('Python') ? 'Polish Python projects — clean code, docstrings, README' : null,
        has('Docker') ? 'Dockerize at least one project if not already done' : null,
        'Update resume: add quantified impact to every bullet point',
        'Tailor resume keywords to match this job description',
      ].filter(Boolean),
    },
    {
      days: 'Day 6',
      focus: 'Mock Interviews + Question Practice',
      tasks: [
        'Answer 10 likely interview questions out loud (use the list generated)',
        'Do a full 1-hour mock technical interview with a peer',
        has('SQL') ? 'Practice 3 complex SQL query problems' : null,
        has('React') || has('Node.js') ? 'Review a sample system design problem for your stack' : null,
        'Record yourself answering "Tell me about yourself" — review for clarity',
        'Research the company: products, tech stack, recent news',
      ].filter(Boolean),
    },
    {
      days: 'Day 7',
      focus: 'Revision + Weak Areas',
      tasks: [
        'Quick revision: OOP, DSA core concepts, your tech stack',
        'Revisit topics you found hardest in days 1–6',
        'Read through your project code one final time',
        'Do a short aptitude test (30 min) for confidence',
        'Rest well — no cramming; confidence and clarity matter more',
      ],
    },
  ]
}

// ── 6. Master analysis function ───────────────────────────────
export function analyzeJD({ company, role, jdText }) {
  const extractedSkills = extractSkills(jdText)
  const baseScore       = calcReadinessScore({ extractedSkills, company, role, jdText })
  const checklist       = generateChecklist(extractedSkills)
  const plan            = generatePlan(extractedSkills)
  const questions       = generateQuestions(extractedSkills)
  const companyIntel    = buildCompanyIntel(company, extractedSkills)

  // Initialise every skill to 'practice' — user adjusts on Results page
  const allSkills = Object.values(extractedSkills).flat()
  const skillConfidenceMap = {}
  allSkills.forEach(s => { skillConfidenceMap[s] = 'practice' })

  const now = new Date().toISOString()

  return {
    // Identity
    id:                crypto.randomUUID(),
    createdAt:         now,
    updatedAt:         now,

    // Context
    company:           (company ?? '').trim(),
    role:              (role ?? '').trim(),
    jdText:            jdText.trim(),

    // Extracted data
    extractedSkills,
    companyIntel,
    checklist,
    plan,
    questions,

    // Score — baseScore is immutable; finalScore changes with toggles
    baseScore,
    readinessScore:    baseScore,   // kept for backward compat with old history entries
    finalScore:        baseScore,   // = baseScore until user toggles skills

    // Skill confidence (all 'practice' on first load)
    skillConfidenceMap,
  }
}
