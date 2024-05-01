import { TestBed } from '@angular/core/testing';

import { APIInterceptorService } from './apiinterceptor.service';

describe('APIInterceptorService', () => {
  let service: APIInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(APIInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
