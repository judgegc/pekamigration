import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PekaApiService } from './peka-api/peka-api.service';
import { Stream } from './peka-api/stream.interface';
import { ViewersList } from './peka-api/viewers-list.interface';
import { Owner } from './peka-api/owner.interface';
import { NetworkHelper } from './network-helper';
import { SnapshotComparator } from './snapshot-comparator';

import * as vis from 'vis';


@Injectable()
export class DataProviderService {

  private data: vis.Data;
  private watchTimer: Observable<number>;
  private readonly UPDATE_INTERVAL = 15000;


  private comparator: SnapshotComparator;

  constructor(private api: PekaApiService) {
    this.data = {
      nodes: new vis.DataSet([
        { id: 1, label: 'peka2.tv', group: 'peka', shape: 'circularImage', image: 'assets/images/peka.png' }
      ]),
      edges: new vis.DataSet([])
    };

    this.comparator = new SnapshotComparator(this.data);
  }

  public get networkData(): vis.Data {
    return this.data;
  }


  public startWatch() {
    this.watchTimer = Observable.timer(1000, this.UPDATE_INTERVAL);
    this.watchTimer.subscribe(this.updateStreamsList);
  }


  private updateStreamsList = (tick: number) => {
    this.api.getStreams()
      .map(streams => streams.content)
      .subscribe(streams => this.processStreams(streams), e => console.log(e));
  }


  private processStreams = (streams: Stream[]) => {

    let updatedStreams: { stream: Stream, viewers: ViewersList }[] = [];
    Observable.zip(
      Observable.from(streams),
      Observable.from(streams.map((stream: Stream) => this.api.getViewers(stream.owner.id))).concatAll(),
      (stream: Stream, viewers: ViewersList) => ({ stream: stream, viewers: viewers }))
      .subscribe({
        next: (streamWithViewers) => {
          updatedStreams.push(streamWithViewers);
        }, complete: () => {
          let diffs = this.comparator.getTransforms(updatedStreams);

          diffs.nodes.remove.splice(diffs.nodes.remove.indexOf(1), 1);////don't touch peka

          /*UPDATE NETWORK*/
          //remove outdated nodes
          (this.data.nodes as vis.DataSet<vis.Node>).remove(diffs.nodes.remove);


          //remove outdated edges
          (this.data.edges as vis.DataSet<vis.Edge>)
          .remove(diffs.edges.remove.map(e => NetworkHelper.getEdgeId(e)));
          

          //add new edges
          (this.data.edges as vis.DataSet<vis.Edge>)
            .add(diffs.edges.add.map(e => ({id: NetworkHelper.getEdgeId(e), from: e.from, to: e.to})));


          //add new nodes
          (this.data.nodes as vis.DataSet<vis.Node>)
            .add(diffs.nodes.add.map(id => {

              let streamer = updatedStreams.find(s => s.stream.id == id);
              if (streamer !== undefined) {
                return { id: id, label: streamer.stream.owner.name, group: 'streamer' };
              }

              let viewerNode: Owner;
              updatedStreams
                .some(s => {
                  let viewer = s.viewers.result.users.find(u => u.id == id);
                  if (viewer === undefined) {
                    return false;
                  }
                  else {
                    viewerNode = viewer;
                    return true;
                  }
                });

              return { id: id, label: viewerNode.name, group: 'viewer' };

            }));


          //connect streamers to root(peka)
          let streamers = (this.data.nodes as vis.DataSet<vis.Node>)
          .get(updatedStreams.map(s => s.stream.id));

          (this.data.edges as vis.DataSet<vis.Edge>)
          .add(streamers.map(s => ({id: NetworkHelper.getEdgeId({from: 1, to: s.id as number}),from: 1, to: s.id})));
          
        }
      });

  }
}
