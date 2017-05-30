import { ViewportComponent } from './../viewport/viewport.component';

import { AllChatsListenerService } from './../all-chats-listener.service';
import { IMessage } from './../peka-api/types/message.interface';
import { DataProviderService } from './../data-provider.service';
import { NetworkHelper } from './../network-helper';
import { NetworkSettings } from './../config/network-settings';

export class ChatsActivitiesVisualizer {
    private readonly CHECK_INTERVAL = 200;
    private readonly ACTIVE_TIME = 3000;
    private isRunning: boolean = false;
    private activeEdges: { id: number, timestamp: number }[] = [];
    private watchTimer;
    private activeStateStyle = (color) => ({ width: 5, color: { color: color } });
    private avaliavleColors = ['#f50057', '#1e88e5', '#e040fb', '#4caf50', '#fbc02d', '#4e342e'];

    public constructor(private network: ViewportComponent, private chatListener: AllChatsListenerService, private dataProvider: DataProviderService) { }

    public start() {
        if (!this.isRunning) {
            this.startVisualize();
            this.isRunning = true;
        }

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

        /*
        Возможно текут edges (update() создает если не существует).
        Если написать в чат и сразу выйти, то при смене стиля на дефолтный update() не найдет edge и создаст новую.
        */
        (this.network.data.edges as vis.DataSet<vis.Edge>)
            .update(resetEdges.map(id => Object.assign({ id: id }, { width: NetworkSettings.edges.width, color: NetworkSettings.edges.color })));
        
        this.activeEdges.splice(0, i);

        if (this.isRunning)
            this.watchTimer = setTimeout(() => this.check(), this.CHECK_INTERVAL);

    }
}