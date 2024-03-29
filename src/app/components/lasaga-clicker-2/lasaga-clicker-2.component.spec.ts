import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LasagaClicker2Component } from './lasaga-clicker-2.component';

describe('LasagaClicker2Component', () => {
  let component: LasagaClicker2Component;
  let fixture: ComponentFixture<LasagaClicker2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LasagaClicker2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LasagaClicker2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
