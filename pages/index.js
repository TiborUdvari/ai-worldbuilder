// todo - find a way to select certain nodes and not others
// todo - create a new thing

import React, { useCallback, useState, useRef, useEffect } from "react";

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import "reactflow/dist/style.css";

import CustomNode from "../components/CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

import "reactflow/dist/style.css";

export default function Home() {
  const handleUpdate = (id, key, value) => {
    console.log("handle update " + id + " " + key + " " + value);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          console.log("found node");
          node.data = {
            ...node.data,
            [key]: value,
          };
        }
        return node;
      })
    );

    /*
    const newElements = elements.map((el) =>
      el.id === id.toString()
        ? { ...el, data: { ...el.data, [key]: value } }
        : el
    );
    setElements(newElements);*/
  };

  const initialNodes = [
    {
      id: "1",
      type: "default",
      className: "annotation",
      data: {
        label: "Story",
      },
      // draggable: false,
      selectable: false,
      position: { x: 500, y: 500 },
      style: {
        width: 500,
        height: 500,
      },
    },
    {
      id: "2",
      type: "custom",
      data: {
        name: "Simple prompt",
        part: "Global",
        onUpdate: handleUpdate,
        content:
          "I want you to act as a storyteller. You will come up with entertaining stories that are engaging, imaginative and captivating for the audience. It can be fairy tales, educational stories or any other type of stories which has the potential to capture people's attention and imagination. Depending on the target audience, you may choose specific themes or topics for your storytelling session e.g., if it’s children then you can talk about animals; If it’s adults then history-based tales might engage them better etc. My first request is",
      },
      position: { x: 0, y: 50 },
    },

    {
      id: "3",
      type: "custom",
      data: {
        name: "Jane Doe",
        part: "Character",
        onUpdate: handleUpdate,
        content: "this is some content about the character",
      },
      position: { x: 0, y: 50 },
      onUpdate: handleUpdate,
    },
    {
      id: "4",
      type: "custom",
      data: {
        name: "The haunted house",
        part: "Location",
        onUpdate: handleUpdate,
        content: "this is some content about the haunted house",
      },
      position: { x: 0, y: 50 },
      onUpdate: handleUpdate,
    },
    {
      id: "5",
      type: "default",
      className: "annotation",
      data: {
        label: (
          <>
            Hi! Welcome to AI Storybuilder. Click on the generate button to
            generate a story. 🥳
          </>
        ),
      },
      draggable: true,
      selectable: false,
      position: { x: 10, y: 10 },
    },
  ];
  const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedValue, setSelectedValue] = useState('Character'); // initialize state with an empty string

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const [gptText, setGPTText] = useState("GPT Text");

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: gptText,
          };
        }
        return node;
      })
    );
  }, [gptText, setGPTText]);

  const generate = () => {

    // get the value of the parts select
    console.log("Selected value");
    console.log(selectedValue);
    let part = selectedValue;
    const nodeId = (nodes.length + 1).toString();

    const newNode = {
      id: nodeId,
      type: "custom",
      data: {
        name: "Empty name",
        part: part,
        onUpdate: handleUpdate,
        content: "--- Empty content",
      },
      position: { x: 0, y: 50 },
      onUpdate: handleUpdate,
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);


    // const partSelect = document.getElementById("part");
    // const partValue = partSelect.value;
    // console.log("Tibor parts")
    // console.log(partValue)

    
    // get the value of the select label and add a custom node of that type to the nodes array
    
    // get the value of the select label and add a custom node of that type to the nodes array
    
    
    // todo: check on what we add based on what is selected



  };

  const generateStory = () => {
    // filter the nodes array to get the nodes that have a part of "Global"
    const globalNodes = nodes.filter((node) => node.data.part === "Global");

    // get the content of the global nodes
    const globalContent = globalNodes.map((node) => node.data.content);

    // reduce the globalcontent array to a single string
    const globalContentString = globalContent.reduce((acc, cur) => {
      return acc + " " + cur;
    });

    prompt = globalContentString;

    askChatGPT(prompt);
  };

  function askChatGPT(question) {
    var id = "oilfjaabefbjoagnomallidmlpkbfcfm";
    const port = chrome.runtime.connect(id);

    port.onMessage.addListener(function (msg) {
      // console.log("message received from the extension");
      // console.log(msg);
      if (msg.answer) {
        setGPTText(msg.answer);
      }
      // should update
      // keep updating the content
    });

    port.postMessage({ question });
  }

  // create the function to add a node
  const addNode = useCallback(() => {
    // it has to be a custom node

    const nodeId = (nodes.length + 1).toString();
    const newNode = {
      id: nodeId,
      position: { x: 100, y: 100 },
      data: { label: `Node ${nodeId}` },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  }, [nodes, setNodes]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      <div
        style={{
          position: "absolute",
          right: "10px",
          top: "10px",
          width: "200px",
          gap: "0.5em"          
        }}
        className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
        
      >
        {/* <label
          for="parts"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select an option
        </label> */}
        <select
          id="parts"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={selectedValue} onChange={handleChange}
        >
          <option value="Character">Character</option>
          <option value="Global">Global</option>
          <option value="Plot">Plot</option>
          <option value="Location">Location</option>
        </select>

        <button
          id="generateBtn"
          className="bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow-xl"
          onClick={() => generate()}
        >
          Generate
        </button>
      </div>
    </div>
  );
}
