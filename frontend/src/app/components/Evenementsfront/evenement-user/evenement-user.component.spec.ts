import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementUserComponent } from './evenement-user.component';

describe('EvenementUserComponent', () => {
  let component: EvenementUserComponent;
  let fixture: ComponentFixture<EvenementUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvenementUserComponent]
    });
    fixture = TestBed.createComponent(EvenementUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
