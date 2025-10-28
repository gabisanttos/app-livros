import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavedbooksPage } from './savedbooks.page';

describe('SavedbooksPage', () => {
  let component: SavedbooksPage;
  let fixture: ComponentFixture<SavedbooksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedbooksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
