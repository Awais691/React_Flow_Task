import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, Handle } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

// Custom Node Component
const CustomNode = ({ id, data }) => {
  return (
    <div style={{ padding: '10px', border: '1px solid #000', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      {data.type === 'input' ? (
        <>
          <label>Node {id}:</label>
          <input
            type="number"
            value={data.value}
            onChange={(e) => data.onChange(id, parseFloat(e.target.value) || 0)}
            style={{ marginTop: 5, width: '100%' }}
          />
          <Handle type="source" position="right" />
        </>
      ) : (
        <>
          <label>Output:</label>
          <div>{data.value}</div>
          <Handle type="target" position="left" />
        </>
      )}
    </div>
  );
};

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges] = useState([
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e2-3', source: '2', target: '3' },
  ]);

  // Function to handle input changes
  const handleInputChange = useCallback((id, value) => {
    setNodes((prevNodes) => {
      // Update Node 1 or Node 2 value
      const updatedNodes = prevNodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, value } };
        }
        return node;
      });

      // Recalculate Node 3 value
      const node1Value = updatedNodes.find((node) => node.id === '1')?.data.value || 0;
      const node2Value = updatedNodes.find((node) => node.id === '2')?.data.value || 0;
      return updatedNodes.map((node) => {
        if (node.id === '3') {
          return { ...node, data: { ...node.data, value: node1Value * node2Value } };
        }
        return node;
      });
    });
  }, []);

  // Initialize nodes with the `handleInputChange` function
  useEffect(() => {
    setNodes([
      {
        id: '1',
        type: 'custom',
        position: { x: 50, y: 100 },
        data: { type: 'input', value: 1, onChange: handleInputChange },
      },
      {
        id: '2',
        type: 'custom',
        position: { x: 50, y: 200 },
        data: { type: 'input', value: 1, onChange: handleInputChange },
      },
      {
        id: '3',
        type: 'custom',
        position: { x: 300, y: 150 },
        data: { type: 'output', value: 1 },
      },
    ]);
  }, [handleInputChange]);

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ custom: CustomNode }}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
