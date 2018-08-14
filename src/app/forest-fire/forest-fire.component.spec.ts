import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForestFireComponent } from './forest-fire.component';

describe('ForestFireComponent', () => {
  let component: ForestFireComponent;
  let fixture: ComponentFixture<ForestFireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForestFireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForestFireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
