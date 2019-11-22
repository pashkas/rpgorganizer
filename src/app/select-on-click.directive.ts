import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSelectOnClick]'
})
export class SelectOnClickDirective {

  constructor(private elementRef: ElementRef) {

  }

  @HostListener('click', ['$event']) onClick($event) {
    this.elementRef.nativeElement.focus();
  }

}
