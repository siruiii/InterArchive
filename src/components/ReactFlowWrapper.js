'use client';

import React, { useMemo } from 'react';
import ReactFlow, { MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

// Preloaded image node type
const ImageNode = ({ data }) => {
  const { onClick, label } = data;

  return (
    <div onClick={onClick} style={{ padding: 0, cursor: 'pointer' }}>
      {label}
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
      minZoom={0.05} // 👈 set your desired min zoom level
      maxZoom={2}
    >
      <Controls />
    </ReactFlow>
  );
}
