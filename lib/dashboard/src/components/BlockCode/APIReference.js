
import React, { useState } from 'react'
import Markdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'

export const ApiReferenceComponent = () => {
    const markdownContent = `

### Example Code

Use this page as a guide to build your own implementation or modify an existing implementation.
Below is an example block's implementation for the OpenAI Chat Completion block and how it
renders in the UI. To learn in details about how to build your own implementation, see the
[documentation](https://otto-m8.com/docs/category/blocks).

~~~python
from openai import OpenAI
from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field,
    FieldType
)
from other_imports import *


class OpenAIChat(BaseImplementation):
    """Task definition of the OpenAI Chat Completion."""
    display_name = 'OpenAI Chat Completion' # This will determine the name when you click "Add Block"

    block_type = 'process' # This will determine block type of either "input", "process" or "output"

    # Any fields within BlockMetadata will be shown in the UI or sidebar depending on how
    # they are configured
    block_metadata = BlockMetadata([
        Field(
            name="openai_api_key", # These are values you can access via self.run_config if is_run_config=True
            display_name="OpenAI API Key", 
            is_run_config=True, 
            show_in_ui=False, 
            type=FieldType.PASSWORD.value
        ),
        Field(
            name="model", 
            display_name="Model", 
            is_run_config=True, 
            default_value='gpt-4o-mini'
        ),
        Field(
            name="system", 
            display_name="System Prompt", 
            is_run_config=True, 
            show_in_ui=False, 
            type=FieldType.TEXTAREA.value
        ),
        Field(
            name="prompt_template", 
            display_name="Prompt Template", 
            is_run_config=True, 
            show_in_ui=False, 
            type=FieldType.PROMPT_TEMPLATE.value
        ),
    ])
    
    def __init__(self, run_config:dict) -> None:
        super().__init__()
        self.run_config = run_config
        self.openAI_client = OpenAI(
            api_key=self.run_config.get('openai_api_key'),
        ) 
        self.others = [...]
    
    def run(self, input_:dict) -> dict:
        # logic for running open ai chat completion
        pass
~~~
  
### \`BlockMetadata\`

~~~python
from typing import List
from core.blocks.field import Field

class BlockMetadata:
    """BlockMetadata groups together the fields of a block. This helps an Implementation
    class to define the fields that are visible in the block's UI,
    the fields that are visible in the block's sidebar, and generating the initial
    state of the Block(Reactflow nodes).
    """
    def __init__(self, fields:List[Field]) -> None:
        default_fields = [
            Field(name="custom_name", display_name="Block Name"),
            Field(name="source_code", display_name="View Code", is_run_config=False, show_in_ui=False),
            Field(name="source_path", display_name=None, is_run_config=False, show_in_ui=False),
            Field(name="source_hash", display_name=None, is_run_config=False, show_in_ui=False),
            Field(name="process_type", display_name=None, is_run_config=False, show_in_ui=False),
            Field(name="core_block_type", display_name=None, is_run_config=False, show_in_ui=False),
        ]
        """Default fields that are common across all blocks"""
        
        self.fields = [*default_fields, *fields]
~~~

### \`Field\`

A \`Field\` is a simple data structure that holds information about a block's metadata.

~~~python title="lib/otto_backend/core/blocks/field.py"
from enum import Enum
from typing import List, Union, Any, Dict
from pydantic import BaseModel

class Field(BaseModel):
    """Base representation of a field in a block. These are used by
    users to configure a block or see the block's configuration in the block.
    """
    name: str
    """Name of the field used for programatic access to the block's metadata"""
    display_name: Union[str, None] = None
    """The text that will be displayed on the UI to represent the block's metadata"""
    default_value: Any = ''
    """Default value the field will hold"""
    type:str = FieldType.TEXT.value
    """The type of field rendered"""
    metadata: Dict[str, Any] = {}
    """Any additional metadata for the field"""
    is_run_config: bool = True
    """Flag to determine whether the field is configurable by the user, or part of the run_config"""
    show_in_ui: bool = True
    """Flag to determine whether this field will be rendered on the Reactflow node"""
~~~

### \`FieldType\`

\`FieldType\` is used to determine the type of a \`Field\` that will be rendered. The primitive types are
basic html elements such as text, textarea, password, etc. On top of the primitive types, there
are types that are specific to Otto-m8.

To use \`FieldType\`, you must import it from

~~~python
from implementations.base import FieldType
~~~

~~~python
class FieldType(Enum):
    TEXT = 'text'
    PASSWORD = 'password'
    TEXTAREA = 'textarea'
    NUMBER = 'number'
    DATETIME = 'datetime'
    STATIC_DROPDOWN = 'static_dropdown'
    LAMBDAS_DROPDOWN = 'lambdas_dropdown'
    TOOL_LIST = 'tool_list'
    PROMPT_TEMPLATE = 'prompt_template'
    MULTIMODAL_SELECTOR = 'multimodal_selector'
    GCLOUD_AUTH = 'gcloud_auth'
~~~

### \`StaticDropdownOption\`

Use the \`StaticDropdownOption\` when using \`FieldType\` of \`STATIC_DROPDOWN\` and you want to render
a dropdown with a pre-determined set of options. To use \`StaticDropdownOption\`, you must import it from

~~~python
from implementations.base import StaticDropdownOption
~~~

~~~python title="lib/otto_backend/core/blocks/field.py"
class StaticDropdownOption(BaseModel):
    """Object to represent a dropdown option for a static dropdown."""
    value: str
    label: str
    
    def __dict__(self):
        return {
            'value': self.value,
            'label': self.label
        }
~~~

An example usage of \`StaticDropdownOption\`:

~~~python title="lib/otto_backend/implementations/tasks/pdf_loader/langchain_pdf_loader.py"
...

class LangchainPDFLoader(BaseImplementation):
    display_name = 'PDF Loader'
    block_type = 'process'
    block_metadata = BlockMetadata([
        ...,
        Field(name="input_type", display_name="Input Type", is_run_config=True, show_in_ui=False,
                type=FieldType.STATIC_DROPDOWN.value,
                default_value=InputType.FILE.value,
                metadata={
                    'dropdown_options': [
                        StaticDropdownOption(value=InputType.FILE.value, label="File").__dict__,
                        StaticDropdownOption(value=InputType.URL.value, label="URL").__dict__,
                    ]
                }
        ),
    ])
    ...
~~~

Another example of where this can be used is when you want to limit which models users can select:

~~~python
class OpenAIChat(BaseImplementation):
    """Task definition of the OpenAI Chat Completion."""
    display_name = 'OpenAI Chat Completion'
    block_type = 'process'
    block_metadata = BlockMetadata([
        Field(
            name="openai_api_key", # These are values you can access via self.run_config if is_run_config=True
            display_name="OpenAI API Key", 
            is_run_config=True, 
            show_in_ui=False, 
            type=FieldType.PASSWORD.value
        ),
        Field(name="model", display_name="Model", is_run_config=True, show_in_ui=False,
            type=FieldType.STATIC_DROPDOWN.value,
            default_value='gpt-4o-mini',
            metadata={
                'dropdown_options': [
                    StaticDropdownOption(value='gpt-4o-mini', label="gpt-4o-mini").__dict__,
                    StaticDropdownOption(value='gpt-4o', label="gpt-4o").__dict__,
                ]
            }
        )
        ...
    ])
    
    def __init__(self, run_config:dict) -> None:
        super().__init__()
        self.run_config = run_config
        ...

~~~

### \`MultimodalField\`

To use \`MultimodalField\`, you must import it from

~~~python
from implementations.base import MultimodalField
~~~

~~~python title="lib/otto_backend/core/blocks/field.py"
class MultimodalField:
    """Object to represent a field for a multimodal selector."""
    def __init__(
        self,
        image:Field,
        text:Field,
        name: Union[str, None] = None,
        display_name: Union[str, None] = None,
        is_run_config: bool = True,
        show_in_ui: bool = False
    ) -> None:
        self.name = name
        self.display_name = display_name
        self.image = image
        self.text = text
        self.type = FieldType.MULTIMODAL_SELECTOR.value
        self.show_in_ui = show_in_ui
        self.is_run_config = is_run_config
        
    def __dict__(self):
        result = {
            'name': self.name,
            'display_name': self.display_name,
            'type': self.type,
            'image': self.image.__dict__,
            'text': self.text.__dict__,
            'is_run_config': self.is_run_config,
            'show_in_ui': self.show_in_ui,
        }
        
        return result
~~~
  
  
    `
    return (
      <div style={{ padding: "20px", color: "white"}}>
        <Markdown
          children={markdownContent}
          components={{
            code(props) {
              const {children, className, node, ...rest} = props
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  style={oneDark}
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              )
            }
          }}
          >
        </Markdown>
      </div>
    );
  };