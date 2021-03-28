import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspeccionPredioPage } from './inspeccion-predio.page';

describe('InspeccionPredioPage', () => {
  let component: InspeccionPredioPage;
  let fixture: ComponentFixture<InspeccionPredioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspeccionPredioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeccionPredioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
