import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[userHasRole]'
})
export class HasRoleDirective implements OnInit {

  @Input('userHasRole') roles: string;

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {
    // if (this.authService.currentRole && this.authService.currentRole == this.role) {
    //   this.viewContainer.createEmbeddedView(this.templateRef);
    // } else {
    //   this.viewContainer.clear();
    // }
    this.authService.currentRole$.subscribe((currentRole) => {
      if(currentRole && currentRole.includes(this.roles)){
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    })
    
  }
}
