import { DEFAULT_CONFIG } from "@/common/constants";
import { SolverConfig } from "@/types/solver-config.interface";
import React, { createContext, useContext, useState } from "react";

const ConfigContext = createContext<
    [SolverConfig, React.Dispatch<React.SetStateAction<SolverConfig>>]
>([DEFAULT_CONFIG, () => null]);

export function useConfig() {
    return useContext(ConfigContext);
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState(DEFAULT_CONFIG);

    return (
        <ConfigContext.Provider value={[config, setConfig]}>
            {children}
        </ConfigContext.Provider>
    );
}
