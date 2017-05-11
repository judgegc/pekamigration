import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MdSlideToggleChange } from '@angular/material';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor() { }

   @Input() options: {dragNodes: boolean};
   @Output() change = new EventEmitter<{name: string, value: any}>();

  ngOnInit() {
  }

  public dragNodesChange(e: MdSlideToggleChange) {
    this.change.emit({name: 'dragNodes', value: e.checked});
  }

}
