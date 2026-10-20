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
