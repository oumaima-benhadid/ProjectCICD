import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenouvellementAbonnementComponent } from './renouvellement-abonnement.component';

describe('RenouvellementAbonnementComponent', () => {
  let component: RenouvellementAbonnementComponent;
  let fixture: ComponentFixture<RenouvellementAbonnementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenouvellementAbonnementComponent]
    });
    fixture = TestBed.createComponent(RenouvellementAbonnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
