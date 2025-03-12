import React, { useState, useEffect } from 'react'
import { FcGoogle } from "react-icons/fc";
import { Button } from '@mui/material';
import { 
    gcloudIsLoggedIn,
    gcloudLogin
 } from '../../api/gcloud';

export const GCloudAuthButton = ({
    field,
    blockData,
    onDataChange
}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const isLoggedIn = async () => {
            const response = await gcloudIsLoggedIn();
            setIsLoggedIn(response['is_logged_in'])
        }
        isLoggedIn();
    }, []);

    const handleSignInWithGoogle = async () => {
        const response = await gcloudLogin();
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
            <Button
                variant="outlined"
                startIcon={<FcGoogle />}
                sx={{ mt: 1, mb: 2 }}
                onClick={handleSignInWithGoogle}
            >
                Sign in with Google
            </Button>
        )}
    </>
  )
}