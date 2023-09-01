import { TestBed } from '@angular/core/testing';

import { SpecializationsResolver } from './specializations.resolver';

describe('SpecializationsResolver', () => {
  let resolver: SpecializationsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SpecializationsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
