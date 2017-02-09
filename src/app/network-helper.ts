export class NetworkHelper {
    public static diff(minuend: number[], subtrahend: number[]): number[] {
        return minuend.filter(item => subtrahend.indexOf(item) < 0);
    }

    public static edgesEqual(first: { from: number, to: number }, second: { from: number, to: number }): boolean
    {
        return (first.from == second.from && first.to == second.to) || 
        (first.from == second.to && first.to == second.from);
    }

    public static edgesDiff(minuend: { from: number, to: number }[], subtrahend: { from: number, to: number }[]): { from: number, to: number }[] {
        return minuend
            .filter(edge => subtrahend.find(x => NetworkHelper.edgesEqual(edge, x)) === undefined)
            .map(edge => ({ from: <number>edge.from, to: <number>edge.to }));
    }

    public static getEdgeId(edge: {from: number, to: number}): number
    {   
        let [k1, k2] = [edge.from, edge.to].sort();
        return 1/2 * (k1 + k2) * (k1 + k2 + 1) + k2;
    }
}
