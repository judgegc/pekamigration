export interface Diff
{
    nodes: { add: number[], remove: number[]};
    edges: { add: {from: number, to: number}[], remove: {from: number, to: number}[]};
}