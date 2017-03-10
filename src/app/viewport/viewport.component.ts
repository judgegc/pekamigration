import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import * as vis from 'vis';

@Component({
  selector: 'viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.css']
})
export class ViewportComponent {

  @Input() data: vis.Data;
  @Output() selectNode = new EventEmitter<number>();
  @Output() deselectNode = new EventEmitter();
  @Output() stabilized = new EventEmitter<number>();


  private network: vis.Network;

  constructor(private container: ElementRef) { }

  ngAfterViewInit() {
    this.network = new vis.Network(this.container.nativeElement, this.data);
    this.network.on('deselectNode', () => this.deselectNode.emit());
    this.network.on('selectNode', (p: vis.Properties) => this.selectNode.emit(Number(p.nodes[0])));
    this.network.on('stabilized', (e: {iterations: number}) => {this.stabilized.emit(e.iterations)});
  }

  public focusNode(id: number) {
    this.network.selectNodes([id], true);
    this.network.focus(id, { scale: 1, animation: { duration: 1000, easingFunction: 'easeInCubic' } });
  }

  public getNodeInfo(id: number) {
    return {
      node: (this.data.nodes as vis.DataSet<vis.Node>).get(id),
      connects: (this.data.nodes as vis.DataSet<vis.Node>)
        .get(this.network.getConnectedNodes(id) as number[])
    };
  }

  public getSummaries()
  {
    let totalStreamers = this.network.getConnectedNodes(1).length;
    return {
      totalStreamers: totalStreamers, 
      totalUsers: (this.data.nodes as vis.DataSet<vis.Node>).length - totalStreamers};
    
  }

  public setOptions(options: vis.Options)
  {
    this.network.setOptions(options);
  }

}
