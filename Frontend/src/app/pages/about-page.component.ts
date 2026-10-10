import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../core/services/language.service';
import { SiteNavbarComponent } from './shared/site-navbar.component';
import { SiteFooterComponent } from './shared/site-footer.component';
import { FirmStatsComponent } from './shared/firm-stats.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink, SiteNavbarComponent, SiteFooterComponent, FirmStatsComponent],
  template: `
    <app-site-navbar />
    <main class="about-page" [attr.dir]="i18n.direction()" [class.is-ar]="ar">
      <section class="about-hero">
        <div class="about-hero-mark" aria-hidden="true"><img src="assets/consultation-logo-watermark.png" alt="" /></div>
        <p class="eyebrow">{{ ar ? 'شركة السياري للمحاماة والاستشارات القانونية' : 'ALSAIARI LAW FIRM · COMPANY PROFILE' }}</p>
        <h1>@if (ar) { <span>رؤية قانونية واضحة،</span><span>وشراكة تبني الثقة.</span> } @else { <span>Clear legal vision.</span><span>Partnership built on trust.</span> }</h1>
        <p class="hero-lead">{{ ar ? 'نرافق الشركات والأفراد في قراراتهم القانونية برؤية عملية، وعناية مهنية، وفهم دقيق لما يهمهم.' : 'We guide businesses and individuals through important legal decisions with practical insight, professional care, and a clear understanding of what matters to them.' }}</p>
        <a class="hero-cta" [routerLink]="['/', i18n.locale(), 'consultation']">{{ ar ? 'ابدأ حواراً معنا' : 'Start a conversation' }} <span aria-hidden="true">↗</span></a>
        <span class="hero-index" aria-hidden="true">ALSAIARI</span>
      </section>

      <section class="firm-overview" aria-labelledby="firm-heading">
        <div class="section-marker"><i></i><small>{{ ar ? 'من نحن' : 'WHO WE ARE' }}</small></div>
        <div class="overview-copy">
          <p class="eyebrow">{{ ar ? 'نبذة عن الشركة' : 'ABOUT THE FIRM' }}</p>
          <h2 id="firm-heading">{{ ar ? 'قانون يفهم أعمالك، ويصون مصالحك.' : 'Legal counsel shaped around your business.' }}</h2>
          <p>{{ ar ? 'شركة السياري للمحاماة والاستشارات القانونية شركة سعودية مرخصة تقدم خدمات قانونية متكاملة للشركات والمؤسسات والأفراد. يجمع فريقنا خبرة في القانون التجاري، وحوكمة الشركات، والعقود، وتسوية المنازعات، والامتثال التنظيمي.' : 'Al Saiari is a licensed Saudi law firm providing integrated legal services to businesses, organizations, and individuals. Our team advises on commercial law, corporate governance, contracts, disputes, and regulatory compliance.' }}</p>
          <p>{{ ar ? 'نعمل بفهم عميق لبيئة الأعمال المحلية والدولية، وبمنهج يقوم على الدقة والشفافية وسرعة الاستجابة، لحماية مصالح عملائنا ومساندتهم في تحقيق أهدافهم.' : 'With a grounded understanding of local and international business environments, we work with precision, transparency, and responsiveness to protect our clients’ interests and help them achieve their objectives.' }}</p>
        </div>
        <figure class="overview-visual">
          <img src="assets/brand/office.png" [alt]="ar ? 'مساحة عمل مهنية تعكس هوية شركة السياري' : 'A professional office setting'" loading="lazy" />
          <figcaption><span>ALSAIARI</span><span>{{ ar ? 'خبرة قانونية برؤية عملية' : 'EXPERIENCE WITH A PRACTICAL VIEW' }}</span></figcaption>
        </figure>
      </section>

      <app-firm-stats />

      <section class="about-partners-section" [class.is-ar]="ar" aria-labelledby="partners-heading">
        <div class="partners-copy">
          <p class="eyebrow">{{ ar ? 'شراكات تدعم الثقة' : 'COLLABORATION & TRUST' }}</p>
          <h2 id="partners-heading">{{ ar ? 'شركاء النجاح' : 'Our partners' }}</h2>
          <p>{{ ar ? 'نعتز بعلاقاتنا المهنية، ونؤمن أن التعاون المبني على الثقة يصنع أثراً مستداماً.' : 'We value our professional relationships and believe trusted collaboration creates lasting impact.' }}</p>
          <span class="partners-caption">{{ ar ? 'معاً نحو أثرٍ أفضل' : 'Working together for better outcomes' }}</span>
        </div>
        <div class="partners-visual" [attr.aria-label]="ar ? 'شعارات شركائنا' : 'Partner logos'">
          <div class="about-partners-track">
            @for (copy of [0, 1]; track copy) {
              <div class="about-partners-sequence" [attr.aria-hidden]="copy !== 0 ? 'true' : null">
                @for (partner of partners; track partner.nameEn) {
                  <article class="about-partner-tile">
                    <img [src]="partner.logo" [alt]="copy === 0 ? (ar ? partner.nameAr : partner.nameEn) : ''" loading="lazy" />
                  </article>
                }
              </div>
            }
          </div>
        </div>
      </section>

      <section class="purpose-section" aria-labelledby="purpose-heading">
        <div class="purpose-heading">
          <p class="eyebrow">{{ ar ? 'رؤيتنا ورسالتنا' : 'OUR PURPOSE' }}</p>
          <h2 id="purpose-heading">{{ ar ? 'نؤمن أن الوضوح يصنع فارقاً.' : 'Clarity makes a difference.' }}</h2>
          <p>{{ ar ? 'هوية مهنية تجمع المعرفة القانونية بالاهتمام الحقيقي بأهداف العميل.' : 'A professional identity that brings legal knowledge together with a genuine commitment to our clients’ goals.' }}</p>
        </div>
        <div class="purpose-grid">
          <article class="purpose-card vision-card">
            <p class="eyebrow">{{ ar ? 'رؤيتنا' : 'OUR VISION' }}</p>
            <h3>{{ ar ? 'أن نكون المستشار القانوني الموثوق لرواد الأعمال والشركات.' : 'To be a trusted legal adviser to entrepreneurs and companies.' }}</h3>
            <p>{{ ar ? 'مستشار يفهم الطموحات ويقدم رؤية قانونية تسند خطوات النمو بثقة.' : 'A trusted adviser who understands ambition and helps businesses move forward with confidence.' }}</p>
          </article>
          <article class="purpose-card mission-card">
            <p class="eyebrow">{{ ar ? 'رسالتنا' : 'OUR MISSION' }}</p>
            <h3>{{ ar ? 'تقديم خدمات قانونية متكاملة بمعايير مهنية رفيعة.' : 'Deliver integrated legal services to the highest professional standards.' }}</h3>
            <p>{{ ar ? 'نقدم حلولاً عملية ومخصصة تساعد العملاء على صون مصالحهم وتحقيق أهدافهم في بيئة أعمال متغيرة.' : 'We provide tailored, practical solutions that protect client interests and support their objectives in a changing business environment.' }}</p>
          </article>
        </div>
      </section>

      <section class="values-section" aria-labelledby="values-heading">
        <div class="values-heading">
          <p class="eyebrow">{{ ar ? 'ما يميز عملنا' : 'THE WAY WE WORK' }}</p>
          <h2 id="values-heading">{{ ar ? 'قيم نلتزم بها في كل خطوة.' : 'Principles behind every step.' }}</h2>
          <p>{{ ar ? 'هذه القيم توجه أسلوبنا في الاستشارة والتمثيل والتواصل.' : 'These principles shape how we advise, represent, and communicate.' }}</p>
        </div>
        <div class="values-grid">
          @for (value of values; track value.id) {
            <article class="value-card">
              <h3>{{ ar ? value.titleAr : value.titleEn }}</h3>
              <p>{{ ar ? value.copyAr : value.copyEn }}</p>
              <i aria-hidden="true"></i>
            </article>
          }
        </div>
      </section>

      <section class="goals-section" aria-labelledby="goals-heading">
        <div class="goals-heading">
          <p class="eyebrow">{{ ar ? 'أهدافنا' : 'OUR GOALS' }}</p>
          <h2 id="goals-heading">{{ ar ? 'أثر عملي يدعم ما تسعى إليه.' : 'Practical outcomes for what comes next.' }}</h2>
        </div>
        <div class="goals-grid">
          @for (goal of goals; track goal.id) {
            <article class="goal-card"><h3>{{ ar ? goal.titleAr : goal.titleEn }}</h3><p>{{ ar ? goal.copyAr : goal.copyEn }}</p></article>
          }
        </div>
      </section>

      <section class="commitment-section" aria-labelledby="commitment-heading">
        <div class="commitment-art"><img src="assets/consultation-logo-watermark.png" alt="" aria-hidden="true" /><i></i><small>CLARITY · CARE · COUNSEL</small></div>
        <div class="commitment-copy">
          <p class="eyebrow">{{ ar ? 'التزامنا تجاهك' : 'OUR COMMITMENT' }}</p>
          <h2 id="commitment-heading">{{ ar ? 'نبدأ بالاستماع، ثم نرسم الطريق معك.' : 'We listen first, then find the way forward with you.' }}</h2>
          <p>{{ ar ? 'نحرص على فهم الوقائع والسياق والأهداف قبل تقديم الرأي، ثم نوضح الخيارات والاعتبارات والخطوة التالية بلغة مباشرة.' : 'We take time to understand the facts, context, and objectives before advising. Then we explain the available options, relevant considerations, and next steps in clear language.' }}</p>
          <a [routerLink]="['/', i18n.locale(), 'consultation']">{{ ar ? 'تعرّف على طريقة عملنا' : 'Discuss your matter with us' }} <span aria-hidden="true">↗</span></a>
        </div>
      </section>



      <section class="about-cta">
        <p class="eyebrow">{{ ar ? 'خطوتك التالية تبدأ بحوار' : 'YOUR NEXT STEP STARTS WITH A CONVERSATION' }}</p>
        <h2>{{ ar ? 'دعنا نبحث معاً عن المسار القانوني الأنسب.' : 'Let’s find the right legal path together.' }}</h2>
        <a [routerLink]="['/', i18n.locale(), 'consultation']">{{ ar ? 'تواصل معنا' : 'Talk to our team' }} <span aria-hidden="true">↗</span></a>
      </section>
    </main>
    <app-site-footer />
  `,
  styles: [`
    .about-partners-section{display:flex;flex-direction:column;align-items:stretch;gap:clamp(16px,2vw,22px);padding:clamp(42px,5vw,68px) clamp(25px,9vw,140px);background:transparent;direction:ltr}
    .partners-copy{width:100%;max-width:none;text-align:center}
    .partners-copy .eyebrow{margin-bottom:10px}
    .partners-copy h2{margin:0 0 10px;color:#172823;font-size:clamp(44px,5.4vw,72px);font-weight:700}
    .partners-copy>p:not(.eyebrow){max-width:700px;margin:0 auto;color:#6d6a63;font-size:clamp(18px,1.7vw,22px);line-height:1.9}
    .partners-caption{display:inline-flex;align-items:center;justify-content:center;gap:12px;margin-top:12px;color:#8c7248;font-size:14px;font-weight:700}
    .partners-caption:before{content:'';width:35px;height:1px;background:#b0905d}
    .about-partners-section.is-ar .partners-copy{direction:rtl;text-align:center;margin-inline:auto}
    .about-partners-section.is-ar .partners-copy>p:not(.eyebrow){font-family:'SFMada',Georgia,serif;line-height:2}
    .partners-visual{position:relative;isolation:isolate;width:100%;height:230px;overflow:hidden;direction:ltr}
    .about-partners-track{display:flex;width:max-content;height:100%;gap:0;margin:0;padding:0;animation:partner-scroll-left 34s linear infinite;will-change:transform}
    .about-partners-sequence{display:flex;flex:0 0 auto;flex-direction:row;align-items:stretch;gap:0;height:100%;margin:0;padding:0}
    .about-partner-tile{display:grid;flex:0 0 clamp(230px,26vw,290px);place-items:center;height:100%;min-width:0;margin:0;padding:12px;background:transparent;border:0;overflow:hidden}
    .about-partner-tile img{display:block;width:min(94%,270px);height:168px;padding:0;border:0;border-radius:0;background:transparent;box-shadow:none;object-fit:contain}
    @keyframes partner-scroll-left{to{transform:translateX(-50%)}}
    @media(max-width:800px){.about-partners-section{gap:18px;padding:46px 24px}.partners-visual{height:205px}.about-partner-tile{flex-basis:235px}.about-partner-tile img{height:152px}}
    @media(max-width:480px){.about-partners-section{gap:16px;padding:42px 18px}.partners-copy h2{font-size:42px}.partners-copy>p:not(.eyebrow){font-size:16px;line-height:1.8}.partners-visual{height:176px}.about-partner-tile{flex-basis:185px;padding:8px}.about-partner-tile img{width:96%;height:140px}}
    @media(prefers-reduced-motion:reduce){.partners-visual{overflow-x:auto}.about-partners-track{animation:none!important;transform:none!important;will-change:auto}}
  `],
})


export class AboutPageComponent {
  readonly i18n = inject(LanguageService);
  readonly partners = [
    { nameEn: 'Jadwa Investment', nameAr: 'جدوى للاستثمار', logo: 'assets/profile/partners/jadwa-investment.jpg' },
    { nameEn: 'National Franchises', nameAr: 'الامتيازات الوطنية', logo: 'assets/profile/partners/national-franchises.jpg' },
    { nameEn: 'National Center for Non-Profit Sector', nameAr: 'المركز الوطني لتنمية القطاع غير الربحي', logo: 'assets/profile/partners/nonprofit-center.jpg' },
    { nameEn: 'Hawsabah', nameAr: 'حوسبة', logo: 'assets/profile/partners/hawsabah.jpg' },
    { nameEn: 'SURE Global Tech', nameAr: 'شور العالمية للتقنية', logo: 'assets/profile/partners/sure-global-tech.jpg' },
    { nameEn: 'ZOOD', nameAr: 'زود', logo: 'assets/profile/partners/zood.jpg' },
  ];
  readonly values = [
    { id: 1, titleEn: 'Precision', titleAr: 'الدقة', copyEn: 'We examine the detail and the wider context before recommending a course of action.', copyAr: 'نراجع التفاصيل والسياق الأوسع قبل تقديم الرأي أو التوصية بالخطوة المناسبة.' },
    { id: 2, titleEn: 'Transparency', titleAr: 'الشفافية', copyEn: 'We explain options, considerations, and next steps in direct, understandable language.', copyAr: 'نوضح الخيارات والاعتبارات والخطوات التالية بلغة مباشرة ومفهومة.' },
    { id: 3, titleEn: 'Responsiveness', titleAr: 'سرعة الاستجابة', copyEn: 'We value timely communication and focused support throughout each matter.', copyAr: 'نحرص على التواصل في الوقت المناسب وتقديم دعم مركز في مختلف مراحل المسألة.' },
    { id: 4, titleEn: 'Confidentiality', titleAr: 'السرية', copyEn: 'We treat client information and interests with professional care and discretion.', copyAr: 'نتعامل مع معلومات العملاء ومصالحهم بعناية مهنية وسرية.' },
    { id: 5, titleEn: 'Practical counsel', titleAr: 'الرأي العملي', copyEn: 'We tailor our advice to the client’s objectives, sector, and operating environment.', copyAr: 'نصمم الرأي القانوني بما يلائم أهداف العميل وقطاعه وبيئة عمله.' },
    { id: 6, titleEn: 'Professional excellence', titleAr: 'التميز المهني', copyEn: 'We are committed to high standards and continued attention to a changing market.', copyAr: 'نلتزم بمعايير مهنية عالية ومواكبة مستمرة لتغيرات السوق.' },
  ];
  readonly goals = [
    { id: 1, titleEn: 'Protect client interests', titleAr: 'حماية مصالح العملاء', copyEn: 'Understand each matter fully and safeguard the legal and commercial interests at stake.', copyAr: 'فهم المسألة من جميع جوانبها وصون المصالح القانونية والتجارية المرتبطة بها.' },
    { id: 2, titleEn: 'Make decisions clearer', titleAr: 'دعم القرار الواضح', copyEn: 'Turn complex requirements into clear options and practical next steps.', copyAr: 'تحويل المتطلبات المعقدة إلى خيارات واضحة وخطوات عملية قابلة للتنفيذ.' },
    { id: 3, titleEn: 'Support sustainable growth', titleAr: 'مساندة النمو المستدام', copyEn: 'Help clients move forward with sound legal foundations and considered guidance.', copyAr: 'مساعدة العملاء على التقدم بأسس قانونية سليمة ورأي مهني مدروس.' },
  ];
  get ar(): boolean { return this.i18n.locale() === 'ar'; }
}
