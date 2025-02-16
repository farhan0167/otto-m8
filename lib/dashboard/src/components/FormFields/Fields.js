

import React, { useState } from 'react'
import { Form } from 'react-bootstrap';
import CustomAlert from '../Extras/CustomAlert';
import LambdasDropdown from './LambdasDropdown';
import { PromptTemplate } from './PromptTemplate';
import { ToolCalling } from './ToolCalling';
//import { BlockFieldType } from '../../types/blocks/field'

// interface FieldProps {
//   field: BlockFieldType;
//   onDataChange?: (action: string, value: any) => void;
// }

export const BlockField = ({
    field,
    blockData,
    connectedSourceNodes,
    onDataChange
}) => {
  const fieldIsDisabled = !onDataChange;

  return (
    <>
      {field.type === 'text' && (
        <Form.Group className="mb-3" controlId={field.name}>
            <Form.Label>{field.display_name}</Form.Label>
            <Form.Control
              type="text"
              value={blockData[field.name] || ''}
              disabled={fieldIsDisabled}
              onChange={(e) => onDataChange?.(field.name, e.target.value)}
            />
        </Form.Group>
      )}
      {field.type === 'textarea' && (
        <Form.Group className="mb-3" controlId={field.name}>
            <Form.Label>{field.display_name}</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={blockData[field.name] || ''}
              disabled={fieldIsDisabled}
              onChange={(e) => onDataChange?.(field.name, e.target.value)}
            />
        </Form.Group>
      )}
      {field.type === 'static_dropdown' && (
        <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>{field.display_name}</Form.Label>
            <Form.Select 
              value={blockData[field.name]} 
              onChange={(e) => onDataChange?.(field.name, e.target.value)}
            >
                {field.dropdown_options && field.dropdown_options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </Form.Select>
            <CustomAlert 
                alertText="Make sure you know the kind of input your models are expecting."
                level="warning"
            />
      </Form.Group>
      )}
      {field.type === 'lambdas_dropdown' && (
        <LambdasDropdown
            field={field}
            blockData={blockData}
            onDataChange={onDataChange}
        />
      )}
      {field.type === 'prompt_template' && (
        <PromptTemplate
            field={field}
            blockData={blockData}
            connectedSourceNodes={connectedSourceNodes}
            onDataChange={onDataChange}
        />
      )}
      {field.type === 'tool_list' && (
        <ToolCalling
            field={field}
            blockData={blockData}
            onDataChange={onDataChange}
        />
      )}

    </>
  )
}