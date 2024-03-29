import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LasagaBuyComponent } from './lasaga-buy.component';

describe('LasagaBuyComponent', () => {
  let component: LasagaBuyComponent;
  let fixture: ComponentFixture<LasagaBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LasagaBuyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LasagaBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
