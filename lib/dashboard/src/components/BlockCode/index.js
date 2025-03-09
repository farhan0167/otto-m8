
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { CodeEditor } from '../Pages/Lambdas/CodeEditor';
import { sha1 } from 'js-sha1';
import { useAuth } from '../../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import { Tabs, Tab, Box, TextField, Button, IconButton } from '@mui/material';
import { save_block_code, fetch_block_data } from '../../api/blocks';
import { checkHealth } from '../../utils/health_check';
import { useLoadingStateHook } from '../../hooks/use_loading';
import { ApiReferenceComponent } from './APIReference';

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: 'white',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
);


export const BlockCode = ({blockDataConfig, onDataChange, show, handleClose}) => {
    const originalCode = blockDataConfig.source_code;
    const [code, setCode] = useState(blockDataConfig.source_code || null);
    const [codeFileName, setCodeFileName] = useState('');
    const [selectedTab, setSelectedTab] = useState(0); // 0: Code Editor, 1: Placeholder

    // Confirmation related
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const handleShowConfirmModal = () => setShowConfirmModal(true);
    const handleCloseConfirmModal = (reset_code) => {
        if (reset_code) {
          setCode(originalCode);
        }
        setShowConfirmModal(false);
    }


    useEffect(() => {
      setCodeFileName(blockDataConfig.source_path.split('/').pop());
    }, [blockDataConfig.source_path]);

    const originalHash = blockDataConfig.source_hash;

    useEffect(() => {
      //Whenever there's a change in code triggered by Save Code,
      // prompt the user to confirm their changes.
        if (code){
          const codeHash = sha1(code);
          if (codeHash !== originalHash) {
              setShowConfirmModal(true);
          }
        }
    }, [code]);

    return (
      <Modal show={show} onHide={handleClose} size="xl" style={{height: '90vh'}}>
        
        <Modal.Body style={{backgroundColor: '#011627'}}>
        <StyledTabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <StyledTab label={codeFileName} />
          <StyledTab label="Guide & API Reference" />
        </StyledTabs>

        {selectedTab === 0 ? (
          <CodeEditor code={code} setCode={setCode} />
        ) : (
          <ApiReferenceComponent />
        )}
          <SaveCodeConfirmation
            showConfirmModal={showConfirmModal}
            handleCloseConfirmModal={handleCloseConfirmModal}
            onDataChange={onDataChange}
            blockDataConfig={blockDataConfig}
            code={code}
          />
        </Modal.Body>
      </Modal>
    )
  }

function createNewFilePath(fullPath, file_name) {
    const parts = fullPath.split("/");
    const index = parts.indexOf("implementations");
    // Since "implementations" is guaranteed to exist, no need to check index !== -1
    const filePath = parts.slice(0, index + 1).join("/");
    return `${filePath}/custom/blocks/${file_name}`;
}

export const SaveCodeConfirmation = ({
  showConfirmModal,
  handleCloseConfirmModal,
  onDataChange,
  blockDataConfig,
  code
}) => {

  const { token } = useAuth();
  const current_file_name = blockDataConfig.source_path.split('/').pop();
  const [finalFileName, setFinalFileName] = useState(current_file_name);
  const {loading, setLoading} = useLoadingStateHook();

  const handleConfirmSave = async () => {
    setLoading({loading: true, message: 'Saving...'});
    const codeHash = sha1(code);
    const newFilePath = createNewFilePath(blockDataConfig.source_path, finalFileName);
    const core_block_type = blockDataConfig.core_block_type
    const reference_core_block_type = blockDataConfig.reference_core_block_type

    const response = await save_block_code(
      token, 
      code, 
      newFilePath, 
      finalFileName, 
      core_block_type, 
      reference_core_block_type
    );
    const new_core_block_type = response.new_core_block_type
    await checkHealth("http://localhost:8000", setLoading, 20, true);
    onDataChange('core_block_type', new_core_block_type);
    onDataChange('source_path', newFilePath);
    onDataChange('source_code', code);
    onDataChange('source_hash', codeHash);
    onDataChange('process_type', 'custom');
    try{
      const new_block_data = await fetch_block_data(new_core_block_type, 'custom');
      onDataChange('sidebar_fields', new_block_data.data.sidebar_fields);
      onDataChange('block_ui_fields', new_block_data.data.block_ui_fields);
    } catch (error) {
      console.error('Error fetching block data:', error.message);
      return
    }
    // add all the new fields to the block data
    handleCloseConfirmModal(false);
  }
  
  return (
    <Modal show={showConfirmModal} onHide={() => handleCloseConfirmModal(true)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Changes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to save changes to this code?</p>
        <div>
          <TextField 
            id="standard-basic" 
            label="File Name" 
            variant="standard" 
            value={finalFileName}
            onChange={(e) => setFinalFileName(e.target.value)}
            sx={{width: '100%'}}
            />
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
          <Button 
          onClick={handleConfirmSave} 
          loading={loading.loading} 
          loadingPosition="start"
          >Save</Button>
        </div>
          
      </Modal.Body>
    </Modal>
  )
}
