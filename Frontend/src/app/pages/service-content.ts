export interface ServiceArticle {
  intro: string;
  sections: { heading: string; paragraphs: string[]; points?: string[] }[];
  resourceLabel: string;
  resourceUrl: string;
}

const articles: Record<string, { en: ServiceArticle; ar: ServiceArticle }> = {
  'litigation-advocacy': {
    en: { intro: 'When a commercial or civil dispute escalates, a clear strategy helps protect your position and focus decisions on the outcome that matters. We support businesses and individuals through dispute assessment, case preparation and representation.', sections: [
      { heading: 'A considered approach to disputes', paragraphs: ['We review the facts, documents, commercial context and objectives to identify the issues, available evidence, procedural considerations and practical options.'], points: ['Review of contracts, correspondence and supporting records', 'Assessment of claims, defenses, risks and potential remedies', 'Preparation for hearings and representation before competent authorities'] },
      { heading: 'Preparation and case management', paragraphs: ['We help organize the case record, develop submissions around relevant facts and legal issues, and keep clients informed about material developments. Where appropriate, negotiation and other dispute resolution options can be considered alongside formal proceedings.'] },
      { heading: 'Related legal support', paragraphs: ['Disputes may raise questions about contract terms or business decisions. See our [Contracts & Commercial Transactions](/en/services/contracts-transactions) and [Legal Advisory](/en/services/legal-advisory) services.'] },
    ], resourceLabel: 'Saudi Ministry of Justice', resourceUrl: 'https://www.moj.gov.sa/' },
    ar: { intro: 'عندما يتصاعد النزاع التجاري أو المدني، تساعد الاستراتيجية الواضحة على حماية موقفك وتركيز القرارات على النتيجة المنشودة. ندعم الأفراد والمنشآت في تقييم النزاع وإعداد الملف والتمثيل أمام الجهات المختصة.', sections: [
      { heading: 'نهج مدروس لإدارة النزاعات', paragraphs: ['نراجع الوقائع والمستندات والسياق التجاري والأهداف لتحديد المسائل الجوهرية والأدلة المتاحة والاعتبارات الإجرائية والخيارات العملية.'], points: ['مراجعة العقود والمراسلات والمستندات المؤيدة', 'تقييم المطالبات والدفوع والمخاطر والطلبات الممكنة', 'الإعداد للجلسات والتمثيل أمام الجهات المختصة'] },
      { heading: 'الإعداد وإدارة القضية', paragraphs: ['نساعد في تنظيم ملف القضية وإعداد المذكرات ومتابعة التطورات الجوهرية والخطوات التالية. وبحسب ظروف القضية، يمكن دراسة التفاوض ووسائل التسوية إلى جانب الإجراءات الرسمية.'] },
      { heading: 'خدمات قانونية مرتبطة', paragraphs: ['قد يثير النزاع مسائل تتعلق بالعقود أو القرارات التجارية. تعرف على خدمات [العقود والصفقات التجارية](/ar/services/contracts-transactions) و[الاستشارات القانونية](/ar/services/legal-advisory).'] },
    ], resourceLabel: 'وزارة العدل السعودية', resourceUrl: 'https://www.moj.gov.sa/' },
  },
  'legal-advisory': {
    en: { intro: 'Timely legal advice helps individuals and organizations understand their options before important decisions are made. We provide practical guidance for day-to-day questions, planned business changes and emerging legal concerns.', sections: [
      { heading: 'Advice shaped around your objectives', paragraphs: ['We work to understand your activities, relevant documents and desired outcome. Our advice explains the issues, identifies material risks and outlines practical next steps based on the information available.'], points: ['Written opinions and responses to specific legal questions', 'Ongoing counsel for business operations and management decisions', 'Review of proposed actions, obligations and available options'] },
      { heading: 'Support for people and businesses', paragraphs: ['Early advice can clarify choices when you are assessing a business decision, reviewing an obligation or responding to a concern. For formation and governance, explore [Company Formation & Commercial Services](/en/services/company-formation); for disputes, see [Litigation & Advocacy](/en/services/litigation-advocacy).'] },
      { heading: 'Start with a clear question', paragraphs: ['A first conversation helps establish the background, documents and decision you need to make. [Book a consultation](/en/consultation) and tell us what guidance would help you move forward.'] },
    ], resourceLabel: 'Saudi Bureau of Experts at the Council of Ministers', resourceUrl: 'https://laws.boe.gov.sa/' },
    ar: { intro: 'تساعد الاستشارة القانونية في الوقت المناسب الأفراد والمنشآت على فهم خياراتهم قبل اتخاذ القرارات المهمة. نقدم توجيهاً عملياً يراعي نشاطك، سواء تعلق الأمر بسؤال يومي أو تغيير مخطط أو مسألة مستجدة.', sections: [
      { heading: 'رأي قانوني يراعي أهدافك', paragraphs: ['نحرص على فهم نشاطك والمستندات ذات الصلة والنتيجة التي تسعى إليها. ونوضح المسائل والمخاطر الجوهرية والخطوات العملية الممكنة استناداً إلى المعلومات المتاحة.'], points: ['إعداد الآراء المكتوبة والإجابة عن الاستفسارات المحددة', 'مشورة مستمرة بشأن أعمال المنشأة وقرارات الإدارة', 'مراجعة الالتزامات والإجراءات المقترحة والخيارات المتاحة'] },
      { heading: 'مساندة للأفراد والمنشآت', paragraphs: ['تساعد المشورة المبكرة على توضيح البدائل عند دراسة قرار تجاري أو مراجعة التزام. لمسائل التأسيس والحوكمة، تعرف على [خدمات تأسيس الشركات والأعمال](/ar/services/company-formation)، وللنزاعات اطلع على [التقاضي والترافع](/ar/services/litigation-advocacy).'] },
      { heading: 'ابدأ بتحديد المسألة', paragraphs: ['تساعد المحادثة الأولية على فهم الخلفية والمستندات والقرار المطلوب. يمكنك [حجز استشارة](/ar/consultation) وشرح نوع التوجيه الذي تحتاج إليه.'] },
    ], resourceLabel: 'هيئة الخبراء بمجلس الوزراء', resourceUrl: 'https://laws.boe.gov.sa/' },
  },
  'company-formation': {
    en: { intro: 'Choosing a suitable legal structure and documenting how a business will operate can create a clearer foundation for growth. We assist founders, shareholders and established companies with formation and ongoing commercial matters in Saudi Arabia.', sections: [
      { heading: 'From structure to registration', paragraphs: ['We help assess entity options against ownership, activity and operating plans, then support the preparation and review of formation documents and company resolutions.'], points: ['Entity selection and incorporation documentation', 'Shareholder and partner arrangements and resolutions', 'Company amendments, restructuring, liquidation and transaction support'] },
      { heading: 'Practical governance and transactions', paragraphs: ['Clear governance records can support informed decisions as a business changes. We advise on corporate documents and coordinate related commercial work, including [contracts and transactions](/en/services/contracts-transactions) and [foreign investment](/en/services/foreign-investment).'] },
      { heading: 'Plan the next step', paragraphs: ['The requirements depend on the proposed activity and current rules. We can review your plans and outline a practical document and action list. [Book a consultation](/en/consultation) to discuss your business.'] },
    ], resourceLabel: 'Saudi Business Center', resourceUrl: 'https://business.sa/' },
    ar: { intro: 'يساعد اختيار الشكل القانوني المناسب وتوثيق طريقة إدارة المنشأة على بناء أساس أوضح للنمو. نساند المؤسسين والشركاء والشركات في التأسيس والمسائل التجارية المستمرة في المملكة العربية السعودية.', sections: [
      { heading: 'من اختيار الكيان إلى التأسيس', paragraphs: ['نساعد في دراسة خيارات الكيان وفق الملكية والنشاط وخطط التشغيل، ثم إعداد ومراجعة مستندات التأسيس وقرارات الشركة.'], points: ['اختيار الكيان وإعداد وثائق التأسيس', 'ترتيبات الشركاء والمساهمين والقرارات', 'تعديلات الشركات وإعادة الهيكلة والتصفية ودعم الصفقات'] },
      { heading: 'حوكمة وصفقات عملية', paragraphs: ['تدعم سجلات الحوكمة الواضحة اتخاذ القرارات مع تطور المنشأة. ونقدم المشورة بشأن مستندات الشركة ونعمل على تنسيق المسائل التجارية ذات الصلة، ومنها [العقود والصفقات التجارية](/ar/services/contracts-transactions) و[الاستثمار الأجنبي](/ar/services/foreign-investment).'] },
      { heading: 'خطط لخطوتك القادمة', paragraphs: ['تختلف المتطلبات بحسب النشاط والأنظمة السارية. يمكننا مراجعة خطتك وتحديد قائمة عملية بالمستندات والخطوات. [احجز استشارة](/ar/consultation) لمناقشة مشروعك.'] },
    ], resourceLabel: 'المركز السعودي للأعمال', resourceUrl: 'https://business.sa/' },
  },
  'foreign-investment': {
    en: { intro: 'Entering a new market involves legal, licensing and operational decisions. We help foreign investors assess setup options, organize required documentation and understand the legal considerations that apply to their proposed Saudi activities.', sections: [
      { heading: 'Plan market entry', paragraphs: ['We discuss the proposed activity, investment structure, ownership and commercial objectives, then help identify legal workstreams and questions that may require confirmation with the relevant authorities.'], points: ['Investment and entity structuring considerations', 'Company formation documentation and corporate arrangements', 'Review of investor, partner and commercial agreements'] },
      { heading: 'Ongoing commercial support', paragraphs: ['Market entry is only one stage of operating a business. We can support continuing transactions and coordinate related [company formation](/en/services/company-formation), [contract](/en/services/contracts-transactions) and [legal advisory](/en/services/legal-advisory) work.'] },
      { heading: 'Use current official guidance', paragraphs: ['Licensing requirements depend on the activity and applicable rules. We help clients identify questions to confirm with the relevant regulator and plan a clear next step.'] },
    ], resourceLabel: 'Invest Saudi', resourceUrl: 'https://investsaudi.sa/' },
    ar: { intro: 'يتطلب دخول سوق جديد قرارات قانونية وتنظيمية وتشغيلية. نساعد المستثمر الأجنبي على دراسة خيارات التأسيس وتنظيم المستندات وفهم الاعتبارات المرتبطة بالنشاط المقترح في المملكة.', sections: [
      { heading: 'التخطيط لدخول السوق', paragraphs: ['نناقش النشاط المقترح وهيكل الاستثمار والملكية والأهداف التجارية، ثم نحدد المسارات القانونية والمسائل التي قد تتطلب التحقق من الجهات المختصة.'], points: ['اعتبارات هيكلة الاستثمار والكيان', 'مستندات تأسيس الشركة والترتيبات المؤسسية', 'مراجعة اتفاقيات المستثمرين والشركاء والعقود التجارية'] },
      { heading: 'مساندة تجارية مستمرة', paragraphs: ['يمثل دخول السوق مرحلة من مراحل تشغيل الأعمال. ويمكننا متابعة المعاملات وتنسيق خدمات [تأسيس الشركات](/ar/services/company-formation) و[العقود والصفقات](/ar/services/contracts-transactions) و[الاستشارات القانونية](/ar/services/legal-advisory).'] },
      { heading: 'الرجوع إلى الإرشادات الرسمية', paragraphs: ['تختلف متطلبات الترخيص بحسب النشاط والأنظمة المطبقة. نساعد على تحديد المسائل التي ينبغي التحقق منها لدى الجهة المنظمة والتخطيط للخطوة التالية.'] },
    ], resourceLabel: 'استثمر في السعودية', resourceUrl: 'https://investsaudi.sa/' },
  },
  franchising: {
    en: { intro: 'Franchising can help a business expand through a structured relationship between franchisor and franchisee. Clear disclosure, carefully drafted documents and practical operating terms help both sides understand their responsibilities.', sections: [
      { heading: 'Build a clear franchise relationship', paragraphs: ['We assist with reviewing and preparing franchise documentation, assessing commercial terms and aligning the agreement with the parties’ planned operating model.'], points: ['Franchise agreement drafting and review', 'Disclosure and supporting document review', 'Territory, fees, brand standards and operational obligations'] },
      { heading: 'Support through the business lifecycle', paragraphs: ['A franchise relationship may change as the network grows. We advise on renewals, amendments, operational questions and dispute prevention, coordinating with [intellectual property](/en/services/intellectual-property) and [commercial contract](/en/services/contracts-transactions) support where needed.'] },
      { heading: 'Check the applicable requirements', paragraphs: ['Franchise rules and filing requirements can depend on the transaction and current regulations. We help identify the applicable questions and documentation to address.'] },
    ], resourceLabel: 'Saudi Ministry of Commerce', resourceUrl: 'https://mc.gov.sa/' },
    ar: { intro: 'يساعد الامتياز التجاري المنشأة على التوسع من خلال علاقة منظمة بين مانح الامتياز وصاحبه. ويساعد الإفصاح الواضح والمستندات الدقيقة والشروط العملية الطرفين على فهم مسؤولياتهما.', sections: [
      { heading: 'تنظيم علاقة الامتياز', paragraphs: ['نساند في إعداد ومراجعة مستندات الامتياز ودراسة الشروط التجارية ومواءمة الاتفاقية مع نموذج التشغيل الذي يخطط له الطرفان.'], points: ['إعداد ومراجعة اتفاقيات الامتياز', 'مراجعة الإفصاح والمستندات المساندة', 'النطاق الجغرافي والرسوم ومعايير العلامة والالتزامات التشغيلية'] },
      { heading: 'مساندة خلال مراحل العلاقة', paragraphs: ['قد تتطور علاقة الامتياز مع توسع الشبكة. نقدم المشورة بشأن التجديد والتعديل والمسائل التشغيلية والحد من النزاعات، مع تنسيق خدمات [الملكية الفكرية](/ar/services/intellectual-property) و[العقود التجارية](/ar/services/contracts-transactions) عند الحاجة.'] },
      { heading: 'التحقق من المتطلبات', paragraphs: ['قد ترتبط قواعد الامتياز وإجراءاته بطبيعة المعاملة والأنظمة السارية. نساعد على تحديد المسائل والمستندات الواجب مراعاتها.'] },
    ], resourceLabel: 'وزارة التجارة السعودية', resourceUrl: 'https://mc.gov.sa/' },
  },
  'intellectual-property': {
    en: { intro: 'Brands, inventions, creative works and confidential business information can be valuable assets. We help businesses and individuals understand practical ways to protect, manage and license intellectual property in Saudi Arabia.', sections: [
      { heading: 'Identify and protect your assets', paragraphs: ['We help assess the rights relevant to your work and business, review ownership and use arrangements, and support appropriate registration and documentation steps.'], points: ['Trademark, copyright and patent related advice', 'IP ownership, assignment and licensing agreements', 'Confidentiality and trade secret protection measures'] },
      { heading: 'Use rights with confidence', paragraphs: ['Clear agreements can support collaboration, commercialization and brand use. We review proposed licenses and commercial documents and can assist when concerns arise about unauthorized use. Related support is available through [franchising](/en/services/franchising) and [contracts and transactions](/en/services/contracts-transactions).'] },
      { heading: 'Check official IP resources', paragraphs: ['Registration pathways and requirements differ by type of right. We help identify the right questions and documentation for your situation.'] },
    ], resourceLabel: 'Saudi Authority for Intellectual Property', resourceUrl: 'https://www.saip.gov.sa/' },
    ar: { intro: 'قد تكون العلامات والابتكارات والمصنفات والمعلومات التجارية السرية أصولاً مهمة. نساعد الأفراد والمنشآت على فهم سبل حماية الملكية الفكرية وإدارتها وترخيصها في المملكة.', sections: [
      { heading: 'تحديد الأصول وحمايتها', paragraphs: ['نساعد على تحديد الحقوق المرتبطة بنشاطك ومراجعة الملكية والاستخدام ودعم خطوات التسجيل والتوثيق المناسبة.'], points: ['المشورة المتعلقة بالعلامات وحقوق المؤلف والبراءات', 'اتفاقيات ملكية الحقوق والتنازل عنها وترخيصها', 'تدابير السرية وحماية الأسرار التجارية'] },
      { heading: 'استخدام الحقوق بوضوح', paragraphs: ['تدعم الاتفاقيات الواضحة التعاون والاستثمار واستخدام العلامة. نراجع التراخيص والمستندات التجارية ونساند عند ظهور مخاوف بشأن الاستخدام غير المصرح به. اطلع أيضاً على خدمات [الامتياز التجاري](/ar/services/franchising) و[العقود والصفقات](/ar/services/contracts-transactions).'] },
      { heading: 'مصادر الملكية الفكرية الرسمية', paragraphs: ['تختلف إجراءات التسجيل ومتطلباته باختلاف نوع الحق. نساعد على تحديد الأسئلة والمستندات الملائمة لحالتك.'] },
    ], resourceLabel: 'الهيئة السعودية للملكية الفكرية', resourceUrl: 'https://www.saip.gov.sa/' },
  },
  'contracts-transactions': {
    en: { intro: 'Well-structured contracts make responsibilities, payment, delivery and risk allocation easier to understand. We help businesses and individuals prepare, review and negotiate agreements that reflect the purpose of the transaction.', sections: [
      { heading: 'Drafting and review', paragraphs: ['We examine the commercial arrangement and flag terms that may need clarification before signature. Our work can cover standalone agreements and documents forming part of a larger transaction.'], points: ['Commercial agreements, memoranda and service contracts', 'Payment, delivery, warranties, liability and termination terms', 'Negotiation support and contract amendments'] },
      { heading: 'Support through implementation', paragraphs: ['Legal support can continue after signing. We help clients interpret obligations, document changes and consider practical responses when performance concerns arise. If a matter becomes contentious, see [litigation and advocacy](/en/services/litigation-advocacy). For business structuring, see [company formation](/en/services/company-formation).'] },
      { heading: 'Bring the right documents', paragraphs: ['A useful review starts with the draft agreement, relevant correspondence and a clear description of your objectives. [Book a consultation](/en/consultation) to discuss the transaction.'] },
    ], resourceLabel: 'Saudi Bureau of Experts at the Council of Ministers', resourceUrl: 'https://laws.boe.gov.sa/' },
    ar: { intro: 'توضح العقود المصاغة بعناية المسؤوليات والمقابل والتسليم وتوزيع المخاطر. نساعد الأفراد والمنشآت على إعداد الاتفاقيات ومراجعتها والتفاوض بشأنها بما يعكس غرض المعاملة.', sections: [
      { heading: 'إعداد العقود ومراجعتها', paragraphs: ['ندرس الترتيب التجاري ونحدد الشروط التي قد تحتاج إلى توضيح قبل التوقيع. وقد يشمل العمل اتفاقية مستقلة أو مستندات ضمن صفقة أوسع.'], points: ['العقود التجارية ومذكرات التفاهم وعقود الخدمات', 'شروط المقابل والتسليم والضمان والمسؤولية والإنهاء', 'دعم التفاوض وتعديل العقود'] },
      { heading: 'مساندة خلال التنفيذ', paragraphs: ['قد تستمر الحاجة إلى الدعم بعد التوقيع. نساعد على فهم الالتزامات وتوثيق التغييرات ودراسة الخيارات عند ظهور صعوبات في التنفيذ. وإذا نشأ نزاع، تعرف على [التقاضي والترافع](/ar/services/litigation-advocacy)، ولمسائل هيكلة الأعمال اطلع على [تأسيس الشركات](/ar/services/company-formation).'] },
      { heading: 'جهز المستندات ذات الصلة', paragraphs: ['تبدأ المراجعة المفيدة بمسودة الاتفاقية والمراسلات ذات الصلة وشرح واضح لأهدافك. [احجز استشارة](/ar/consultation) لمناقشة المعاملة.'] },
    ], resourceLabel: 'هيئة الخبراء بمجلس الوزراء', resourceUrl: 'https://laws.boe.gov.sa/' },
  },
};

export function getServiceArticle(slug: string, locale: 'ar' | 'en'): ServiceArticle | null {
  return articles[slug]?.[locale] ?? null;
}
