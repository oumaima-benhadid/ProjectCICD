import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezvousNComponent } from './rendezvous-n.component';

describe('RendezvousNComponent', () => {
  let component: RendezvousNComponent;
  let fixture: ComponentFixture<RendezvousNComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RendezvousNComponent]
    });
    fixture = TestBed.createComponent(RendezvousNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
