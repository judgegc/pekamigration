import { ViewportComponent } from './../viewport/viewport.component';

import { AllChatsListenerService } from './../all-chats-listener.service';
import { IMessage } from './../peka-api/types/message.interface';
import { DataProviderService } from './../data-provider.service';
import { NetworkHelper } from './../network-helper';
import { NetworkSettings } from './../config/network-settings';
import { SoundEffect } from './../audio/sound-effect';

export class ChatsActivitiesVisualizer {
    private readonly CHECK_INTERVAL = 200;
    private readonly ACTIVE_TIME = 3000;
    private isRunning: boolean = false;
    private activeEdges: { id: number, timestamp: number }[] = [];
    private watchTimer;
    private activeStateStyle = (color) => ({ width: 5, color: { color: color } });
    private avaliavleColors = ['#f50057', '#1e88e5', '#e040fb', '#4caf50', '#fbc02d', '#4e342e'];
    private effects: SoundEffect[];
    private soundEffects: boolean = false;
    public constructor(private network: ViewportComponent, private chatListener: AllChatsListenerService, private dataProvider: DataProviderService) {
        this.effects = [
            new SoundEffect('assets/sounds/dry_water_drops_1.mp3'),
            new SoundEffect('assets/sounds/dry_water_drops_2.mp3'),
            new SoundEffect('assets/sounds/dry_water_drops_3.mp3'),
            new SoundEffect('assets/sounds/dry_water_drops_4.mp3'),
            new SoundEffect('assets/sounds/dry_water_drops_5.mp3'),
            new SoundEffect('assets/sounds/dry_water_drops_6.mp3'),
        ];
    }

    public start() {
        if (!this.isRunning) {
            this.startVisualize();
            this.isRunning = true;
        }

    }
    public enableSoundEffects(enable: boolean) {
        this.soundEffects = enable;
    }

    public removeOutdated(edges: number[]) {
        this.activeEdges = this.activeEdges.filter(x => edges.indexOf(x.id));
    }

    private startVisualize() {
        this.watchTimer = setTimeout(() => this.check(), this.CHECK_INTERVAL);

        this.chatListener.OnMessage.subscribe({
            next: (msg: IMessage) => {
                let stream = msg.channel.split('/'); //stream/12345
                if (stream.length != 2)
                    return;
                let streamOwnerId = Number.parseInt(stream[1]);
                let senderId = msg.from.id;

                let streamId = this.dataProvider.streamIdByOwner(streamOwnerId);
                if (streamId == undefined)
                    return;

                let senderToStreamEdgeId = NetworkHelper.getEdgeId({ from: streamId, to: senderId });

                if (this.network.findEdge(senderToStreamEdgeId) != null) {

                    let options = this.activeStateStyle(this.randomColor());
                    (this.network.data.edges as vis.DataSet<vis.Edge>)
                        .update([Object.assign({ id: senderToStreamEdgeId }, options)]);

                    this.activeEdges.push({ id: senderToStreamEdgeId, timestamp: Date.now() });
                }
                if (this.soundEffects) {
                    let source = this.network.getNodePosition(senderId);
                    if (source !== undefined)
                        this.playRandomEffect({ x: source.x, y: source.y, z: 10 }, { x: this.network.cameraPosition.x, y: this.network.cameraPosition.y, z: 20 });
                }
            }
        });
    }

    private randomColor() {
        return this.avaliavleColors[Math.floor(Math.random() * this.avaliavleColors.length)];
    }


    private check() {
        let resetEdges: number[] = [];
        let i = 0;
        for (; i < this.activeEdges.length && this.activeEdges[i].timestamp + this.ACTIVE_TIME < Date.now(); ++i) {
            resetEdges.push(this.activeEdges[i].id);
        }

        (this.network.data.edges as vis.DataSet<vis.Edge>)
            .update(resetEdges.map(id => Object.assign({ id: id }, { width: NetworkSettings.edges.width, color: NetworkSettings.edges.color })));

        this.activeEdges.splice(0, i);

        if (this.isRunning)
            this.watchTimer = setTimeout(() => this.check(), this.CHECK_INTERVAL);
    }

    private playRandomEffect(source: { x: number, y: number, z: number }, listener: { x: number, y: number, z: number }) {
        this.effects[Math.floor(Math.random() * this.effects.length)].play(source, listener)
    }
}