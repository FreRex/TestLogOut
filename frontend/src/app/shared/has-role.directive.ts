import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[userIsAdmin]',
})
export class HasRoleDirective implements OnInit {
  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$ /* .pipe(take(1)) */
      .subscribe((user) => {
        if (user && user.autorizzazione == '1') {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }
}
