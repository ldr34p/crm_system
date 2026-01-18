import { Component } from '@angular/core';
import {
AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompaniesService } from '../services/companies-service';

@Component({
  selector: 'app-company-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './company-form.html',
  styleUrl: './company-form.css',
})

export class CompanyFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, public companiesService: CompaniesService) {
    this.form = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      companyCode: ['', [this.optionalPattern(/^\d+$/)]], 
      vatCode: ['', [this.optionalPattern(/^(LT)?\d+$/)]],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [this.optionalPhoneLt()]],
      contacts: this.fb.array([this.createContactGroup()])
    });
  }

  get contacts(): FormArray<FormGroup> {
    return this.form.get('contacts') as FormArray<FormGroup>;
  }

  addContact(): void {
    this.contacts.push(this.createContactGroup());
  }

  removeContact(index: number): void {
    if (this.contacts.length > 1) this.contacts.removeAt(index);
  }

  private createContactGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      position: [''],
      phone: ['', [this.optionalPhoneLt()]],
    });
  }

  private optionalPattern(regex: RegExp) {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value ?? '').toString().trim();
      if (!v) return null; // optional
      return regex.test(v) ? null : { pattern: true };
    };
  }

  private optionalPhoneLt() {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value ?? '').toString().trim();
      if (!v) return null;

      const onlyPlusDigits = /^\+\d+$/.test(v);
      const startsWithLt = v.startsWith('+370');
      const lenOk = v.length >= 10 && v.length <= 12;

      return onlyPlusDigits && startsWithLt && lenOk
        ? null
        : { phoneLt: true };
    };
  }

  onRegister(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.value,
      createdAt: Date.now(),
    };

    console.log('REGISTER PAYLOAD:', this.form.value);
    this.companiesService.addCompany(payload);
  }

  isInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
