import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeanceoffComponent } from './seanceoff.component';

describe('SeanceoffComponent', () => {
  let component: SeanceoffComponent;
  let fixture: ComponentFixture<SeanceoffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeanceoffComponent]
    });
    fixture = TestBed.createComponent(SeanceoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
