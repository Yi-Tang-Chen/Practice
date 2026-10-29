(function (root) {
  'use strict';
  const labels = Object.freeze({
    defined: 'Defined output',
    undefined: 'Undefined behavior',
    constraint: 'Constraint violation (diagnostic required)',
    implementation: 'Implementation-defined behavior',
    unspecified: 'Unspecified evaluation order',
    layout: 'Depends on ABI / structure layout'
  });

  function normalizeOutput(value) {
    return String(value || '').trim().replace(/\s*=\s*/g, '=').replace(/\s+/g, ' ');
  }

  function hasAnswer(question, answer) {
    if (!answer) return false;
    if (question.group === 'reading') return Boolean(answer.kind || normalizeOutput(answer.output));
    return Boolean(String(answer.text || '').trim());
  }

  function gradeReading(question, answer) {
    if (!hasAnswer(question, answer)) return { status: 'unanswered' };
    const classificationCorrect = answer.kind === question.kind;
    let outputCorrect = null;
    if (question.kind === 'defined') {
      let actual = normalizeOutput(answer.output);
      if (question.id === 'R04') actual = actual.toLowerCase().replace(/^0x/, '');
      outputCorrect = actual === normalizeOutput(question.output);
    }
    return {
      status: classificationCorrect && outputCorrect !== false ? 'correct' : 'incorrect',
      classificationCorrect,
      outputCorrect
    };
  }

  function statusOf(question, answer) {
    if (!hasAnswer(question, answer)) return 'unanswered';
    if (question.group === 'reading') {
      return answer.checked ? gradeReading(question, answer).status : 'pending';
    }
    return answer.review === 'mastered' ? 'mastered'
      : answer.review === 'review' ? 'review' : 'pending';
  }

  const api = { labels, normalizeOutput, hasAnswer, gradeReading, statusOf };
  root.PracticeGrader = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
