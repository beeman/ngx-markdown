import { AfterViewInit, Component, ElementRef, Input, Output } from '@angular/core';

import { MarkdownService } from './markdown.service';
import { EventEmitter } from '@angular/forms/src/facade/async';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'markdown, [markdown]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./markdown.component.scss'],
})
export class MarkdownComponent implements AfterViewInit {
  private _data: string;
  private _src: string;

  @Input()
  get data(): string { return this._data; }
  set data(value: string) {
    this._data = value;
    this.render(value);
  }

  @Input()
  get src(): string { return this._src; }
  set src(value: string) {
    this._src = value;
    this.markdownService
      .getSource(value)
      .subscribe(
        markdown => this.render(markdown),
        error => this.error.emit(error),
      );
  }

  @Output() error = new EventEmitter<string>();

  get isTranscluded(): boolean {
    return !this.data && !this.src;
  }

  constructor(
    public element: ElementRef,
    public markdownService: MarkdownService,
  ) { }

  ngAfterViewInit() {
    if (this.isTranscluded) {
      this.render(this.element.nativeElement.innerHTML);
    }
  }

  render(markdown: string) {
    this.element.nativeElement.innerHTML = this.markdownService.compile(markdown);
    this.markdownService.highlight();
  }
}