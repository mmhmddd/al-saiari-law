import { Component } from '@angular/core'; import { AdminResourcePageComponent } from '../../shared/admin-resource-page.component';
@Component({standalone:true,imports:[AdminResourcePageComponent],template:`<app-admin-resource-page section="articles" [createMode]="true" />`}) export class ArticleCreatePageComponent {}
