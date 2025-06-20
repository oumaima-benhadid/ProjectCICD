import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeancebackComponent } from './seanceback.component';

describe('SeancebackComponent', () => {
  let component: SeancebackComponent;
  let fixture: ComponentFixture<SeancebackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeancebackComponent]
    });
    fixture = TestBed.createComponent(SeancebackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
