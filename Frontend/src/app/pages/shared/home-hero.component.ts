import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';



@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero" [attr.dir]="ar ? 'rtl' : 'ltr'" aria-labelledby="home-title">
      <div class="hero-content">
        <p class="hero-kicker"><span></span>{{ ar ? content.kickerAr : content.kickerEn }}</p>
        <h1 id="home-title">{{ ar ? content.titleAr : content.titleEn }}<em>{{ ar ? content.accentAr : content.accentEn }}</em></h1>
        <p class="hero-description">{{ ar ? content.descriptionAr : content.descriptionEn }}</p>
        <div class="hero-actions"><a class="hero-primary" [routerLink]="['/', i18n.locale(), 'consultation']"><span class="button-copy">{{ ar ? content.primaryAr : content.primaryEn }}</span><span class="button-icon" aria-hidden="true">↗</span></a><a class="hero-secondary" href="#services">{{ ar ? content.secondaryAr : content.secondaryEn }}<span aria-hidden="true">↓</span></a></div>
        <div class="hero-caption"><span>{{ ar ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia' }}</span><i aria-hidden="true"></i><a href="tel:+966570907930" [attr.aria-label]="ar ? 'اتصل بنا على +966 57 090 7930' : 'Call us at +966 57 090 7930'">+966 57 090 7930</a></div>
      </div>
      <div class="hero-art" role="img" [attr.aria-label]="ar ? 'ميزان العدالة والمستندات القانونية ومطرقة القاضي في مكتب محاماة' : 'Scales of justice, legal documents and a gavel in a law office'">
        <div class="art-image"></div>
        <video class="art-video" autoplay muted loop playsinline preload="metadata" poster="assets/brand/legal-office-hero-poster.jpg" aria-hidden="true" tabindex="-1">
          <source src="assets/brand/legal-office-hero.mp4" type="video/mp4" />
        </video>
        <div class="art-shade"></div><div class="art-frame"></div>
        <div class="art-brand"><img src="assets/brand/al-saiari-logo-transparent.png" alt="" /><span> ALSAIARI LAW</span></div>
        <div class="art-seal" aria-hidden="true"><img src="assets/consultation-logo-watermark.png" alt="" /><span>LEGAL<br>COUNSEL</span></div>
        <div class="art-note">COUNSEL · CLARITY · TRUST</div>
      </div>
    </section>
  `,
  styles: [`
    :host{display:block}.hero{min-height:clamp(660px,calc(100svh - 94px),900px);display:grid;grid-template-columns:1fr;position:relative;background:#171614;color:#fff;overflow:hidden;isolation:isolate}.hero-content{z-index:1;align-self:center;width:min(860px,72%);padding:70px 4vw 100px clamp(25px,10vw,160px);animation:hero-enter .8s both}.hero-kicker{display:flex;align-items:center;gap:15px;color:#e2c99d;font:13px 'Times New Roman',Georgia,serif;letter-spacing:.19em;margin:0 0 34px}.hero-kicker span{display:block;width:43px;height:1px;background:#c9aa75}.hero h1{font:400 clamp(72px,8.5vw,122px)/1 'Times New Roman',Georgia,serif;letter-spacing:-.045em;margin:0;max-width:900px;animation:hero-enter .9s .08s both}.hero h1 em{display:block;font-style:normal;color:#d1b17c}.hero-description{max-width:620px;color:#e1ded7;font-size:20px;line-height:1.85;margin:34px 0 38px;animation:hero-enter .9s .16s both}.hero-actions{display:flex;align-items:center;gap:32px;animation:hero-enter .9s .24s both}.hero-primary{display:flex;align-items:center;justify-content:space-between;gap:36px;background:#f5f1e9;color:#171614;padding:21px 24px;min-width:270px;font-size:17px;border-radius:3px;box-shadow:0 10px 35px #0003;transition:transform .22s ease,background .22s ease,box-shadow .22s ease}.hero-primary:hover{background:#d7c29a;transform:translateY(-3px);box-shadow:0 16px 42px #0005}.hero-primary:focus-visible,.hero-secondary:focus-visible{outline:3px solid #dfbe83;outline-offset:5px}.hero-primary span{display:grid;place-items:center;width:31px;height:31px;border-radius:50%;background:#e5ddcd;color:#795f36;font-size:19px;transition:transform .2s ease,background .2s ease}.hero-primary:hover span{transform:translate(2px,-2px);background:#fff8e9}.hero-secondary{display:flex;align-items:center;gap:14px;font-size:16px;color:#fff;transition:color .2s ease,gap .2s ease}.hero-secondary:hover{color:#e2c99d;gap:19px}.hero-secondary span{display:grid;place-items:center;width:31px;height:31px;border:1px solid #ffffff70;border-radius:50%;color:#dfbe83;font-size:18px;transition:border-color .2s ease,background .2s ease}.hero-secondary:hover span{border-color:#dfbe83;background:#ffffff12}.hero-caption{display:flex;align-items:center;flex-wrap:wrap;gap:11px;margin-top:30px;color:#ddd9d0;font:11px 'Times New Roman',Georgia,serif;letter-spacing:.08em;animation:hero-enter .9s .32s both}.hero-caption i{height:15px;width:1px;background:#d4c7ae99}.hero-caption a{direction:ltr;unicode-bidi:isolate;color:inherit;text-decoration:none;white-space:nowrap;transition:color .2s ease}.hero-caption a:hover{color:#e2c99d}.hero-art{position:absolute;inset:0;z-index:-1;background:#252421;overflow:hidden}.art-image{position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=2200&q=90');background-size:cover;background-position:center 48%;filter:grayscale(1) contrast(1.08);transform:scale(1.06);animation:art-settle 1.8s cubic-bezier(.2,.7,.2,1) both}.art-shade{position:absolute;inset:0;background:linear-gradient(90deg,#11110ff2 0%,#11110fcf 38%,#11110f72 65%,#11110f25 100%)}.art-frame{position:absolute;inset:28px;border:1px solid #ded4bf55;pointer-events:none}.art-brand{position:absolute;top:56px;right:5vw;display:flex;align-items:center;gap:12px;opacity:0;animation:hero-enter .8s .45s both}.art-brand img{width:158px;height:54px;object-fit:contain;filter:brightness(0) invert(1)}.art-brand span{color:#fff;font:10px 'Times New Roman',serif;letter-spacing:.15em}.art-seal{position:absolute;width:190px;height:190px;border:1px solid #e4d5b05c;border-radius:50%;right:12%;top:35%;display:flex;align-items:center;justify-content:center;gap:10px;color:#f7f3e9;animation:seal-arrive 1s .55s both}.art-seal:before,.art-seal:after{content:'';position:absolute;inset:10px;border:1px solid #e4d5b044;border-radius:50%}.art-seal:after{inset:-10px}.art-seal img{width:76px;height:76px;object-fit:contain}.art-seal span{font:10px/1.5 'Times New Roman',serif;letter-spacing:.13em}.art-index{position:absolute;bottom:72px;right:5vw;display:flex;align-items:center;gap:10px;color:white;font:11px 'Times New Roman',serif;letter-spacing:.1em}.art-index i{width:85px;height:1px;background:#ffffff80}.art-note{position:absolute;bottom:42px;right:5vw;color:#ffffffc7;font:9px 'Times New Roman',serif;letter-spacing:.19em}.hero[dir=rtl] .hero-content{text-align:right;padding-left:4vw;padding-right:clamp(25px,10vw,160px);margin-left:auto}.hero[dir=rtl] .hero-kicker,.hero[dir=rtl] .hero-caption{justify-content:flex-start}.hero[dir=rtl] .art-shade{background:linear-gradient(270deg,#11110ff2 0%,#11110fcf 38%,#11110f72 65%,#11110f25 100%)}.hero[dir=rtl] h1{font-family:'SFMada',Georgia,serif;font-size:clamp(64px,7.4vw,104px);line-height:1.22;letter-spacing:0}.hero[dir=rtl] .hero-description{font-family:'SFMada',Georgia,serif}.hero[dir=rtl] .art-brand{right:auto;left:5vw}.hero[dir=rtl] .art-index{right:auto;left:5vw}.hero[dir=rtl] .art-note{right:auto;left:5vw}.hero[dir=rtl] .art-seal{right:auto;left:12%}
    @media(max-width:800px){.hero{min-height:clamp(660px,calc(100svh - 78px),850px)}.hero-content{width:82%;padding-left:6vw;padding-right:3vw}.hero h1{font-size:clamp(66px,9vw,94px)}.hero[dir=rtl] h1{font-size:clamp(58px,8vw,84px)}.hero-description{font-size:18px}.hero-art{min-height:100%}.art-seal{width:145px;height:145px;right:8%;top:31%}.hero[dir=rtl] .art-seal{left:8%}.hero-caption{margin-top:26px;flex-wrap:wrap}}
    @media(max-width:600px){.hero{min-height:clamp(690px,calc(100svh - 72px),860px)}.hero-content{width:100%;padding:68px 25px 100px}.hero-kicker{font-size:11px;margin-bottom:25px}.hero h1{font-size:clamp(60px,14vw,84px);max-width:500px}.hero[dir=rtl] h1{font-size:clamp(55px,12vw,72px)}.hero-description{font-size:17px;line-height:1.8;margin:25px 0 30px;max-width:520px}.hero-primary{min-width:220px;padding:18px;gap:15px;font-size:15px}.hero-actions{gap:20px;flex-wrap:wrap}.hero-secondary{font-size:14px}.hero-caption{margin-top:22px;font-size:10px;gap:8px;letter-spacing:.04em}.hero-art{min-height:100%;margin:0}.art-frame{inset:14px}.art-brand{top:38px;right:28px}.art-seal{width:105px;height:105px;right:10%;top:23%}.art-seal b{font-size:29px}.art-seal span{font-size:7px}.art-index{bottom:68px;right:28px}.art-index i{width:52px}.art-note{bottom:43px;right:28px;font-size:7px}.hero[dir=rtl] .hero-content{text-align:right;padding-left:25px;padding-right:25px}.hero[dir=rtl] .art-brand{left:28px}.hero[dir=rtl] .art-index{left:28px}.hero[dir=rtl] .art-seal{left:10%}.hero[dir=rtl] .art-note{left:28px}}
    @keyframes hero-enter{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}@keyframes art-settle{from{opacity:.55;transform:scale(1.13)}to{opacity:1;transform:scale(1.06)}}@keyframes seal-arrive{from{opacity:0;transform:scale(.88) rotate(-8deg)}to{opacity:1;transform:scale(1) rotate(0)}}@media(prefers-reduced-motion:reduce){.hero-content,.hero h1,.hero-description,.hero-actions,.hero-caption,.art-image,.art-brand,.art-seal{animation:none!important}.hero-primary,.hero-secondary{transition:none!important}}
  `, `
    .hero-primary{gap:24px;background:#f5f1e9;padding:13px 16px 13px 20px;min-width:0;border:1px solid #fff9;border-radius:5px;box-shadow:0 8px 22px #0003;transition:transform .22s ease,background .22s ease,box-shadow .22s ease}.hero-primary:hover{background:#ead8b6;transform:translateY(-2px);box-shadow:0 12px 28px #0004}.button-copy{display:flex!important;align-items:center!important;width:auto!important;height:auto!important;background:none!important;color:inherit!important;font-size:15px!important}.button-icon{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#e5ddcd;color:#795f36;font-size:17px;transition:transform .22s ease,background .22s ease}.hero-primary:hover .button-icon{transform:translate(2px,-2px);background:#fff8e9}.hero-secondary span{width:36px;height:36px;transition:transform .22s ease,border-color .22s ease,background .22s ease}.hero-secondary:hover span{transform:translateY(2px)}
    @media(max-width:600px){.hero-primary{min-width:0;padding:12px 14px 12px 17px}.hero-actions{gap:18px}}
  `, `
    .hero-art .art-image{z-index:0}
    .hero-art .art-image{background-image:url('/assets/brand/legal-office-hero-poster.jpg')}
    .hero-art .art-video{position:absolute;z-index:1;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;filter:grayscale(1) contrast(1.08) brightness(.68);transform:scale(1.06);animation:art-drift 24s ease-in-out infinite alternate}
    .hero-art .art-shade{z-index:2}
    .hero-art .art-frame{z-index:4}
    .hero-art .art-brand,.hero-art .art-seal,.hero-art .art-note,.hero-art .art-index{z-index:3}
    @keyframes art-drift{from{transform:scale(1.04)}to{transform:scale(1.13)}}
    @media(prefers-reduced-motion:reduce){.hero-art .art-video{display:none;animation:none}.hero-art .art-image{animation:none;transform:scale(1.06)}}
  `],
})
export class HomeHeroComponent {
  readonly i18n = inject(LanguageService);
  get ar(): boolean { return this.i18n.locale() === 'ar'; }
  readonly content = {
    kickerAr: 'مكتب المحاماة والاستشارات القانونية', kickerEn: 'ALSAIARI · LAW & LEGAL CONSULTANCY',
    titleAr: 'رؤية قانونية', accentAr: 'تمنحك وضوحاً.',
    titleEn: 'Clear thinking.', accentEn: 'Confident steps.',
    descriptionAr: 'نساعدك على فهم موقفك القانوني ورؤية خياراتك بوضوح، عبر مشورة مهنية تراعي تفاصيلك وأهدافك.',
    descriptionEn: 'We help you understand your legal position and see your options clearly, with considered advice shaped around your details and goals.',
    primaryAr: 'ناقش مسألتك معنا', primaryEn: 'Discuss your matter',
    secondaryAr: 'استكشف خدماتنا', secondaryEn: 'Explore our services',
  };
}
