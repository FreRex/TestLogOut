import { TestBed } from '@angular/core/testing';

import { StorageDataService } from './storage-data.service';

describe('StorageDataService', () => {
  let service: StorageDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
