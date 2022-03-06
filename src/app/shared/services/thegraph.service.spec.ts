import { TestBed } from '@angular/core/testing';

import { ThegraphService } from './thegraph.service';

describe('ThegraphService', () => {
  let service: ThegraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThegraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
