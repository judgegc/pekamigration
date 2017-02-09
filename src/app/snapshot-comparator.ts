import { NetworkHelper } from './network-helper';
import { Stream } from './peka-api/stream.interface';
import { ViewersList } from './peka-api/viewers-list.interface';

export class SnapshotComparator {
    constructor(private network: vis.Data) {
    }

    public getTransforms(updatedData: { stream: Stream, viewers: ViewersList }[]) {

        let presentNodes = (<vis.DataSet<vis.Node>>this.network.nodes)
            .map(node => <number>node.id);

        let updatedNodes: number[] = [].concat.apply([], updatedData
            .map(s => s.viewers.result.users
            .map(u => u.id)
        .concat(s.stream.id)));
        updatedNodes = updatedNodes.filter((i, idx) => updatedNodes.indexOf(i) === idx );


        let presentEdges = (<vis.DataSet<vis.Edge>>this.network.edges)
        .map(edge => ({from: edge.from, to: edge.to}));

        let updatedEdges = [].concat.apply([],updatedData
        .map(s => s.viewers.result.users.map(u => ({from: s.stream.id, to: u.id}))));


        return {
            nodes:
            {
                remove: NetworkHelper.diff(presentNodes, updatedNodes),
                add: NetworkHelper.diff(updatedNodes, presentNodes)
            },
            edges:
            {
                remove: NetworkHelper.edgesDiff(presentEdges, updatedEdges),
                add: NetworkHelper.edgesDiff(updatedEdges, presentEdges)
            }
        };

    }
}
