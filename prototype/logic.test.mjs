import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleProfile, validateStep, makeReport, recommendedPath } from './logic.js';

test('both demo cases have distinct task impact and action plan content', () => {
  const marketing = makeReport(sampleProfile('marketing'));
  const admin = makeReport(sampleProfile('admin'));
  assert.notDeepEqual(marketing.scenario.tasks, admin.scenario.tasks);
  assert.notEqual(marketing.scenario.plan.A.project, admin.scenario.plan.A.project);
});

test('validation blocks missing answers and unrealistic weekly hours', () => {
  const p = sampleProfile('admin');
  p.hours = '0';
  assert.ok(validateStep(p, 3).hours);
  p.hours = '2';
  assert.deepEqual(validateStep(p, 3), {});
});

test('goal changes suggested starting path while leaving choice open', () => {
  assert.equal(recommendedPath(sampleProfile('marketing')), 'A');
  assert.equal(recommendedPath(sampleProfile('admin')), 'B');
});

import { escapeHTML, requestAnalysis } from './live.js';
test('live intake permits arbitrary fictional occupations but requires consent', () => {
  const p={...sampleProfile('marketing'),scenario:'',background:'Fictional librarian'};
  assert.deepEqual(validateStep(p,0,'live'),{});
  assert.ok(validateStep(p,3,'live').synthetic);
  p.synthetic=true;
  assert.deepEqual(validateStep(p,3,'live'),{});
});
test('model text is escaped before rendering', () => {
  assert.equal(escapeHTML('<img src=x onerror="alert(1)">'),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});
test('failed AI request never substitutes scripted output', async () => {
  const original=globalThis.fetch;
  globalThis.fetch=async()=>({ok:false,json:async()=>({detail:'RunPod unavailable'})});
  try { await assert.rejects(()=>requestAnalysis(sampleProfile('admin'),'test'),/RunPod unavailable/); }
  finally {globalThis.fetch=original;}
});
test('a mock-shaped response cannot masquerade as real inference', async () => {
  const original=globalThis.fetch;
  globalThis.fetch=async()=>({ok:true,json:async()=>({mode:'demo',analysis:{}})});
  try {await assert.rejects(()=>requestAnalysis(sampleProfile('admin'),'test'),/did not identify real inference/);}
  finally {globalThis.fetch=original;}
});

import { readFileSync } from 'node:fs';
import { renderLiveReport, renderMatching } from './live.js';
test('all live report sections render from the synthetic contract fixture', () => {
  const report=JSON.parse(readFileSync(new URL('../tests/fixtures/report.json',import.meta.url),'utf8'));
  for(const page of ['capability','impact','paths','plan']) {
    for(const path of ['A','B']) {
      const html=renderLiveReport(report,page,path);
      assert.ok(html.includes('TEST FIXTURE — NO MODEL INFERENCE'));
      assert.ok(!html.includes('undefined'));
      assert.ok(html.includes('Source links provide context'));
    }
  }
  const html=renderMatching({...report,note:'Test fixture'});
  assert.ok(html.includes('NO AI INFERENCE'));
  report.analysis.summary.text='<script>alert(1)</script>';
  assert.ok(!renderLiveReport(report,'capability','A').includes('<script>'));
});
