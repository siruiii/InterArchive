'use client';

import React, { useMemo } from 'react';
import ReactFlow, { MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

// Preloaded image node type
const ImageNode = ({ data }) => {
  return (
    <div style={{ padding: 0 }}>
      {data.label}
    </div>
  );
};

export default function ReactFlowWrapper({ nodes, edges }) {
  const nodeTypes = useMemo(() => ({
    imageNode: ImageNode,
  }), []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}
