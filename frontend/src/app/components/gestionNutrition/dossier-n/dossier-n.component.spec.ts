import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierNComponent } from './dossier-n.component';

describe('DossierNComponent', () => {
  let component: DossierNComponent;
  let fixture: ComponentFixture<DossierNComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DossierNComponent]
    });
    fixture = TestBed.createComponent(DossierNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
