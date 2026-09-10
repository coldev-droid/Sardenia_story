import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Layers } from 'lucide-react';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: 'chapter' | 'hazard' | 'entity' | 'artifact';
  label: string;
  status?: 'locked' | 'conditional_lock' | 'blocked' | 'active' | 'pending' | 'dormant' | 'missing' | 'buried' | 'carried';
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  type: 'CREATES' | 'ESCALATES' | 'CONTAINS' | 'TRANSFORMS' | 'RESOLVES' | 'FLOW' | 'AFFECTS' | 'HOLDS' | 'APPROACHES';
}

const data = {
  nodes: [
    // Chapters
    { id: 'C1', group: 'chapter', label: 'CH1: The Book That Forgot Fire', status: 'locked' },
    { id: 'C2', group: 'chapter', label: 'CH2: The Emerald Crossing', status: 'locked' },
    { id: 'C3', group: 'chapter', label: 'CH3: The Gateway of Alghero', status: 'pending' },
    
    // Hazards
    { id: 'H1', group: 'hazard', label: 'Thermal Amnesia Field', status: 'active' },
    { id: 'H2', group: 'hazard', label: 'Identity Overwrite (Cogas)', status: 'active' },
    { id: 'H3', group: 'hazard', label: 'Sickle Paradox Trap', status: 'active' },
    { id: 'H4', group: 'hazard', label: 'Janna Interference', status: 'pending' },
    
    // Entities
    { id: 'E1', group: 'entity', label: 'Cogas', status: 'active' },
    { id: 'E2', group: 'entity', label: 'Janna', status: 'pending' },
    { id: 'E3', group: 'entity', label: 'Surbile', status: 'dormant' },
    { id: 'E4', group: 'entity', label: 'Elara', status: 'missing' },
    
    // Artifacts
    { id: 'A1', group: 'artifact', label: 'Obsidian Splinter', status: 'carried' },
    { id: 'A2', group: 'artifact', label: 'Obsidian Eye', status: 'buried' },
  ] as Node[],
  links: [
    { source: 'C1', target: 'C2', type: 'FLOW' },
    { source: 'C2', target: 'C3', type: 'FLOW' },
    
    { source: 'C1', target: 'H1', type: 'CREATES' },
    { source: 'C1', target: 'H2', type: 'CREATES' },
    { source: 'C1', target: 'H3', type: 'CREATES' },
    
    { source: 'C2', target: 'H1', type: 'CONTAINS' },
    { source: 'H2', target: 'C2', type: 'ESCALATES' },
    { source: 'C2', target: 'H4', type: 'CREATES' },
    
    { source: 'A1', target: 'C1', type: 'AFFECTS' },
    { source: 'A1', target: 'A2', type: 'APPROACHES' },
    { source: 'E1', target: 'H2', type: 'CREATES' },
    { source: 'E2', target: 'C2', type: 'APPROACHES' }
  ] as Link[]
};

const getEdgeColor = (type: string) => {
  switch (type) {
    case 'CREATES': return '#ef4444'; // red-500
    case 'ESCALATES': return '#f97316'; // orange-500
    case 'CONTAINS': return '#eab308'; // yellow-500
    case 'TRANSFORMS': return '#a855f7'; // purple-500
    case 'RESOLVES': return '#10b981'; // emerald-500
    case 'FLOW': return '#6366f1'; // indigo-500
    case 'APPROACHES': return '#0ea5e9'; // sky-500
    default: return '#6b7280';
  }
};

export const ChapterFlow: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    const wrapper = svgRef.current.parentElement;
    if (!wrapper) return;
    const width = wrapper.clientWidth;
    const height = 450;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height].join(' '))
      .attr('width', '100%')
      .attr('height', '100%');

    const simulationNodes = data.nodes.map(d => ({...d}));
    const simulationLinks = data.links.map(d => ({...d}));

    const defs = svg.append('defs');
    
    const edgeTypes = ['CREATES', 'ESCALATES', 'CONTAINS', 'TRANSFORMS', 'RESOLVES', 'FLOW', 'AFFECTS', 'HOLDS', 'APPROACHES'];
    
    edgeTypes.forEach(type => {
      defs.append('marker')
        .attr('id', `arrowhead-${type}`)
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', getEdgeColor(type))
        .style('stroke', 'none');
    });

    const simulation = d3.forceSimulation(simulationNodes as any)
      .force('link', d3.forceLink(simulationLinks).id((d: any) => d.id).distance((d: any) => d.type === 'FLOW' ? 120 : 70))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    const link = svg.append('g')
      .selectAll('line')
      .data(simulationLinks)
      .join('line')
      .attr('stroke', (d: any) => getEdgeColor(d.type))
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => d.type === 'FLOW' ? 3 : 2)
      .attr('stroke-dasharray', (d: any) => d.type === 'RESOLVES' || d.type === 'CONTAINS' ? '4,4' : 'none')
      .attr('marker-end', (d: any) => `url(#arrowhead-${d.type})`);

    const node = svg.append('g')
      .selectAll('g')
      .data(simulationNodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', (d: any) => d.group === 'chapter' ? 14 : 10)
      .attr('fill', (d: any) => {
        if (d.group === 'chapter') {
           if (d.status === 'conditional_lock') return '#f59e0b'; // amber
           if (d.status === 'blocked') return '#be123c'; // crimson
           return '#374151'; // pending
        }
        if (d.group === 'artifact') return '#10b981'; // emerald
        if (d.group === 'entity') return '#8b5cf6'; // violet
        return '#4b5563'; // hazard default
      })
      .attr('stroke', (d: any) => {
         if (d.group === 'hazard') return '#fcd34d';
         return d.status === 'active' ? '#38bdf8' : '#818cf8';
      })
      .attr('stroke-width', 2);

    node.append('text')
      .attr('x', 18)
      .attr('y', 4)
      .text((d: any) => {
         if (d.status === 'dormant') return `${d.label} (Untested)`;
         if (d.status === 'missing') return `${d.label} (Missing)`;
         if (d.status === 'buried') return `${d.label} (Buried)`;
         return d.label;
      })
      .attr('fill', '#e7e5e4')
      .attr('font-size', '11px')
      .attr('font-weight', (d: any) => d.group === 'chapter' ? 'bold' : 'normal')
      .attr('font-family', 'sans-serif')
      .style('pointer-events', 'none');

    // Add edge labels
    const edgeLabel = svg.append('g')
      .selectAll('text')
      .data(simulationLinks)
      .join('text')
      .attr('font-size', '9px')
      .attr('fill', (d: any) => getEdgeColor(d.type))
      .attr('text-anchor', 'middle')
      .attr('dy', -4)
      .text((d: any) => d.type !== 'FLOW' ? d.type : '');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
      edgeLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div className="bg-stone-900 rounded-2xl border border-indigo-900/50 p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="font-serif font-bold text-lg text-indigo-300">Chapter Flow & Hazard Visualizer</h3>
            <p className="text-xs text-stone-400">Directed graph mapping structural dependency across chapters, entities, and artifacts.</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>Cond. Lock</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-700 block"></span>Blocked</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500 block"></span>Entity</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>Artifact</div>
        </div>
      </div>
      
      <div className="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden flex justify-center relative w-full h-[450px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </div>
  );
}
