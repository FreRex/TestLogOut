import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[userIsAdmin]',
})
export class HasRoleDirective implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(
        shareReplay({ refCount: true, bufferSize: 1 }),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        console.log('🐱‍👤 : HasRoleDirective : user', user);
        if (user.autorizzazione == '1') {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }

  destroy$ = new Subject();
  ngOnDestroy() {
    this.destroy$.next();
  }
}
