import { createInputPayload } from "../../../InputHandles/createInputPayload";
import { prepareInputBlock } from "../../../InputHandles/utils";


export const fetchTemplate = async ({
    template_id, 
    token,
    setDeploymentUrl,
    setInputTextBlocks,
    setInputUploadBlocks,
    setInputURLBlocks,
    setInputData 
}) => {
    try {
      const response = await fetch(
          `http://localhost:8000/templates/${template_id}`,
          {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  "Authorization": `Bearer ${token}`
              },
          }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }
      const data = await response.json();
      setDeploymentUrl(data.deployment_url);

      const backendTemplate = data.backend_template;
      const { user_input, uploads, urls } = prepareInputBlock(backendTemplate['input']);
      setInputTextBlocks(user_input)
      setInputUploadBlocks(uploads)
      setInputURLBlocks(urls)
      const inputPayload = createInputPayload(backendTemplate['input'])
      setInputData((prev) => ({ ...prev, ...inputPayload }));

    } catch (error) {
      console.error('Error fetching template:', error);
    }
  };

export const fetchChatHistory = async (setChatHistory, deploymentUrl) => {
    if (!deploymentUrl) return; // Ensure deploymentUrl is set before calling this

    try {
      const response = await fetch(`${deploymentUrl}/get_chat_history`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      const data = await response.json();
      console.log(data)
      setChatHistory(data.chat_history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

export const clearChatHistory = async (setChatHistory, deploymentUrl) => {
    if (!deploymentUrl) return; // Ensure deploymentUrl is set before calling this

    try {
      const response = await fetch(`${deploymentUrl}/clear_chat_history`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to clear chat history');
      }
      setChatHistory([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };