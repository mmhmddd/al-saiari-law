import { Component, inject } from '@angular/core'; import { RouterLink } from '@angular/router';
import { LanguageService } from '../core/services/language.service';
@Component({standalone:true,imports:[RouterLink],template:`<main class="public-placeholder" [attr.dir]="i18n.direction()"><img src="assets/brand/al-saiari-logo.png" [alt]="i18n.t('brand.name')"><p>{{i18n.t('brand.name')}}</p><h1>{{i18n.t('public.comingSoon')}}</h1><a [routerLink]="'/' + i18n.locale() + '/login'">{{i18n.t('public.adminLogin')}}</a></main>`}) export class PublicPageComponent {readonly i18n=inject(LanguageService);}
