import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionValorescatastralesPage } from './gestion-valorescatastrales.page';

describe('GestionValorescatastralesPage', () => {
  let component: GestionValorescatastralesPage;
  let fixture: ComponentFixture<GestionValorescatastralesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionValorescatastralesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionValorescatastralesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
