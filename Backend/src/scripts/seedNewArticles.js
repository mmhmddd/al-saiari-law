const mongoose = require('mongoose');
const env = require('../config/environment');
const Article = require('../models/Article');
const User = require('../models/User');

const official = {
  mc: 'https://mc.gov.sa/en/Regulations/pages/default.aspx',
  sdaia: 'https://dgp.sdaia.gov.sa/wps/portal/pdp/knowledgecenter/',
  saip: 'https://www.saip.gov.sa/en/services/trademarks',
  laws: 'https://laws.boe.gov.sa/',
  business: 'https://business.sa/',
};
const serviceLinks = {
  corporate: ['/services/company-formation', '/services/contracts-transactions', '/services/legal-advisory'],
  data: ['/services/contracts-transactions', '/services/legal-advisory', '/services/company-formation'],
  ip: ['/services/intellectual-property', '/services/franchising', '/services/contracts-transactions'],
  deals: ['/services/contracts-transactions', '/services/company-formation', '/services/legal-advisory'],
  operations: ['/services/contracts-transactions', '/services/legal-advisory', '/services/litigation-advocacy'],
};
const topics = [
  {
    slug:'corporate-governance-practices-saudi-companies',category:['Corporate Governance','حوكمة الشركات'],group:'corporate',img:'photo-1486406146926-c627a92ad1ab',
    title:['Corporate Governance for Growing Saudi Companies','حوكمة الشركات السعودية في مراحل النمو'],
    excerpt:['A practical framework for clear decisions, reliable records and accountable governance as a Saudi company grows.','إطار عملي لتنظيم القرارات وحفظ السجلات وتعزيز المساءلة مع نمو الشركة السعودية.'],
    sections:[
      ['Build governance around real decisions','اربط الحوكمة بالقرارات الفعلية','Governance is the set of roles, decision paths and records that helps an organization act consistently. A growing company should begin by mapping who may approve spending, sign contracts, appoint managers, make distributions and respond to conflicts. The right structure depends on the company form, its constitutional documents and applicable requirements. A policy copied from another organization may not fit its ownership or operating model.'],
      ['Keep core records current','حافظ على تحديث السجلات الأساسية','Maintain a dependable record of owner and board decisions, delegated authorities, key contracts, statutory filings and changes in ownership or management. Minutes should identify the matter considered, the information reviewed, the decision and any declared interest. Store final signed versions in a controlled location and set a process for correcting errors without obscuring the original record. Good records support continuity when staff change and help explain why a decision was made.'],
      ['Review governance as the business changes','راجع الحوكمة مع تغير الأعمال','New investors, subsidiaries, financing, major procurement and expansion can change the company’s risk profile. Schedule periodic reviews of approval limits, signatory powers, reporting lines and compliance responsibilities. Ask whether the people making decisions receive timely financial and operational information, and whether related-party matters are handled transparently. Keep an action log with owners and due dates so that recommendations lead to follow-through.'],
      ['Create a practical annual cycle','أنشئ دورة سنوية عملية','A governance calendar can bring together annual confirmations, financial reporting, owner meetings, licence renewals and policy reviews. Assign a responsible person to each deadline, identify required supporting papers and keep evidence of completion. A calendar is an internal control, not a substitute for checking the current rule or deadline with the competent authority. For legal review, compare your documents with the current official Companies Law materials and get advice for your entity’s facts.'],
    ],
    bullets:[['Decision authority and signing limits','صلاحيات القرار وحدود التوقيع'],['Meeting and written resolution records','سجلات الاجتماعات والقرارات المكتوبة'],['Conflict-of-interest disclosures','الإفصاح عن تعارض المصالح'],['Annual filing and policy review dates','مواعيد الإيداع السنوي ومراجعة السياسات']],
    sources:['mc','laws'], tags:['Saudi corporate governance','board resolutions','company records'],
  },
  {
    slug:'saudi-business-acquisition-legal-due-diligence',category:['Business Transactions','المعاملات التجارية'],group:'deals',img:'photo-1450101499163-c8848c66ca85',
    title:['Legal Due Diligence Before Acquiring a Saudi Business','الفحص القانوني قبل الاستحواذ على منشأة سعودية'],
    excerpt:['A focused review of ownership, contracts, licences, disputes and liabilities before a business acquisition.','مراجعة مركزة للملكية والعقود والتراخيص والنزاعات والالتزامات قبل الاستحواذ على منشأة.'],
    sections:[
      ['Define the transaction and review scope','حدد الصفقة ونطاق المراجعة','Before requesting files, clarify whether the proposed transaction is a share purchase, asset transfer, merger or another arrangement. Each structure raises different questions about which rights, contracts, employees, permits and liabilities may transfer. Agree a proportionate review scope, a secure document room and a process for asking follow-up questions. A clear scope helps the buyer focus on facts that could affect price, timing, approvals or the decision to proceed.'],
      ['Check ownership and authority','تحقق من الملكية والصلاحية','Review corporate records, constitutional documents, ownership history and approvals relevant to the transaction. Confirm who can negotiate and sign, and identify any restrictions on transfers or reserved matters. Compare the information provided with official records where available. Investigate liens, pledges, guarantees and related-party arrangements, and record unresolved discrepancies for clarification rather than treating an incomplete file as proof that no issue exists.'],
      ['Read contracts as an operating system','اقرأ العقود باعتبارها جزءاً من التشغيل','Important agreements may include customer and supplier contracts, leases, finance documents, technology licences, distribution arrangements and insurance. Look for change-of-control consent, assignment restrictions, renewal windows, exclusivity, service levels, termination triggers and price adjustments. Check whether actual practice matches the written terms. A short abstract of each material agreement can make dependencies and consent requirements easier to compare.'],
      ['Convert findings into transaction protections','حوّل النتائج إلى وسائل حماية تعاقدية','Organize findings by impact, likelihood, evidence and remedy. Some matters may need a condition before closing, a price adjustment, a specific indemnity, a seller undertaking or a post-completion action plan. Others may be acceptable with a documented operational response. The right allocation is negotiated and depends on the facts, governing law and transaction structure; due diligence does not guarantee that every issue will be discovered.'],
    ],
    bullets:[['Corporate ownership and approval records','سجلات الملكية والموافقات المؤسسية'],['Material contracts and consent triggers','العقود الجوهرية ومتطلبات الموافقة'],['Licences, claims, security and guarantees','التراخيص والمطالبات والضمانات'],['A prioritized closing and follow-up list','قائمة أولويات للإقفال والمتابعة']],
    sources:['mc','laws'],tags:['Saudi acquisition due diligence','business purchase','commercial transaction'],
  },
  {
    slug:'pdpl-compliance-readiness-saudi-businesses',category:['Data Protection','حماية البيانات'],group:'data',img:'photo-1516321318423-f06f85e504b3',
    title:['Saudi PDPL Readiness: A Business Data Protection Checklist','الاستعداد لنظام حماية البيانات الشخصية: قائمة للمنشآت'],
    excerpt:['Map personal data, document purposes and build practical privacy processes under Saudi data protection requirements.','احصر البيانات الشخصية ووثق أغراض استخدامها وأنشئ إجراءات خصوصية عملية وفق المتطلبات السعودية.'],
    sections:[
      ['Start with a data map','ابدأ بخريطة للبيانات','List the personal data your organization collects, receives, stores, uses or shares. Include information handled in customer systems, staff files, marketing platforms, paper records and service providers. For each activity, note the purpose, data categories, source, access, recipients, retention approach and any transfer outside the Kingdom. This inventory helps the business understand its processing before it drafts notices or selects technical safeguards.'],
      ['Explain purposes and lawful grounds','وضح الأغراض والأسس النظامية','For each use, identify the business purpose and assess the applicable legal basis under the current Personal Data Protection Law and implementing rules. Do not assume that one consent statement covers every use. Give people clear information about collection and use, and collect only data that is needed for the stated purpose. Retention, direct marketing, sensitive data and cross-border transfers may require additional analysis.'],
      ['Turn privacy commitments into routines','حوّل التزامات الخصوصية إلى إجراءات','Create a process for access, correction, deletion and other requests that may apply, with a way to verify identity and track response deadlines. Decide how staff report a suspected breach, who assesses it and how decisions are recorded. Review processor contracts, access controls, training and secure disposal. Assign ownership for each task and refresh the process when systems, purposes or vendors change.'],
      ['Check official guidance and applicability','تحقق من الإرشادات الرسمية والانطباق','SDAIA publishes guidance for controllers and processors, including materials on privacy notices and records of processing. Use the official guidance as a starting point, then confirm how current rules apply to your organization, sector and data flows. A compliance checklist is not a legal determination: appointing a data protection officer, keeping records or taking another step can depend on facts and regulatory criteria.'],
    ],
    bullets:[['Data inventory and purpose register','جرد البيانات وسجل الأغراض'],['Privacy notice and request handling','إشعار الخصوصية ومعالجة الطلبات'],['Vendor, retention and transfer review','مراجعة الموردين والاحتفاظ والنقل'],['Incident reporting and staff awareness','الإبلاغ عن الحوادث وتوعية الموظفين']],
    sources:['sdaia','laws'],tags:['Saudi PDPL','data protection compliance','privacy notice'],
  },
  {
    slug:'trademark-clearance-before-brand-launch-saudi',category:['Intellectual Property','الملكية الفكرية'],group:'ip',img:'photo-1558655146-d09347e92766',
    title:['Trademark Clearance Before Launching a Brand in Saudi Arabia','فحص العلامة التجارية قبل إطلاقها في السعودية'],
    excerpt:['Reduce brand launch risk by checking names, ownership, markets and registration strategy before investing in a rollout.','قلل مخاطر إطلاق العلامة بفحص الاسم والملكية والأسواق وخطة التسجيل قبل الاستثمار في التوسع.'],
    sections:[
      ['Screen the complete brand identity','افحص هوية العلامة كاملة','A brand may include a word mark, Arabic and Latin spellings, a logo, a tagline, packaging and distinctive visual elements. Search for similar marks and consider how customers will pronounce, spell and remember the name. Search results are an initial screen rather than a legal clearance opinion. A specialist review can assess similarity, goods and services, ownership and the practical risk of objections or disputes.'],
      ['Identify the owner before filing','حدد المالك قبل التقديم','Confirm whether the intended owner is the operating company, a holding entity or another party. Check employment, agency, design and co-founder arrangements to establish who created the logo and who may use or transfer it. Put assignments and licences in writing, including the scope, territory, term, quality controls and permission to use the mark in online channels. Clear records reduce uncertainty when the business raises investment or expands.'],
      ['Plan protection around goods and services','خطط للحماية بحسب السلع والخدمات','Describe the business’s actual and near-term offerings before choosing filing coverage. A broad ambition without a realistic use plan may create avoidable cost, while a narrow description may not match the intended launch. Consider related product lines, retail or online channels, and future markets. Keep proof of use, registration details, renewal dates and contact information in a central IP register.'],
      ['Coordinate registration with launch activity','نسق التسجيل مع أنشطة الإطلاق','Before announcing a name, check domain and social handle availability, vendor artwork, packaging and marketing materials. Use consistent brand guidelines and monitor for unauthorized use. The Saudi Authority for Intellectual Property provides official trademark information and services. Filing requirements and outcomes depend on the mark and application; verify current official instructions and seek advice where a conflict or objection arises.'],
    ],
    bullets:[['Name and logo search across relevant classes','بحث الاسم والشعار ضمن الفئات المناسبة'],['Written ownership and permission records','توثيق الملكية والأذونات كتابياً'],['A registration and renewal calendar','جدول التسجيل والتجديد'],['Brand-use rules for teams and suppliers','قواعد استخدام العلامة للفرق والموردين']],
    sources:['saip','mc'],tags:['trademark Saudi Arabia','brand protection','SAIP'],
  },
  {
    slug:'commercial-distribution-agreement-saudi-arabia',category:['Contracts','العقود'],group:'operations',img:'photo-1586528116311-ad8dd3c8310d',
    title:['Negotiating a Commercial Distribution Agreement in Saudi Arabia','التفاوض على اتفاقية توزيع تجاري في السعودية'],
    excerpt:['Key commercial and legal points to document when appointing a distributor or expanding product sales.','أهم النقاط التجارية والقانونية التي ينبغي توثيقها عند تعيين موزع أو توسيع مبيعات المنتجات.'],
    sections:[
      ['Describe the commercial relationship precisely','صف العلاقة التجارية بدقة','State which products are covered, the territory, permitted sales channels, customer groups and whether the appointment is exclusive. Define how online sales, tenders, key accounts and direct sales will be handled. Avoid relying on informal assumptions about who may sell to whom. If the arrangement could fall within a regulated category, check the applicable Saudi rules and registration requirements before signing or performing.'],
      ['Set workable performance and supply terms','ضع شروط أداء وتوريد قابلة للتطبيق','Document forecasts, purchase orders, minimum commitments, delivery windows, acceptance, stock handling, product changes and service support. Explain how pricing, discounts, tax, currency and payment dates are determined. Include a process for allocating scarce inventory and responding to delays. Performance measures should use data both sides can verify, with a reasonable cure process where targets are missed.'],
      ['Protect quality, brand and compliance','احم الجودة والعلامة والامتثال','Set clear rules for product storage, marketing claims, approved materials, customer complaints, recalls and use of intellectual property. Allocate responsibility for training and regulatory records, while requiring prompt cooperation if a safety or compliance issue appears. Define how confidential information and customer data may be used, secured and returned. Match audit rights to the information needed to verify contractual obligations.'],
      ['Plan for change and exit','خطط للتغيير والإنهاء','Choose the contract term and renewal method deliberately. Address termination for breach, insolvency, convenience if appropriate, and events that require urgent action. State what happens to open orders, stock, customer support, outstanding payments, records and brand materials at exit. Dispute clauses should identify the agreed process and notices. Review the final document against current law and the actual operating model.'],
    ],
    bullets:[['Territory, exclusivity and sales channels','النطاق الجغرافي والحصرية وقنوات البيع'],['Forecast, orders, delivery and payment','التوقعات والطلبات والتسليم والسداد'],['Brand use, quality and compliance duties','استخدام العلامة والجودة والامتثال'],['Renewal, termination and exit transition','التجديد والإنهاء والانتقال عند الخروج']],
    sources:['mc','laws'],tags:['distribution agreement Saudi Arabia','commercial contracts','supplier agreement'],
  },
  {
    slug:'contract-renewal-amendment-management-business',category:['Contracts','العقود'],group:'operations',img:'photo-1450101499163-c8848c66ca85',
    title:['Managing Contract Renewals and Amendments Without Missing Key Terms','إدارة تجديد العقود وتعديلاتها دون إغفال الشروط المهمة'],
    excerpt:['A repeatable contract management process for renewal dates, changes, approvals and evidence.','عملية متكررة لإدارة مواعيد التجديد والتغييرات والموافقات والأدلة التعاقدية.'],
    sections:[
      ['Create one reliable contract register','أنشئ سجلاً موحداً موثوقاً للعقود','A contract register should identify the parties, owner, effective date, term, renewal window, notice method, governing language, value and linked documents. Record key obligations and dependencies, not just expiry dates. Store signed agreements and amendments together with version control. Restrict access where documents contain confidential information and name a responsible person who can update the register when the business changes.'],
      ['Start renewal reviews early','ابدأ مراجعة التجديد مبكراً','Set reminders far enough ahead to assess performance, pricing, service levels, insurance, security and business need. Check whether a renewal happens automatically unless notice is given, and verify the notice address and permitted delivery method. Ask the operational owner whether the service should continue, change or end. A calendar alert is useful only when someone is accountable for making a documented decision.'],
      ['Control amendments and approvals','اضبط التعديلات والموافقات','Use a written change request that explains the reason, commercial effect, implementation date and affected clauses. Confirm that the person signing has authority and that required internal approvals are recorded. Amendments should identify the base agreement and state whether other terms remain in force. Update related purchase orders, schedules, statements of work and internal systems so the negotiated change is actually reflected in operations.'],
      ['Close the loop after signature','أكمل المتابعة بعد التوقيع','Save the final executed version, share the relevant obligations with finance and delivery teams, and assign actions with dates. Track insurance certificates, service reports, price adjustments and notice deadlines that follow from the amendment. If performance deteriorates, document the issue and use the agreement’s escalation process. Legal review can help interpret unclear wording, but operational owners remain essential to compliance.'],
    ],
    bullets:[['Renewal and notice date reminders','تذكيرات التجديد ومواعيد الإشعار'],['Approval and signing authority record','سجل الموافقات وصلاحيات التوقيع'],['Version-controlled signed documents','مستندات موقعة بضبط الإصدارات'],['Post-signature obligation owners','مسؤولون عن الالتزامات بعد التوقيع']],
    sources:['mc','laws'],tags:['contract management','contract renewal','business contracts'],
  },
  {
    slug:'saudi-company-restructuring-legal-planning',category:['Corporate Transactions','المعاملات المؤسسية'],group:'corporate',img:'photo-1497366754035-f200968a6e72',
    title:['Legal Planning for a Saudi Company Restructuring','التخطيط القانوني لإعادة هيكلة شركة سعودية'],
    excerpt:['Plan governance, approvals, contracts and implementation steps before changing a business structure.','خطط للحوكمة والموافقات والعقود وخطوات التنفيذ قبل تغيير هيكل المنشأة.'],
    sections:[
      ['Set the business objective first','حدد الهدف التجاري أولاً','A restructuring may respond to growth, investment, succession, financing, operational separation or risk management. Write down the intended outcome and compare possible routes before implementing any transfer. Changes to ownership, assets, activities or group structure can affect permissions, tax, employees, lenders and commercial partners. Coordinate legal, finance, tax and operational review early enough to identify dependencies and required approvals.'],
      ['Map assets, liabilities and agreements','احصر الأصول والالتزامات والاتفاقيات','Prepare a reliable map of entities, ownership, intellectual property, equipment, receivables, debt, guarantees, employees, permits and material contracts. Identify which items can transfer, which need consent, and which may remain with the original entity. Review financing restrictions and security interests. Reconcile the map with accounting and corporate records, and investigate gaps before a transaction document assumes that an asset is available.'],
      ['Plan approvals and implementation sequence','خطط للموافقات وتسلسل التنفيذ','List internal resolutions, regulator filings, third-party consents and closing conditions. Assign an owner and evidence for each step. Sequence matters: a transfer may depend on a licence, updated registration, lender consent or completed corporate approval. Draft a closing checklist that names documents, signatories, effective dates and follow-up filings, while allowing for authority review timelines that can change.'],
      ['Protect continuity after the change','احم استمرارية الأعمال بعد التغيير','Update contracts, invoices, bank mandates, customer communications, data access and internal approval powers after completion. Tell staff and counterparties only what is necessary and at the appropriate time. Confirm that records are retained and accessible to the right entity. Revisit insurance, licences, website disclosures and delegated authorities. A restructuring is complete operationally when teams know which entity owns each relationship and obligation.'],
    ],
    bullets:[['Target structure and transaction rationale','الهيكل المستهدف ومبررات المعاملة'],['Asset, liability and consent inventory','جرد الأصول والالتزامات والموافقات'],['Approval and filing sequence','تسلسل الموافقات والإيداعات'],['Post-completion continuity checklist','قائمة استمرارية الأعمال بعد الإتمام']],
    sources:['mc','business'],tags:['company restructuring Saudi Arabia','corporate transaction','business reorganization'],
  },
  {
    slug:'saudi-commercial-compliance-calendar',category:['Business Compliance','امتثال الأعمال'],group:'corporate',img:'photo-1454165804606-c3d57bc86b40',
    title:['Build a Practical Legal Compliance Calendar for Your Saudi Business','إعداد تقويم امتثال قانوني عملي لمنشأتك السعودية'],
    excerpt:['Organize recurring filings, licence renewals, contract deadlines and policy reviews in one accountable calendar.','نظم الإيداعات المتكررة وتجديد التراخيص ومواعيد العقود ومراجعة السياسات في تقويم واضح المسؤوليات.'],
    sections:[
      ['List obligations by source and owner','صنف الالتزامات حسب مصدرها ومسؤولها','Gather obligations from current laws, company documents, licences, customer contracts, financing terms and internal policies. For each item, record the source, responsible owner, backup contact, due date, lead time and proof of completion. Separate fixed annual events from deadlines triggered by a transaction or notice. Confirm obligations against current official sources rather than copying dates from an old spreadsheet.'],
      ['Set reminders that lead to action','ضع تذكيرات تقود إلى إجراء','A useful calendar includes preparation time, approval time and submission time. Add escalation reminders for items that remain open and identify who may approve an extension or corrective step. Link each calendar entry to the relevant document and the person who can answer questions. Keep a completion record and save receipts or correspondence. Review access when staff roles change so that alerts do not disappear with one employee.'],
      ['Connect compliance with business planning','اربط الامتثال بخطط الأعمال','Upcoming expansion, new products, hiring, data collection, franchise activity or a financing round may create new review tasks. Ask department leads to report material changes quarterly. Update the calendar when contracts renew or authorities change procedures. A compliance calendar should be proportional to the business: too many low-value alerts obscure urgent items, while an incomplete list creates false confidence.'],
      ['Review the system and close gaps','راجع النظام وأغلق الثغرات','Each quarter, check overdue items, changed rules, missed notices and repeat causes of delay. Assign corrective actions with a clear owner and completion date. For critical obligations, maintain a backup person and a simple evidence trail. Use counsel to confirm how specific rules apply when the position is uncertain. The calendar supports management and does not itself establish compliance or guarantee a regulatory outcome.'],
    ],
    bullets:[['Authority filings and licence renewals','إيداعات الجهات وتجديد التراخيص'],['Contract notice and renewal windows','مواعيد إشعارات العقود وتجديدها'],['Policy, training and governance reviews','مراجعة السياسات والتدريب والحوكمة'],['Named owners and completion evidence','مسؤولون محددون وأدلة الإنجاز']],
    sources:['mc','business'],tags:['Saudi business compliance','compliance calendar','regulatory deadlines'],
  },
  {
    slug:'saudi-business-legal-records-retention',category:['Business Compliance','امتثال الأعمال'],group:'operations',img:'photo-1450101499163-c8848c66ca85',
    title:['Organizing Legal Records for a Saudi Business','تنظيم السجلات القانونية للمنشآت السعودية'],
    excerpt:['A secure, searchable records system for corporate decisions, contracts, licences and important business evidence.','نظام آمن وقابل للبحث لحفظ القرارات المؤسسية والعقود والتراخيص وأدلة الأعمال المهمة.'],
    sections:[
      ['Know which records the business relies on','اعرف السجلات التي تعتمد عليها المنشأة','Identify the records needed to prove ownership, authority, performance, payment, compliance and key decisions. Common groups include constitutional documents, resolutions, licences, contracts, employment records, insurance, claims and correspondence. Assign a business owner to each group and define which version is authoritative. A simple index can help teams retrieve documents without copying sensitive files into uncontrolled locations.'],
      ['Use consistent naming and access controls','استخدم تسمية ثابتة وضوابط وصول','Choose a naming convention with dates, parties, document type and version. Separate drafts from signed copies and preserve approval evidence. Use access permissions based on role and business need, with stronger safeguards for confidential and personal information. Keep backup and recovery procedures, and log material access where appropriate. Staff should know how to share files securely with advisers and counterparties.'],
      ['Set retention and disposal rules','ضع قواعد للاحتفاظ والإتلاف','Create a retention schedule after reviewing applicable legal, regulatory, contractual and operational requirements. Suspend routine deletion when a dispute, investigation, audit or preservation obligation may apply. Securely dispose of records when retention ends, including duplicate copies and devices. Personal data should not be kept indefinitely without a reason. Confirm sector-specific periods and transfer restrictions with current official guidance.'],
      ['Make the archive useful in a transaction or dispute','اجعل الأرشيف مفيداً عند الصفقة أو النزاع','An organized archive reduces the time needed to respond to audits, acquisitions, financing requests and claims. Keep a chronology and index for significant matters, but do not alter source records. Record who collected documents and when, especially where evidence may later be relevant. Review the system annually, remove obsolete access and test whether a new employee can find a signed contract and its amendments quickly.'],
    ],
    bullets:[['Corporate and approval records','السجلات المؤسسية والموافقات'],['Signed contracts and amendments','العقود الموقعة والتعديلات'],['Licence, claim and insurance files','ملفات التراخيص والمطالبات والتأمين'],['Retention, backup and secure disposal','الاحتفاظ والنسخ الاحتياطي والإتلاف الآمن']],
    sources:['mc','laws'],tags:['legal records management','Saudi company documents','business compliance'],
  },
];

const imgUrl = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=85`;
function buildContent(topic, lang) {
  const isAr = lang === 'ar';
  const links = serviceLinks[topic.group].map((path, i) => `<a href="/${lang}${path}">${isAr ? ['خدمات ذات صلة','خدمات العقود','الاستشارات القانونية'][i] : ['related legal services','contract support','legal consultation'][i]}</a>`).join('، ');
  const sourceLinks = topic.sources.map((key, i) => `<a href="${official[key]}" target="_blank" rel="noopener noreferrer">${isAr ? ['المصدر الرسمي الأول','المصدر الرسمي الثاني'][i] : ['official reference','official guidance'][i]}</a>`).join(' و');
  const bullets = topic.bullets.map(([en, ar]) => `<li>${isAr ? ar : en}</li>`).join('');
  const paragraphs = topic.sections.map(([headingEn, headingAr, bodyEn]) => {
    const heading = isAr ? headingAr : headingEn;
    const body = isAr
      ? `تبدأ هذه الخطوة بفهم واقع المنشأة والهدف الذي تسعى إليه، ثم جمع المعلومات والمستندات ذات الصلة من الإدارات المعنية. يساعد توثيق الوقائع والقرارات والموافقات على تكوين صورة واضحة، كما يكشف النواقص التي تحتاج إلى استكمال قبل التنفيذ. ينبغي تحديد مسؤول عن المتابعة وموعد للمراجعة، مع حفظ النسخ النهائية في مكان منظم يسهل الرجوع إليه. وتختلف التفاصيل باختلاف النشاط والهيكل والاتفاقيات والأنظمة السارية؛ لذلك لا يكفي الاعتماد على نموذج عام أو افتراض أن إجراء منشأة أخرى يناسب هذه الحالة. راجع المتطلبات الرسمية ذات الصلة، واطلب مشورة مهنية إذا أثرت المسألة في الحقوق أو الالتزامات أو المواعيد.`
      : bodyEn;
    return `<h2>${heading}</h2><p>${body}</p>`;
  }).join('');
  const figure = `<figure class="article-inline-image"><img src="${imgUrl(topic.img)}" alt="${isAr ? topic.title[1] : topic.title[0]}" loading="lazy"><figcaption>${isAr ? 'خطوات عملية لدعم القرارات التجارية الواعية.' : 'Practical planning supports better informed business decisions.'}</figcaption></figure>`;
  const intro = isAr
    ? `<p>تحتاج المنشآت إلى إجراءات قانونية واضحة تدعم النمو وتساعد على إدارة المخاطر وحفظ الحقوق. يقدم هذا المقال إطاراً عملياً لمراجعة ${topic.title[1]}، مع أسئلة وسجلات تساعد أصحاب الأعمال على ترتيب الخطوات ومناقشة المسألة مع الفرق المختصة. ابدأ بتحديد الهدف والوقائع والأطراف المعنية، ثم اجمع المستندات المرتبطة قبل اتخاذ القرار. تختلف المتطلبات بحسب النشاط والهيكل والاتفاقيات والأنظمة المطبقة؛ لذا تحقق من المصادر الرسمية واطلب مشورة قانونية تناسب تفاصيل الحالة عند الحاجة.</p>`
    : `<p>Businesses need clear legal processes that support growth while managing risk and documenting decisions. This guide offers practical steps to adapt to the organization’s size, structure and objectives, and identifies records and questions worth reviewing early. Begin by gathering information from the teams involved, then assign an owner and expected completion date to each action. Requirements vary with the facts and current rules, so verify official sources and seek advice tailored to the situation when needed.</p>`;
  const action = isAr
    ? `<h2>حوّل الإرشادات إلى خطة عمل</h2><p>حوّل النقاط السابقة إلى مهام محددة، واحتفظ بسجل للقرارات والمستندات، وحدد موعداً لمراجعة الخطة عند تغير الظروف. يمكن أن تساعدك ${links} في تقييم الوثائق والخطوات ذات الصلة. وتتوفر معلومات إضافية لدى ${sourceLinks}. استخدم المصادر الرسمية للتحقق من الأنظمة والإجراءات الحالية قبل تقديم طلب أو الالتزام بخطوة مؤثرة.</p><p>هذا المقال للتوعية العامة ولا يمثل استشارة قانونية أو ضماناً لنتيجة. يعتمد الإجراء المناسب على وقائع كل حالة والأنظمة السارية وقتها.</p>`
    : `<h2>Turn the guidance into an action list</h2><p>Convert these points into assigned tasks, keep a record of decisions and supporting evidence, and schedule a review after any material change. Our ${links} can help assess documents and appropriate next steps. Additional regulatory information is available from ${sourceLinks}. Use official sources to confirm current rules and procedures before making a decision or filing an application.</p><p>This article is general educational information, not legal advice or a guarantee of outcome. The appropriate action depends on the details of each situation and the rules in force at the time.</p>`;
  return `${intro}${paragraphs}${figure}<h2>${isAr ? 'نقاط للمراجعة' : 'A practical review list'}</h2><ul>${bullets}</ul>${action}`;
}

async function seedNewArticles() {
  await mongoose.connect(env.mongodbUri);
  const author = await User.findOne({ role: 'admin', isActive: true }).sort({ createdAt: 1 });
  if (!author) throw new Error('Create an active administrator before seeding articles.');
  for (const topic of topics) {
    const existing = await Article.findOne({ $or: [{ 'slug.en': topic.slug }, { 'slug.ar': topic.slug }] }).select('_id');
    if (existing) { console.log(`Skipped existing article: ${topic.slug}`); continue; }
    const localized = (index) => ({ en: topic[index][0], ar: topic[index][1] });
    const metaTitle = { en: topic.title[0].slice(0,70), ar: topic.title[1].slice(0,70) };
    const article = new Article({
      title: localized('title'), slug: { en: topic.slug, ar: topic.slug }, excerpt: localized('excerpt'),
      content: { en: buildContent(topic, 'en'), ar: buildContent(topic, 'ar') },
      category: localized('category'), tags: { en: topic.tags, ar: topic.tags },
      featuredImage: { url: imgUrl(topic.img), publicId: null },
      imageAlt: { en: topic.title[0], ar: topic.title[1] }, author: author._id,
      status: 'published', publishedAt: new Date(),
      seo: { metaTitle, metaDescription: { en: topic.excerpt[0].slice(0,160), ar: topic.excerpt[1].slice(0,160) }, keywords: { en: topic.tags, ar: topic.tags }, canonicalUrl: { en: '', ar: '' } },
    });
    await article.save();
    console.log(`Published article: ${topic.slug}`);
  }
}

seedNewArticles().catch((error) => { console.error('[Seed new articles]', error.message); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
