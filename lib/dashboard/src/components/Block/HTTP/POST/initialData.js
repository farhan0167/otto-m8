export const initialDataHTTPPost = (nodeType) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: 'HTTP Post Block', 
            'method': 'POST', 
            'process_type': 'http_post_request',
            'endpoint': null
        },
        type: nodeType,
      };
}