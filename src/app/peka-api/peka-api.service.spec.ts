/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PekaApiService } from './peka-api.service';

describe('PekaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PekaApiService]
    });
  });

  it('should ...', inject([PekaApiService], (service: PekaApiService) => {
    expect(service).toBeTruthy();
  }));
});
