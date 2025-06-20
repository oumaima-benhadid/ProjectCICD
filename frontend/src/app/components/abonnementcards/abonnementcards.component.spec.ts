import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonnementcardsComponent } from './abonnementcards.component';

describe('AbonnementcardsComponent', () => {
  let component: AbonnementcardsComponent;
  let fixture: ComponentFixture<AbonnementcardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbonnementcardsComponent]
    });
    fixture = TestBed.createComponent(AbonnementcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
