import { TestBed } from '@angular/core/testing';

import { NodeRedService } from './node-red.service';

describe('NodeRedService', () => {
  let service: NodeRedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeRedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
