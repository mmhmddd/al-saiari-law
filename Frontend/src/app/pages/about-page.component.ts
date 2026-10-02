import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../core/services/language.service';
import { SiteNavbarComponent } from './shared/site-navbar.component';
import { SiteFooterComponent } from './shared/site-footer.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink, SiteNavbarComponent, SiteFooterComponent],
  template: `
    <app-site-navbar />
    <main class="about-page" [attr.dir]="i18n.direction()" [class.is-ar]="ar">
      <section class="about-hero">
        <div class="about-hero-mark" aria-hidden="true"><img src="assets/consultation-logo-watermark.png" alt="" /></div>
        <p class="eyebrow">{{ ar ? 'شركة السياري للمحاماة والاستشارات القانونية' : 'ALSAIARI LAW FIRM · COMPANY PROFILE' }}</p>
        <h1>@if (ar) { <span>رؤية قانونية واضحة،</span><span>وشراكة تبني الثقة.</span> } @else { <span>Clear legal vision.</span><span>Partnership built on trust.</span> }</h1>
        <p class="hero-lead">{{ ar ? 'نرافق الشركات والأفراد في قراراتهم القانونية برؤية عملية، وعناية مهنية، وفهم دقيق لما يهمهم.' : 'We guide businesses and individuals through important legal decisions with practical insight, professional care, and a clear understanding of what matters to them.' }}</p>
        <a class="hero-cta" [routerLink]="['/', i18n.locale(), 'consultation']">{{ ar ? 'ابدأ حواراً معنا' : 'Start a conversation' }} <span aria-hidden="true">↗</span></a>
        <span class="hero-index" aria-hidden="true">01 <i></i> ALSAIARI</span>
      </section>

      <section class="firm-overview" aria-labelledby="firm-heading">
        <div class="section-marker"><span>01</span><i></i><small>{{ ar ? 'من نحن' : 'WHO WE ARE' }}</small></div>
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

      <section class="partners-section" aria-labelledby="partners-heading">
        <div class="partners-heading">
          <div>
            <p class="eyebrow">{{ ar ? 'شراكات تدعم الأثر' : 'COLLABORATION & TRUST' }}</p>
            <h2 id="partners-heading">{{ ar ? 'شركاء النجاح' : 'Partners in success' }}</h2>
          </div>
          <p>{{ ar ? 'نمضي إلى الأمام بالتعاون والثقة، ونعتز بالشعارات الواردة ضمن الملف التعريفي للشركة.' : 'We value collaboration and trust, and are proud to feature the partner marks included in our company profile.' }}</p>
        </div>
        <div class="partners-carousel" aria-label="Partners in success logos">
          <div class="partner-track">
            <div class="partner-sequence">
              @for (partner of partners; track partner.nameEn) {
                <article class="partner-card"><img [src]="partner.logo" [alt]="ar ? partner.nameAr : partner.nameEn" loading="lazy" /><span>{{ ar ? partner.nameAr : partner.nameEn }}</span></article>
              }
            </div>
            @for (copy of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; track copy) {
              <div class="partner-sequence" aria-hidden="true">
                @for (partner of partners; track partner.nameEn) {
                  <article class="partner-card"><img [src]="partner.logo" alt="" loading="lazy" /><span>{{ ar ? partner.nameAr : partner.nameEn }}</span></article>
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
            <span class="purpose-symbol" aria-hidden="true">01</span>
            <p class="eyebrow">{{ ar ? 'رؤيتنا' : 'OUR VISION' }}</p>
            <h3>{{ ar ? 'أن نكون المستشار القانوني الموثوق لرواد الأعمال والشركات.' : 'To be a trusted legal adviser to entrepreneurs and companies.' }}</h3>
            <p>{{ ar ? 'مستشار يفهم الطموحات ويقدم رؤية قانونية تسند خطوات النمو بثقة.' : 'A trusted adviser who understands ambition and helps businesses move forward with confidence.' }}</p>
          </article>
          <article class="purpose-card mission-card">
            <span class="purpose-symbol" aria-hidden="true">02</span>
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
              <span class="value-number">0{{ value.id }}</span>
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
            <article class="goal-card"><span>0{{ goal.id }}</span><h3>{{ ar ? goal.titleAr : goal.titleEn }}</h3><p>{{ ar ? goal.copyAr : goal.copyEn }}</p></article>
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
