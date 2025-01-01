export const getExampleTemplates = () => {
    return [
        {   
            "name": "Simple Chatbot",
            "description": "A simple chatbot with a single input and output block.",
            "nodes": [
              {
                "id": "1",
                "type": "input",
                "position": {
                  "x": 300,
                  "y": 150
                },
                "data": {
                  "label": "Input Block",
                  "input_type": "text",
                  "custom_name": "user_input",
                  "core_block_type": "text_input",
                  "process_type": "task"
                },
                "sourcePosition": "right",
                "deletable": true,
                "measured": {
                  "width": 150,
                  "height": 40
                }
              },
              {
                "id": "3",
                "type": "output",
                "position": {
                  "x": 700,
                  "y": 150
                },
                "data": {
                  "label": "Output Block"
                },
                "sourcePosition": "right",
                "targetPosition": "left",
                "measured": {
                  "width": 150,
                  "height": 40
                }
              },
              {
                "id": "qkh5g",
                "position": {
                  "x": 502.5,
                  "y": 122
                },
                "data": {
                  "label": "4145de08-ff85-4952-b1a4-13f5606c5263",
                  "custom_name": "",
                  "model": "gpt-4o-mini",
                  "core_block_type": "openai_chat",
                  "process_type": "task",
                  "logo": {
                    "src": "/assets/openai.png",
                    "height": "40%",
                    "width": "40%"
                  },
                  "system": "You are a helpful assistant.",
                  "prompt": "{user_input}",
                  "openai_api_key": "",
                  "tools": [],
                  "pass_input_to_output": false
                },
                "type": "process",
                "measured": {
                  "width": 150,
                  "height": 97
                },
                "selected": true,
                "dragging": false
              }
            ],
            "edges": [
              {
                "id": "e1-2",
                "source": "1",
                "target": "2",
                "animated": true
              },
              {
                "id": "e2-3",
                "source": "2",
                "target": "3",
                "animated": true
              },
              {
                "source": "1",
                "target": "qkh5g",
                "targetHandle": "a",
                "animated": true,
                "id": "xy-edge__1-qkh5ga"
              },
              {
                "source": "qkh5g",
                "sourceHandle": "b",
                "target": "3",
                "animated": true,
                "id": "xy-edge__qkh5gb-3"
              }
            ]
        }
    ]
}