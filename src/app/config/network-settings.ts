import * as vis from 'vis';

export let NetworkSettings: vis.Options = {
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
        maxVelocity: 50,
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