import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

import type { FunctionComponent } from "react";

interface PortalProps {
    children: JSX.Element | JSX.Element[] | null;
    selector?: string;
}

const Portal: FunctionComponent<PortalProps> = ({ children, selector }) => {
    const [ htmlElement, setHTMLElement ] = useState<HTMLElement | null>(null);

    useEffect(() => {
        let element: HTMLElement;

        if ( selector ) {
            element = document.querySelector(selector) ?? document.body;
        } else {
            element = document.body;
        }

        setHTMLElement(element);
    }, []);

    return htmlElement ? createPortal(children, htmlElement) : null;
}

export default Portal;