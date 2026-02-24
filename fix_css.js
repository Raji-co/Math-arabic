const fs = require('fs');

const cssPath = 'src/app/globals.css';
let css = fs.readFileSync(cssPath, 'utf8');

const startIndex = css.indexOf('/* =========================================================\n   SERLO EDITOR GLOBAL RTL FIXES');

if (startIndex !== -1) {
    css = css.substring(0, startIndex);
}

const newStyles = `/* =========================================================
   SERLO EDITOR GLOBAL RTL FIXES
   ========================================================= */

/* The editor wrapper stays LTR to preserve Tailwind's physical positioning (left, margin-left) for core UI (drag handles, menus) */
.serlo-editor-wrapper {
  direction: ltr;
}

/* Force ALL plugin contents to RTL by default */
.serlo-editor-wrapper [data-document="true"],
.serlo-editor-wrapper .plugin-wrapper-container,
.serlo-editor-wrapper [data-qa^="plugin-"] {
  direction: rtl;
  text-align: right;
}

/* Ensure math formulas (Katex) and symbols are ALWAYS LTR so they render correctly */
.serlo-editor-wrapper .math-block,
.serlo-editor-wrapper .katex,
.serlo-editor-wrapper .katex-display,
.serlo-editor-wrapper .serlo-math-wrapper,
.serlo-editor-wrapper [data-qa="math-editor"] {
  direction: ltr !important;
  text-align: left !important;
  display: inline-block;
}

/* General Layout for Equations (Tables) */
.serlo-editor-wrapper table {
  direction: rtl;
  text-align: right;
  width: 100%;
}
.serlo-editor-wrapper table tr {
  display: flex !important;
  flex-direction: row !important; /* In RTL, this starts from right */
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
.serlo-editor-wrapper table td {
  text-align: right !important;
}

/* Buttons like Add new row should go to the right */
.serlo-editor-wrapper button.serlo-button-edit-secondary,
.serlo-editor-wrapper .mx-side > button {
  float: right;
  direction: rtl;
  clear: both;
}

/* Text inputs, textareas, and contenteditable blocks should be RTL */
.serlo-editor-wrapper textarea,
.serlo-editor-wrapper [contenteditable="true"],
.serlo-editor-wrapper input[type="text"] {
  direction: rtl;
  text-align: right;
}

/* Plugin Toolbars */
.serlo-editor-wrapper .plugin-toolbar {
  direction: rtl;
  flex-direction: row-reverse !important;
}
.serlo-editor-wrapper .plugin-toolbar > div {
  display: flex !important;
  flex-direction: row-reverse !important;
}
/* Ensure the first child container (formatting controls) is pushed to the far left in RTL */
.serlo-editor-wrapper .plugin-toolbar > div:first-child {
  margin-left: auto;
  margin-right: 0;
}

/* General labels and buttons */
.serlo-editor-wrapper label,
.serlo-editor-wrapper button,
.serlo-editor-wrapper select {
  direction: rtl;
  text-align: right;
}

/* Interactive Exercises Flex Layout (Answers, Feedback) */
.serlo-editor-wrapper .serlo-interactive-exercise {
  direction: rtl;
}
.serlo-editor-wrapper [data-qa="plugin-exercise-scq"] .flex.flex-row,
.serlo-editor-wrapper .serlo-interactive-exercise .flex.flex-row,
.serlo-editor-wrapper [data-qa="plugin-exercise-input"] .flex.flex-row {
  flex-direction: row-reverse;
}

/* Check Button Alignment */
.serlo-editor-wrapper .serlo-interactive-exercise-submit-container {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
}
.serlo-editor-wrapper .serlo-interactive-exercise-submit-container .serlo-button-blue {
  font-size: 0;
  margin-right: auto;
  margin-left: 0;
}
.serlo-editor-wrapper .serlo-interactive-exercise-submit-container .serlo-button-blue::after {
  content: "تحقق";
  font-size: 1rem;
}

/* Correct!? */
.serlo-editor-wrapper label:has(input[type="checkbox"]),
.serlo-editor-wrapper label:has(input[type="radio"]) {
  font-size: 0;
}
.serlo-editor-wrapper label:has(input[type="checkbox"])::before,
.serlo-editor-wrapper label:has(input[type="radio"])::before {
  content: "صحيح؟";
  font-size: 1rem;
  margin-left: 0.5rem;
}

/* Answer and Feedback Labels */
.serlo-editor-wrapper [data-qa="plugin-exercise-scq"] .flex-col > .flex:nth-child(1) > span.text-sm.font-bold,
.serlo-editor-wrapper [data-qa="plugin-exercise-input"] .flex-col > .flex:nth-child(1) > span.text-sm.font-bold {
  font-size: 0;
}
.serlo-editor-wrapper [data-qa="plugin-exercise-scq"] .flex-col > .flex:nth-child(1) > span.text-sm.font-bold::after,
.serlo-editor-wrapper [data-qa="plugin-exercise-input"] .flex-col > .flex:nth-child(1) > span.text-sm.font-bold::after {
  content: "الجواب";
  font-size: 0.875rem;
}
.serlo-editor-wrapper [data-qa="plugin-exercise-scq"] .flex-col > .flex:nth-child(2) > span.text-sm.font-bold,
.serlo-editor-wrapper [data-qa="plugin-exercise-input"] .flex-col > .flex:nth-child(2) > span.text-sm.font-bold {
  font-size: 0;
}
.serlo-editor-wrapper [data-qa="plugin-exercise-scq"] .flex-col > .flex:nth-child(2) > span.text-sm.font-bold::after,
.serlo-editor-wrapper [data-qa="plugin-exercise-input"] .flex-col > .flex:nth-child(2) > span.text-sm.font-bold::after {
  content: "الملاحظات (Feedback)";
  font-size: 0.875rem;
}

/* "Add answer +" */
.serlo-editor-wrapper button.serlo-button-light {
  position: relative;
  overflow: hidden;
  color: transparent !important;
}
.serlo-editor-wrapper button.serlo-button-light::after {
  content: "إضافة خيار +";
  color: var(--foreground);
  position: absolute;
  right: 50%;
  transform: translateX(50%);
  white-space: nowrap;
}

/* Delete Button Position */
.serlo-editor-wrapper button[aria-label="remove"],
.serlo-editor-wrapper button[title="Remove"],
.serlo-editor-wrapper div[data-qa="plugin-exercise-scq"] > div.flex > div.flex.flex-col > div.relative > button[aria-label="remove"] {
  position: absolute;
  right: auto;
  left: 0;
}

/* Box Plugin Header Margins */
.serlo-editor-wrapper .serlo-box figcaption span.mr-1\\.5 {
  margin-right: 0;
  margin-left: 0.375rem;
}
.serlo-editor-wrapper .serlo-box figcaption div.-ml-1 {
  margin-left: 0;
  margin-right: -0.25rem;
}

/* Box empty content warning */
.serlo-editor-wrapper .box-warning {
  right: auto !important;
  left: 2.5rem !important;
}

/* Sub-items list default right alignment */
.serlo-editor-wrapper ul,
.serlo-editor-wrapper ol {
  direction: rtl;
  text-align: right;
}
`;

fs.writeFileSync(cssPath, css + newStyles);
console.log('Fixed CSS Applied.');
