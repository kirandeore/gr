import { TestBed } from '@angular/core/testing';

import { ResumeBuilderFormService } from './resume-builder-form.service';

describe('ResumeBuilderFormService', () => {
  let service: ResumeBuilderFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeBuilderFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
