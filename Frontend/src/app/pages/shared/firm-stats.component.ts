import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-firm-stats',
  standalone: true,
  template: `
    <section #statsBar class="firm-stats" [attr.dir]="i18n.direction()" [attr.aria-label]="ar ? 'نبذة عن الشركة بالأرقام' : 'The firm at a glance'">
      <div class="stats-grid">
        @for (stat of stats; track stat.id) {
          <article class="stat-card">
            <strong>{{ stat.prefix }}{{ counters[stat.id] }}{{ stat.suffix }}</strong>
            <span>{{ ar ? stat.labelAr : stat.labelEn }}</span>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    :host{display:block;padding:clamp(42px,6vw,76px) clamp(20px,7.7vw,116px);background:#fff}
    .firm-stats{max-width:1440px;margin:0 auto;padding:clamp(26px,3.4vw,50px);overflow:hidden;border:1px solid #c6a66b55;border-radius:16px;background:linear-gradient(145deg,#242321 0%,#171716 58%,#0d0d0d 100%);box-shadow:0 18px 45px #17161418}
    .stats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(10px,1.5vw,20px)}
    .stat-card{min-width:0;min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:22px 14px;border:1px solid #c6a66b30;border-radius:13px;background:linear-gradient(155deg,#ffffff12,#ffffff08);text-align:center;color:#fff}
    .stat-card strong{color:#d8bd8e;font:700 clamp(48px,6vw,76px)/1 Georgia,'Times New Roman',serif;letter-spacing:-.045em}
    .stat-card span{color:#f5f3ee;font-size:clamp(14px,1.35vw,18px);font-weight:700;line-height:1.5}
    :host-context(.is-ar) .stat-card span{font-family:'SFMada',Georgia,serif}
    @media(max-width:760px){:host{padding:38px 22px}.firm-stats{padding:20px}.stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.stat-card{min-height:150px}.stat-card strong{font-size:clamp(46px,11vw,64px)}}
    @media(max-width:420px){:host{padding:30px 16px}.firm-stats{padding:14px;border-radius:12px}.stats-grid{gap:9px}.stat-card{min-height:132px;padding:15px 8px}.stat-card span{font-size:13px}}
  `],
})
export class FirmStatsComponent implements AfterViewInit, OnDestroy {
  readonly i18n = inject(LanguageService);
  private readonly ngZone = inject(NgZone);
  @ViewChild('statsBar') private statsBar?: ElementRef<HTMLElement>;
  private observer?: IntersectionObserver;
  private animationFrame = 0;
  readonly counters: Record<string, number> = { clients: 0, services: 0, experience: 0, principles: 0 };
  readonly stats = [
    { id: 'clients', value: 200, prefix: '', suffix: '+', labelEn: 'Satisfied clients', labelAr: 'عميل راضي' },
    { id: 'services', value: 7, prefix: '+', suffix: '', labelEn: 'Legal services', labelAr: 'خدمة قانونية' },
    { id: 'experience', value: 20, prefix: '+', suffix: '', labelEn: 'Years of experience', labelAr: 'سنوات خبرة' },
    { id: 'principles', value: 6, prefix: '+', suffix: '', labelEn: 'Professional principles', labelAr: 'قيم مهنية' },
  ];

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.setFinalValues();
      return;
    }

    this.observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      this.observer?.disconnect();
      this.ngZone.run(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.setFinalValues();
        else this.animateCounters();
      });
    }, { threshold: 0.25 });
    if (this.statsBar) this.observer.observe(this.statsBar.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    cancelAnimationFrame(this.animationFrame);
  }

  private setFinalValues(): void {
    for (const stat of this.stats) this.counters[stat.id] = stat.value;
  }

  private animateCounters(): void {
    const duration = 1400;
    let startTime = 0;
    const tick = (time: number): void => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      for (const stat of this.stats) this.counters[stat.id] = Math.round(stat.value * eased);
      if (progress < 1) this.animationFrame = requestAnimationFrame(tick);
    };
    this.animationFrame = requestAnimationFrame(tick);
  }

  get ar(): boolean { return this.i18n.locale() === 'ar'; }
}
