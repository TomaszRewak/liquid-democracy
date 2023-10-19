import { createContext, useCallback, useContext, useState } from "react"

const VisibilityContext = createContext();

export const VisibilityProvider = ({ children }) => {
    const [showSensitiveData, setShowSensitiveData] = useState(true);

    const toggleShowSensitiveData = useCallback(() => {
        setShowSensitiveData(!showSensitiveData);
    }, [showSensitiveData]);

    return (
        <VisibilityContext.Provider value={{showSensitiveData, toggleShowSensitiveData}}>
            {children}
        </VisibilityContext.Provider>
    );
}

export function useShowSensitiveData() {
    return useContext(VisibilityContext).showSensitiveData;
}

export function useToggleShowSensitiveData() {
    return useContext(VisibilityContext).toggleShowSensitiveData;
}