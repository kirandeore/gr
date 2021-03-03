import { TestBed } from '@angular/core/testing';

import { Form2HtmlService } from './form-2-html.service';

describe('Form2HtmlService', () => {
  let service: Form2HtmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Form2HtmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
