import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDossiersComponent } from './admin-dossiers.component';

describe('AdminDossiersComponent', () => {
  let component: AdminDossiersComponent;
  let fixture: ComponentFixture<AdminDossiersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDossiersComponent]
    });
    fixture = TestBed.createComponent(AdminDossiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
