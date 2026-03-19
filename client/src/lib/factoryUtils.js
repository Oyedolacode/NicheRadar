/* ─────────────────────────────────────────
   NicheRadar v5 Factory Logic
   Restored from niche-radar (3).html
───────────────────────────────────────── */

export const TOPIC_DB = {
  ai: { emoji: '🤖', domain: 'Technology', audience: 'students, professionals, entrepreneurs', pain: 'saving time, learning faster, staying competitive', hooks: ['Most people are using AI wrong', 'While you sleep, AI is doing this', 'I tested every AI tool so you don\'t have to', 'The AI tool that replaced my entire workflow'], powerWords: ['2x faster', 'secretly', 'replaced', 'nobody talks about', 'game-changer'], formats: ['list', 'howto', 'comparison', 'secrets', 'tutorial'] },
  history: { emoji: '📜', domain: 'History & Education', audience: 'curious learners, history enthusiasts', pain: 'boring textbooks, unknown stories, forgotten events', hooks: ['This event was erased from history books', 'The real story nobody told you', 'History class never taught you this', 'This changed civilization forever'], powerWords: ['disturbing', 'hidden', 'forgotten', 'shocking', 'never told'], formats: ['documentary', 'facts', 'mystery', 'dark', 'untold'] },
  psychology: { emoji: '🧠', domain: 'Psychology & Self-Help', audience: 'self-improvement seekers, curious minds', pain: 'understanding behavior, improving relationships, avoiding manipulation', hooks: ['Your brain is lying to you', 'Why smart people make terrible decisions', 'This trick controls people without them knowing', 'The psychology secret therapists won\'t share'], powerWords: ['dark', 'manipulation', 'subconscious', 'trick', 'secret'], formats: ['explained', 'facts', 'tactics', 'experiments', 'case study'] },
  stoicism: { emoji: '⚖️', domain: 'Philosophy & Lifestyle', audience: 'self-improvement seekers, stressed professionals', pain: 'anxiety, lack of control, emotional reactivity', hooks: ['Marcus Aurelius had one daily habit that changed everything', 'Stoics knew something modern people forgot', 'One Stoic rule that eliminates 80% of stress', 'How to become unbreakable in 30 days'], powerWords: ['unbreakable', 'ancient wisdom', 'forgotten', 'transforms', 'powerful'], formats: ['explained', 'lessons', 'habits', 'philosophy', 'mindset'] },
  finance: { emoji: '💰', domain: 'Personal Finance', audience: 'young adults, aspiring investors, debt-free seekers', pain: 'living paycheck to paycheck, debt, not knowing where to start', hooks: ['I saved $10K in 6 months doing this', 'The investing strategy banks don\'t want you to know', 'Why you\'re still broke despite working hard', 'The money rule the rich follow silently'], powerWords: ['secretly', 'passive', 'freedom', 'escape', 'wealth'], formats: ['beginners', 'strategy', 'mistakes', 'rules', 'habits'] },
  science: { emoji: '🔬', domain: 'Science & Education', audience: 'curious people, students, science enthusiasts', pain: 'complex concepts, boring lessons, missing the wonder of science', hooks: ['This breaks every rule of physics', 'Scientists discovered something impossible', 'The weirdest experiment ever run', 'This discovery changed how we see reality'], powerWords: ['impossible', 'discovered', 'bizarre', 'mind-blowing', 'breakthrough'], formats: ['explained', 'experiments', 'facts', 'discoveries', 'mysteries'] },
  minecraft: { emoji: '⛏️', domain: 'Gaming', audience: 'gamers, Minecraft fans, YouTube viewers', pain: 'missing lore, seeking secrets, wanting deeper understanding', hooks: ['Minecraft has a dark secret nobody noticed', 'The hidden lore Mojang never explained', 'This Minecraft mystery stayed unsolved for years', 'I explored every secret in the new update'], powerWords: ['secret', 'hidden', 'never noticed', 'dark', 'mysterious'], formats: ['documentary', 'lore', 'secrets', 'history', 'exploration'] },
  coding: { emoji: '💻', domain: 'Technology & Education', audience: 'aspiring developers, students, career changers', pain: 'overwhelmed by where to start, boring tutorials, imposter syndrome', hooks: ['I learned to code in 30 days doing this', 'The coding mistake that wastes years', 'Build this project in one day (employers love it)', 'One programming concept that unlocks everything'], powerWords: ['30 days', 'employers love', 'build', 'unlock', 'simple'], formats: ['projects', 'roadmap', 'tips', 'beginner', 'tutorial'] },
};

export function getTopicDB(topic) {
  const b = topic.toLowerCase();
  for (const [k, v] of Object.entries(TOPIC_DB)) if (b.includes(k)) return { ...v, key: k };
  return { emoji: '🎯', domain: 'Content Creation', audience: 'general YouTube audience', pain: 'finding quality content, learning, entertainment', hooks: ['Nobody is talking about this', 'I tried this for 30 days', 'The truth about ' + topic, 'This changed how I see ' + topic], powerWords: ['secret', 'truth', 'hidden', 'finally', 'exposed'], formats: ['explained', 'facts', 'tips', 'guide', 'story'], key: 'general' };
}

export function generateIdeas(topic, length) {
  const db = getTopicDB(topic);
  const types = [
    { type: 'List', prefix: ['5', '7', '10', '3', '8'], suffix: ['you need to know', 'that actually work', 'nobody talks about', 'that changed everything', 'that will blow your mind'] },
    { type: 'HowTo', prefix: ['How to', 'The right way to', 'How I'], suffix: ['in 7 days', 'without failing', 'the easy way', 'once and for all', 'from scratch'] },
    { type: 'Curiosity', prefix: ['The truth about', 'Why nobody talks about', 'The real reason'], suffix: ['(it\'s not what you think)', 'will shock you', 'is more complex than you think', 'has been hidden'] },
    { type: 'Story', prefix: ['I tried', 'I tested', 'I spent 30 days'], suffix: ['and here\'s what happened', '(unexpected results)', 'here\'s what I learned', '(the honest review)'] },
    { type: 'Facts', prefix: ['', topic + ' facts', 'Crazy things about'], suffix: ['that will blow your mind', 'most people don\'t know', 'nobody believes are true', 'that changed history'] },
    { type: 'Comparison', prefix: ['', 'Best vs worst', 'Old vs new'], suffix: ['methods compared', '— which actually works?', 'explained visually', 'for beginners vs experts'] },
    { type: 'Documentary', prefix: ['The full story of', 'Inside', 'The complete history of'], suffix: ['(documentary)', '(deep dive)', 'explained', 'no one tells you'] },
    { type: 'Shorts', prefix: ['60 second', 'Quick', 'Fast'], suffix: ['explained', 'facts', 'guide', 'tips'] },
    { type: 'Secrets', prefix: ['The secret', 'Hidden', 'What they don\'t tell you about'], suffix: ['revealed', 'explained', 'finally exposed', 'that changes everything'] },
    { type: 'Tutorial', prefix: ['Step by step', 'Complete', 'Beginner\'s'], suffix: ['guide to ' + topic, 'tutorial for ' + topic, 'masterclass', 'crash course'] },
    { type: 'Mistakes', prefix: ['Stop making these', 'The biggest', 'Common'], suffix: ['mistakes with ' + topic, 'errors beginners make', 'myths debunked', 'misconceptions'] },
    { type: 'Controversy', prefix: ['The controversial truth about', 'Why ' + topic, 'Is ' + topic], suffix: ['is actually harmful', 'is overrated (unpopular opinion)', 'is not what you think', 'changed my mind'] },
  ];
  const ideas = [];
  const hook = db.hooks[Math.floor(Math.random() * db.hooks.length)];
  types.forEach((t, i) => {
    const pfx = t.prefix[i % t.prefix.length] || t.prefix[0];
    const sfx = t.suffix[i % t.suffix.length];
    const title = pfx ? pfx + ' ' + topic + ' ' + sfx : topic + ' ' + sfx;
    const viral = Math.round(5 + Math.random() * 4.5);
    ideas.push({ title: title.trim(), angle: `A ${t.type.toLowerCase()} format exploring ${topic} from a ${db.audience} perspective`, hook: db.hooks[i % db.hooks.length] || hook, type: t.type, viralScore: viral });
  });
  return ideas.slice(0, 12);
}

export function generateTitles(topic) {
  const db = getTopicDB(topic);
  const pw = db.powerWords;
  const randPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const templates = [
    { t: `${randPick(['5', '7', '10', '3'])} ${topic} ${randPick(['secrets', 'facts', 'tips', 'hacks'])} nobody talks about`, type: 'List', ctr: 85 },
    { t: `${randPick(['The', 'This'])} ${randPick(pw)} truth about ${topic} (${randPick(['shocking', 'most won\'t believe this', 'watch this first'])})`, type: 'Curiosity', ctr: 82 },
    { t: `How to master ${topic} in ${randPick(['7 days', '30 days', 'one week', 'a month'])} (step by step)`, type: 'HowTo', ctr: 79 },
    { t: `Why ${randPick(['everyone', 'most people', 'smart people'])} is wrong about ${topic}`, type: 'Controversy', ctr: 83 },
    { t: `I tested ${topic} for ${randPick(['30 days', 'a month', '60 days'])} — here's what happened`, type: 'Story', ctr: 77 },
    { t: `${randPick(['5', '7', '10'])} ${topic} ${randPick(['mistakes', 'myths', 'lies'])} that are ${randPick(['costing you', 'holding you back', 'destroying your results'])}`, type: 'Mistakes', ctr: 81 },
    { t: `The ${randPick(['ultimate', 'complete', 'only'])} ${topic} guide for ${randPick(['beginners', '2024', '2025'])}`, type: 'Tutorial', ctr: 72 },
    { t: `${topic.charAt(0).toUpperCase() + topic.slice(1)} ${randPick(['exposed', 'explained', 'decoded', 'simplified'])} (${randPick(['full breakdown', 'no fluff', 'honest review'])})`, type: 'Explainer', ctr: 74 },
    { t: `What nobody tells you about ${topic} (until it's too late)`, type: 'Warning', ctr: 86 },
    { t: `${randPick(['Stop', 'Quit', 'Don\'t'])} ${randPick(['wasting time on', 'ignoring', 'making mistakes with'])} ${topic} — do this instead`, type: 'Action', ctr: 80 },
  ];
  return templates.map(t => ({ ...t, ctr: Math.min(99, Math.max(55, t.ctr + Math.round((Math.random() - .5) * 10))) }));
}

export function generateThumbs(topic) {
  const db = getTopicDB(topic);
  const randPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return [
    { concept: `Shocked reaction face with bold red text revealing the ${topic} secret`, layout: 'center focus', textOverlay: `${topic.toUpperCase().slice(0, 12)} SECRET`, leftElement: `Shocked person or ${db.emoji}`, rightElement: 'Bold text overlay', colorScheme: 'Red and white high contrast', emoji: '😱', style: 'shocking', bg: 'linear-gradient(135deg,#1a0505,#4a0a0a)' },
    { concept: `Split comparison: before (confused/struggling) vs after (confident, using ${topic})`, layout: 'before-after', textOverlay: 'BEFORE vs AFTER', leftElement: 'Stressed/confused person', rightElement: 'Relaxed successful person', colorScheme: 'Blue (left) and green (right) split', emoji: '🔄', style: 'educational', bg: 'linear-gradient(135deg,#051a2e,#0a1a10)' },
    { concept: `Bold number ${randPick(['5', '7', '10'])} with ${topic} visual elements and high-contrast background`, layout: 'left-right split', textOverlay: `${randPick(['5', '7', '10'])} HIDDEN FACTS`, leftElement: `Large number in bold font`, rightElement: `${topic} icon or illustration`, colorScheme: 'Yellow on dark background, high contrast', emoji: '💡', style: 'curious', bg: 'linear-gradient(135deg,#1a1500,#3a3000)' },
    { concept: `Close-up curious/surprised face with question marks and ${topic} keyword`, layout: 'center focus', textOverlay: `WHY ${topic.toUpperCase().slice(0, 8)}?`, leftElement: 'Close-up face with curiosity', rightElement: 'Question marks and topic elements', colorScheme: 'Purple gradient with bright yellow text', emoji: '🤔', style: 'entertaining', bg: 'linear-gradient(135deg,#1a0a2e,#2d1060)' },
  ];
}

export function generateScript(topic, title, length) {
  const db = getTopicDB(topic);
  const hookLine = db.hooks[Math.floor(Math.random() * db.hooks.length)];
  const dur = { short: '60 seconds', medium: '8–12 minutes', long: '20–30 minutes' };
  const sections_medium = [
    { title: `What Most People Get Wrong About ${topic}`, content: `Here's the uncomfortable truth: most people approach ${topic} completely backwards. They focus on [common mistake] when the real key is understanding [core concept]. I'll show you exactly what this means with a specific example...`, duration: '2–3 min' },
    { title: `The Core Method / Key Insight`, content: `After [research/testing/experience], I discovered the key principle that separates people who succeed with ${topic} from those who don't. It's simpler than you think, but almost nobody does it: [explain core method with specific detail and example]...`, duration: '3–4 min' },
    { title: `Practical Application`, content: `Here's how you actually apply this to real life. Take this specific example: [concrete scenario]. Step 1: [action]. Step 2: [action]. The reason this works is because ${topic} fundamentally operates on the principle of [explanation]...`, duration: '2–3 min' },
    { title: `The Biggest Mistake to Avoid`, content: `Before I wrap up, there's one critical mistake I see people make constantly with ${topic}. [Describe mistake]. This is dangerous because [consequence]. Instead, you should always [correct approach]...`, duration: '1–2 min' },
  ];
  const sections_short = [{ title: 'Main Point', content: `The key thing about ${topic} that most people miss: [core insight]. Here's why this matters: [brief explanation with one example]...`, duration: '30–40 sec' }];
  const sections_long = [...sections_medium, { title: 'Deep Dive: Advanced Concepts', content: `Now let's go deeper. For those of you who want to truly master ${topic}, there's a layer most guides skip entirely. [Advanced concept with detailed explanation, case study, and real-world application]...`, duration: '5–7 min' }, { title: 'Case Study / Real Examples', content: `Let me walk through a specific case study that illustrates everything we've covered. [Detailed real or hypothetical example showing the principles in action with measurable outcomes]...`, duration: '4–5 min' }];
  const sections = length === 'short' ? sections_short : length === 'long' ? sections_long : sections_medium;
  return {
    hook: `"${hookLine}" [Pause for 2 seconds, make eye contact with camera]\n\n"In the next ${dur[length] || '10 minutes'}, I'm going to show you exactly ${title.toLowerCase().includes('how') ? 'how' : 'what'} — and this will completely change how you think about ${topic}."`,
    intro: `Welcome back — if you're new here, I cover [your channel niche] every week. Quick note: everything I'm sharing today is based on [research/experience/testing].\n\nHere's the structure of today's video: [briefly list 3 main points]. By the end, you'll have [specific actionable outcome] that you can apply immediately.`,
    sections,
    examples: `Real example: [Specific person, company, or scenario]\n\nHere's exactly what happened: [Concrete story with numbers/results if possible]\n\nThe key takeaway from this example is: [1-sentence lesson tied back to your main point]`,
    conclusion: `So to summarize everything:\n\n1. ${topic} works best when you [key point 1]\n2. The biggest mistake is [mistake] — instead do [solution]\n3. Start today with this one action: [specific first step]\n\nRemember: [motivational one-liner tied to the topic]`,
    cta: `If this helped you understand ${topic} better, hit that like button — it genuinely helps this channel grow.\n\nSubscribe if you want more content like this every [your upload schedule].\n\nAnd drop a comment below: [engaging question like "What's your biggest challenge with ${topic}?" or "Which tip will you try first?"]`,
    totalDuration: dur[length] || '8–12 minutes',
  };
}
