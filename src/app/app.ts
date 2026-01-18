import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CompanyFormComponent } from './company-form/company-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CompanyFormComponent],
  template: '<app-company-form></app-company-form>',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('crm_system');
}
