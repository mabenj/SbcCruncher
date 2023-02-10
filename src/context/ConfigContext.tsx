import { DEFAULT_CONFIG } from "@/constants";
import { ConfigState } from "@/types/ConfigState.interface";
import { range } from "@/utilities";
import React, { createContext, useContext, useState } from "react";

const ConfigContext = createContext<
    [ConfigState, React.Dispatch<React.SetStateAction<ConfigState>>]
>([DEFAULT_CONFIG, () => null]);

export function useConfig(){
    return useContext(ConfigContext)
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState(DEFAULT_CONFIG);

    return (
        <ConfigContext.Provider value={[config, setConfig]}>
            {children}
        </ConfigContext.Provider>
    );
}
