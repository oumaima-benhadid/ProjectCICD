import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRdvComponent } from './admin-rdv.component';

describe('AdminRdvComponent', () => {
  let component: AdminRdvComponent;
  let fixture: ComponentFixture<AdminRdvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRdvComponent]
    });
    fixture = TestBed.createComponent(AdminRdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
