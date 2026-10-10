import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    @if (showIntro) {
      <div class="site-intro" [class.site-intro--leaving]="introLeaving" role="status" aria-label="Al Saiari Law Firm">
        <div class="intro-frame" aria-hidden="true"></div>
        <div class="intro-content">
          <span class="intro-orbit intro-orbit--outer" aria-hidden="true"></span>
          <span class="intro-orbit intro-orbit--inner" aria-hidden="true"></span>
          <img class="intro-logo" src="assets/brand/al-saiari-logo-transparent.png" alt="Al Saiari Law Firm" />
          <span class="intro-rule" aria-hidden="true"></span>
          <p>LEGAL COUNSEL <i>·</i> CLARITY <i>·</i> TRUST</p>
        </div>
      </div>
    }
    <router-outlet />
  `,
  styles: [`
    :host{display:block}
    .site-intro{position:fixed;z-index:99999;inset:0;display:grid;place-items:center;overflow:hidden;background:radial-gradient(ellipse at 50% 43%,#292722 0%,#171716 48%,#0b0b0b 100%);opacity:1;transition:opacity .58s cubic-bezier(.65,0,.35,1)}
    .site-intro:before{position:absolute;inset:0;content:'';background:radial-gradient(ellipse at center,#ffffff0c,transparent 58%);pointer-events:none}
    .site-intro--leaving{opacity:0;pointer-events:none}
    .intro-frame{position:absolute;inset:clamp(14px,2.4vw,32px);border:1px solid #c6a66b35;opacity:0;animation:frame-appear .8s .15s ease-out forwards}
    .intro-frame:before,.intro-frame:after{position:absolute;width:36px;height:36px;content:'';border-color:#c6a66b95;border-style:solid}
    .intro-frame:before{inset:12px auto auto 12px;border-width:1px 0 0 1px}
    .intro-frame:after{inset:auto 12px 12px auto;border-width:0 1px 1px 0}
    .intro-content{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;width:min(620px,88vw);min-height:360px;padding:50px 24px}
    .intro-logo{position:relative;z-index:1;display:block;width:min(440px,76vw);max-height:190px;object-fit:contain;filter:brightness(0) invert(1);opacity:0;transform:translateY(14px) scale(.97);animation:logo-appear .9s .2s cubic-bezier(.2,.7,.2,1) forwards}
    .intro-orbit{position:absolute;left:50%;top:50%;display:block;border:1px solid #c6a66b20;border-radius:50%;transform:translate(-50%,-50%) scale(.94);opacity:0;animation:orbit-appear 1.1s ease-out forwards}
    .intro-orbit--outer{width:min(590px,86vw);aspect-ratio:1.9/1;animation-delay:.05s}
    .intro-orbit--inner{width:min(520px,78vw);aspect-ratio:1.9/1;border-color:#c6a66b30;animation-delay:.18s}
    .intro-rule{width:0;height:1px;margin-top:23px;background:linear-gradient(90deg,transparent,#c6a66b,transparent);animation:rule-appear .7s .55s ease-out forwards}
    .intro-content p{margin:14px 0 0;color:#f4f1eb;font:10px Georgia,'Times New Roman',serif;letter-spacing:.24em;opacity:0;animation:caption-appear .6s .68s ease-out forwards}
    .intro-content p i{padding:0 7px;color:#c6a66b;font-style:normal}
    @keyframes logo-appear{to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes orbit-appear{to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
    @keyframes rule-appear{to{width:min(180px,42vw)}}
    @keyframes caption-appear{to{opacity:.86}}
    @keyframes frame-appear{to{opacity:1}}
    @media(max-width:600px){.intro-content{min-height:280px}.intro-logo{width:min(360px,80vw)}.intro-content p{font-size:8px;letter-spacing:.18em}.intro-orbit--outer{width:86vw}.intro-orbit--inner{width:76vw}}
    @media(prefers-reduced-motion:reduce){.site-intro,.intro-frame,.intro-logo,.intro-orbit,.intro-rule,.intro-content p{animation:none!important;transition:none!important;opacity:1;transform:none}.intro-rule{width:min(180px,42vw)}}
  `],
})
export class AppComponent implements OnDestroy {
  showIntro = false;
  introLeaving = false;
  private leaveTimer?: ReturnType<typeof setTimeout>;
  private removeTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    if (typeof window === 'undefined') return;

    this.showIntro = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const visibleDuration = reducedMotion ? 700 : 2050;
    const exitDuration = reducedMotion ? 0 : 580;
    this.leaveTimer = setTimeout(() => this.introLeaving = true, visibleDuration);
    this.removeTimer = setTimeout(() => this.showIntro = false, visibleDuration + exitDuration);
  }

  ngOnDestroy(): void {
    if (this.leaveTimer) clearTimeout(this.leaveTimer);
    if (this.removeTimer) clearTimeout(this.removeTimer);
  }
}
