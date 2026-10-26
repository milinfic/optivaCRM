import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDateInput]',
  standalone: true
})
export class DateInputDirective {

  constructor(
    private el: ElementRef,
    @Optional() private control: NgControl
  ) {}

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    if (value.length > 5) value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');

    value = value.substring(0, 10);

    input.value = value;

    this.control?.control?.setValue(value, { emitEvent: false });
  }
}