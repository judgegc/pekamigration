import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  
  private displayMode: string;
  private totalViewers: number;
  private watchChannels: string[] = [];
  private pekaStats: {totalStreams: number, totalUsers: number};

  constructor() { }
  ngOnInit() {
  }

  public setMode(mode: string)
  {
    this.displayMode = mode;
  }
  public setViewers(val: number)
  {
    this.totalViewers = val;
  }
  public setChannels(chnls: string[])
  {
    this.watchChannels = chnls;
  }
  public setPeka(stat: {totalStreams: number, totalUsers: number})
  {
    this.pekaStats = stat;
  }

}
