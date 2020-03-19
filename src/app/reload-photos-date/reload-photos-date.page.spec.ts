import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReloadPhotosDatePage } from './reload-photos-date.page';

describe('ReloadPhotosDatePage', () => {
  let component: ReloadPhotosDatePage;
  let fixture: ComponentFixture<ReloadPhotosDatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReloadPhotosDatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReloadPhotosDatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
