import { cases, steps } from './data.js';
import { emptyProfile, sampleProfile, validateStep, makeReport, recommendedPath } from './logic.js';

const root = document.getElementById('app');
const state = { page: 'home', step: 0, profile: emptyProfile(), report: null, path: 'A', errors: {} };
const reportPages = ['capability', 'impact', 'paths', 'plan'];
const pageLabels = { capability: 'Capabilities', impact: 'AI & work', paths: 'Career paths', plan: 'Action plan' };
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nl = value => esc(value).replace(/\n/g, '<br>');

function button(label, action, cls = 'button primary', extra = '') {
  return `<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
}
function iconArrow() { return '<span aria-hidden="true">↗</span>'; }
function badge(label='DEMO / MOCK') { return `<span class="demo-badge"><span class="demo-dot"></span>${label}</span>`; }
function header() {
  const links = state.report ? `<nav class="top-nav" aria-label="Report navigation">${reportPages.map(p => `<button type="button" data-action="page:${p}" class="${state.page === p ? 'active' : ''}">${pageLabels[p]}</button>`).join('')}</nav>` : '';
  return `<header class="site-header"><div class="shell header-inner"><button type="button" class="brand" data-action="home" aria-label="AI Career Navigator home"><span class="brand-mark"><i></i><i></i><i></i></span><span>AI Career<br><b>Navigator</b></span></button>${links}<div class="header-actions">${badge()}${state.report ? button('Start over', 'restart', 'button small ghost') : button('Start assessment', 'start', 'button small dark')}</div></div></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="shell footer-inner"><span class="footer-brand">AI Career Navigator <span>·</span> Your Skills. Your Future. Your Choice.</span><span>Interactive prototype V0.1 · Scripted demo, no AI inference</span></div></footer>`;
}
function heroGraphic() {
  return `<div class="hero-visual" aria-label="Illustration of capabilities leading to future paths" role="img"><div class="visual-grid"></div><div class="visual-top"><span class="micro">YOUR CAREER, IN CONTEXT</span><span class="visual-index">01 / 03</span></div><div class="visual-orbit"><div class="orbit-ring ring-one"></div><div class="orbit-ring ring-two"></div><div class="orbit-core"><span>YOU</span><strong>More than<br>a job title.</strong></div><div class="orbit-node node-a">Skills</div><div class="orbit-node node-b">AI + work</div><div class="orbit-node node-c">Possibilities</div></div><div class="visual-bottom"><span class="sparkle">✳</span><span>From uncertainty<br>to informed choices.</span><span class="mini-arrow">↗</span></div></div>`;
}
function home() {
  return `<main><section class="hero shell"><div class="hero-copy"><div class="eyebrow"><span class="eyebrow-line"></span> A more human way to navigate change</div><h1>Your skills.<br>Your future.<br><em>Your choice.</em></h1><p class="hero-lede">Understand what you bring to work, how AI may change your tasks, and which next steps fit your real life.</p><div class="hero-buttons">${button(`Start assessment ${iconArrow()}`, 'start')}${button('Explore a demo', 'samples', 'button secondary')}</div><div class="hero-note"><span class="shield">✦</span><span>Made for clarity, not predictions. This prototype uses transparent mock scenarios.</span></div></div>${heroGraphic()}</section><section class="proof-strip"><div class="shell proof-inner"><span>Know your strengths</span><span class="proof-divider"></span><span>Understand changing tasks</span><span class="proof-divider"></span><span>Choose your next move</span></div></section><section class="section shell" id="approach"><div class="section-heading"><div><span class="kicker">THE APPROACH</span><h2>A clearer picture of<br>what comes next.</h2></div><p>Career change is personal. We connect your experience, the tasks that are changing, and the limits that shape what is realistic.</p></div><div class="feature-grid"><article class="feature-card"><span class="feature-icon violet">◇</span><span class="feature-num">01 / UNDERSTAND</span><h3>See your capabilities</h3><p>Look at what you can do independently, with AI, and what you could explore next. Every insight points back to evidence.</p></article><article class="feature-card"><span class="feature-icon peach">✳</span><span class="feature-num">02 / INTERPRET</span><h3>Look beyond job titles</h3><p>Explore which specific tasks AI may assist, which may be automated, and where human judgment remains central.</p></article><article class="feature-card"><span class="feature-icon mint">↗</span><span class="feature-num">03 / DECIDE</span><h3>Compare real options</h3><p>See how upgrading your role or exploring a new direction could work, with trade-offs and a small, testable next step.</p></article></div></section><section class="process-section"><div class="shell process-inner"><div><span class="kicker">HOW IT WORKS</span><h2>One step at a time.<br><em>At your pace.</em></h2><p>We start with your context, then move from explanation to action. You stay in control of the decision.</p>${button(`Begin your assessment ${iconArrow()}`, 'start', 'button light')}</div><ol class="process-list"><li><b>01</b><div><strong>Tell us about your work</strong><span>Your background, tasks, skills and constraints.</span></div></li><li><b>02</b><div><strong>Explore the analysis</strong><span>Capabilities and task-level AI impact.</span></div></li><li><b>03</b><div><strong>Compare two paths</strong><span>Upgrade where you are or explore a new direction.</span></div></li><li><b>04</b><div><strong>Try a practical next step</strong><span>A small project with a way to check progress.</span></div></li></ol></div></section><section class="bottom-cta shell"><div><span class="kicker">YOUR NEXT CHAPTER</span><h2>Make sense of change.<br>Then make your move.</h2></div>${button(`Start assessment ${iconArrow()}`, 'start')}</section></main>`;
}
function samples() {
  return `<main class="subpage shell"><div class="back-row">${button('← Back to home','home','text-button')}</div><div class="intro-narrow"><span class="kicker">EXPLORE THE PROTOTYPE</span><h1>Choose a starting point.</h1><p>Load a fictional profile to see how the experience changes. You can edit every answer before generating a mock report.</p>${badge('TWO FICTIONAL DEMO CASES')}</div><div class="sample-grid">${Object.entries(cases).map(([id,c]) => `<button class="sample-card ${c.color}" type="button" data-action="sample:${id}"><span class="sample-top"><span class="sample-icon">${id==='marketing'?'✳':'◇'}</span><span>CASE 0${id==='marketing'?'1':'2'}</span></span><strong>${esc(c.label)}</strong><p>${id==='marketing'?'Wants to use AI to move from content production toward strategy.':'Wants to explore a move from administration into operations.'}</p><span class="sample-link">Load this profile ↗</span></button>`).join('')}</div><div class="info-banner"><span>ⓘ</span><p>These examples are fictional. Their insights are scripted for interaction testing and are not validated career research.</p></div></main>`;
}
const fieldMeta = {
  background: ['Current role or field', 'e.g. Marketing specialist', 'text'],
  experience: ['Professional experience', '', 'select'],
  tasks: ['What do you do on a typical week?', 'Describe 2–4 tasks you actually perform.', 'textarea'],
  skills: ['What skills do you already use?', 'Include professional and people skills.', 'textarea'],
  aiUse: ['How have you used AI tools so far?', 'It is completely fine to be new to AI.', 'textarea'],
  concerns: ['What feels uncertain right now?', 'What is changing or worrying you?', 'textarea'],
  goal: ['What would you like to move toward?', 'e.g. Grow into a strategic role, or explore operations.', 'textarea'],
  hours: ['Hours you can learn per week', '1–40', 'number'],
  constraints: ['What needs to be realistic?', 'Time, budget, access, responsibilities or other limits.', 'textarea']
};
function renderField(key) {
  const [label, placeholder, type] = fieldMeta[key];
  const error = state.errors[key] ? `<span class="field-error" id="error-${key}">${esc(state.errors[key])}</span>` : '';
  const common = `name="${key}" id="field-${key}" aria-invalid="${!!state.errors[key]}" ${state.errors[key] ? `aria-describedby="error-${key}"`: ''}`;
  let control = type === 'textarea' ? `<textarea ${common} rows="4" placeholder="${placeholder}">${esc(state.profile[key])}</textarea>` : type === 'select' ? `<select ${common}><option value="">Select experience</option>${['Student / exploring','Less than 1 year','1–2 years','3–5 years','6–10 years','10+ years'].map(x=>`<option value="${x}" ${state.profile[key]===x?'selected':''}>${x}</option>`).join('')}</select>` : `<input ${common} type="${type}" ${type==='number'?'min="1" max="40"':''} placeholder="${placeholder}" value="${esc(state.profile[key])}" />`;
  return `<div class="field"><label for="field-${key}">${label}<span class="required"> *</span></label>${control}${error}</div>`;
}
function profile() {
  const step = steps[state.step];
  const intro = [
    'Your work is more than a job title. Start with the context that feels closest to you.',
    'Specific tasks and skills help make the experience more useful than a generic career quiz.',
    'There is no right answer. We want to understand your starting point and what matters to you.',
    'The best next step is one that fits your time, resources and goals.'
  ];
  return `<main class="form-page"><div class="shell"><div class="back-row">${button(state.step===0?'← Back to home':'← Previous step',state.step===0?'home':'prev','text-button')}</div><div class="form-shell"><aside class="form-side"><span class="kicker">PERSONAL PROFILE</span><h1>Let's start<br>with <em>you.</em></h1><p>Four focused steps. Your answers stay in this browser session and are only used to assemble a scripted demo.</p><div class="privacy-note"><span>✳</span><div><strong>Your choice, always.</strong><p>No account, no upload and no AI API call in this prototype.</p></div></div></aside><div class="form-card"><div class="progress-top"><span>${step.eyebrow}</span><span>${Math.round((state.step+1)/steps.length*100)}% complete</span></div><div class="progress-track"><div style="width:${(state.step+1)/steps.length*100}%"></div></div><h2>${step.title}</h2><p class="form-intro">${intro[state.step]}</p><form id="profile-form" novalidate>${state.step===0 ? `<div class="field"><label for="field-scenario">Demo context <span class="required">*</span></label><select name="scenario" id="field-scenario" aria-invalid="${!!state.errors.scenario}" ${state.errors.scenario?'aria-describedby="error-scenario"':''}><option value="">Choose one of two supported cases</option><option value="marketing" ${state.profile.scenario==='marketing'?'selected':''}>Marketing</option><option value="admin" ${state.profile.scenario==='admin'?'selected':''}>Administration</option></select>${state.errors.scenario?`<span class="field-error" id="error-scenario">${esc(state.errors.scenario)}</span>`:''}<span class="field-help">V0.1 only includes these two scripted demo contexts.</span></div>`:''}${step.fields.filter(f=>f!=='scenario').map(renderField).join('')}<div class="form-actions"><span>Step ${state.step+1} of ${steps.length}</span><button class="button primary" type="submit">${state.step===steps.length-1?'View mock report':'Continue'} <span aria-hidden="true">→</span></button></div></form></div></div></div></main>`;
}
function reportHeader(kicker, title, lede) {
  return `<div class="report-head"><div class="report-head-top"><span class="kicker">${kicker}</span>${badge()}</div><h1>${title}</h1><p>${lede}</p></div>`;
}
function reportShell(content, active) {
  const r = state.report;
  return `<main class="report-page shell"><aside class="report-sidebar"><div class="sidebar-sticky"><div class="report-person"><span class="person-avatar">${r.scenario.short.slice(0,1)}</span><div><span>DEMO PROFILE</span><strong>${esc(r.profile.background)}</strong></div></div><nav aria-label="Report sections" class="report-nav">${reportPages.map((p,i)=>`<button type="button" data-action="page:${p}" class="${active===p?'active':''}"><span>0${i+1}</span>${pageLabels[p]}<b>↗</b></button>`).join('')}</nav><div class="sidebar-bottom"><span>YOUR INPUT</span><p>${esc(r.profile.experience)} · ${r.weeklyHours}h/week</p>${button('Edit your answers ↗','edit','text-button')}</div></div></aside><div class="report-main">${content}<div class="report-bottom-nav">${active==='capability'?button('Back to profile','edit','button secondary'):button('← Previous',`page:${reportPages[reportPages.indexOf(active)-1]}`,'button secondary')}${active==='plan'?button('Start again ↗','restart','button primary'):button(`Next: ${pageLabels[reportPages[reportPages.indexOf(active)+1]]} →`,`page:${reportPages[reportPages.indexOf(active)+1]}`,'button primary')}</div></div></main>`;
}
function methodology() { return `<div class="method-note"><span class="method-icon">ⓘ</span><div><strong>How to read this demo</strong><p>${esc(state.report.evidenceLimit)} Treat each suggestion as a hypothesis to test, not a prediction.</p></div></div>`; }
function capability() {
  const r=state.report;
  return reportShell(`${reportHeader('01 / CAPABILITY ASSESSMENT','What you bring to the table.','Three lenses on your experience. We show concrete clues and open questions instead of a made-up score.')}<div class="profile-summary"><span>BASED ON YOUR ANSWERS</span><p>“${esc(r.profile.skills)}”</p><small>${esc(r.profile.background)} · ${esc(r.profile.experience)}</small></div><div class="capability-grid">${r.scenario.capabilities.map((c,i)=>`<article class="cap-card cap-${i}"><div class="cap-top"><span class="cap-icon">${c.icon}</span><span class="cap-label">LENS ${i+1}</span></div><h2>${c.title}</h2><p class="cap-summary">${c.summary}</p><div class="cap-detail"><span class="small-label">WHY THIS APPEARS</span><p>${i===0 ? `Your self-reported tasks: ${esc(r.profile.tasks)}` : i===1 ? `Your self-reported AI use: ${esc(r.profile.aiUse)}` : c.evidence}</p></div><div class="chip-row">${c.examples.map(e=>`<span>${e}</span>`).join('')}</div><div class="cap-next"><span>WHAT TO VERIFY NEXT</span><p>${c.next}</p></div></article>`).join('')}</div>${methodology()}`,'capability');
}
const taskLabels = { 'AI can assist':'Assist', 'Automation potential':'Automate', 'Human judgment':'Human-led', 'Develop further':'Grow' };
function impact() {
  const r=state.report;
  return reportShell(`${reportHeader('02 / AI CAREER IMPACT','Look at the work. Not the label.','AI can affect different tasks in different ways. The cards below are scripted examples for your chosen demo context.')}<div class="impact-intro"><span class="impact-symbol">✳</span><div><strong>${esc(r.scenario.label)}</strong><p>Your self-reported tasks: ${esc(r.profile.tasks)}</p></div></div><div class="task-grid">${r.scenario.tasks.map((t,i)=>`<article class="task-card task-${i}"><div class="task-top"><span class="task-dot"></span><span>${t.type.toUpperCase()}</span></div><h2>${t.name}</h2><p>${t.note}</p><span class="task-tag">${taskLabels[t.type]}</span></article>`).join('')}</div><div class="explain-panel"><div><span class="kicker">A USEFUL DISTINCTION</span><h3>Possible to automate ≠ guaranteed to disappear.</h3></div><p>Technical capability, workplace adoption, responsibility and human preference are different questions. This prototype does not assign a job replacement probability.</p></div>${methodology()}`,'impact');
}
function pathCard(id) {
  const p=state.report.scenario.paths[id]; const selected=state.path===id;
  const list=(label,items)=>`<div class="path-list"><span>${label}</span><ul>${items.map(item=>`<li>${item}</li>`).join('')}</ul></div>`;
  return `<article class="path-card ${selected?'selected':''}"><div class="path-top"><span>PATH ${id}</span>${selected?'<span class="selected-pill">SELECTED</span>':''}</div><h2>${p.title}</h2><p class="path-subtitle">${p.subtitle}</p><div class="why-box"><span>WHY CONSIDER IT</span><p>${p.why}</p></div><div class="path-columns">${list('YOUR STRENGTHS',p.strengths)}${list('SKILLS TO ADD',p.gaps)}${list('POTENTIAL OPPORTUNITIES',p.opportunities)}</div><div class="path-reality"><span>REAL-WORLD LIMIT</span><p>${p.constraints}</p></div><div class="path-next"><span>NEXT EXPERIMENT</span><p>${p.next}</p></div>${button(selected?'Current focus ✓':'Focus on this path',`select:${id}`,selected?'button selected-button':'button secondary')}</article>`;
}
function paths() {
  const recommendation=recommendedPath(state.report.profile);
  return reportShell(`${reportHeader('03 / CAREER PATHS','Two ways forward. One decision that stays yours.','Compare an upgrade to your current work with a small exploration of an adjacent role. You can keep both options open.')}<div class="path-tip"><span>✦</span><p>From your stated goal, <strong>Path ${recommendation}</strong> may be a useful first experiment. This is a demo suggestion, not a recommendation based on validated market data.</p></div><div class="paths-grid">${pathCard('A')}${pathCard('B')}</div><div class="choice-banner"><strong>Your choice can change.</strong><span>Try one small experiment before committing to a major career move.</span></div>${methodology()}`,'paths');
}
function plan() {
  const r=state.report, p=r.scenario.plan[state.path], path=r.scenario.paths[state.path];
  return reportShell(`${reportHeader('04 / ACTION PLAN','Make the next step visible.','A practical starting plan for your selected demo path, shaped around the time you said you have.')}<div class="plan-summary"><div><span>YOUR FOCUS</span><h2>Path ${state.path}: ${path.subtitle}</h2><p>${esc(r.profile.goal)}</p></div><div class="time-token"><strong>${r.weeklyHours}h</strong><span>per week available</span></div></div><div class="plan-layout"><section class="plan-primary"><div class="plan-section-title"><span>01</span><div><small>THE PRACTICE PROJECT</small><h2>Build evidence, not just confidence.</h2></div></div><p class="project-copy">${p.project}</p><div class="milestone-box"><span>SHORT-TERM MILESTONE</span><strong>${p.milestone}</strong></div><div class="proof-box"><span>HOW TO CHECK PROGRESS</span><p>${p.proof}</p></div></section><div class="plan-side"><section class="plan-mini"><span class="small-label">02 / SKILLS TO PRIORITIZE</span><ol>${p.skills.map(x=>`<li>${x}</li>`).join('')}</ol></section><section class="plan-mini"><span class="small-label">03 / TOOLS TO EXPLORE</span><ul>${p.tools.map(x=>`<li>${x}</li>`).join('')}</ul><p class="tool-note">Examples only. Check workplace privacy rules before entering any real work data into an AI tool.</p></section></div></div><div class="reality-panel"><span>YOUR REAL-WORLD LIMIT</span><p>${esc(r.profile.constraints)}</p><small>Keep the project small enough to fit roughly ${r.weeklyHours} hour${r.weeklyHours===1?'':'s'} per week. Adjust the milestone if that is unrealistic.</small></div>${methodology()}`,'plan');
}
function render() {
  const pageContent = ({ home, samples, profile, capability, impact, paths, plan })[state.page]();
  root.innerHTML = `${header()}${pageContent}${footer()}`;
  document.title = `${state.page==='home'?'AI Career Navigator':state.page==='profile'?'Your profile':pageLabels[state.page]||'Explore demos'} · Interactive Prototype`;
}
function go(page) { state.page=page; render(); window.scrollTo({top:0,behavior:'instant'}); }
function collectForm() { const form=document.getElementById('profile-form'); if (!form) return; const values=new FormData(form); for (const [key,value] of values) state.profile[key]=String(value).trim(); }
root.addEventListener('click', event=>{
  const control=event.target.closest('[data-action]'); if(!control) return;
  const action=control.dataset.action;
  if(action==='home') { state.report=null; return go('home'); }
  if(action==='start') { state.profile=emptyProfile(); state.report=null; state.step=0; state.errors={}; return go('profile'); }
  if(action==='samples') return go('samples');
  if(action.startsWith('sample:')) { state.profile=sampleProfile(action.split(':')[1]); state.report=null; state.step=0; state.errors={}; return go('profile'); }
  if(action==='prev') { collectForm(); state.errors={}; state.step=Math.max(0,state.step-1); return go('profile'); }
  if(action==='edit') { state.report=null; state.errors={}; state.step=0; return go('profile'); }
  if(action==='restart') { state.report=null; state.profile=emptyProfile(); state.step=0; state.path='A'; state.errors={}; return go('home'); }
  if(action.startsWith('page:') && state.report) return go(action.split(':')[1]);
  if(action.startsWith('select:') && state.report) { state.path=action.split(':')[1]; return go('paths'); }
});
root.addEventListener('submit', event=>{
  if(event.target.id!=='profile-form') return;
  event.preventDefault(); collectForm(); state.errors=validateStep(state.profile,state.step);
  if(Object.keys(state.errors).length) { render(); document.getElementById(`field-${Object.keys(state.errors)[0]}`)?.focus(); return; }
  if(state.step<steps.length-1) {state.step++; return go('profile');}
  state.report=makeReport(state.profile); state.path=recommendedPath(state.profile); go('capability');
});
render();
