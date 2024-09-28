# Add a New Block

To add a new kind of block which performs a new kind of Task not yet supported, you will need to take the following steps.

1. Start by defining a new Task in the backend in `tasks/`. Every Task inherits from the `Task` class. It has a `run()` method, which takes `input_` as a param, where the main work for the task happens.

2. Register the Task in the Catalog and Task Registry.
3. The subsequent steps will involve creating the data components for the Task in the dashboard. The directory structure should look as follows and contain the following files:
    ```
    - components/
    - Block/
        - Vendor/
            - TaskName/
                * initialData.js
                * runConfig.js
                * sideBarData.js
    ```
   i. Add the initial data state of the Block in `initialData.js`.

    ```javascript
    export const initialDataAnotherTask = (nodeType) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        // below you define the data that the users will see
        data: { 
            label: 'Task Block', 
            'modelCard': 'bert-base-uncased', 
            'process_type': 'hugging_face_model_card',
            'logo': {
                'src': '/assets/hugging_face_model_card.png', 
                'height': '20%',
                'width': '90%'
            },
        },
        type: nodeType,
      };
    }
    ```
   ii. Update the `initialDataProcessBlock.js` file with the new initial data state via process type.
   ```javascript
   import { initialDataHuggingFaceModelCard } from "./HuggingFace/ModelCard/initialData";
   import { initialDataAnotherTask } from "./Vendor/AnotherTask/initialData";
    ...

    export const initialDataProcessBlock = ({nodeType, processBlockType}) => {
        if (processBlockType === 'hugging_face_model_card') {
            return initialDataHuggingFaceModelCard(nodeType)
        }
        if (processBlockType === 'other tasks registered in backend') {
            return initialDataAnotherTask(nodeType)
        }
        ...
    }
   ```
   iii. Once that is done, you'll need to add a new Node Config Sidebar Component that lets users change the state of the data via the sidebar in the `sideBarData.js` file. This file essentially renders the component that will be rendered on Node click, so that users could configure it.
   iv. You will also need to define what data points will be passed on as run config in a `runConfig.js` file. We need to create a run config file that will essentially tell the `processNodeDataForBackend()` function on what data points are considered run configurations. 
   ```javascript

    export const HuggingFaceModelCardRunConfig = (data, run_config) => {
        run_config['model_card'] = data.modelCard
        return run_config
    }
   ```
   For instance, for the `HuggingFaceModelCard` the data point `model_card` is considered a run config since the backend will rely on this to choose which model to run. 
4. Lastly, you'll need to add the run config function to the `createRunConfigForNode()` function in `/components/Workflows/Utils/CreateRunConfig.js`. This will ensure that we have a way to process the frontend template the backend template.