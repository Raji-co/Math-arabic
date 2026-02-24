import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

// Sample article content using Serlo Editor format
const makeArticleContent = (intro: string) => JSON.stringify({
    plugin: 'rows',
    state: [
        {
            plugin: 'text',
            state: [
                { type: 'h', level: 2, children: [{ text: 'المقدمة' }] },
                { type: 'p', children: [{ text: intro }] },
            ],
        },
        {
            plugin: 'text',
            state: [
                { type: 'h', level: 2, children: [{ text: 'الأمثلة' }] },
                { type: 'p', children: [{ text: 'فيما يلي بعض الأمثلة التوضيحية لفهم هذا المفهوم بشكل أفضل.' }] },
            ],
        },
        {
            plugin: 'text',
            state: [
                { type: 'h', level: 2, children: [{ text: 'خلاصة' }] },
                { type: 'p', children: [{ text: 'تعتبر هذه المفاهيم من الأساسيات الضرورية لفهم الرياضيات بشكل عام.' }] },
            ],
        },
    ],
});

async function main() {
    console.log('🌱 Seeding database...');

    // Clean up existing data (order matters for FK constraints)
    await prisma.curriculumTag.deleteMany();
    await prisma.taxonomyLink.deleteMany();
    await prisma.node.deleteMany();
    await prisma.user.deleteMany();

    // --- Create default admin user ---
    const adminPassword = await bcrypt.hash('admin123', 12);
    await prisma.user.create({
        data: {
            name: 'مدير المنصة',
            email: 'admin@serlo-ar.local',
            passwordHash: adminPassword,
            role: 'admin',
        },
    });
    console.log('👑 Admin user created: admin@serlo-ar.local / admin123');

    // ===================================================================
    // LEVEL 0 — Root: الرياضيات
    // ===================================================================
    const math = await prisma.node.create({
        data: { id: 'topic-math', type: 'topic', title: 'الرياضيات', description: 'مادة الرياضيات للمرحلة الابتدائية والمتوسطة والثانوية', status: 'published' }
    });

    // ===================================================================
    // LEVEL 1 — Big branches under Math
    // ===================================================================
    const algebra = await prisma.node.create({
        data: { id: 'topic-algebra', type: 'topic', title: 'الجبر', description: 'المعادلات، المتباينات، والدوال الجبرية', status: 'published' }
    });
    const geometry = await prisma.node.create({
        data: { id: 'topic-geometry', type: 'topic', title: 'الهندسة', description: 'الأشكال الهندسية، المساحات، والأحجام', status: 'published' }
    });
    const calculus = await prisma.node.create({
        data: { id: 'topic-calculus', type: 'topic', title: 'التفاضل والتكامل', description: 'النهايات، المشتقات، والتكاملات', status: 'published' }
    });
    const statistics = await prisma.node.create({
        data: { id: 'topic-statistics', type: 'topic', title: 'الإحصاء والاحتمالات', description: 'تحليل البيانات، المقاييس الإحصائية، ونظرية الاحتمالات', status: 'published' }
    });

    // ===================================================================
    // LEVEL 2 — Subtopics under الجبر
    // ===================================================================
    const equations = await prisma.node.create({
        data: { id: 'topic-equations', type: 'topic', title: 'المعادلات', description: 'المعادلات الخطية، التربيعية، والمتعددة الحدود', status: 'published' }
    });
    const functions = await prisma.node.create({
        data: { id: 'topic-functions', type: 'topic', title: 'الدوال', description: 'مفهوم الدالة، أنواعها، وتمثيلها البياني', status: 'published' }
    });
    const inequalities = await prisma.node.create({
        data: { id: 'topic-inequalities', type: 'topic', title: 'المتباينات', description: 'المتباينات الخطية والتربيعية وأنظمة المتباينات', status: 'published' }
    });

    // LEVEL 2 — Subtopics under الهندسة
    const coordSystem = await prisma.node.create({
        data: { id: 'topic-coordinate-system', type: 'topic', title: 'نظام الإحداثيات', description: 'المستوى الإحداثي الديكارتي ثنائي وثلاثي الأبعاد', status: 'published' }
    });
    const triangles = await prisma.node.create({
        data: { id: 'topic-triangles', type: 'topic', title: 'المثلثات', description: 'أنواع المثلثات، خصائصها، ومبرهنة فيثاغورس', status: 'published' }
    });
    const circles = await prisma.node.create({
        data: { id: 'topic-circles', type: 'topic', title: 'الدائرة', description: 'محيط الدائرة، مساحتها، وقوانين الأوتار', status: 'published' }
    });

    // LEVEL 2 — Subtopics under التفاضل والتكامل
    const limits = await prisma.node.create({
        data: { id: 'topic-limits', type: 'topic', title: 'النهايات', description: 'مفهوم النهاية وقوانين حساب النهايات', status: 'published' }
    });
    const derivatives = await prisma.node.create({
        data: { id: 'topic-derivatives', type: 'topic', title: 'المشتقات', description: 'مفهوم المشتقة وقواعد الاشتقاق', status: 'published' }
    });

    // LEVEL 2 — Subtopics under الإحصاء والاحتمالات
    const dataAnalysis = await prisma.node.create({
        data: { id: 'topic-data-analysis', type: 'topic', title: 'تحليل البيانات', description: 'المتوسط الحسابي، الوسيط، المنوال، والانحراف المعياري', status: 'published' }
    });
    const probability = await prisma.node.create({
        data: { id: 'topic-probability', type: 'topic', title: 'نظرية الاحتمالات', description: 'الأحداث والفضاء العيني وقوانين الاحتمال', status: 'published' }
    });

    // ===================================================================
    // ARTICLES
    // ===================================================================

    // Articles under نظام الإحداثيات
    const artCoordSys = await prisma.node.create({ data: { id: 'art-coord-sys', type: 'article', title: 'مقدمة في نظام الإحداثيات', status: 'published', content: makeArticleContent('نظام الإحداثيات هو إطار رياضي يُستخدم لتحديد موضع نقطة في الفضاء. يتكون من محورين متعامدين: المحور الأفقي (x) والمحور الرأسي (y)، يتقاطعان عند نقطة تُسمى نقطة الأصل.') } });
    const artCartesian = await prisma.node.create({ data: { id: 'art-cartesian', type: 'article', title: 'المستوى الإحداثي الديكارتي', status: 'published', content: makeArticleContent('المستوى الإحداثي الديكارتي هو نظام إحداثيات يعتمد على محورين متعامدين. سُمّي نسبةً إلى العالم رينيه ديكارت. يُقسم المستوى إلى أربعة أرباع وفقاً لاتجاه المحورين.') } });
    const artQuadrants = await prisma.node.create({ data: { id: 'art-quadrants', type: 'article', title: 'الأرباع في نظام الإحداثيات', status: 'published', content: makeArticleContent('ينقسم المستوى الإحداثي إلى أربعة أرباع: الربع الأول (x>0, y>0)، الربع الثاني (x<0, y>0)، الربع الثالث (x<0, y<0)، والربع الرابع (x>0, y<0).') } });

    // Articles under المعادلات
    const artLinearEq = await prisma.node.create({ data: { id: 'art-linear-eq', type: 'article', title: 'المعادلات الخطية', status: 'published', content: makeArticleContent('المعادلة الخطية هي معادلة من الدرجة الأولى في متغير واحد أو أكثر. شكلها العام: ax + b = 0، حيث a ≠ 0. حلّها يتمثل في إيجاد قيمة x التي تجعل المعادلة صحيحة.') } });
    const artQuadraticEq = await prisma.node.create({ data: { id: 'art-quadratic-eq', type: 'article', title: 'المعادلات التربيعية', status: 'published', content: makeArticleContent('المعادلة التربيعية هي معادلة من الدرجة الثانية شكلها: ax² + bx + c = 0. تُحل بالتحليل، أو بإكمال المربع، أو بالقانون العام: x = (−b ± √(b²−4ac)) / 2a.') } });

    // Articles under الدوال
    const artFunctionConcept = await prisma.node.create({ data: { id: 'art-function-concept', type: 'article', title: 'مفهوم الدالة', status: 'published', content: makeArticleContent('الدالة هي قاعدة رياضية تربط كل عنصر في مجموعة المجال بعنصر واحد بالضبط في مجموعة المدى. يُرمز إليها عادةً بـ f(x)، حيث x هو المتغير المستقل.') } });
    const artLinearFunc = await prisma.node.create({ data: { id: 'art-linear-func', type: 'article', title: 'الدوال الخطية', status: 'published', content: makeArticleContent('الدالة الخطية هي دالة شكلها f(x) = mx + b، حيث m هو الميل وb هو قاطع المحور الصادي. تمثيلها البياني خط مستقيم دائماً.') } });

    // Articles under المثلثات
    const artPythagoras = await prisma.node.create({ data: { id: 'art-pythagoras', type: 'article', title: 'مبرهنة فيثاغورس', status: 'published', content: makeArticleContent('تنص مبرهنة فيثاغورس على أن: في المثلث القائم الزاوية، مربع طول الوتر يساوي مجموع مربعي طولَي الضلعين الآخرين. صياغتها: c² = a² + b².') } });
    const artTriangleTypes = await prisma.node.create({ data: { id: 'art-triangle-types', type: 'article', title: 'أنواع المثلثات', status: 'published', content: makeArticleContent('تُصنَّف المثلثات من حيث الأضلاع إلى: متساوي الأضلاع، متساوي الساقين، مختلف الأضلاع. ومن حيث الزوايا إلى: حاد الزوايا، قائم الزاوية، منفرج الزاوية.') } });

    // Articles under الدائرة
    const artCircleProps = await prisma.node.create({ data: { id: 'art-circle-props', type: 'article', title: 'خصائص الدائرة', status: 'published', content: makeArticleContent('الدائرة هي مجموعة النقاط المتساوية البُعد عن نقطة ثابتة تُسمى المركز. أهم مقاداتها: المحيط = 2πr، المساحة = πr²، حيث r هو نصف القطر.') } });

    // Articles under النهايات
    const artLimitConcept = await prisma.node.create({ data: { id: 'art-limit-concept', type: 'article', title: 'مفهوم النهاية', status: 'published', content: makeArticleContent('النهاية تصف سلوك دالة عندما يقترب المتغير من قيمة معينة. نكتب: lim(x→a) f(x) = L، أي أن قيم f(x) تقترب من L كلما اقترب x من a.') } });

    // Articles under المشتقات
    const artDerivativeConcept = await prisma.node.create({ data: { id: 'art-derivative-concept', type: 'article', title: 'مفهوم المشتقة', status: 'published', content: makeArticleContent('المشتقة تقيس معدل التغير اللحظي لدالة. هي النهاية: f\'(x) = lim(h→0) [f(x+h) - f(x)] / h. تُستخدم لإيجاد ميل المماس عند نقطة على منحنى الدالة.') } });

    // Articles under تحليل البيانات
    const artMeanMedian = await prisma.node.create({ data: { id: 'art-mean-median', type: 'article', title: 'المتوسط والوسيط والمنوال', status: 'published', content: makeArticleContent('المتوسط الحسابي = مجموع القيم ÷ عددها. الوسيط هو القيمة الوسطى عند الترتيب التصاعدي. المنوال هو القيمة الأكثر تكراراً في مجموعة البيانات.') } });

    // Articles under الاحتمالات
    const artProbabilityBasics = await prisma.node.create({ data: { id: 'art-probability-basics', type: 'article', title: 'أساسيات الاحتمالات', status: 'published', content: makeArticleContent('الاحتمال هو مقياس لمدى إمكانية وقوع حدث ما. يتراوح بين 0 و1. احتمال الحدث A = عدد النتائج المواتية ÷ عدد النتائج الكلية في الفضاء العيني.') } });

    // Existing coord system articles
    const artDraw3d = await prisma.node.create({ data: { id: 'art-draw-3d', type: 'article', title: 'الرسم في نظام الإحداثيات ثلاثي الأبعاد', status: 'published', content: makeArticleContent('نظام الإحداثيات ثلاثي الأبعاد يضيف محوراً ثالثاً (z) عمودياً على المحورين x وy. يُستخدم لتحديد مواضع النقاط في الفضاء ثلاثي الأبعاد.') } });

    // ===================================================================
    // BUILD TAXONOMY HIERARCHY
    // ===================================================================
    await prisma.taxonomyLink.createMany({
        data: [
            // Math → big branches
            { parentId: math.id, childId: algebra.id },
            { parentId: math.id, childId: geometry.id },
            { parentId: math.id, childId: calculus.id },
            { parentId: math.id, childId: statistics.id },

            // Algebra → subtopics
            { parentId: algebra.id, childId: equations.id },
            { parentId: algebra.id, childId: functions.id },
            { parentId: algebra.id, childId: inequalities.id },

            // Geometry → subtopics
            { parentId: geometry.id, childId: coordSystem.id },
            { parentId: geometry.id, childId: triangles.id },
            { parentId: geometry.id, childId: circles.id },

            // Calculus → subtopics
            { parentId: calculus.id, childId: limits.id },
            { parentId: calculus.id, childId: derivatives.id },

            // Statistics → subtopics
            { parentId: statistics.id, childId: dataAnalysis.id },
            { parentId: statistics.id, childId: probability.id },

            // نظام الإحداثيات → articles
            { parentId: coordSystem.id, childId: artCoordSys.id },
            { parentId: coordSystem.id, childId: artCartesian.id },
            { parentId: coordSystem.id, childId: artQuadrants.id },
            { parentId: coordSystem.id, childId: artDraw3d.id },

            // المعادلات → articles
            { parentId: equations.id, childId: artLinearEq.id },
            { parentId: equations.id, childId: artQuadraticEq.id },

            // الدوال → articles
            { parentId: functions.id, childId: artFunctionConcept.id },
            { parentId: functions.id, childId: artLinearFunc.id },

            // المثلثات → articles
            { parentId: triangles.id, childId: artPythagoras.id },
            { parentId: triangles.id, childId: artTriangleTypes.id },

            // الدائرة → articles
            { parentId: circles.id, childId: artCircleProps.id },

            // النهايات → articles
            { parentId: limits.id, childId: artLimitConcept.id },

            // المشتقات → articles
            { parentId: derivatives.id, childId: artDerivativeConcept.id },

            // تحليل البيانات → articles
            { parentId: dataAnalysis.id, childId: artMeanMedian.id },

            // الاحتمالات → articles
            { parentId: probability.id, childId: artProbabilityBasics.id },
        ]
    });

    // ===================================================================
    // CURRICULUM TAGS
    // ===================================================================
    await prisma.curriculumTag.createMany({
        data: [
            { nodeId: coordSystem.id, country: 'SA', grade: 4, subject: 'Math' },
            { nodeId: artCoordSys.id, country: 'SA', grade: 4, subject: 'Math' },
            { nodeId: coordSystem.id, country: 'JO', grade: 3, subject: 'Math' },
            { nodeId: equations.id, country: 'SA', grade: 7, subject: 'Math' },
            { nodeId: equations.id, country: 'EG', grade: 8, subject: 'Math' },
            { nodeId: triangles.id, country: 'SA', grade: 5, subject: 'Math' },
            { nodeId: triangles.id, country: 'JO', grade: 5, subject: 'Math' },
            { nodeId: derivatives.id, country: 'SA', grade: 12, subject: 'Math' },
            { nodeId: probability.id, country: 'EG', grade: 10, subject: 'Math' },
        ]
    });

    console.log('✅ Database seeded successfully!');
    console.log('📚 Hierarchy:');
    console.log('   الرياضيات');
    console.log('   ├── الجبر → المعادلات、الدوال、المتباينات');
    console.log('   ├── الهندسة → نظام الإحداثيات、المثلثات、الدائرة');
    console.log('   ├── التفاضل والتكامل → النهايات、المشتقات');
    console.log('   └── الإحصاء والاحتمالات → تحليل البيانات、الاحتمالات');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
