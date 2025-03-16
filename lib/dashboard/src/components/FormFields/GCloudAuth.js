import React, { useState, useEffect } from 'react'
import { FcGoogle } from "react-icons/fc";
import { Button } from '@mui/material';
import { MenuItem, Select, InputLabel, FormControl, Chip } from "@mui/material";

import { 
    gcloudIsLoggedIn,
    gcloudLogin
 } from '../../api/gcloud';

export const GCloudAuthButton = ({
    field,
    blockData,
    onDataChange
}) => {
    const service = field.metadata.service;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scopes, setScopes] = useState(field.metadata.options);
    const [selectedScopes, setSelectedScopes] = useState(field.metadata.selected_options);

    const handleScopeChange = (selectedValues) => {
        field.metadata.selected_options = selectedValues;
    };

    useEffect(() => {
        const isLoggedIn = async () => {
            const response = await gcloudIsLoggedIn(selectedScopes, service);
            setIsLoggedIn(response['is_logged_in'])
        }
        isLoggedIn();
    }, []);

    const handleSignInWithGoogle = async () => {
        const response = await gcloudLogin(selectedScopes, service);
        if (response.redirect_uri) {
            const authWindow = window.open(response.redirect_uri, "_blank");

            // Listen for message from popup window
            const listener = (event) => {
                if (event.data.status === "success") {
                    setIsLoggedIn(event.data.is_logged_in);
                    window.removeEventListener("message", listener);
                }
            };

            window.addEventListener("message", listener);
        }
    }
  return (
    <>
        {isLoggedIn===true ? (
            <p>Logged in</p>
        ) : (
            <>
                <MultiSelect
                    scopes={scopes}
                    onChange={handleScopeChange}
                    selectedKeys={selectedScopes}
                    setSelectedKeys={setSelectedScopes}
                />
                <Button
                    variant="outlined"
                    startIcon={<FcGoogle />}
                    sx={{ mt: 1, mb: 2 }}
                    onClick={handleSignInWithGoogle}
                >
                    Sign in with Google
                </Button>
            </>
        )}
    </>
  )
}


const MultiSelect = ({
    scopes, 
    onChange, 
    selectedKeys, 
    setSelectedKeys
 }) => {
  
    const handleChange = (event) => {
      const newSelectedKeys = event.target.value;
      setSelectedKeys(newSelectedKeys);
  
      // Map selected keys to their corresponding values
      const selectedValues = newSelectedKeys.map((key) => {
        const scope = scopes.find((scope) => scope.value === key);
        return scope ? scope.value : key;
      });
  
      // Call the provided onChange callback with the selected values
      if (onChange) {
        onChange(selectedValues);
      }
    };
  
    return (
      <FormControl fullWidth>
        <InputLabel>Select Scopes</InputLabel>
        <Select
          multiple
          value={selectedKeys}
          onChange={handleChange}
          renderValue={(selected) => (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {selected.map((key) => (
                <Chip key={key} label={key} />
              ))}
            </div>
          )}
        >
          {scopes.map((scope, index) => (
            <MenuItem key={index} value={scope.value}>
              {scope.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };