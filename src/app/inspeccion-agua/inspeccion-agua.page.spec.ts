import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspeccionAguaPage } from './inspeccion-agua.page';

describe('InspeccionAguaPage', () => {
  let component: InspeccionAguaPage;
  let fixture: ComponentFixture<InspeccionAguaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspeccionAguaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeccionAguaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
