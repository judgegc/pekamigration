import { Component, OnInit, ViewChild } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MdIconRegistry} from '@angular/material';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { PekaApiService } from './peka-api/peka-api.service';
import { DataProviderService } from './data-provider.service';
import { ViewportComponent } from './viewport/viewport.component';
import { DescriptionComponent } from './description/description.component';
import { RequestStatus, Status } from './request-status.interface';

import * as io from 'socket.io-client';
import * as vis from 'vis';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(ViewportComponent) network: ViewportComponent;
  @ViewChild(DescriptionComponent) description: DescriptionComponent;

  private socket: SocketIOClient.Socket;

  private data: vis.Data;
  private options: vis.Options;

  private isShowDescription: boolean = false;

  private requestInProgress: boolean = false;
  private requestProgress: number = 0;


  public constructor(private dataProvider: DataProviderService, mdIconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {

    mdIconRegistry.addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/md-settings.svg'));


    this.dataProvider.OnRequestStatus.subscribe({
      next: (x: RequestStatus) => {
        switch (x.status) {
          case Status.BEGIN:
            this.requestInProgress = true;
            break;
          case Status.INPROGRESS:
            this.requestProgress = x.progress
            break;
          case Status.END:
            this.requestProgress = 0;
            this.requestInProgress = false;
            break;
        }
      }
    });

    this.options = {
      groups: {
        peka: { color: { background: '#FBC02D' }, borderWidth: 1, size: 80 },
        streamer: { color: { background: '#1976D2' }, borderWidth: 1, size: 50 },
        viewer: { color: { background: '#455A64' }, borderWidth: 1, size: 20 }
      },
      interaction: {
        hover: true,
        dragNodes: false
      },
      layout: {
        improvedLayout: true
      },
      nodes: {
        shape: 'dot',
        borderWidth: 1,
        size: 30,
        color: {
          border: '#222222',
          background: '#666666',
          highlight: {
            border: '#222222',
            background: '#7B1FA2'
          }
        },
        font: { color: '#000000', align: 'center' }
      },
      edges: {
        color:
        {
          color: 'lightgray',
          highlight: '#9C27B0'
        },
        smooth: false
      },
      physics: {
        "barnesHut": {
          "gravitationalConstant": -80000,
          "centralGravity": 1.3,
          "springLength": 145
        },

        minVelocity: 0.64,
        timestep: 0.5,
        adaptiveTimestep: true,
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 100,
          onlyDynamicEdges: false,
          fit: true
        }
      }
    };

    this.data = this.dataProvider.networkData;
    this.dataProvider.startWatch();  

  }

  ngAfterViewInit() {

    this.network.setOptions(this.options);
    
  }

  //event from viewport 
  private deselectNode() {
    this.isShowDescription = false;
  }

  //event from viewport
  private selectNode(id: number) {
    this.isShowDescription = true;
    this.updateDescription(id);
  }

  //event from search box
  private searchComplete(id: number) {
    try {
      this.network.focusNode(id);
      this.isShowDescription = true;
      this.updateDescription(id);
    } catch (ex) {
      console.log('Нода не найдена. Работаем дальше');
    }
  }


  private updateDescription(id: number) {
    let info = this.network.getNodeInfo(id);

    this.description.setMode(info.node.group.toString());
    switch (info.node.group.toString()) {
      case 'streamer':
        this.description.setViewers(info.connects.length - 1);//- peka
        break;
      case 'viewer':
        this.description.setChannels(info.connects.map(c => c.label));
        break
      case 'peka':
        let sum = this.network.getSummaries();
        this.description.setPeka({ totalStreams: sum.totalStreamers, totalUsers: sum.totalUsers - 1 });//- peka
        break;
    }
  }

  private settingChange(opt: {name: string, value: any})
  {
    switch(opt.name)
    {
      case 'dragNodes':
      this.options.interaction.dragNodes = opt.value;
      break;
    }

    this.network.setOptions(this.options);
  }
}

