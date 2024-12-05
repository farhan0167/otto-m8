import React from 'react'

const ChatTextInput = ({block, inputData, setInputData}) => {
    const name = block.name;

    const handleChange = (e) => {
        setInputData({
            ...inputData,
            [name]: e.target.value
        })
    }

  return (
    <>
        <textarea
            value={inputData[name] || ''}
            onChange={ handleChange }
            placeholder="Type a message..."
            style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '14px', 
                border: '1px solid #ccc',
                //minHeight: '50px', // Set a minimum height for the textarea
                maxHeight: '350px', // Limit the height to avoid it growing too large
                width: '100%',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
            }}
        />
    </>
  )
}

export default ChatTextInput