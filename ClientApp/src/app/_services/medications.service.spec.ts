/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MedicationsService } from './medications.service';

describe('Service: Medications', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MedicationsService]
    });
  });

  it('should ...', inject([MedicationsService], (service: MedicationsService) => {
    expect(service).toBeTruthy();
  }));
});
