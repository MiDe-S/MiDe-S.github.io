import { TestBed } from '@angular/core/testing';

import { LasagaClickerService } from './lasaga-clicker.service';

describe('LasagaClickerService', () => {
  let service: LasagaClickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LasagaClickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
