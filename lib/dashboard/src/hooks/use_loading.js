import { useState } from "react";

export const useLoadingStateHook = () => {
    const [loading, setLoading] = useState({
        loading: false,
        message: 'Loading...'
    });
    return {
        loading,
        setLoading
    }
}