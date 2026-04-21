import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SlaManagement } from "./sla-management";

describe("SlaManagement", () => {
  let component: SlaManagement;
  let fixture: ComponentFixture<SlaManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlaManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(SlaManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
