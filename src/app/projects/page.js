'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';

const ReactFlowWrapper = dynamic(() => import('@/components/ReactFlowWrapper'), { ssr: false });

export default function ProjectsPage() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const getImageUrls = (basePath, idWithoutExt) => {
    const extensions = ['.jpeg'];
    return extensions.map(ext => `${basePath}/${idWithoutExt}${ext}`);
  };

  const createNodesFromJson = useCallback((data) => {
    const basePath = '/thumbnails';

    return data.map((item) => {
      const idWithoutExt = item.id.replace(/\..+$/, '');
      const imageUrls = getImageUrls(basePath, idWithoutExt);

      const imgEl = (
        <img
          key={item.id}
          src={imageUrls[0]}
          width={item.w}
          height={item.h}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          loading="eager"
          onError={(e) => {
            let i = 1;
            const tryNext = () => {
              if (i < imageUrls.length) {
                e.target.src = imageUrls[i++];
              }
            };
            tryNext();
            e.target.onerror = tryNext;
          }}
        />
      );

      return {
        id: item.id,
        type: 'imageNode',
        position: { x: item.x, y: item.y },
        data: {
          label: imgEl,
        },
      };
    });
  }, []);

  useEffect(() => {
    fetch('/tsne_image_data_final.json')
      .then(res => res.json())
      .then(data => {
        const nodes = createNodesFromJson(data);
        setNodes(nodes);
      });
  }, [createNodesFromJson]);

  const memoNodes = useMemo(() => nodes, [nodes]);
  const memoEdges = useMemo(() => edges, [edges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowWrapper nodes={memoNodes} edges={memoEdges} />
    </div>
  );
}