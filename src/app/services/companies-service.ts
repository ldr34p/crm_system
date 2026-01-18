import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Contact {
  firstName: string;
  lastName: string;
  position?: string;
  phone?: string;
}

export interface Company {
  id?: string;
  companyName: string;
  companyCode?: string;
  vatCode?: string;
  address?: string;
  email: string;
  phone?: string;
  contacts: Contact[];
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private apiURL = 'https://crm-system-51df8-default-rtdb.europe-west1.firebasedatabase.app';

  public companies: Company[] = [];

  public loading = false;
  public error: string | null = null;
  public success: string | null = null;

  public onCompaniesListChange = new EventEmitter<void>();

  constructor(private http: HttpClient) {
    this.loadData();
  }

  public loadData(): void {
    this.loading = true;
    this.error = null;

    this.http.get<{ [key: string]: Company }>(this.apiURL + '/companies.json').subscribe({
      next: (data) => {
        this.companies = [];
        if (data) {
          for (const id in data) {
            this.companies.push({ id, ...data[id] });
          }
        }
        this.loading = false;
        this.onCompaniesListChange.emit();
      },
      error: (err) => {
        this.loading = false;
        this.error = `Load failed: ${err?.message ?? err}`;
        this.onCompaniesListChange.emit();
      },
    });
  }

  public addCompany(company: Omit<Company, 'id'>): void {
    this.loading = true;
    this.error = null;
    this.success = null;

    this.http.post(this.apiURL + '/companies.json', company).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Company saved successfully.';
        this.loadData();
      },
      error: (err) => {
        this.loading = false;
        this.error = `Save failed: ${err?.message ?? err}`;
        this.onCompaniesListChange.emit();
      },
    });
  }

  public loadCompany(id: string) {
    return this.http.get<Company>(this.apiURL + '/companies/' + id + '.json');
  }

  public updateCompany(id: string, patch: Partial<Company>) {
    return this.http.patch(this.apiURL + '/companies/' + id + '.json', patch);
  }

  public deleteCompanyById(id: string): void {
    this.loading = true;
    this.error = null;

    this.http.delete(this.apiURL + '/companies/' + id + '.json').subscribe({
      next: () => {
        this.loading = false;
        this.loadData();
      },
      error: (err) => {
        this.loading = false;
        this.error = `Delete failed: ${err?.message ?? err}`;
        this.onCompaniesListChange.emit();
      },
    });
  }
}
