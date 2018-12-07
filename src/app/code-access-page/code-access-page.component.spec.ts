import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeAccessPageComponent } from './code-access-page.component';

describe('CodeAccessPageComponent', () => {
  let component: CodeAccessPageComponent;
  let fixture: ComponentFixture<CodeAccessPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeAccessPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeAccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
