import React, { useEffect, useState } from 'react';
import { Keyboard, Delete, ArrowLeft, ArrowRight, Eraser } from 'lucide-react';

// Input keys (from syllabusExamples) that hold a math expression string.
export const EXPR_KEYS = ['g_expr', 'f_expr', 'P_expr', 'Q_expr', 'R_expr', 'u_ic_str'];

// `|` marks where the cursor lands after inserting a template.
const KEY_GROUPS = [
  {
    title: 'Calculus',
    cols: 3,
    keys: [
      { label: 'd/dx', tpl: 'diff(|, x)', hint: 'Derivative: diff(f, x)' },
      { label: 'd²/dx²', tpl: 'diff(|, x, 2)', hint: 'Second derivative: diff(f, x, 2)' },
      { label: '∫ dx', tpl: 'integrate(|, x)', hint: 'Indefinite integral: integrate(f, x)' },
      { label: '∫ₐᵗ', tpl: 'integrate(|, (t, 0, x))', hint: 'Definite integral from 0 to x: integrate(f(t), (t, 0, x))' },
      { label: 'Σ', tpl: 'summation(|, (k, 1, 10))', hint: 'Sum: summation(f(k), (k, 1, 10))' },
      { label: 'lim', tpl: 'limit(|, x, 0)', hint: 'Limit: limit(f, x, 0)' },
    ],
  },
  {
    title: 'Roots & powers',
    cols: 4,
    keys: [
      { label: '√', tpl: 'sqrt(|)', hint: 'Square root' },
      { label: '∛', tpl: 'cbrt(|)', hint: 'Cube root' },
      { label: 'ⁿ√', tpl: 'root(|, 4)', hint: 'n-th root: root(x, n)' },
      { label: '|x|', tpl: 'abs(|)', hint: 'Absolute value' },
      { label: 'x²', tpl: '^2', hint: 'Square' },
      { label: 'x³', tpl: '^3', hint: 'Cube' },
      { label: 'xⁿ', tpl: '^(|)', hint: 'Power' },
      { label: '1/x', tpl: '1/(|)', hint: 'Reciprocal' },
      { label: 'eˣ', tpl: 'exp(|)', hint: 'Exponential' },
      { label: 'ln', tpl: 'ln(|)', hint: 'Natural logarithm' },
      { label: 'log₁₀', tpl: 'log10(|)', hint: 'Base-10 logarithm' },
      { label: 'log₂', tpl: 'log2(|)', hint: 'Base-2 logarithm' },
    ],
  },
  {
    title: 'Trigonometry',
    cols: 4,
    keys: [
      { label: 'sin', tpl: 'sin(|)' },
      { label: 'cos', tpl: 'cos(|)' },
      { label: 'tan', tpl: 'tan(|)' },
      { label: 'sec', tpl: 'sec(|)' },
      { label: 'sin⁻¹', tpl: 'asin(|)', hint: 'Inverse sine' },
      { label: 'cos⁻¹', tpl: 'acos(|)', hint: 'Inverse cosine' },
      { label: 'tan⁻¹', tpl: 'atan(|)', hint: 'Inverse tangent' },
      { label: 'csc', tpl: 'csc(|)' },
      { label: 'sinh', tpl: 'sinh(|)' },
      { label: 'cosh', tpl: 'cosh(|)' },
      { label: 'tanh', tpl: 'tanh(|)' },
      { label: 'cot', tpl: 'cot(|)' },
    ],
  },
  {
    title: 'Variables & constants',
    cols: 7,
    keys: [
      { label: 'x', tpl: 'x' },
      { label: 'y', tpl: 'y', hint: 'Only used by ODE and Poisson (g(x, y)) inputs' },
      { label: 'π', tpl: 'pi', hint: 'pi' },
      { label: 'e', tpl: 'e', hint: "Euler's number" },
      { label: '(', tpl: '(' },
      { label: ')', tpl: ')' },
      { label: ',', tpl: ', ' },
    ],
  },
];

const PAD_KEYS = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '^', '+',
];

// Insert `text` into a React-controlled input at its cursor. The native value setter
// plus a bubbling `input` event is what makes React's onChange see the change.
function insertAtCursor(input, text) {
  const cursorMarker = text.indexOf('|');
  const insert = cursorMarker === -1 ? text : text.replace('|', '');
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? start;
  const next = input.value.slice(0, start) + insert + input.value.slice(end);
  setInputValue(input, next, start + (cursorMarker === -1 ? insert.length : cursorMarker));
}

function setInputValue(input, value, caret) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
  input.setSelectionRange(caret, caret);
}

function backspace(input) {
  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? start;
  if (start !== end) return setInputValue(input, input.value.slice(0, start) + input.value.slice(end), start);
  if (start === 0) return;
  setInputValue(input, input.value.slice(0, start - 1) + input.value.slice(end), start - 1);
}

function moveCursor(input, delta) {
  const pos = Math.min(Math.max((input.selectionStart ?? 0) + delta, 0), input.value.length);
  input.focus();
  input.setSelectionRange(pos, pos);
}

export default function MathKeyboard() {
  const [target, setTarget] = useState(null);

  // Track the expression field that was focused last, so keyboard clicks know where to type.
  useEffect(() => {
    const onFocusIn = (e) => {
      if (e.target instanceof HTMLInputElement && e.target.dataset.expr) setTarget(e.target);
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  // The field disappears when the method changes; drop the stale reference.
  const activeTarget = target && target.isConnected ? target : null;

  const run = (action) => (e) => {
    e.preventDefault();
    if (activeTarget) action(activeTarget);
  };
  // Keep focus (and the selection) in the field while a key is pressed.
  const keepFocus = (e) => e.preventDefault();

  return (
    <div className="enterprise-card math-keyboard">
      <div className="math-keyboard-header">
        <Keyboard size={16} color="#38bdf8" />
        <span>Math Keyboard</span>
      </div>
      <div className={`math-keyboard-status ${activeTarget ? 'active' : ''}`}>
        {activeTarget
          ? <>Typing into <strong className="font-mono">{activeTarget.dataset.expr}</strong></>
          : 'Click a function field (f(x), g(x), …) to type into it.'}
      </div>

      <div className="math-keyboard-edit">
        <button type="button" className="mk-key mk-key-util" title="Move cursor left" onMouseDown={keepFocus} onClick={run((i) => moveCursor(i, -1))}><ArrowLeft size={14} /></button>
        <button type="button" className="mk-key mk-key-util" title="Move cursor right" onMouseDown={keepFocus} onClick={run((i) => moveCursor(i, 1))}><ArrowRight size={14} /></button>
        <button type="button" className="mk-key mk-key-util" title="Backspace" onMouseDown={keepFocus} onClick={run(backspace)}><Delete size={14} /></button>
        <button type="button" className="mk-key mk-key-util" title="Clear field" onMouseDown={keepFocus} onClick={run((i) => setInputValue(i, '', 0))}><Eraser size={14} /></button>
      </div>

      {KEY_GROUPS.map((group) => (
        <div key={group.title}>
          <div className="math-keyboard-group-title">{group.title}</div>
          <div className="math-keyboard-grid" style={{ gridTemplateColumns: `repeat(${group.cols}, 1fr)` }}>
            {group.keys.map((k) => (
              <button
                key={k.label}
                type="button"
                className="mk-key"
                title={k.hint || k.tpl.replace('|', '')}
                disabled={!activeTarget}
                onMouseDown={keepFocus}
                onClick={run((i) => insertAtCursor(i, k.tpl))}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <div className="math-keyboard-group-title">Numbers & operators</div>
        <div className="math-keyboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {PAD_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              className="mk-key mk-key-pad"
              disabled={!activeTarget}
              onMouseDown={keepFocus}
              onClick={run((i) => insertAtCursor(i, k))}
            >
              {{ '*': '×', '/': '÷', '-': '−' }[k] || k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
