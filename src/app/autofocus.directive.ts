import { Directive, ElementRef, Injectable } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
@Injectable({
  providedIn: 'root'
})
export class AutofocusDirective {

  constructor(private el: ElementRef) {
  }
 
  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}
