import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileeComponent } from './user-profilee.component';

describe('UserProfileeComponent', () => {
  let component: UserProfileeComponent;
  let fixture: ComponentFixture<UserProfileeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileeComponent]
    });
    fixture = TestBed.createComponent(UserProfileeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
