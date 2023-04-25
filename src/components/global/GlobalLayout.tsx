import type { FunctionComponent } from "react";
import type { Offcanvas } from "bootstrap";

import Bottom from "@components/chats/Bottom";
import BottomWrapper from "@components/chats/BottomWrapper";
import BottomWrapperMd from "@components/chats/BottomWrapperMd";

import { OffcanvasContext } from "src/utils/contexts";
import { useRef } from "react";

interface GlobalLayoutProps {
    children: JSX.Element | JSX.Element[];
}

const GlobalLayout: FunctionComponent<GlobalLayoutProps> = ({ children }) => {
    const bottomOffcanvasRef = useRef<Offcanvas | null>(null);

    const setBottomOffcanvas = (offcanvas: Offcanvas) => {
        bottomOffcanvasRef.current = offcanvas;
    }

    return(
        <OffcanvasContext.Provider value={bottomOffcanvasRef}>
            {children}
            {/* From xs to sm */}
            <BottomWrapper>
                <Bottom />
            </BottomWrapper>
            {/*  */}
            {/* From md to xxl */}
            <BottomWrapperMd setBottomOffcanvas={setBottomOffcanvas}>
                <Bottom />
            </BottomWrapperMd>
            {/*  */}
        </OffcanvasContext.Provider>
    )
}

export default GlobalLayout;