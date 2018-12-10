import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationAcceessPageComponent } from './registration-acceess-page.component';

describe('RegistrationAcceessPageComponent', () => {
  let component: RegistrationAcceessPageComponent;
  let fixture: ComponentFixture<RegistrationAcceessPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationAcceessPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationAcceessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
