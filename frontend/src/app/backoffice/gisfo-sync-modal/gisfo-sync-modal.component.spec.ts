import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GisfoSyncModalComponent } from './gisfo-sync-modal.component';

describe('GisfoSyncModalComponent', () => {
  let component: GisfoSyncModalComponent;
  let fixture: ComponentFixture<GisfoSyncModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GisfoSyncModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GisfoSyncModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
