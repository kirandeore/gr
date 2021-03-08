import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeFillupFormComponent } from './resume-fillup-form.component';

describe('ResumeFillupFormComponent', () => {
  let component: ResumeFillupFormComponent;
  let fixture: ComponentFixture<ResumeFillupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeFillupFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeFillupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
