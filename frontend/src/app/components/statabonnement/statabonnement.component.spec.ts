import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatabonnementComponent } from './statabonnement.component';

describe('StatabonnementComponent', () => {
  let component: StatabonnementComponent;
  let fixture: ComponentFixture<StatabonnementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatabonnementComponent]
    });
    fixture = TestBed.createComponent(StatabonnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
