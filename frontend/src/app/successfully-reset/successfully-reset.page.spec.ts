import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessfullyResetPage } from './successfully-reset.page';

describe('SuccessfullyResetPage', () => {
  let component: SuccessfullyResetPage;
  let fixture: ComponentFixture<SuccessfullyResetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfullyResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
