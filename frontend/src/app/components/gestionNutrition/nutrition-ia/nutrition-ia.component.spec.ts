import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionIAComponent } from './nutrition-ia.component';

describe('NutritionIAComponent', () => {
  let component: NutritionIAComponent;
  let fixture: ComponentFixture<NutritionIAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NutritionIAComponent]
    });
    fixture = TestBed.createComponent(NutritionIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
