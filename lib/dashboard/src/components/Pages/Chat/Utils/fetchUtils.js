

export const fetchTemplate = async (setDeploymentUrl, template_id, token) => {
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