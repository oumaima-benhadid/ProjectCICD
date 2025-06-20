import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteBackComponent } from './activite-back.component';

describe('ActiviteBackComponent', () => {
  let component: ActiviteBackComponent;
  let fixture: ComponentFixture<ActiviteBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActiviteBackComponent]
    });
    fixture = TestBed.createComponent(ActiviteBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
