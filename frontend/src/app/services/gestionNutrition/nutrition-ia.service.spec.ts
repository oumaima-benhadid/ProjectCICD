import { TestBed } from '@angular/core/testing';

import { NutritionIAService } from './nutrition-ia.service';

describe('NutritionIAService', () => {
  let service: NutritionIAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NutritionIAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
