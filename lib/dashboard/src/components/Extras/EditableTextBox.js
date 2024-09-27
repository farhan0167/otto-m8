import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const EditableText = ({ text, onTextChange, textTag }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(text);

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setCurrentText(e.target.value);
    onTextChange(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const Tag = textTag || 'p';

  return (
    <>
      {isEditing ? (
        <Form.Control
          type="text"
          value={currentText}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          autoFocus
        />
      ) : (
        <Tag onClick={handleTextClick}>
            {currentText || 'Click to edit...'}
        </Tag>
      )}
    </>
  );
};

export default EditableText;
