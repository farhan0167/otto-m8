

export const createDraftWorkflow = async (template, token) => {
    try {
      const response = await fetch('http://localhost:8000/create_draft_workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
            payload: {
                name: template.name,
                description: template.description,
                frontend_template: {
                    nodes: template.nodes,
                    edges: template.edges
                }
            }
        }),
      });
      return response
    } catch (error) {
      return null
    }
  }