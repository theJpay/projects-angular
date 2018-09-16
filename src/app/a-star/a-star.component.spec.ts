import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AStarComponent } from './a-star.component';

describe('AStarComponent', () => {
  let component: AStarComponent;
  let fixture: ComponentFixture<AStarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AStarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
