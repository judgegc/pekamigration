import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { PekaApiService } from './peka-api/peka-api.service';
import { DataProviderService } from './data-provider.service';
import { ViewportComponent } from './viewport/viewport.component';
import { DescriptionComponent } from './description/description.component';
import { RequestStatus, Status } from './request-status.interface';
import { AllChatsListenerService } from './all-chats-listener.service';
import { NetworkHelper } from './network-helper';

import { NetworkSettings } from './config/network-settings';

import { IMessage } from './peka-api/types/message.interface';

import { ChatsActivitiesVisualizer } from './modules/chats-activities-visualizer';

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
  private isSlowMode: boolean = false;
  private _data: vis.Data;

  private messagesVisualizer: ChatsActivitiesVisualizer;


  public options: vis.Options;

  public isShowDescription: boolean = false;

  public requestInProgress: boolean = false;
  public requestProgress: number = 0;

  ngAfterViewInit() {
    this.network.setOptions(this.options);
    this.messagesVisualizer = new ChatsActivitiesVisualizer(this.network, this.chatListener, this.dataProvider);
    this.messagesVisualizer.start();
  }

  public get data() {
    return this._data;
  }

  public constructor(private dataProvider: DataProviderService, private chatListener: AllChatsListenerService, mdIconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {

    mdIconRegistry.addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/md-settings.svg'));
    
    this.options = NetworkSettings;

    this.chatListener.start();
    
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

    this._data = this.dataProvider.networkData;
    this.dataProvider.startWatch();

  }

  public nodes() {
    return this._data.nodes;
  }
  //event from viewport 
  public deselectNode(e) {
    this.isShowDescription = false;
  }

  //event from viewport
  public selectNode(id: number) {
    this.isShowDescription = true;
    this.updateDescription(id);
  }

  //event from search box
  public searchComplete(id: number) {
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

  public settingChange(opt: { name: string, value: any }) {
    switch (opt.name) {
      case 'dragNodes':
        this.options.interaction.dragNodes = opt.value;
        break;
    }

    this.network.setOptions(this.options);
  }

  public stabilized(iterations: number) {
    if (iterations > 2000 && !this.isSlowMode) {
      this.isSlowMode = true;
      this.options.physics.maxVelocity = 5;
      this.network.setOptions(this.options);
      console.log('Переход в slow mode');
    }
  }
}

