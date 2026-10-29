(function () {
  'use strict';
  const questions = globalThis.PRACTICE_QUESTIONS;
  const G = globalThis.PracticeGrader;
  const key = 'firmware-practice-notebook-v1';
  const groups = {
    reading: { title: 'Code reading', nav: 'Code reading', description: 'Read the snippet. Choose its behavior and enter the output when it is defined.' },
    concepts: { title: 'Concept questions', nav: 'Concepts', description: 'Write your answer, compare it with the reference, and mark what needs another pass.' },
    debugging: { title: 'Debugging', nav: 'Debugging', description: 'Identify the fault, give a failing case, and describe your correction and tests.' },
    advanced: { title: 'Design & whiteboard', nav: 'Design & whiteboard', description: 'State your assumptions, outline a design, and work through its boundary cases.' },
    mocks: { title: 'Mock interviews', nav: 'Mock interviews', description: 'Keep your written responses and notes together. Use the scoring guide to review the session.' },
    resume: { title: '履歷深挖', nav: '履歷深挖', description: '144 題，每題四個追問。依你的 resume.pdf 深挖實作、失敗情境與證據；標示職務延伸的題目另採設計提案回答。' }
  };
  const statusLabels = {
    unanswered: 'Not answered', pending: 'Not checked', correct: 'Correct',
    incorrect: 'Needs review', mastered: 'Understood · self-rated', review: 'Needs review · self-rated'
  };
  let answers = {};
  let ui = { group: 'reading', scope: 'pointers', filter: 'all' };
  let storageAvailable = true;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved && saved.version === 1) {
      if (saved.answers && typeof saved.answers === 'object') answers = saved.answers;
      if (saved.ui && groups[saved.ui.group]) ui.group = saved.ui.group;
      if (['pointers', 'memory', 'all'].includes(saved.ui?.scope)) ui.scope = saved.ui.scope;
    }
  } catch (_) { storageAvailable = false; }

  const $ = (id) => document.getElementById(id);
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function button(text, className, action) {
    const element = node('button', className, text);
    element.type = 'button';
    element.addEventListener('click', action);
    return element;
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify({ version: 1, answers, ui }));
      storageAvailable = true;
    } catch (_) { storageAvailable = false; }
    $('storage-note').textContent = storageAvailable
      ? 'Answers saved in this browser'
      : 'Storage unavailable — download answers to keep them';
  }
  function currentSet() {
    return questions.filter(q => {
      if (q.group !== ui.group) return false;
      if (ui.group !== 'reading' || ui.scope === 'all') return true;
      const number = Number(q.id.slice(1));
      return ui.scope === 'pointers' ? number >= 5 && number <= 12
        : (number >= 21 && number <= 25) || number >= 28;
    });
  }
  function getAnswer(q) {
    if (!answers[q.id] || typeof answers[q.id] !== 'object') answers[q.id] = {};
    return answers[q.id];
  }
  function status(q) { return G.statusOf(q, answers[q.id]); }

  // Render only a small Markdown subset. All content uses textContent, including
  // code and reference answers; raw HTML is never inserted into the document.
  function inline(parent, text) {
    const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]*\))/g);
    for (const token of tokens) {
      if (token.startsWith('`') && token.endsWith('`')) parent.append(node('code', '', token.slice(1, -1)));
      else if (token.startsWith('**') && token.endsWith('**')) parent.append(node('strong', '', token.slice(2, -2)));
      else if (/^\[/.test(token)) parent.append(document.createTextNode(token.match(/^\[([^\]]+)\]/)?.[1] || token));
      else parent.append(document.createTextNode(token));
    }
  }
  function markdown(text, className) {
    const container = node('div', className);
    const lines = String(text || '').split('\n');
    let paragraph = [], list = null;
    function flush() {
      if (paragraph.length) {
        const p = node('p'); inline(p, paragraph.join(' ')); container.append(p); paragraph = [];
      }
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('```')) {
        flush(); list = null;
        const code = [];
        while (++i < lines.length && !lines[i].startsWith('```')) code.push(lines[i]);
        const pre = node('pre'); pre.append(node('code', '', code.join('\n'))); container.append(pre);
      } else if (/^#{1,6}\s/.test(line)) {
        flush(); list = null;
        const h = node('h3'); inline(h, line.replace(/^#{1,6}\s+/, '')); container.append(h);
      } else if (/^\s*(?:- |\d+\. )/.test(line)) {
        flush();
        const kind = /^\s*\d+\./.test(line) ? 'ol' : 'ul';
        if (!list || list.tagName.toLowerCase() !== kind) { list = node(kind); container.append(list); }
        const li = node('li'); inline(li, line.replace(/^\s*(?:- |\d+\. )/, '')); list.append(li);
      } else if (!line.trim()) { flush(); list = null; }
      else { list = null; paragraph.push(line); }
    }
    flush();
    return container;
  }

  function showReadingResult(card, q) {
    card.querySelector('.feedback')?.remove();
    const result = G.gradeReading(q, getAnswer(q));
    if (result.status === 'unanswered') return;
    const panel = node('div', 'feedback ' + result.status);
    panel.setAttribute('role', 'status');
    panel.append(node('strong', 'feedback-title', result.status === 'correct' ? 'Correct' : 'Review this answer'));
    panel.append(node('p', '', 'Classification: ' + G.labels[q.kind]));
    if (q.kind === 'defined') {
      if (!result.classificationCorrect) panel.append(node('p', '', 'The behavior classification needs correcting.'));
      if (!result.outputCorrect) panel.append(node('p', '', 'Your predicted output does not match. Expected output:'));
      else panel.append(node('p', '', 'Expected output:'));
      panel.append(node('pre', '', q.output));
    }
    panel.append(node('p', '', q.explanation));
    card.append(panel);
  }
  function showReference(card, q) {
    card.querySelector('.feedback')?.remove();
    const panel = node('div', 'feedback');
    panel.append(node('strong', 'feedback-title', 'Reference answer'));
    panel.append(markdown(q.reference, 'reference'));
    const rating = node('div', 'self-rating');
    rating.append(node('p', '', 'Self-assessment: compare the key points and your reasoning. This response is not automatically graded.'));
    const buttons = node('div', 'rating-buttons');
    for (const [value, label, className] of [
      ['mastered', 'Mark as understood', 'secondary'],
      ['review', 'Needs review', 'secondary review-button']
    ]) {
      const b = button(label, className, () => {
        const answer = getAnswer(q);
        if (!G.hasAnswer(q, answer)) return;
        answer.review = value;
        save(); updateCardStatus(card, q); updateProgress();
        for (const child of buttons.children) child.setAttribute('aria-pressed', String(child === b));
        $('result-summary').textContent = `${q.id}: ${value === 'mastered' ? 'marked as understood' : 'added to your review list'}.`;
        if (ui.filter === 'review' && value === 'mastered') render();
      });
      b.setAttribute('aria-pressed', String(getAnswer(q).review === value));
      buttons.append(b);
    }
    rating.append(buttons); panel.append(rating); card.append(panel);
  }
  function updateCardStatus(card, q) {
    const current = status(q);
    const badge = card.querySelector('.status');
    badge.className = 'status ' + current;
    badge.textContent = current === 'pending' && q.group !== 'reading' ? 'Not self-reviewed' : statusLabels[current];
  }
  function onEdit(card, q) {
    const answer = getAnswer(q);
    answer.checked = false; answer.review = null;
    if (q.group === 'reading') card.querySelector('.feedback')?.remove();
    else card.querySelectorAll('.rating-buttons button').forEach(b => b.setAttribute('aria-pressed', 'false'));
    $('result-summary').textContent = '';
    save(); updateCardStatus(card, q); updateProgress();
  }

  function renderCard(q) {
    const answer = getAnswer(q);
    const card = node('article', 'question-card'); card.id = q.id;
    const top = node('div', 'question-top');
    const name = node('div', 'question-name');
    name.append(node('span', 'question-id', q.id));
    const title = node('h2');
    inline(title, q.title.length > 125 ? q.title.slice(0, 122) + '…' : q.title);
    name.append(title); top.append(name, node('span', 'status')); card.append(top);
    if (q.group === 'reading') {
      card.append(node('p', 'question-prompt', q.prompt));
      const pre = node('pre'); pre.append(node('code', '', q.code)); card.append(pre);
      const row = node('div', 'answer-row');
      const classification = node('div');
      const label = node('label', '', 'Behavior'); label.htmlFor = q.id + '-kind';
      const select = node('select'); select.id = q.id + '-kind'; select.dataset.field = 'kind';
      const placeholder = node('option', '', 'Choose a classification…'); placeholder.value = ''; select.append(placeholder);
      for (const [value, text] of Object.entries(G.labels)) { const o = node('option', '', text); o.value = value; select.append(o); }
      select.value = answer.kind || '';
      classification.append(label, select);
      const prediction = node('div');
      const outputLabel = node('label', '', 'Predicted output'); outputLabel.htmlFor = q.id + '-output';
      const output = node('textarea'); output.id = q.id + '-output'; output.dataset.field = 'output'; output.rows = 1;
      output.value = answer.output || ''; output.spellcheck = false;
      output.disabled = select.value !== 'defined';
      output.placeholder = 'Choose “Defined output” to enter values';
      output.setAttribute('aria-describedby', q.id + '-output-help');
      const help = node('p', 'field-help', 'Separate values with spaces. String case matters.'); help.id = q.id + '-output-help';
      prediction.append(outputLabel, output, help); row.append(classification, prediction); card.append(row);
      select.addEventListener('change', () => {
        answer.kind = select.value; output.disabled = select.value !== 'defined'; onEdit(card, q);
      });
      output.addEventListener('input', () => { answer.output = output.value; onEdit(card, q); });
      const reason = node('details', 'reason'); reason.append(node('summary', '', 'Reasoning notes (optional, not graded)'));
      const notesLabel = node('label', '', 'Your reasoning'); notesLabel.htmlFor = q.id + '-notes';
      const notes = node('textarea'); notes.id = q.id + '-notes'; notes.value = answer.notes || ''; notes.rows = 2;
      notes.addEventListener('input', () => { answer.notes = notes.value; save(); });
      reason.append(notesLabel, notes); card.append(reason);
    } else {
      card.append(markdown(q.body, 'body-markdown'));
      const label = node('label', '', 'Your answer'); label.htmlFor = q.id + '-text';
      const textarea = node('textarea', 'written-answer'); textarea.id = q.id + '-text'; textarea.dataset.field = 'text';
      textarea.value = answer.text || ''; textarea.rows = q.group === 'mocks' ? 10 : 5;
      textarea.placeholder = 'Write your answer here. English or 中文 are both fine.';
      textarea.addEventListener('input', () => { answer.text = textarea.value; onEdit(card, q); });
      card.append(label, textarea, node('p', 'field-help', 'Compare with the reference, then choose your own review status.'));
    }
    const actions = node('div', 'question-actions');
    const action = button(q.group === 'reading' ? 'Check ' + q.id : 'Compare answer', 'secondary', () => {
      if (!G.hasAnswer(q, answer)) {
        $('result-summary').textContent = `${q.id}: write an answer before checking.`;
        card.querySelector(q.group === 'reading' ? 'select' : 'textarea').focus();
        return;
      }
      if (q.group === 'reading') { answer.checked = true; showReadingResult(card, q); }
      else { answer.revealed = true; showReference(card, q); }
      save(); updateCardStatus(card, q); updateProgress();
      if (ui.filter !== 'all') render();
    });
    actions.append(action, node('span', 'saved-label', q.group === 'reading' ? 'Output + classification check' : 'Reference comparison · self-assessed'));
    card.append(actions); updateCardStatus(card, q);
    if (q.group === 'reading' && answer.checked) showReadingResult(card, q);
    if (q.group !== 'reading' && answer.revealed) showReference(card, q);
    return card;
  }

  function updateProgress() {
    const set = currentSet();
    const counts = { correct: 0, incorrect: 0, pending: 0, unanswered: 0, mastered: 0, review: 0 };
    for (const q of set) counts[status(q)]++;
    const answered = set.length - counts.unanswered;
    $('progress-count').textContent = `${answered} / ${set.length} answered`;
    $('progress').max = set.length; $('progress').value = answered;
    $('progress-title').textContent = ui.group === 'reading' ? 'Reading progress' : 'Written responses · self-assessed';
    const stats = $('statistics'); stats.replaceChildren();
    const items = ui.group === 'reading'
      ? [[counts.correct, 'correct'], [counts.incorrect, 'to review'], [counts.pending, 'not checked'], [counts.unanswered, 'unanswered']]
      : [[counts.mastered, 'understood'], [counts.review, 'to review'], [counts.pending, 'not self-reviewed'], [counts.unanswered, 'unanswered']];
    for (const [count, label] of items) { const span = node('span'); span.append(node('strong', '', String(count)), ' ' + label); stats.append(span); }
  }
  function render() {
    const meta = groups[ui.group];
    $('title').textContent = meta.title; $('description').textContent = meta.description;
    $('mode-badge').textContent = ui.group === 'reading' ? 'Auto-graded' : 'Self-assessed';
    $('scope-controls').hidden = ui.group !== 'reading';
    $('check-all').replaceChildren(document.createTextNode(ui.group === 'reading' ? 'Check answers →' : 'Compare answered questions →'));
    $('instructions').replaceChildren(markdown(ui.group === 'reading'
      ? 'Assume C11, 8-bit bytes, 32-bit int and unsigned int, uint32_t = unsigned int, 64-bit unsigned size_t, 8-byte pointers, and no VLAs. Byte order and structure layout are not specified. Function definitions are at file scope; executable statements are inside main.\n\nChoose a behavior first. Only enter an output for Defined output. Whitespace differences are ignored; text output is case-sensitive. Reasoning notes are saved but not automatically graded.\n\nThese snippets are not executed in the browser. Undefined behavior does not have a guaranteed output.'
      : 'Write your answer before opening the reference. Compare the main points, examples, and assumptions. Then mark the response as understood or needing review.\n\nThese are open-ended questions. The page does not automatically judge your wording or reasoning. The reference answers retain the original Chinese explanations. You can answer in either language.\n\nUse the coding/ directory for implementation exercises and their tests. Any coding tasks in a mock interview are reviewed with its scoring guide, not executed here.'));
    for (const b of document.querySelectorAll('[data-scope]')) b.setAttribute('aria-pressed', String(b.dataset.scope === ui.scope));
    for (const b of document.querySelectorAll('[data-filter]')) b.setAttribute('aria-pressed', String(b.dataset.filter === ui.filter));
    for (const b of document.querySelectorAll('[data-group]')) {
      if (b.dataset.group === ui.group) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    }
    const set = currentSet();
    const visible = set.filter(q => ui.filter === 'all' || (ui.filter === 'review'
      ? ['incorrect', 'review'].includes(status(q)) : status(q) === 'unanswered'));
    const container = $('questions'); container.replaceChildren();
    if (visible.length) for (const q of visible) container.append(renderCard(q));
    else container.append(node('div', 'empty', ui.filter === 'review'
      ? 'No questions are marked for review in this set. Check your reading answers or self-review a written response first.'
      : 'No unanswered questions in this set.'));
    $('footer-count').textContent = `${visible.length} shown · ${set.length} in this set · ${questions.length} questions in the notebook`;
    $('bank-count').textContent = `32 reading checks · ${questions.length - 32} written responses`;
    updateProgress(); save();
  }

  for (const [id, meta] of Object.entries(groups)) {
    const b = button('', 'nav-button', () => {
      ui.group = id; ui.filter = 'all'; $('result-summary').textContent = '';
      history.replaceState(null, '', location.pathname + location.search); render(); window.scrollTo(0, 0);
    });
    b.dataset.group = id;
    b.append(node('span', '', meta.nav), node('span', 'nav-count', String(questions.filter(q => q.group === id).length)));
    $('groups').append(b);
  }
  document.querySelectorAll('[data-scope]').forEach(b => b.addEventListener('click', () => {
    ui.scope = b.dataset.scope; ui.filter = 'all'; $('result-summary').textContent = ''; render();
  }));
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { ui.filter = b.dataset.filter; render(); }));
  $('check-all').addEventListener('click', () => {
    const set = currentSet();
    let attempted = 0;
    for (const q of set) {
      const answer = getAnswer(q);
      if (!G.hasAnswer(q, answer)) continue;
      attempted++;
      if (q.group === 'reading') answer.checked = true; else answer.revealed = true;
    }
    render();
    const summary = $('result-summary'); summary.replaceChildren();
    if (!attempted) { summary.textContent = 'Write an answer first. Blank questions are left unanswered.'; return; }
    if (ui.group === 'reading') {
      const correct = set.filter(q => status(q) === 'correct').length;
      summary.append(`${correct} / ${attempted} answered questions correct. ${set.length - attempted} unanswered.`);
    } else summary.append(`References opened for ${attempted} responses. Mark each one after comparing; this is self-assessment.`);
    const review = set.filter(q => ['incorrect', 'review'].includes(status(q)));
    if (review.length) {
      summary.append(' Review: ');
      for (const q of review) summary.append(button(q.id, '', () => {
        ui.filter = 'all'; render(); $(q.id)?.scrollIntoView({ block: 'start' });
      }));
    }
  });
  $('reset').addEventListener('click', () => {
    if (!confirm('Clear answers and review marks for this set? Other sets will be kept.')) return;
    for (const q of currentSet()) delete answers[q.id];
    ui.filter = 'all'; $('result-summary').textContent = ''; render();
  });
  $('export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), answers }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = node('a'); link.href = url; link.download = 'firmware-practice-answers.json';
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  function followHash() {
    const q = questions.find(q => q.id.toLowerCase() === location.hash.slice(1).toLowerCase());
    if (!q) return false;
    ui.group = q.group; ui.scope = 'all'; ui.filter = 'all'; render();
    requestAnimationFrame(() => $(q.id)?.scrollIntoView({ block: 'start' }));
    return true;
  }
  window.addEventListener('hashchange', followHash);
  if (!followHash()) render();
})();
