import { useMemo } from "react";

export default function useApiUrl(endpoint) {
    // process.env.REACT_APP_API_URL;
    const url = 'http://localhost:3001/';

    return useMemo(() => {
        return `${url}${endpoint}`;
    }, [endpoint]);
}