import { AfterViewInit, Component, ElementRef, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LanguageService } from "../core/services/language.service";
import { ConsultationService } from "../core/services/consultation.service";
import { HomeHeroComponent } from "./shared/home-hero.component";
import { SiteNavbarComponent } from "./shared/site-navbar.component";
import { SiteFooterComponent } from "./shared/site-footer.component";
import { RouterLink } from "@angular/router";
import { SERVICE_OFFERINGS } from "./service-catalog";

@Component({
  standalone: true,
  imports: [
    HomeHeroComponent,
    SiteNavbarComponent,
    SiteFooterComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <main
      class="site"
      [attr.dir]="i18n.direction()"
      [class.is-ar]="i18n.locale() === 'ar'"
    >
      <app-site-navbar />

      <app-home-hero />

      <section
        appScrollReveal
        class="trust-strip"
        [attr.aria-label]="ar ? 'مبادئنا' : 'Our principles'"
      >
        <div>{{ ar ? "وضوح في الرأي" : "Clarity in counsel" }}</div>
        <div>{{ ar ? "عناية بكل تفصيل" : "Care in every detail" }}</div>
        <div>{{ ar ? "التزام بالسرية" : "Discretion, always" }}</div>
      </section>

      <section appScrollReveal class="about section-grid" id="about">
        <div class="about-copy">
          <p class="eyebrow">
            {{
              ar
                ? "شركة السياري محامون ومستشارون"
                : "AL SAIARI LAWYERS & LEGAL CONSULTANTS"
            }}
          </p>
          <h2>
            {{
              ar
                ? "شريك قانوني استراتيجي للأعمال."
                : "Your strategic legal partner in business."
            }}
          </h2>
          <p class="body-copy">
            {{
              ar
                ? "شركة سعودية مرخصة تقدم خدمات قانونية متكاملة للشركات والمؤسسات. يجمع فريقنا خبرة واسعة في القانون التجاري، وحوكمة الشركات، والعقود، والمنازعات، والامتثال النظامي. نعمل بدقة وشفافية وسرعة استجابة لحماية مصالح عملائنا ودعم أهدافهم، وفق معايير مهنية تواكب تطورات السوق السعودي ورؤية المملكة 2030."
                : "A licensed Saudi law firm delivering integrated legal services to businesses and organizations. Our experienced team supports clients across commercial law, corporate governance, contracts, disputes, and regulatory compliance. We work with precision, transparency, and responsiveness to protect client interests and support their goals in a changing Saudi market."
            }}
          </p>
          <a class="text-link" [routerLink]="['/', i18n.locale(), 'about']"
            >{{ ar ? "تعرف علينا أكثر" : "Learn more about us" }}
            <span aria-hidden="true">↗</span></a
          >
        </div>
        <div class="about-aside">
          <div class="seal" aria-hidden="true"><img src="assets/consultation-logo-watermark.png" alt="" /><i></i></div>
          <p>
            {{
              ar
                ? "رأي قانوني متزن. وعلاقة أساسها الثقة."
                : "Measured legal thinking. A relationship built on trust."
            }}
          </p>
          <small>AL SAIARI LAW FIRM</small>
        </div>
        <figure class="about-photo">
          <img
            src="assets/brand/office.png"
            [alt]="
              ar
                ? 'مكتب شركة السياري للمحاماة والاستشارات القانونية'
                : 'Al Saiari Law office'
            "
            loading="lazy"
          />
          <figcaption>
            {{
              ar
                ? "بيئة مهنية لاستقبالكم"
                : "A considered space to welcome you"
            }}<a href="assets/profile/al-saiari-profile.pdf" download
              >{{ ar ? "تحميل الملف التعريفي" : "Download firm profile"
              }}<span aria-hidden="true">↓</span></a
            >
          </figcaption>
        </figure>
      </section>

      <section appScrollReveal class="services-section" id="services">
        <div class="section-heading">
          <div>
            <p class="eyebrow">
              {{
                ar
                  ? "رؤية قانونية لخطواتك القادمة"
                  : "Practical counsel for the moments that shape what comes next"
              }}
            </p>
            <h2>{{ ar ? "خدماتنا القانونية" : "Our Legal Services" }}</h2>
          </div>
          <p>
            {{
              ar
                ? "استشارات وتمثيل قانوني وحلول أعمال تساعدك على اتخاذ الخطوة التالية بثقة."
                : "Advice, representation and business solutions to help you take your next step with confidence."
            }}
          </p>
        </div>
        <div class="featured-services">
          @for (service of services.slice(0, 4); track service.id) {
            <a
              class="featured-service"
              [routerLink]="['/', i18n.locale(), 'services']"
              [fragment]="service.id"
              [attr.aria-label]="
                ar
                  ? 'اقرأ المزيد عن ' + service.ar
                  : 'Read more about ' + service.en
              "
            >
              <div class="feature-image-wrap">
                <img
                  class="feature-image"
                  [src]="service.image"
                  [alt]="ar ? service.ar : service.en"
                  loading="lazy"
                />
                <div class="feature-image-overlay">
                  <strong>{{ ar ? service.ar : service.en }}</strong
                  ><span
                    >{{ ar ? "اقرأ المزيد" : "Read more" }}
                    <i aria-hidden="true">↗</i></span
                  >
                </div>
              </div>
              <div class="feature-copy">
                <span>{{
                  ar ? "خدمة قانونية متخصصة" : "SPECIALIST LEGAL SERVICE"
                }}</span>
                <h3>{{ ar ? service.ar : service.en }}</h3>
                <p>{{ ar ? service.descAr : service.descEn }}</p>
              </div>
              <span class="feature-arrow" aria-hidden="true">↗</span>
            </a>
          }
        </div>
        <a
          class="all-services-link"
          [routerLink]="['/', i18n.locale(), 'services']"
          >{{ ar ? "اكتشف جميع خدماتنا" : "See how we can help" }}
          <span>↗</span></a
        >
      </section>

      <section appScrollReveal class="approach" id="approach">
        <div class="approach-panel">
          <div class="approach-intro">
            <p class="eyebrow">
              {{ ar ? "خطوة واضحة تبدأ بحوار" : "A CLEARER WAY FORWARD" }}
            </p>
            <h2>
              {{
                ar
                  ? "احجز استشارتك القانونية الآن"
                  : "Book your legal consultation now"
              }}
            </h2>
            <p>
              {{
                ar
                  ? "ناقش مسألتك مع فريقنا القانوني، واحصل على رؤية واضحة تساعدك على تحديد خطوتك القادمة."
                  : "Talk through your matter with our legal team and get clear guidance on what to do next."
              }}
            </p>
          </div>
          <a class="approach-booking" [routerLink]="['/', i18n.locale(), 'consultation']"
            >{{ ar ? "تواصل معنا" : "Contact our team" }}
            <span aria-hidden="true">↗</span></a
          >
        </div>
      </section>

      <section appScrollReveal class="latest-articles" id="insights">
        <div class="articles-heading">
          <div>
            <p class="eyebrow">
              {{
                ar
                  ? "معرفة عملية لقراراتك القادمة"
                  : "PERSPECTIVES FOR WHAT COMES NEXT"
              }}
            </p>
            <h2>{{ ar ? "أحدث المقالات" : "Latest Articles" }}</h2>
          </div>
          <p>
            {{
              ar
                ? "اقرأ رؤى واضحة حول المسائل القانونية التي تهمك."
                : "Clear perspectives on legal questions that matter to you."
            }}
          </p>
        </div>
        <a class="all-articles-link" [routerLink]="['/', i18n.locale(), 'articles']">{{ ar ? 'استكشف جميع المقالات' : 'Explore all articles' }} <span aria-hidden="true">↗</span></a>
        <div class="article-grid">
          @for (article of mockArticles; track article.id) {
            <article class="article-card">
              <div class="article-image-wrap">
                <img
                  [src]="article.image"
                  [alt]="ar ? article.titleAr : article.titleEn"
                  loading="lazy"
                /><span class="sample-label">{{
                  ar ? "مقال تجريبي" : "SAMPLE ARTICLE"
                }}</span>
                <div class="article-image-overlay">
                  <strong>{{ ar ? article.titleAr : article.titleEn }}</strong
                  ><button type="button" (click)="selectedArticle = article">
                    {{ ar ? "اقرأ المزيد" : "Read more" }}
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </div>
              <div class="article-card-copy">
                <div class="article-meta">
                  <span>{{ ar ? article.categoryAr : article.categoryEn }}</span
                  ><time>{{ article.date }}</time>
                </div>
                <h3>{{ ar ? article.titleAr : article.titleEn }}</h3>
                <p>{{ ar ? article.excerptAr : article.excerptEn }}</p>
                <button class="article-read-more" type="button" (click)="selectedArticle = article">
                  {{ ar ? "اقرأ المقال" : "Read article" }} <span aria-hidden="true">↗</span>
                </button>
              </div>
            </article>
          }
        </div>
        @if (selectedArticle; as article) {
          <div class="article-modal-backdrop" (click)="selectedArticle = null">
            <section
              class="article-modal"
              role="dialog"
              aria-modal="true"
              [attr.aria-label]="ar ? article.titleAr : article.titleEn"
              (click)="$event.stopPropagation()"
            >
              <button
                class="article-modal-close"
                type="button"
                (click)="selectedArticle = null"
                [attr.aria-label]="ar ? 'إغلاق المقال' : 'Close article'"
              >
                ×
              </button>
              <span class="article-modal-category"
                >{{ ar ? article.categoryAr : article.categoryEn }} ·
                {{ ar ? "مقال تجريبي" : "SAMPLE ARTICLE" }}</span
              >
              <h2>{{ ar ? article.titleAr : article.titleEn }}</h2>
              <p>{{ ar ? article.excerptAr : article.excerptEn }}</p>
              <p>{{ ar ? article.bodyAr : article.bodyEn }}</p>
            </section>
          </div>
        }
      </section>

      <section class="faq-section" id="faq">
        <div>
          <p class="eyebrow">
            {{ ar ? "إجابات أولية" : "A FEW FIRST ANSWERS" }}
          </p>
          <h2>{{ ar ? "قبل أن تبدأ." : "Before we begin." }}</h2>
        </div>
        <div class="faq-list">
          <details>
            <summary>
              {{
                ar
                  ? "كيف أبدأ بطلب استشارة؟"
                  : "How do I request a consultation?"
              }}<span>+</span>
            </summary>
            <p>
              {{
                ar
                  ? "تواصل معنا عبر بيانات الاتصال، وشاركنا نبذة موجزة عن المسألة لنرشدك إلى الخطوة المناسبة."
                  : "Reach out using the contact details below and share a brief outline of your matter. Our team will guide you on the next step."
              }}
            </p>
          </details>
          <details>
            <summary>
              {{
                ar
                  ? "هل يمكنني معرفة الخيارات المتاحة قبل اتخاذ قرار؟"
                  : "Can I understand my options before deciding?"
              }}<span>+</span>
            </summary>
            <p>
              {{
                ar
                  ? "نعم، هدف النقاش الأولي هو توضيح المسارات والاعتبارات ذات الصلة لمساعدتك على اتخاذ قرار مدروس."
                  : "Yes. An initial discussion can clarify the available paths and key considerations, helping you make an informed decision."
              }}
            </p>
          </details>
          <details>
            <summary>
              {{
                ar
                  ? "كيف تتعاملون مع سرية المعلومات؟"
                  : "How is confidential information handled?"
              }}<span>+</span>
            </summary>
            <p>
              {{
                ar
                  ? "نتعامل مع المعلومات التي تشاركها بعناية وسرية مهنية، ونوضح نطاق العمل قبل المضي في أي إجراء."
                  : "We handle information you share with care and professional discretion, and clarify the scope of work before proceeding."
              }}
            </p>
          </details>
        </div>
      </section>

      <section class="contact-section" id="contact">
        <div class="contact-orbit" aria-hidden="true"><img src="assets/consultation-logo-watermark.png" alt="" /></div>
        <p class="eyebrow">
          {{ ar ? "لنبدأ بالحديث" : "START A CONVERSATION" }}
        </p>
        <h2>
          {{
            ar
              ? "كل مسألة تستحق أن تُفهم جيداً."
              : "Every matter deserves a closer look."
          }}
        </h2>
        <p>
          {{
            ar
              ? "أرسل طلباً أولياً، وسيتواصل معك فريق المكتب."
              : "Send an initial request and the firm team will be in touch."
          }}
        </p>
        @if (requestSent) {
          <div class="request-message" role="status">
            {{
              ar
                ? "وصل طلبك بنجاح. سيتواصل معك فريق المكتب."
                : "Your request was received. The firm team will be in touch."
            }}
          </div>
        } @else {
          <form
            class="consultation-form"
            [formGroup]="consultationForm"
            (ngSubmit)="submitConsultation()"
          >
            <label
              ><span>{{ ar ? "الاسم" : "Name" }}</span
              ><input
                formControlName="name"
                autocomplete="name"
                required
                [placeholder]="ar ? 'الاسم الكامل' : 'Your full name'"
            /></label>
            <label
              ><span>{{ ar ? "رقم الهاتف" : "Phone number" }}</span
              ><input
                formControlName="phone"
                type="tel"
                autocomplete="tel"
                required
                [placeholder]="
                  ar ? 'رقم الهاتف مع رمز الدولة' : 'Include your country code'
                "
            /></label>
            <label
              ><span>{{ ar ? "التاريخ المناسب" : "Preferred date" }} <small>{{ ar ? "اختياري" : "Optional" }}</small></span
              ><input
                formControlName="preferredDate"
                type="date"
                [min]="today"
            /></label>
            <label
              ><span>{{ ar ? "الوقت المناسب" : "Preferred time" }} <small>{{ ar ? "اختياري" : "Optional" }}</small></span
              ><input formControlName="preferredTime" type="time"
            /></label>
            @if (requestError) {
              <p class="request-error" role="alert">
                {{
                  ar
                    ? "تعذر إرسال الطلب الآن. يرجى المحاولة مجدداً."
                    : "We could not send your request. Please try again."
                }}
              </p>
            }
            <button
              class="contact-button"
              type="submit"
              [disabled]="submitting"
            >
              {{
                submitting
                  ? ar
                    ? "جارٍ الإرسال…"
                    : "Sending…"
                  : ar
                    ? "إرسال طلب الاستشارة"
                    : "Request a consultation"
              }}
              <span>↗</span>
            </button>
          </form>
        }
      </section>

      <app-site-footer />
      <a
        class="whatsapp-float"
        href="https://wa.me/966570907930"
        target="_blank"
        rel="noopener noreferrer"
        [attr.aria-label]="
          ar
            ? 'تواصل معنا عبر واتساب على الرقم +966 57 090 7930'
            : 'Chat with us on WhatsApp at +966 57 090 7930'
        "
        title="+966 57 090 7930"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M16.04 3C8.88 3 3.05 8.82 3.05 15.98c0 2.28.6 4.5 1.73 6.47L3 29l6.72-1.76a12.94 12.94 0 0 0 6.31 1.61h.01c7.16 0 12.98-5.82 12.99-12.98A12.9 12.9 0 0 0 25.22 6.7 12.9 12.9 0 0 0 16.04 3Zm0 23.66h-.01c-1.96 0-3.88-.53-5.55-1.53l-.4-.24-3.99 1.05 1.06-3.89-.26-.4a10.68 10.68 0 0 1-1.64-5.67c0-5.96 4.85-10.81 10.82-10.81 2.89 0 5.61 1.13 7.65 3.17a10.75 10.75 0 0 1 3.16 7.66c0 5.97-4.85 10.82-10.82 10.82Zm5.94-8.1c-.33-.16-1.96-.97-2.26-1.08-.3-.11-.52-.16-.74.16-.22.33-.85 1.08-1.04 1.3-.19.22-.38.25-.71.08-.33-.16-1.39-.51-2.65-1.63-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.5.14-.66.15-.14.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.79-1.01-2.45-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.71s1.17 3.15 1.33 3.37c.16.22 2.3 3.51 5.57 4.92.78.34 1.39.55 1.87.7.79.25 1.5.21 2.06.13.63-.09 1.96-.8 2.24-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.38Z"
          />
        </svg>
      </a>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        --black: #141414;
        --paper: #f7f6f3;
        --white: #fff;
        --brass: #ad8c59;
        --soft: #dedbd4;
        --serif: "Times New Roman", Georgia, serif;
        color: var(--black);
      }
      .site {
        background: var(--paper);
        overflow-x: clip;
      }
      .site.is-ar {
        font-family: "SFMada", Georgia, serif;
      }
      .site-header {
        height: 94px;
        padding: 0 clamp(22px, 6.2vw, 100px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #1a191612;
        background: var(--paper);
        position: relative;
        z-index: 2;
      }
      .brand-mark img {
        display: block;
        width: 154px;
        height: 64px;
        object-fit: contain;
        mix-blend-mode: multiply;
      }
      .main-nav,
      .header-actions {
        display: flex;
        align-items: center;
      }
      .main-nav {
        gap: clamp(18px, 3vw, 44px);
      }
      .main-nav a {
        font-size: 14px;
        color: #595751;
      }
      .main-nav a:hover,
      .admin-link:hover {
        color: var(--brass);
      }
      .header-actions {
        gap: 18px;
      }
      .language-switch {
        border: 0;
        background: none;
        font-size: 13px;
        color: #555;
        padding: 8px;
      }
      .header-cta,
      .contact-button {
        background: var(--black);
        color: white;
        padding: 14px 19px;
        font-size: 13px;
        display: inline-flex;
        gap: 23px;
        align-items: center;
      }
      .header-cta:hover,
      .contact-button:hover {
        background: #39342b;
      }
      .header-cta span {
        color: #c4a875;
      }
      .trust-strip {
        background: #191919;
        color: #f7f6f3;
        min-height: 83px;
        padding: 12px clamp(22px, 9vw, 150px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
      }
      .trust-strip div {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 14px;
      }
      .trust-strip span,
      .section-index,
      .eyebrow,
      .vertical-note,
      .service-no,
      .trust-strip span {
        color: #c2a574;
        font-size: 11px;
      }
      .section-grid {
        display: grid;
        grid-template-columns: 0.62fr 1.8fr 0.85fr;
        gap: 40px;
        padding: clamp(80px, 10vw, 148px) clamp(24px, 10vw, 160px);
      }
      .section-label {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
      }
      .section-index {
        font-size: 10px;
        color: var(--brass);
        letter-spacing: 0.15em;
      }
      .vertical-note {
        font-size: 10px;
        color: #99958d;
        writing-mode: vertical-rl;
        letter-spacing: 0.24em;
      }
      .eyebrow {
        font-size: 10px;
        letter-spacing: 0.17em;
        color: #927546;
        text-transform: uppercase;
        margin: 0 0 24px;
      }
      .about-copy h2,
      .section-heading h2,
      .approach h2,
      .is-ar .about-copy h2,
      .is-ar .section-heading h2,
      .is-ar .approach h2,
      .is-ar .body-copy {
        max-width: 560px;
        color: #white;
        font-size: 32px;
        line-height: 1.95;
        margin: 27px 0;
      }
      
      
      .text-link {
        display: inline-flex;
        gap: 24px;
        border-bottom: 1px solid #a58a61;
        padding-bottom: 9px;
        font-size: 13px;
      }
      .text-link span {
        color: var(--brass);
      }
      .about-aside {
        align-self: end;
        padding: 26px 0 5px 28px;
        border-left: 1px solid #d7d2c8;
      }
      .seal {
        width: 112px;
        height: 112px;
        border: 1px solid #b59a6d;
        border-radius: 50%;
        display: grid;
        place-items: center;
        position: relative;
        color: #94774a;
        font: 25px var(--serif);
      }
      .seal:before,
      .seal:after {
        content: "";
        position: absolute;
        inset: 7px;
        border: 1px solid #cfc2a9;
        border-radius: 50%;
      }
      .seal:after {
        inset: -7px;
        border-color: #d7d2c8;
      }
      .seal img { width: 58px; height: 58px; object-fit: contain; filter: brightness(0) saturate(100%) sepia(35%) saturate(700%) hue-rotate(5deg) brightness(82%); }
      .seal i {
        position: absolute;
        width: 5px;
        height: 5px;
        background: var(--brass);
        border-radius: 50%;
        top: 10px;
        right: 21px;
      }
      .about-aside p {
        font: italic 19px/1.5 var(--serif);
        max-width: 200px;
        margin: 29px 0 17px;
      }
      .about-aside small {
        font: 10px var(--serif);
        letter-spacing: 0.12em;
        color: #9b8a6d;
      }
      .services-section {
        background: #eeede9;
        padding: clamp(70px, 8vw, 116px) clamp(24px, 10vw, 160px);
      }
      .section-heading {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 45px;
        margin-bottom: 52px;
      }
      .section-heading .eyebrow {
        margin: 22px 0 16px;
      }
      .section-heading h2 {
        font-size: clamp(35px, 4vw, 55px);
      }
      .section-heading > p {
        max-width: 275px;
        color: #77736a;
        font-size: 14px;
        line-height: 1.9;
        margin: 0 0 6px;
      }
      .service-row {
        display: grid;
        grid-template-columns: 65px minmax(180px, 0.9fr) minmax(180px, 1fr) 35px;
        align-items: center;
        gap: 25px;
        padding: 25px 8px;
        border-top: 1px solid #cfcbc2;
        transition:
          padding 0.2s ease,
          color 0.2s ease;
      }
      .service-row:last-child {
        border-bottom: 1px solid #cfcbc2;
      }
      .service-row:hover {
        padding-inline: 17px;
        color: #8a7045;
      }
      .service-no {
        font-size: 11px;
        color: #9b8156;
      }
      .service-title {
        font: 25px/1.25 var(--serif);
      }
      .is-ar .service-title {
        font:
          24px/1.5 "SFMada",
          Georgia,
          serif;
      }
      .service-description {
        color: #77746c;
        font-size: 13px;
        line-height: 1.75;
      }
      .service-arrow {
        font-size: 20px;
        text-align: end;
        color: #9d8052;
      }
      .approach {
        background: #191919;
        color: white;
        padding: clamp(75px, 9vw, 130px) clamp(24px, 10vw, 160px);
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(50px, 9vw, 140px);
      }
      .approach .section-index {
        color: #c3a36f;
      }
      .approach-intro .eyebrow {
        margin-top: 32px;
        color: #c3a36f;
      }
      .approach h2 {
        font-size: clamp(38px, 4.5vw, 62px);
      }
      .approach-intro > p:last-child {
        color: #aeaca6;
        line-height: 1.9;
        max-width: 430px;
        margin-top: 25px;
      }
      .steps {
        align-self: center;
      }
      .steps article {
        display: flex;
        gap: 25px;
        padding: 26px 0;
        border-bottom: 1px solid #ffffff24;
      }
      .steps article:first-child {
        border-top: 1px solid #ffffff24;
      }
      .steps article > span {
        font: 12px var(--serif);
        color: #c2a574;
        padding-top: 5px;
      }
      .steps h3 {
        font: 24px var(--serif);
        margin: 0 0 8px;
      }
      .steps p {
        font-size: 14px;
        line-height: 1.8;
        color: #b4b2ac;
        margin: 0;
        max-width: 390px;
      }
      .faq-section {
        background: #eeede9;
        padding: clamp(70px, 8vw, 110px) clamp(24px, 10vw, 160px);
        display: grid;
        grid-template-columns: 0.8fr 1.2fr;
        gap: clamp(35px, 8vw, 110px);
      }
      .faq-section .eyebrow {
        margin-top: 25px;
      }
      .faq-section h2 {
        font-size: 48px;
      }
      .faq-list details {
        border-bottom: 1px solid #d1cdc4;
        padding: 21px 0;
      }
      .faq-list details:first-child {
        border-top: 1px solid #d1cdc4;
      }
      .faq-list summary {
        list-style: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
      }
      .faq-list summary::-webkit-details-marker {
        display: none;
      }
      .faq-list summary span {
        font: 23px var(--serif);
        color: #9c8051;
      }
      .faq-list details[open] summary span {
        transform: rotate(45deg);
      }
      .faq-list details p {
        color: #77746d;
        line-height: 1.85;
        font-size: 14px;
        max-width: 620px;
        margin: 14px 25px 3px 0;
      }
      .contact-section {
        text-align: center;
        background: #191919;
        color: #fff;
        padding: clamp(80px, 10vw, 145px) 22px;
        position: relative;
        overflow: hidden;
      }
      .contact-section .section-index,
      .contact-section .eyebrow {
        position: relative;
      }
      .contact-section .eyebrow {
        margin: 25px 0 19px;
        color: #c7aa77;
      }
      .contact-section h2 {
        font-size: clamp(39px, 5vw, 67px);
        max-width: 790px;
        margin: 0 auto;
      }
      .contact-section > p:not(.eyebrow) {
        color: #c3c1bb;
        margin: 20px auto 30px;
        max-width: 540px;
        line-height: 1.8;
      }
      .contact-button {
        background: #f1eee7;
        color: #191919;
        padding: 16px 23px;
        transition:
          transform 0.22s ease,
          background 0.22s ease,
          box-shadow 0.22s ease;
      }
      .contact-button:hover:not(:disabled) {
        background: #d6c8ae;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px #0003;
      }
      .contact-button span {
        color: #96784b;
        transition: transform 0.22s ease;
      }
      .contact-button:hover:not(:disabled) span {
        transform: translate(2px, -2px);
      }
      .contact-orbit {
        position: absolute;
        font: 270px var(--serif);
        color: #ffffff05;
        left: 5%;
        top: 10%;
        transform: rotate(-12deg);
        pointer-events: none;
      }
      .contact-orbit img { display: block; width: 270px; height: 270px; object-fit: contain; opacity: .12; }
      .site-footer {
        min-height: 100px;
        padding: 20px clamp(22px, 6vw, 96px);
        display: flex;
        align-items: center;
        gap: 30px;
        background: #111;
        color: #bcbab4;
      }
      .footer-brand img {
        width: 110px;
        height: 55px;
        object-fit: contain;
        filter: grayscale(1) brightness(0) invert(1);
        opacity: 0.88;
      }
      .site-footer > span {
        font-size: 12px;
      }
      .admin-link {
        margin-inline-start: auto;
        font-size: 12px;
      }
      .site-footer small {
        font: 10px var(--serif);
        letter-spacing: 0.08em;
        color: #77756f;
      }
      .site[dir="rtl"] .about-aside {
        border-left: 0;
        border-right: 1px solid #d7d2c8;
        padding: 26px 28px 5px 0;
      }
      .site[dir="rtl"] .vertical-note {
        writing-mode: vertical-rl;
      }
      .site[dir="rtl"] .service-arrow {
        text-align: start;
      }
      .site[dir="rtl"] .faq-list details p {
        margin: 14px 0 3px 25px;
      }
      @media (max-width: 850px) {
        .site-header {
          height: 78px;
        }
        .brand-mark img {
          width: 128px;
        }
        .main-nav {
          gap: 15px;
        }
        .main-nav a {
          font-size: 12px;
        }
        .header-actions {
          gap: 8px;
        }
        .header-cta {
          padding: 12px;
          font-size: 12px;
        }
        .section-grid {
          grid-template-columns: 0.3fr 1.7fr;
          gap: 30px;
        }
        .about-aside {
          grid-column: 2;
          display: flex;
          align-items: center;
          gap: 25px;
          border: 0 !important;
          padding: 10px 0 !important;
        }
        .about-aside p {
          margin: 0;
        }
        .section-label {
          grid-row: span 2;
        }
        .vertical-note {
          display: none;
        }
        .approach {
          gap: 45px;
        }
        .service-row {
          grid-template-columns:
            42px minmax(145px, 0.9fr) minmax(150px, 1fr)
            24px;
          gap: 15px;
        }
        .service-title {
          font-size: 21px;
        }
      }
      @media (max-width: 620px) {
        .site-header {
          padding: 0 17px;
          height: 72px;
        }
        .brand-mark img {
          width: 105px;
          height: 54px;
        }
        .main-nav {
          display: none;
        }
        .header-actions {
          gap: 7px;
        }
        .header-cta {
          padding: 11px 12px;
          gap: 9px;
        }
        .trust-strip {
          padding: 18px 20px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 13px;
        }
        .trust-strip div {
          font-size: 13px;
        }
        .section-grid {
          padding: 76px 24px 68px;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        .section-label {
          grid-row: auto;
        }
        .about-copy h2 {
          font-size: 39px;
        }
        .body-copy {
          font-size: 15px;
        }
        .about-aside {
          grid-column: auto;
        }
        .seal {
          width: 80px;
          height: 80px;
          font-size: 20px;
          flex: none;
        }
        .services-section {
          padding: 70px 22px;
        }
        .section-heading {
          display: block;
          margin-bottom: 30px;
        }
        .section-heading > p {
          margin-top: 16px;
        }
        .section-heading h2 {
          font-size: 39px;
        }
        .service-row {
          grid-template-columns: 32px 1fr 22px;
          gap: 12px;
          padding: 20px 1px;
        }
        .service-title {
          font-size: 21px;
        }
        .service-description {
          grid-column: 2;
          grid-row: 2;
          font-size: 12px;
        }
        .service-arrow {
          grid-column: 3;
          grid-row: 1;
        }
        .approach {
          padding: 72px 24px;
          grid-template-columns: 1fr;
          gap: 30px;
        }
        .approach h2 {
          font-size: 43px;
        }
        .steps article {
          padding: 20px 0;
        }
        .steps h3 {
          font-size: 21px;
        }
        .faq-section {
          padding: 70px 24px;
          grid-template-columns: 1fr;
          gap: 25px;
        }
        .faq-section h2 {
          font-size: 42px;
        }
        .faq-list summary {
          font-size: 14px;
        }
        .contact-section {
          padding: 86px 23px;
        }
        .contact-section h2 {
          font-size: 44px;
        }
        .site-footer {
          padding: 20px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .footer-brand img {
          width: 85px;
        }
        .site-footer > span {
          font-size: 11px;
          flex: 1;
        }
        .site-footer small {
          width: 100%;
          text-align: center;
          border-top: 1px solid #ffffff20;
          padding-top: 13px;
        }
        .admin-link {
          margin-inline-start: 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        *,
        *:before,
        *:after {
          scroll-behavior: auto !important;
          transition: none !important;
        }
      }
    `,
    `
      .consultation-form {
        position: relative;
        z-index: 1;
        width: min(820px, 100%);
        margin: 38px auto 0;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px;
        text-align: start;
        padding: clamp(22px, 4vw, 38px);
        border: 1px solid #ffffff1c;
        border-radius: 16px;
        background: linear-gradient(145deg, #fff 0%, #f7f6f2 100%);
        box-shadow: 0 24px 70px #0003;
      }
      .consultation-form label {
        display: flex;
        flex-direction: column;
        gap: 7px;
        color: #2a302c;
        font-size: 13px;
        font-weight: 700;
      }
      .consultation-form label span{display:flex;align-items:center;gap:8px}
      .consultation-form label small{margin-inline-start:auto;color:#858980;font-size:11px;font-weight:400}
      .consultation-form input {
        width: 100%;
        min-height: 52px;
        padding: 12px 14px;
        background: #fff;
        border: 1px solid #dfe4df;
        color: #172823;
        border-radius: 8px;
        color-scheme: light;
        transition: border-color .2s ease, box-shadow .2s ease;
      }
      .consultation-form input:focus {
        outline: none;
        border-color: #aa8e5d;
        box-shadow: 0 0 0 4px #aa8e5d20;
      }
      .consultation-form input::placeholder {
        color: #939b95;
      }
      .consultation-form .contact-button {
        grid-column: 1/-1;
        justify-self: stretch;
        margin-top: 2px;
        border: 0;
        border-radius: 8px;
        min-height: 54px;
        font-weight: 700;
        cursor: pointer;
      }
      .consultation-form .contact-button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
      .request-message {
        position: relative;
        z-index: 1;
        display: inline-block;
        margin: 28px auto 0;
        padding: 15px 20px;
        border: 1px solid #b69a6b;
        color: #e7dcc8;
      }
      .request-error {
        grid-column: 1/-1;
        color: #a33e3e;
        font-size: 13px;
        text-align: start;
      }
      @media (max-width: 620px) {
        .consultation-form {
          grid-template-columns: 1fr;
          gap: 14px;
          padding: 20px;
        }
        .consultation-form .contact-button {
          grid-column: auto;
          width: 100%;
        }
      }
    `,
    `
      .site-header {
        height: 88px;
        padding-inline: clamp(22px, 6vw, 92px);
      }
      .brand-mark {
        display: flex;
        align-items: center;
        flex: none;
      }
      .brand-mark img {
        width: 158px;
        height: 66px;
      }
      .main-nav {
        gap: clamp(12px, 2.3vw, 34px);
        align-self: stretch;
      }
      .main-nav a {
        position: relative;
        display: flex;
        align-items: center;
        color: #46443f;
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        transition: color 0.2s ease;
      }
      .main-nav a:after {
        content: "";
        position: absolute;
        bottom: 22px;
        inset-inline: 0;
        height: 1px;
        background: #ad8c59;
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.22s ease;
      }
      .main-nav a:hover {
        color: #927546;
      }
      .main-nav a:hover:after {
        transform: scaleX(1);
      }
      .header-actions {
        gap: 12px;
        flex: none;
      }
      .language-switch {
        border: 1px solid #d9d5cc;
        border-radius: 50px;
        min-width: 44px;
        height: 40px;
        color: #383630;
        font-weight: 700;
        transition:
          background 0.2s ease,
          border-color 0.2s ease;
      }
      .language-switch:hover {
        background: #eeebe4;
        border-color: #b8a47f;
      }
      .header-cta {
        padding: 14px 18px;
        border-radius: 3px;
        background: #171614;
        box-shadow: 0 5px 15px #17161418;
        transition:
          transform 0.22s ease,
          box-shadow 0.22s ease,
          background 0.22s ease;
      }
      .header-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px #17161428;
      }
      .header-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 9px 22px #17161428;
        background: #342f26;
      }
      .menu-toggle {
        display: none;
        width: 42px;
        height: 42px;
        border: 1px solid #dedbd4;
        background: transparent;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 5px;
        color: #191919;
      }
      .menu-toggle span {
        width: 17px;
        height: 1.5px;
        background: currentColor;
        transition: transform 0.2s ease;
      }
      .menu-toggle:hover {
        background: #eeebe4;
      }
      @media (max-width: 900px) {
        .site-header {
          padding-inline: 24px;
        }
        .brand-mark img {
          width: 130px;
        }
        .main-nav {
          gap: 14px;
        }
        .main-nav a {
          font-size: 12px;
        }
        .header-actions {
          gap: 7px;
        }
        .header-cta {
          padding: 12px;
          font-size: 12px;
        }
      }
      @media (max-width: 620px) {
        .site-header {
          height: 72px;
          padding: 0 17px;
        }
        .brand-mark img {
          width: 112px;
          height: 56px;
        }
        .menu-toggle {
          display: flex;
          order: 3;
        }
        .main-nav {
          display: flex;
          position: absolute;
          top: calc(100% + 1px);
          inset-inline: 12px;
          z-index: 5;
          align-self: auto;
          flex-direction: column;
          align-items: stretch;
          gap: 0;
          padding: 8px 16px;
          background: #fbfaf7;
          border: 1px solid #e4e0d7;
          box-shadow: 0 16px 30px #17161420;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition:
            opacity 0.2s ease,
            transform 0.2s ease,
            visibility 0.2s ease;
        }
        .main-nav.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .main-nav a {
          min-height: 48px;
          border-bottom: 1px solid #e9e6df;
          font-size: 15px;
        }
        .main-nav a:last-child {
          border-bottom: 0;
        }
        .main-nav a:after {
          display: none;
        }
        .header-actions {
          gap: 7px;
        }
        .language-switch {
          min-width: 40px;
          height: 38px;
        }
        .header-cta {
          padding: 11px 12px;
          gap: 8px;
          font-size: 12px;
        }
        .header-cta span {
          display: none;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .main-nav,
        .main-nav a,
        .main-nav a:after,
        .header-cta,
        .language-switch,
        .menu-toggle span {
          transition: none !important;
        }
      }
    `,
    `
      .about.section-grid {
        grid-template-columns: 1fr 1fr;
        gap: 24px 7vw;
        padding: clamp(65px, 8vw, 108px) clamp(24px, 10vw, 160px);
        align-items: center;
      }
      .about .section-label {
        grid-column: 1/-1;
        display: block;
      }
      .about .about-aside {
        display: none;
      }
      .about-copy {
        grid-column: 1;
        grid-row: 2;
      }
      .about-photo {
        grid-column: 2;
        grid-row: 2;
        position: relative;
        min-height: 410px;
        margin: 0;
        overflow: hidden;
        background: #d8d1c4;
        box-shadow: 0 24px 55px #241c101f;
      }
      .about-photo:before {
        content: "";
        position: absolute;
        inset: 14px;
        border: 1px solid #ffffff80;
        z-index: 1;
        pointer-events: none;
      }
      .about-photo img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: saturate(0.78);
        transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
      }
      .about-photo:hover img {
        transform: scale(1.04);
      }
      .about-photo figcaption {
        position: absolute;
        z-index: 2;
        inset: auto 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 25px 30px;
        color: #fff;
        font-size: 13px;
        background: linear-gradient(0deg, #111d, #1110);
      }
      .about-photo figcaption a {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border: 1px solid #ffffffa8;
        border-radius: 3px;
        background: #181714d9;
        color: white;
        font-size: 12px;
        white-space: nowrap;
        transition:
          background 0.2s,
          transform 0.2s;
      }
      .about-photo figcaption a:hover {
        background: #927546;
        transform: translateY(-2px);
      }
      .about-photo figcaption a span {
        font-size: 17px;
        color: #e2c99d;
      }
      @media (max-width: 850px) {
        .about.section-grid {
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          padding: 70px 32px;
        }
        .about .section-label {
          grid-column: 1/-1;
        }
        .about-photo {
          min-height: 350px;
        }
        .about-copy h2 {
          font-size: 38px;
        }
        .about-copy .body-copy {
          font-size: 14px;
        }
      }
      @media (max-width: 620px) {
        .about.section-grid {
          grid-template-columns: 1fr;
          padding: 70px 24px 62px;
          gap: 23px;
        }
        .about-copy {
          grid-column: 1;
          grid-row: 2;
        }
        .about-photo {
          grid-column: 1;
          grid-row: 3;
          min-height: 300px;
        }
        .about-photo figcaption {
          padding: 17px;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        .about-photo figcaption a {
          width: 100%;
          justify-content: center;
        }
        .about-copy h2 {
          font-size: 36px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .about-photo img,
        .about-photo figcaption a {
          transition: none !important;
        }
      }
    `,
    `
      .about-copy h2 {
        font-weight: 700;
        font-size: clamp(43px, 5vw, 68px);
        line-height: 1.22;
        letter-spacing: -0.035em;
        color: #201e1a;
      }
      .is-ar .about-copy h2 {
        line-height: 1.4;
        letter-spacing: 0;
      }
      .about-copy .body-copy {
        max-width: 620px;
        font-size: 17px;
        line-height: 2.05;
        color: #5c5952;
      }
      .about-copy .text-link {
        margin-top: 12px;
        display: inline-flex;
        align-items: center;
        gap: 20px;
        padding: 15px 20px;
        border: 1px solid #a58a61;
        border-bottom: 1px solid #a58a61;
        border-radius: 4px;
        background: #1c1a16;
        color: #fff;
        font-size: 15px;
        font-weight: 700;
        box-shadow: 0 8px 22px #17161426;
        transition:
          transform 0.2s ease,
          background 0.2s ease,
          box-shadow 0.2s ease;
      }
      .about-copy .text-link:hover {
        transform: translateY(-3px);
        background: #342f26;
        box-shadow: 0 13px 27px #17161430;
      }
      .about-copy .text-link span {
        display: grid;
        place-items: center;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        background: #c4a875;
        color: #1c1a16;
      }
      .about-photo img {
        object-position: center;
      }
      @media (max-width: 850px) {
        .about-copy h2 {
          font-size: clamp(40px, 5vw, 52px);
        }
        .about-copy .body-copy {
          font-size: 15px;
        }
      }
      @media (max-width: 620px) {
        .about-copy h2 {
          font-size: 40px;
        }
        .about-copy .body-copy {
          font-size: 15px;
          line-height: 1.95;
        }
        .about-copy .text-link {
          width: 100%;
          justify-content: space-between;
        }
      }
    `,
    `
      .featured-services {
        display: grid;
        grid-template-columns: 1fr 1fr;
        border-top: 1px solid #c9c5bc;
      }
      .featured-service {
        min-height: 220px;
        display: grid;
        grid-template-columns: 42px 1fr 25px;
        gap: 18px;
        align-items: start;
        padding: 30px 26px 28px 5px;
        border-bottom: 1px solid #c9c5bc;
        color: inherit;
        transition:
          background 0.22s ease,
          padding 0.22s ease;
      }
      .featured-service:nth-child(odd) {
        border-inline-end: 1px solid #c9c5bc;
      }
      .featured-service:nth-child(even) {
        padding-inline-start: 30px;
      }
      .featured-service:hover {
        background: #e8e5de;
        padding-top: 25px;
      }
      .feature-number {
        font:
          12px Georgia,
          serif;
        color: #9d8052;
      }
      .feature-copy > span {
        font:
          9px Georgia,
          serif;
        letter-spacing: 0.14em;
        color: #98805b;
      }
      .feature-copy h3 {
        font: 25px/1.35 var(--serif);
        margin: 14px 0 10px;
      }
      .is-ar .feature-copy h3 {
        font:
          24px/1.5 "SFMada",
          Georgia,
          serif;
      }
      .feature-copy p {
        font-size: 13px;
        line-height: 1.8;
        color: #716e66;
        max-width: 440px;
        margin: 0;
      }
      .feature-arrow {
        color: #957747;
        font-size: 20px;
        transition: transform 0.22s ease;
      }
      .featured-service:hover .feature-arrow {
        transform: translate(3px, -3px);
      }
      .all-services-link {
        display: flex;
        width: max-content;
        margin: 30px 0 0 auto;
        align-items: center;
        gap: 24px;
        padding: 13px 16px;
        background: #1c1a16;
        color: #fff;
        border-radius: 3px;
        transition:
          transform 0.22s ease,
          background 0.22s ease;
      }
      .all-services-link:hover {
        transform: translateY(-2px);
        background: #62543d;
      }
      .all-services-link span {
        color: #d5bb90;
      }
      @media (max-width: 850px) {
        .featured-service {
          min-height: 240px;
          grid-template-columns: 32px 1fr 18px;
          gap: 12px;
          padding-inline: 4px 16px;
        }
        .featured-service:nth-child(even) {
          padding-inline-start: 18px;
        }
        .feature-copy h3 {
          font-size: 21px;
        }
      }
      @media (max-width: 620px) {
        .featured-services {
          grid-template-columns: 1fr;
        }
        .featured-service,
        .featured-service:nth-child(even) {
          min-height: 0;
          padding: 22px 4px;
          grid-template-columns: 32px 1fr 18px;
          border-inline-end: 0;
        }
        .feature-copy h3 {
          font-size: 23px;
        }
        .feature-copy p {
          font-size: 13px;
        }
        .all-services-link {
          width: 100%;
          justify-content: space-between;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .featured-service,
        .feature-arrow,
        .all-services-link {
          transition: none !important;
        }
      }
      .featured-service {
        display: block;
        position: relative;
        min-height: 0;
        padding: 0 !important;
        background: #1b1a17;
        color: #fff;
        overflow: hidden;
      }
      .featured-service:nth-child(odd) {
        border-inline-end: 0;
      }
      .featured-services {
        gap: 16px;
        border: 0;
      }
      .featured-service:hover {
        background: #24221d;
        padding: 0 !important;
      }
      .feature-image {
        display: block;
        width: 100%;
        height: clamp(180px, 20vw, 270px);
        object-fit: cover;
        filter: grayscale(0.72) brightness(0.74);
        transition:
          transform 0.65s cubic-bezier(0.2, 0.7, 0.2, 1),
          filter 0.4s ease;
      }
      .featured-service:hover .feature-image {
        transform: scale(1.045);
        filter: grayscale(0.2) brightness(0.8);
      }
      .feature-number {
        position: absolute;
        top: 16px;
        inset-inline-start: 16px;
        z-index: 1;
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border: 1px solid #fff9;
        border-radius: 50%;
        color: #fff;
        background: #17161465;
      }
      .feature-copy {
        padding: 22px 23px 27px;
      }
      .feature-copy > span {
        color: #c8aa75;
      }
      .feature-copy h3 {
        color: #fff;
        font-size: clamp(20px, 2vw, 26px);
        min-height: 2.4em;
      }
      .feature-copy p {
        color: #cbc7be;
      }
      .feature-arrow {
        position: absolute;
        inset-inline-end: 22px;
        bottom: 27px;
        color: #dbbf8c;
      }
      .featured-service:hover .feature-arrow {
        transform: translate(3px, -3px);
      }
      .all-services-link {
        margin-top: 24px;
      }
      @media (max-width: 850px) {
        .featured-service,
        .featured-service:nth-child(even) {
          min-height: 0;
          padding: 0 !important;
        }
        .feature-copy {
          padding: 18px;
        }
        .feature-copy h3 {
          font-size: 20px;
        }
        .feature-copy p {
          font-size: 12px;
        }
      }
      @media (max-width: 620px) {
        .featured-services {
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .feature-image {
          height: 205px;
        }
        .feature-copy h3 {
          min-height: 0;
        }
        .all-services-link {
          width: 100%;
          justify-content: space-between;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .feature-image {
          transition: none !important;
        }
      }
      .section-heading h2 {
        font-size: clamp(44px, 5.1vw, 70px);
        line-height: 1.18;
        max-width: 800px;
      }
      .is-ar .section-heading h2 {
        line-height: 1.42;
      }
      .feature-copy h3 {
        font-size: clamp(26px, 2.7vw, 36px);
        line-height: 1.3;
        min-height: 2.5em;
      }
      .feature-copy p {
        font-size: 14px;
        line-height: 1.9;
      }
      .feature-copy > span {
        font-size: 10px;
        letter-spacing: 0.12em;
      }
      @media (max-width: 850px) {
        .section-heading h2 {
          font-size: clamp(40px, 5.5vw, 56px);
        }
        .feature-copy h3 {
          font-size: 25px;
        }
      }
      @media (max-width: 620px) {
        .section-heading h2 {
          font-size: 43px;
        }
        .feature-copy h3 {
          font-size: 27px;
          min-height: 0;
        }
      }
      .site h2,
      .site h3 {
        font-family: var(--serif);
        font-size: 44px;
        font-weight: 700;
        line-height: 1.3;
        letter-spacing: 0;
      }
      .site.is-ar h2,
      .site.is-ar h3 {
        font-family: "SFMada", Georgia, serif;
        line-height: 1.45;
      }
      .site p:not(.eyebrow) {
        font-size: 16px;
        font-weight: 400;
        line-height: 1.9;
      }
      .site .feature-copy h3 {
        font-size: 44px;
        min-height: 0;
      }
      .site .faq-list summary {
        font-size: 16px;
        font-weight: 400;
      }
      @media (max-width: 850px) {
        .site h2,
        .site h3,
        .site .feature-copy h3 {
          font-size: 38px;
        }
      }
      @media (max-width: 620px) {
        .site h2,
        .site h3,
        .site .feature-copy h3 {
          font-size: 34px;
        }
        .site p:not(.eyebrow) {
          font-size: 16px;
        }
      }
      .feature-image-wrap {
        position: relative;
        overflow: hidden;
      }
      .feature-image-overlay {
        position: absolute;
        inset: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 12px;
        padding: 26px 24px;
        color: #fff;
        background: linear-gradient(
          0deg,
          #171614f2 0%,
          #171614c9 45%,
          #17161410 100%
        );
        transform: translateY(100%);
        transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
      }
      .featured-service:hover .feature-image-overlay,
      .featured-service:focus-visible .feature-image-overlay {
        transform: translateY(0);
      }
      .feature-image-overlay strong {
        font: 700 25px/1.35 var(--serif);
      }
      .site.is-ar .feature-image-overlay strong {
        font-family: "SFMada", Georgia, serif;
      }
      .feature-image-overlay > span {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        width: max-content;
        padding-bottom: 5px;
        border-bottom: 1px solid #d4bb8b;
        color: #e5d1aa;
        font-size: 14px;
      }
      .feature-image-overlay i {
        font-style: normal;
      }
      .featured-service:focus-visible {
        outline: 3px solid #c8a76f;
        outline-offset: 3px;
      }
      @media (hover: none) {
        .feature-image-overlay {
          transform: translateY(0);
          padding: 15px 17px;
          background: linear-gradient(
            0deg,
            #171614e8 0%,
            #171614a0 48%,
            transparent 100%
          );
        }
        .feature-image-overlay strong {
          font-size: 20px;
        }
        .feature-image-overlay > span {
          font-size: 13px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .feature-image-overlay {
          transition: none;
        }
      }
      .whatsapp-float {
        position: fixed;
        z-index: 1000;
        inset-inline-end: 22px;
        bottom: calc(22px + env(safe-area-inset-bottom, 0px));
        width: 50px;
        height: 50px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #25d366;
        color: #fff;
        transition:
          transform 0.22s ease,
          background 0.22s ease;
      }
      .whatsapp-float svg {
        width: 28px;
        height: 28px;
      }
      .whatsapp-float:hover {
        transform: translateY(-2px);
        background: #20bd5b;
      }
      .whatsapp-float:focus-visible {
        outline: 3px solid #171614;
        outline-offset: 4px;
      }
      @media (max-width: 620px) {
        .whatsapp-float {
          width: 46px;
          height: 46px;
          inset-inline-end: 16px;
          bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        }
        .whatsapp-float svg {
          width: 25px;
          height: 25px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .whatsapp-float {
          transition: none;
        }
      }
    `,
  ],
})
export class PublicPageComponent implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private revealObserver?: IntersectionObserver;
  readonly i18n = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly consultations = inject(ConsultationService);
  readonly today = this.localDate();
  readonly consultationForm = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.maxLength(120)]],
    phone: ["", [Validators.required, Validators.maxLength(40)]],
    preferredDate: [""],
    preferredTime: [""],
  });
  submitting = false;
  requestSent = false;
  requestError = false;
  ngAfterViewInit(): void {
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const sections = (
      this.host.nativeElement as HTMLElement
    ).querySelectorAll<HTMLElement>(
      ".trust-strip, .section-grid, .services-section, .approach, .latest-articles, .faq-section, .contact-section",
    );
    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(28px)";
      section.style.transition =
        "opacity 700ms ease, transform 700ms cubic-bezier(.2,.7,.2,1)";
    });
    this.revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target as HTMLElement;
          section.style.opacity = "1";
          section.style.transform = "translateY(0)";
          this.revealObserver?.unobserve(section);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
    );
    sections.forEach((section) => this.revealObserver?.observe(section));
  }
  get ar(): boolean {
    return this.i18n.locale() === "ar";
  }
  private localDate(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }
  submitConsultation(): void {
    if (this.consultationForm.invalid || this.submitting) return;
    this.submitting = true;
    this.requestError = false;
    this.consultations.create(this.consultationForm.getRawValue()).subscribe({
      next: () => {
        this.requestSent = true;
        this.submitting = false;
        this.consultationForm.reset();
      },
      error: () => {
        this.requestError = true;
        this.submitting = false;
      },
    });
  }
  readonly services = SERVICE_OFFERINGS;
  readonly mockArticles = [
    {
      id: "contract-review",
      date: "2026-09-12",
      categoryAr: "العقود التجارية",
      categoryEn: "COMMERCIAL CONTRACTS",
      titleAr: "كيف تساعد مراجعة العقود على حماية مصالح شركتك؟",
      titleEn: "How can contract review protect your business interests?",
      excerptAr:
        "تعرّف على البنود الأساسية التي تستحق مراجعة دقيقة قبل توقيع أي اتفاق تجاري.",
      excerptEn:
        "A look at the clauses worth reviewing carefully before signing a commercial agreement.",
      bodyAr:
        "مراجعة العقد تساعد على تحديد الالتزامات، وآلية الدفع، وشروط الإنهاء، والمسؤولية عند الإخلال. اطلب توضيح البنود التي قد تؤثر في سير العمل قبل التوقيع.",
      bodyEn:
        "A careful review can clarify obligations, payment terms, termination conditions and liability. Make sure clauses that could affect day-to-day operations are understood before signing.",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: "company-formation",
      date: "2026-08-28",
      categoryAr: "تأسيس الشركات",
      categoryEn: "COMPANY FORMATION",
      titleAr: "اختيار الكيان القانوني المناسب لمشروعك",
      titleEn: "Choosing the right legal structure for your business",
      excerptAr:
        "فهم الفروقات بين الكيانات القانونية يساعدك على تأسيس أعمالك على أساس أوضح.",
      excerptEn:
        "Understanding the differences between legal entities helps you build on a clearer foundation.",
      bodyAr:
        "يعتمد اختيار الشكل القانوني على طبيعة النشاط، وعدد الشركاء، وخطط النمو والتمويل. تساعد مراجعة هذه العوامل مبكراً على تأسيس الكيان بما يلائم احتياجات المشروع.",
      bodyEn:
        "The right structure depends on your activity, partners, growth plans and funding needs. Reviewing these factors early can help you establish an entity that fits the business.",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: "intellectual-property",
      date: "2026-08-05",
      categoryAr: "الملكية الفكرية",
      categoryEn: "INTELLECTUAL PROPERTY",
      titleAr: "خطوات أولية لحماية علامتك التجارية",
      titleEn: "First steps to protecting your brand",
      excerptAr:
        "نظرة مبسطة على تسجيل العلامة التجارية ومتابعة استخدامها ضمن السوق.",
      excerptEn:
        "A practical introduction to registering your trademark and protecting its use in the market.",
      bodyAr:
        "ابدأ بتحديد الأصول التي تميز نشاطك، مثل الاسم والشعار والابتكارات. ثم تحقق من متطلبات التسجيل والمتابعة المناسبة لحماية هذه الحقوق في الأسواق ذات الصلة.",
      bodyEn:
        "Start by identifying the assets that distinguish your business, such as its name, logo and innovations. Then consider the relevant registration and monitoring steps for the markets where you operate.",
      image:
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1000&q=85",
    },
  ];
  selectedArticle: (typeof this.mockArticles)[number] | null = null;
}
