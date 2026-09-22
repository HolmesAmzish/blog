import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import type { CategoryTreeNode } from '@/types';

interface TreeNode extends CategoryTreeNode {
  x: number;
  y: number;
  children: TreeNode[];
}

interface CategoryTreeProps {
  data: CategoryTreeNode;
  isDark?: boolean;
  onNodeClick?: (id: number, slug: string) => void;
}

const LEFT_MARGIN = 120;
const RIGHT_MARGIN = 120;
const LEVEL_WIDTH = 180;
const NODE_HEIGHT = 44;
const TOP_MARGIN = 24;
const NODE_RADIUS = 4;

function layoutTree(root: CategoryTreeNode): TreeNode {
  let leafIndex = 0;

  const layout = (node: CategoryTreeNode, depth: number): TreeNode => {
    const children = node.children.map(child => layout(child, depth + 1));
    const x = LEFT_MARGIN + depth * LEVEL_WIDTH;

    let y: number;
    if (children.length === 0) {
      y = TOP_MARGIN + leafIndex * NODE_HEIGHT;
      leafIndex += 1;
    } else {
      y = (children[0].y + children[children.length - 1].y) / 2;
    }

    return { ...node, x, y, children };
  };

  return layout(root, 0);
}

function collectLinks(node: TreeNode): Array<{ parent: TreeNode; child: TreeNode }> {
  return node.children.flatMap(child => [
    { parent: node, child },
    ...collectLinks(child),
  ]);
}

function collectNodes(node: TreeNode): TreeNode[] {
  return [node, ...node.children.flatMap(collectNodes)];
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({ data, isDark, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      setContainerSize({ width: cr.width, height: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const tree = useMemo(() => layoutTree(data), [data]);
  const links = useMemo(() => collectLinks(tree), [tree]);
  const nodes = useMemo(() => collectNodes(tree), [tree]);

  const treeWidth = useMemo(() => {
    const maxX = nodes.reduce((max, node) => Math.max(max, node.x), 0);
    return maxX + RIGHT_MARGIN;
  }, [nodes]);

  const treeHeight = useMemo(() => {
    const leafCount = nodes.filter(n => n.children.length === 0).length;
    return Math.max(TOP_MARGIN * 2 + leafCount * NODE_HEIGHT, 200);
  }, [nodes]);

  const containerWidth = containerSize.width || treeWidth;
  const containerHeight = containerSize.height || treeHeight;

  const baseTx = (containerWidth - treeWidth) / 2;
  const baseTy = (containerHeight - treeHeight) / 2;

  const canPanX = treeWidth > containerWidth;
  const canPanY = treeHeight > containerHeight;

  // Reset pan when tree or container changes, unless user is currently dragging.
  useEffect(() => {
    if (!isDragging) setPan({ x: 0, y: 0 });
  }, [treeWidth, treeHeight, containerWidth, containerHeight, isDragging]);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const panX = canPanX ? clamp(pan.x, baseTx, -baseTx) : 0;
  const panY = canPanY ? clamp(pan.y, baseTy, -baseTy) : 0;

  const transformX = baseTx + panX;
  const transformY = baseTy + panY;

  const startDrag = useCallback((clientX: number, clientY: number) => {
    if (!canPanX && !canPanY) return;
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY, panX: pan.x, panY: pan.y };
  }, [canPanX, canPanY, pan.x, pan.y]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Left button only
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  }, [startDrag]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, [startDrag]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
    };

    const handleUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
    };

    const handleTouchEnd = () => setIsDragging(false);

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const textColor = isDark ? '#fff' : '#000';
  const lineColor = isDark ? '#2d2d2d' : '#e5e7eb';

  const handleNodeClick = (node: TreeNode) => {
    if (node.id === -1) return;
    onNodeClick?.(node.id, node.slug);
  };

  const cursor = isDragging ? 'grabbing' : canPanX || canPanY ? 'grab' : 'default';

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] overflow-hidden relative select-none"
      style={{ cursor }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <svg
        width={containerWidth}
        height={containerHeight}
        className="block"
      >
        <g transform={`translate(${transformX}, ${transformY})`}>
          {links.map(({ parent, child }) => {
            const midX = (parent.x + child.x) / 2;
            const d = `M ${parent.x},${parent.y} C ${midX},${parent.y} ${midX},${child.y} ${child.x},${child.y}`;
            return (
              <path
                key={`link-${parent.id}-${child.id}`}
                d={d}
                fill="none"
                stroke={lineColor}
                strokeWidth={1}
              />
            );
          })}

          {nodes.map(node => {
            const isLeaf = node.children.length === 0;
            const isRoot = node.id === -1;
            return (
              <circle
                key={`node-${node.id}`}
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS}
                fill={isLeaf ? '#0047FF' : isDark ? '#fff' : '#000'}
                stroke="#0047FF"
                strokeWidth={1}
                className={isRoot ? '' : 'cursor-pointer'}
                onClick={() => handleNodeClick(node)}
              />
            );
          })}

          {nodes.map(node => {
            const isLeaf = node.children.length === 0;
            const isRoot = node.id === -1;
            const xOffset = isLeaf ? 10 : -10;
            const textAnchor = isLeaf ? 'start' : 'end';

            return (
              <text
                key={`label-${node.id}`}
                x={node.x + xOffset}
                y={node.y + 4}
                fill={textColor}
                fontSize={11}
                fontFamily="monospace"
                textAnchor={textAnchor}
                className={isRoot ? '' : 'cursor-pointer'}
                onClick={() => handleNodeClick(node)}
              >
                {node.name}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
