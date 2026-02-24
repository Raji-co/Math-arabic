const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, 'node_modules', '@serlo/editor', 'dist', 'index-CEihI8lA.js');
let content = fs.readFileSync(jsPath, 'utf8');

const replacements = {
    'task: "Task"': 'task: "مهمة"',
    'answer: "Answer"': 'answer: "الجواب"',
    'check: "Check"': 'check: "تحقق"',
    'yourAnswer: "Your answer…"': 'yourAnswer: "إجابتك..."',
    'strategy: "Strategy"': 'strategy: "استراتيجية"',
    'solution: "Proposed Solution"': 'solution: "الحل المقترح"',
    'title: "Feedback"': 'title: "الملاحظات (Feedback)"',
    'correct: "Correct!"': 'correct: "صحيح!"',
    'addAnswer: "Add answer"': 'addAnswer: "إضافة خيار"',
    'createSolution: "Create proposed solution"': 'createSolution: "إنشاء حل مقترح"',
    'types: {\\n        blank: "Blank",': 'types: {\\n        blank: "فراغ",', // just in case
    // Also try replacing the standalone "Answer" and "Feedback" and "Correct!?" if they are hardcoded
    'Feedback': 'الملاحظات',
    'Answer': 'الجواب',
    'Correct!?': 'صحيح؟'
};

for (const [eng, ara] of Object.entries(replacements)) {
    // We'll just do a global replace for the strict keys. For 'Feedback' and 'Answer' standalone we'll be careful
    if (eng.includes(': "')) {
        const reg = new RegExp(eng.replace(/[.*+?^${}()|[\]\\\\]/g, '\\\\$&'), 'g');
        content = content.replace(reg, ara);
    }
}

// Hardcode manual replaces for Correct!?
content = content.replace(/"Correct!\\?"/g, '"صحيح؟"');
content = content.replace(/"Add answer \\+"/g, '"إضافة خيار +"');
content = content.replace(/"Create proposed solution \\+"/g, '"إنشاء حل مقترح +"');

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Translated exercise strings in @serlo/editor successfully!');
