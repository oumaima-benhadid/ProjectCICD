import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReclamationsComponent } from './admin-reclamations.component';

describe('AdminReclamationsComponent', () => {
  let component: AdminReclamationsComponent;
  let fixture: ComponentFixture<AdminReclamationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminReclamationsComponent]
    });
    fixture = TestBed.createComponent(AdminReclamationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
