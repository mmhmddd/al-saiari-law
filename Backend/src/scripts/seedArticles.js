const mongoose = require('mongoose');
const env = require('../config/environment');
const Article = require('../models/Article');
const User = require('../models/User');

const articles = [
  {
    slug: 'choosing-a-company-structure-in-saudi-arabia',
    title: { en: 'Choosing a Company Structure in Saudi Arabia: Key Questions for Founders', ar: 'اختيار الشكل القانوني للشركة في السعودية: أسئلة مهمة للمؤسسين' },
    excerpt: { en: 'A practical starting point for comparing ownership, governance and operating needs before forming a business in Saudi Arabia.', ar: 'دليل عملي لمقارنة احتياجات الملكية والحوكمة والتشغيل قبل تأسيس منشأة في المملكة العربية السعودية.' },
    category: { en: 'Business Setup', ar: 'تأسيس الأعمال' },
    tags: { en: ['company formation', 'Saudi Arabia', 'corporate governance'], ar: ['تأسيس الشركات', 'السعودية', 'حوكمة الشركات'] },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85',
    imageAlt: { en: 'Modern commercial buildings representing business formation', ar: 'مبانٍ تجارية حديثة ترمز إلى تأسيس الأعمال' },
    seo: { en: ['company formation Saudi Arabia', 'business structure', 'Saudi corporate law'], ar: ['تأسيس شركة في السعودية', 'الشكل القانوني', 'نظام الشركات السعودي'] },
    content: {
      en: `<p>Choosing a legal structure is one of the first decisions founders make when establishing a business. The right choice depends on the planned activity, ownership, funding, management and growth plans. There is no single structure that fits every project.</p><h2>Start with the business plan</h2><p>Describe what the business will do, who will own it, where it will operate and how it expects to grow. Consider whether investors or new partners may join, what decisions require shared approval, and how responsibilities will be allocated.</p><ul><li>Compare the available legal forms against the planned activity.</li><li>Agree how ownership, management authority and key decisions will work.</li><li>Plan for funding, transfers, changes and possible exit scenarios.</li></ul><h2>Document the relationship early</h2><p>Founders should discuss contributions, roles, decision-making and dispute handling before launch. Clear constitutional documents and partner arrangements can reduce uncertainty as the business develops. The details should be checked against current regulations and the intended activity.</p><p>For tailored guidance on formation documents and corporate arrangements, see our <a href="/en/services/company-formation">company formation service</a> or <a href="/en/consultation">book a consultation</a>.</p><p>Official reference: <a href="https://business.sa/" target="_blank" rel="noopener noreferrer">Saudi Business Center</a>.</p>`,
      ar: `<p>يعد اختيار الشكل القانوني من القرارات الأولى عند تأسيس المشروع. ويتوقف الاختيار المناسب على النشاط والملكية والتمويل والإدارة وخطط النمو؛ فلا يوجد شكل واحد يناسب جميع المشاريع.</p><h2>ابدأ بخطة العمل</h2><p>حدد نشاط المنشأة وملاكها ومواقع عملها وخطط توسعها. وفكر في دخول مستثمرين أو شركاء جدد، والقرارات التي تتطلب موافقة مشتركة، وكيفية توزيع المسؤوليات.</p><ul><li>قارن الأشكال القانونية المتاحة بالنشاط المزمع.</li><li>اتفق على الملكية وصلاحيات الإدارة والقرارات الجوهرية.</li><li>خطط للتمويل ونقل الحصص والتغييرات والخيارات المستقبلية.</li></ul><h2>وثق العلاقة مبكراً</h2><p>من المفيد أن يناقش المؤسسون المساهمات والأدوار وآلية اتخاذ القرار وتسوية الخلافات قبل بدء النشاط. تساعد وثائق التأسيس وترتيبات الشركاء الواضحة على تقليل الالتباس مع نمو المنشأة. وينبغي مراجعة التفاصيل وفق الأنظمة السارية وطبيعة النشاط.</p><p>للمساعدة في مستندات التأسيس والترتيبات المؤسسية، تعرف على <a href="/ar/services/company-formation">خدمات تأسيس الشركات</a> أو <a href="/ar/consultation">احجز استشارة</a>.</p><p>مرجع رسمي: <a href="https://business.sa/" target="_blank" rel="noopener noreferrer">المركز السعودي للأعمال</a>.</p>`,
    },
  },
  {
    slug: 'commercial-contract-review-checklist',
    title: { en: 'A Commercial Contract Review Checklist for Growing Businesses', ar: 'قائمة مراجعة العقود التجارية للمنشآت النامية' },
    excerpt: { en: 'Review the commercial purpose, responsibilities, payment, risk and exit terms before signing a business agreement.', ar: 'راجع الغرض التجاري والمسؤوليات والمقابل والمخاطر وشروط الإنهاء قبل توقيع الاتفاقية.' },
    category: { en: 'Contracts', ar: 'العقود' },
    tags: { en: ['commercial contracts', 'contract review', 'business'], ar: ['العقود التجارية', 'مراجعة العقود', 'الأعمال'] },
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=85',
    imageAlt: { en: 'Business documents prepared for contract review', ar: 'مستندات أعمال جاهزة لمراجعة عقد تجاري' },
    seo: { en: ['commercial contract review', 'business agreement checklist', 'contract lawyer Saudi Arabia'], ar: ['مراجعة العقود التجارية', 'قائمة مراجعة الاتفاقيات', 'محامي عقود السعودية'] },
    content: {
      en: `<p>A contract should describe the deal the parties actually intend to make. A structured review helps identify unclear terms before they become operational problems. The right level of review depends on the value, duration and risk of the arrangement.</p><h2>Check the commercial essentials</h2><ul><li>Confirm the parties, authority to sign, scope and expected deliverables.</li><li>Make payment dates, invoicing, expenses and taxes understandable.</li><li>Set realistic timelines, acceptance steps and service standards.</li><li>Review confidentiality, data, intellectual property and permitted use.</li></ul><h2>Understand risk and exit options</h2><p>Read liability, indemnity, insurance, force majeure, renewal and termination provisions together. Check what happens to work in progress, confidential information and outstanding payments if the relationship ends. Notice periods and cure rights should be clear and workable.</p><p>Keep drafts and negotiation records, and make sure the final signed version reflects agreed changes. For support with drafting, review or negotiation, explore our <a href="/en/services/contracts-transactions">contracts and transactions service</a>. Official legislation is available through the <a href="https://laws.boe.gov.sa/" target="_blank" rel="noopener noreferrer">Bureau of Experts</a>.</p>`,
      ar: `<p>ينبغي أن يعكس العقد الصفقة التي يقصد الطرفان إبرامها فعلاً. وتساعد المراجعة المنظمة على اكتشاف الشروط غير الواضحة قبل أن تتحول إلى مشكلات تشغيلية. ويتحدد نطاق المراجعة بحسب قيمة العلاقة ومدتها ومخاطرها.</p><h2>تحقق من الأساسيات التجارية</h2><ul><li>تحقق من أطراف العقد وصلاحية التوقيع والنطاق والمخرجات.</li><li>وضح مواعيد الدفع والفواتير والمصروفات والضرائب.</li><li>حدد الجداول الزمنية وآلية القبول ومعايير الخدمة.</li><li>راجع السرية والبيانات والملكية الفكرية والاستخدام المسموح.</li></ul><h2>افهم المخاطر وخيارات الإنهاء</h2><p>اقرأ أحكام المسؤولية والتعويض والتأمين والقوة القاهرة والتجديد والإنهاء معاً. تحقق مما يحدث للأعمال الجارية والمعلومات السرية والمبالغ المستحقة عند انتهاء العلاقة. وينبغي أن تكون مدد الإشعار وفرص معالجة الإخلال واضحة وقابلة للتطبيق.</p><p>احتفظ بالمسودات ومراسلات التفاوض وتأكد من انعكاس التعديلات المتفق عليها في النسخة النهائية. للمساعدة في الإعداد والمراجعة والتفاوض، تعرف على <a href="/ar/services/contracts-transactions">خدمات العقود والصفقات</a>. وتتاح الأنظمة الرسمية عبر <a href="https://laws.boe.gov.sa/" target="_blank" rel="noopener noreferrer">هيئة الخبراء</a>.</p>`,
    },
  },
  {
    slug: 'foreign-investment-market-entry-saudi-arabia',
    title: { en: 'Foreign Investment in Saudi Arabia: Preparing for Market Entry', ar: 'الاستثمار الأجنبي في السعودية: الاستعداد لدخول السوق' },
    excerpt: { en: 'Map your proposed activity, ownership, licensing questions and commercial arrangements before entering the Saudi market.', ar: 'حدد النشاط والملكية ومتطلبات الترخيص والترتيبات التجارية قبل دخول السوق السعودي.' },
    category: { en: 'Investment', ar: 'الاستثمار' },
    tags: { en: ['foreign investment', 'Saudi market entry', 'licensing'], ar: ['الاستثمار الأجنبي', 'دخول السوق السعودي', 'التراخيص'] },
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=85',
    imageAlt: { en: 'Saudi city skyline representing market entry and investment', ar: 'أفق مدينة سعودية يرمز إلى دخول السوق والاستثمار' },
    seo: { en: ['foreign investment Saudi Arabia', 'Saudi market entry', 'investment licensing'], ar: ['الاستثمار الأجنبي في السعودية', 'دخول السوق السعودي', 'تراخيص الاستثمار'] },
    content: {
      en: `<p>Entering a new market involves more than incorporating a company. Investors should connect the proposed activity, ownership model, licensing path, operating arrangements and commercial goals before committing to a structure.</p><h2>Build an activity-led plan</h2><p>Start with a precise description of the goods or services, customer base and operating locations. Confirm which activities will be performed locally and which may be provided by affiliates or overseas teams. These details can affect the regulatory questions to investigate.</p><ul><li>Map ownership, governance and funding arrangements.</li><li>Identify licensing and registration questions for the proposed activity.</li><li>Review local partner, employment, premises and supplier arrangements.</li><li>Prepare bilingual corporate and commercial documents where needed.</li></ul><h2>Verify requirements with official sources</h2><p>Rules and procedures can change and may differ by activity. Use current government guidance and confirm requirements with the competent authority before relying on assumptions. Keep a record of approvals, filings and ongoing obligations.</p><p>Our team can help coordinate the legal workstreams and related <a href="/en/services/company-formation">company formation</a> and <a href="/en/services/legal-advisory">legal advisory</a>. Start with <a href="https://investsaudi.sa/" target="_blank" rel="noopener noreferrer">Invest Saudi</a> for official investor information.</p>`,
      ar: `<p>لا يقتصر دخول سوق جديد على تأسيس شركة. ينبغي للمستثمر ربط النشاط المقترح ونموذج الملكية ومسار الترخيص وترتيبات التشغيل والأهداف التجارية قبل اعتماد الهيكل.</p><h2>ضع خطة تنطلق من النشاط</h2><p>ابدأ بوصف دقيق للسلع أو الخدمات والعملاء ومواقع التشغيل. وحدد الأعمال التي ستنفذ محلياً وما قد تقدمه الجهات المرتبطة أو الفرق الخارجية؛ فقد تؤثر هذه التفاصيل في المسائل التنظيمية المطلوب بحثها.</p><ul><li>حدد الملكية والحوكمة وترتيبات التمويل.</li><li>احصر أسئلة الترخيص والتسجيل المرتبطة بالنشاط.</li><li>راجع ترتيبات الشركاء والموظفين والمقار والموردين.</li><li>جهز المستندات المؤسسية والتجارية باللغتين عند الحاجة.</li></ul><h2>تحقق من المتطلبات عبر المصادر الرسمية</h2><p>قد تتغير الأنظمة والإجراءات وقد تختلف بحسب النشاط. ارجع إلى الإرشادات الحكومية الحالية وتحقق من المتطلبات لدى الجهة المختصة قبل الاعتماد على الافتراضات، واحتفظ بسجل للموافقات والإيداعات والالتزامات المستمرة.</p><p>يمكن لفريقنا تنسيق المسارات القانونية وخدمات <a href="/ar/services/company-formation">تأسيس الشركات</a> و<a href="/ar/services/legal-advisory">الاستشارات القانونية</a>. ابدأ بمراجعة معلومات المستثمر الرسمية عبر <a href="https://investsaudi.sa/" target="_blank" rel="noopener noreferrer">استثمر في السعودية</a>.</p>`,
    },
  },
  {
    slug: 'franchise-agreement-planning-guide',
    title: { en: 'Franchise Agreements: What Both Sides Should Clarify', ar: 'اتفاقية الامتياز التجاري: مسائل ينبغي للطرفين توضيحها' },
    excerpt: { en: 'A practical overview of disclosure, territory, fees, brand standards and operating responsibilities in a franchise relationship.', ar: 'نظرة عملية على الإفصاح والنطاق الجغرافي والرسوم ومعايير العلامة ومسؤوليات التشغيل في علاقة الامتياز.' },
    category: { en: 'Franchising', ar: 'الامتياز التجاري' },
    tags: { en: ['franchise agreement', 'franchising', 'commercial law'], ar: ['اتفاقية الامتياز', 'الامتياز التجاري', 'القانون التجاري'] },
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85',
    imageAlt: { en: 'Collaborative business workspace for franchise planning', ar: 'مساحة عمل مشتركة للتخطيط لعلاقة امتياز تجاري' },
    seo: { en: ['franchise agreement Saudi Arabia', 'franchise disclosure', 'franchise legal advice'], ar: ['اتفاقية الامتياز التجاري السعودية', 'الإفصاح في الامتياز', 'استشارات الامتياز التجاري'] },
    content: {
      en: `<p>A franchise relationship combines a brand, operating system and continuing commercial obligations. Before signing, both parties should understand what is being licensed, what support is promised and how the relationship may change or end.</p><h2>Clarify the core terms</h2><ul><li>Define the territory, channels, exclusivity and any reserved rights.</li><li>Explain initial and ongoing fees, reporting and payment timing.</li><li>Document training, launch support, supply and quality standards.</li><li>Set rules for brand use, marketing, confidential information and intellectual property.</li></ul><h2>Plan for change and termination</h2><p>Consider renewal criteria, transfers, default notices, cure periods and post-termination obligations. The agreement should explain what happens to customer records, stock, signage and access to systems. Disclosure and filing requirements should be confirmed using current official guidance.</p><p>Franchise documents often connect to <a href="/en/services/intellectual-property">intellectual property</a> and wider <a href="/en/services/contracts-transactions">commercial contract</a> matters. The <a href="https://mc.gov.sa/" target="_blank" rel="noopener noreferrer">Ministry of Commerce</a> provides official business information.</p>`,
      ar: `<p>تجمع علاقة الامتياز بين العلامة التجارية ونظام التشغيل والالتزامات التجارية المستمرة. وقبل التوقيع، ينبغي للطرفين فهم الحقوق المرخصة والدعم الموعود وكيفية تطور العلاقة أو انتهائها.</p><h2>وضح الشروط الأساسية</h2><ul><li>حدد النطاق الجغرافي والقنوات والحصرية والحقوق المستثناة.</li><li>وضح الرسوم الأولية والمستمرة والتقارير ومواعيد السداد.</li><li>وثق التدريب ودعم الافتتاح والتوريد ومعايير الجودة.</li><li>ضع قواعد استخدام العلامة والتسويق والمعلومات السرية والملكية الفكرية.</li></ul><h2>خطط للتغيير والإنهاء</h2><p>ناقش شروط التجديد والنقل والإشعار بالإخلال ومهل المعالجة والالتزامات بعد الإنهاء. وينبغي أن توضح الاتفاقية مصير بيانات العملاء والمخزون واللوحات والوصول إلى الأنظمة. تحقق من متطلبات الإفصاح والإيداع بالرجوع إلى الإرشادات الرسمية السارية.</p><p>ترتبط وثائق الامتياز غالباً بخدمات <a href="/ar/services/intellectual-property">الملكية الفكرية</a> و<a href="/ar/services/contracts-transactions">العقود التجارية</a>. وتوفر <a href="https://mc.gov.sa/" target="_blank" rel="noopener noreferrer">وزارة التجارة</a> معلومات رسمية للأعمال.</p>`,
    },
  },
  {
    slug: 'protecting-trademarks-and-business-ip',
    title: { en: 'Protecting Trademarks and Business Intellectual Property', ar: 'حماية العلامات التجارية والملكية الفكرية للمنشآت' },
    excerpt: { en: 'Practical steps to identify ownership, document permissions and build an intellectual property protection plan.', ar: 'خطوات عملية لتحديد الملكية وتوثيق الأذونات وبناء خطة لحماية الملكية الفكرية.' },
    category: { en: 'Intellectual Property', ar: 'الملكية الفكرية' },
    tags: { en: ['trademark protection', 'intellectual property', 'brand'], ar: ['حماية العلامات التجارية', 'الملكية الفكرية', 'العلامة'] },
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1400&q=85',
    imageAlt: { en: 'Digital technology representing intellectual property protection', ar: 'تقنية رقمية ترمز إلى حماية الملكية الفكرية' },
    seo: { en: ['trademark protection Saudi Arabia', 'business intellectual property', 'IP agreements'], ar: ['حماية العلامات التجارية السعودية', 'الملكية الفكرية للمنشآت', 'اتفاقيات الملكية الفكرية'] },
    content: {
      en: `<p>Intellectual property can include a business name, logo, software, creative material, inventions and confidential know-how. A protection plan begins by identifying what the business owns, what it uses under permission and what needs registration or contractual safeguards.</p><h2>Know what you own</h2><p>Keep records showing who created or transferred each asset and under what terms. Employment, contractor, co-founder and agency arrangements should address ownership and permitted use. Check that brand names and visual assets are cleared before investing in a launch.</p><ul><li>List key brands, works, inventions, software and confidential materials.</li><li>Review registration status and renewal dates.</li><li>Document licenses, assignments and permissions in writing.</li><li>Limit access to trade secrets and use appropriate confidentiality terms.</li></ul><h2>Use and enforce rights consistently</h2><p>Clear internal guidelines can help teams and business partners use assets correctly. If unauthorized use is identified, preserve evidence and get advice before sending notices or making public statements. The appropriate response depends on the right, facts and applicable procedures.</p><p>For agreements and registration-related support, see our <a href="/en/services/intellectual-property">intellectual property service</a>. Official information is available from the <a href="https://www.saip.gov.sa/" target="_blank" rel="noopener noreferrer">Saudi Authority for Intellectual Property</a>.</p>`,
      ar: `<p>قد تشمل الملكية الفكرية اسم المنشأة وشعارها وبرامجها ومصنفاتها وابتكاراتها وخبراتها السرية. وتبدأ خطة الحماية بتحديد ما تملكه المنشأة وما تستخدمه بإذن وما يحتاج إلى تسجيل أو حماية تعاقدية.</p><h2>اعرف ما تملكه</h2><p>احتفظ بسجلات توضح منشئ كل أصل وكيفية انتقاله وشروط استخدامه. وينبغي أن تعالج ترتيبات الموظفين والمتعاقدين والمؤسسين والوكالات الملكية والاستخدام المسموح. وتحقق من الأسماء والعناصر البصرية قبل الاستثمار في إطلاق العلامة.</p><ul><li>أعد قائمة بالعلامات والمصنفات والابتكارات والبرامج والمعلومات السرية.</li><li>راجع حالة التسجيل ومواعيد التجديد.</li><li>وثق التراخيص والتنازلات والأذونات كتابةً.</li><li>قيد الوصول إلى الأسرار التجارية واستخدم شروط السرية المناسبة.</li></ul><h2>استخدم الحقوق بصورة متسقة</h2><p>تساعد الإرشادات الداخلية الواضحة الموظفين والشركاء على استخدام الأصول بشكل سليم. وعند رصد استخدام غير مصرح به، احفظ الأدلة واطلب المشورة قبل إرسال الإشعارات أو إصدار تصريحات علنية. ويتوقف الإجراء المناسب على نوع الحق والوقائع والإجراءات المنطبقة.</p><p>للمساعدة في الاتفاقيات ومسائل التسجيل، تعرف على <a href="/ar/services/intellectual-property">خدمات الملكية الفكرية</a>. وتتوفر المعلومات الرسمية لدى <a href="https://www.saip.gov.sa/" target="_blank" rel="noopener noreferrer">الهيئة السعودية للملكية الفكرية</a>.</p>`,
    },
  },
  {
    slug: 'resolving-business-disputes-before-litigation',
    title: { en: 'Resolving Business Disputes: Preparation Before the Next Step', ar: 'تسوية النزاعات التجارية: الاستعداد قبل اتخاذ الخطوة التالية' },
    excerpt: { en: 'Organize the facts, documents, desired outcome and communication strategy when a commercial disagreement arises.', ar: 'نظم الوقائع والمستندات والنتيجة المطلوبة وخطة التواصل عند نشوء خلاف تجاري.' },
    category: { en: 'Dispute Resolution', ar: 'تسوية النزاعات' },
    tags: { en: ['business dispute', 'dispute resolution', 'litigation'], ar: ['النزاعات التجارية', 'تسوية النزاعات', 'التقاضي'] },
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1400&q=85',
    imageAlt: { en: 'Legal documents prepared for a business dispute review', ar: 'مستندات قانونية لمراجعة نزاع تجاري' },
    seo: { en: ['business dispute resolution', 'commercial litigation Saudi Arabia', 'dispute preparation'], ar: ['تسوية النزاعات التجارية', 'التقاضي التجاري السعودية', 'الاستعداد للنزاع'] },
    content: {
      en: `<p>A disagreement can affect cash flow, customer relationships and business operations. Before responding, take time to understand the contract, preserve relevant records and decide what practical outcome would resolve the problem.</p><h2>Build a reliable record</h2><ul><li>Collect the signed agreement, amendments, invoices and delivery records.</li><li>Keep relevant emails and messages in their original form.</li><li>Prepare a dated timeline of events and decisions.</li><li>Separate confirmed facts from assumptions and disputed points.</li></ul><h2>Assess options before escalating</h2><p>Review notice, escalation, negotiation and dispute resolution clauses. Consider the commercial value of the issue, urgency, evidence, costs and impact on the ongoing relationship. A measured written communication may clarify positions, but avoid admissions or threats before the facts and legal position are reviewed.</p><p>If the dispute continues, advice can help assess available procedures and prepare a response. Learn about our <a href="/en/services/litigation-advocacy">litigation and advocacy service</a> or review the underlying <a href="/en/services/contracts-transactions">contract support</a>.</p>`,
      ar: `<p>قد يؤثر الخلاف التجاري في التدفقات النقدية وعلاقات العملاء وسير الأعمال. وقبل الرد، خذ وقتاً لفهم العقد وحفظ السجلات ذات الصلة وتحديد النتيجة العملية التي قد تنهي المشكلة.</p><h2>أنشئ ملفاً موثوقاً</h2><ul><li>اجمع العقد الموقع وتعديلاته والفواتير وسجلات التسليم.</li><li>احتفظ بالرسائل والبريد ذي الصلة بصيغته الأصلية.</li><li>أعد تسلسلاً زمنياً مؤرخاً للأحداث والقرارات.</li><li>افصل الوقائع المؤكدة عن الافتراضات والنقاط محل الخلاف.</li></ul><h2>قيّم الخيارات قبل التصعيد</h2><p>راجع شروط الإشعار والتصعيد والتفاوض وتسوية النزاع. وازن القيمة التجارية للمسألة ومدى استعجالها والأدلة والتكاليف وأثرها في العلاقة القائمة. وقد توضح المراسلات المكتوبة المتزنة المواقف، لكن تجنب الإقرارات أو التهديدات قبل مراجعة الوقائع والموقف القانوني.</p><p>إذا استمر النزاع، تساعد المشورة على تقييم الإجراءات المتاحة وإعداد الرد. تعرف على <a href="/ar/services/litigation-advocacy">خدمات التقاضي والترافع</a> أو راجع <a href="/ar/services/contracts-transactions">دعم العقود التجارية</a>.</p>`,
    },
  },
];

async function seedArticles() {
  await mongoose.connect(env.mongodbUri);
  const author = await User.findOne({ role: 'admin', isActive: true }).sort({ createdAt: 1 });
  if (!author) throw new Error('Create an active administrator before seeding articles.');

  for (const entry of articles) {
    const seo = {
      metaTitle: { en: entry.title.en.slice(0, 70), ar: entry.title.ar.slice(0, 70) },
      metaDescription: { en: entry.excerpt.en.slice(0, 160), ar: entry.excerpt.ar.slice(0, 160) },
      keywords: entry.seo,
      canonicalUrl: { en: '', ar: '' },
    };
    await Article.updateOne(
      { 'slug.en': entry.slug },
      { $setOnInsert: {
        title: entry.title,
        slug: { en: entry.slug, ar: entry.slug },
        excerpt: entry.excerpt,
        content: entry.content,
        category: entry.category,
        tags: entry.tags,
        featuredImage: { url: entry.image, publicId: null },
        imageAlt: entry.imageAlt,
        author: author._id,
        status: 'published',
        publishedAt: new Date(),
        seo,
      } },
      { upsert: true },
    );
    console.log(`Seeded article: ${entry.slug}`);
  }
}

seedArticles()
  .catch((error) => {
    console.error('[Seed articles]', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
