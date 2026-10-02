export interface ServiceOffering {
  id: string;
  image: string;
  no: string;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
}

export const SERVICE_OFFERINGS: ServiceOffering[] = [
  { id: 'litigation-advocacy', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=85', no: '01', ar: 'التقاضي والترافع', en: 'Litigation & Advocacy', descAr: 'تمثيل العملاء أمام الجهات القضائية وشبه القضائية والجهات الحكومية، مع حماية مراكزهم القانونية والعمل على تحقيق أهدافهم.', descEn: 'Representation before judicial, quasi-judicial and government authorities, with a clear focus on protecting your legal position and objectives.' },
  { id: 'legal-advisory', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85', no: '02', ar: 'الاستشارات القانونية', en: 'Legal Advisory', descAr: 'حلول واستشارات قانونية مبنية على فهم دقيق لاحتياجات العميل وطبيعة نشاطه، لمساعدته على اتخاذ قرارات مدروسة.', descEn: 'Practical legal advice grounded in a careful understanding of your needs, activities and goals.' },
  { id: 'company-formation', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85', no: '03', ar: 'تأسيس الشركات والخدمات التجارية', en: 'Company Formation & Commercial Services', descAr: 'تأسيس الشركات واختيار الكيان الأنسب، وصياغة القرارات ومراجعتها، ودعم التصفية والاندماج والاستحواذ والامتياز التجاري.', descEn: 'Company formation and entity selection, partner resolutions, liquidation, mergers and acquisitions, and commercial franchising.' },
  { id: 'foreign-investment', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=85', no: '04', ar: 'الاستثمار الأجنبي', en: 'Foreign Investment', descAr: 'دعم المستثمرين في التراخيص وتأسيس الشركات وفق الأنظمة السعودية، مع إرشاد قانوني مستمر للعقود والمعاملات الاستثمارية.', descEn: 'Support with investment licensing and company formation under Saudi regulations, with ongoing guidance on investor contracts and transactions.' },
  { id: 'franchising', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85', no: '05', ar: 'الامتياز التجاري', en: 'Franchising', descAr: 'إعداد ومراجعة اتفاقيات الامتياز، والإرشاد في الامتثال، وتنظيم العلاقة بين مانح الامتياز وصاحبه بما يدعم استدامة الأعمال.', descEn: 'Drafting and reviewing franchise agreements, compliance advice, and structuring the relationship to support sustainable operations.' },
  { id: 'intellectual-property', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=85', no: '06', ar: 'الملكية الفكرية', en: 'Intellectual Property', descAr: 'حماية العلامات التجارية وبراءات الاختراع وحقوق المؤلف والأسرار التجارية، من خلال التسجيل والاستشارات والاتفاقيات المناسبة.', descEn: 'Protecting trademarks, patents, copyrights and trade secrets through registration, advice and carefully drafted agreements.' },
  { id: 'contracts-transactions', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=85', no: '07', ar: 'العقود والصفقات التجارية', en: 'Contracts & Commercial Transactions', descAr: 'صياغة ومراجعة العقود ومذكرات التفاهم والاتفاقيات، ودعم التفاوض والإشراف على مراحل التنفيذ.', descEn: 'Drafting and reviewing contracts, memoranda and agreements, with negotiation support and guidance through implementation.' },
];
