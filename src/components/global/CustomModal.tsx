import type { ForwardRefRenderFunction, FormEventHandler } from "react";
import type { Modal } from "bootstrap";

import Button from "./Button";

import { useRef, useEffect, useId, useImperativeHandle, forwardRef, useState } from "react";
import { useModal } from "src/utils/hooks";

interface CustomModalProps {
    title: string;
    children: JSX.Element | JSX.Element[];
    footer?: JSX.Element | JSX.Element[];
    onSubmit?: FormEventHandler<HTMLFormElement>;
    cleaner?: () => any;
}

const CustomModal: ForwardRefRenderFunction<Modal | null, CustomModalProps> =
({ title, children, footer, onSubmit, cleaner }, forwardedRef) =>
{
    const modalElementRef = useRef<HTMLFormElement>(null);
    const id = useId();
    const modal = useModal({ id });

    useImperativeHandle(forwardedRef, () => {
        return modal ?? {} as Modal;
    }, [ modal ]);

    useEffect(() => {
        const modalElement = modalElementRef.current as HTMLFormElement;

        function callCleaner() {
            if ( cleaner ) cleaner();
        }

        modalElement.addEventListener("hidden.bs.modal", callCleaner);

        return () => {
            modalElement.removeEventListener("hidden.bs.modal", callCleaner);
        }
    }, []);

    const defaultOnSubmit: FormEventHandler<HTMLFormElement> = event => {
        event.preventDefault();

        if ( onSubmit ) onSubmit(event);
    }

    return(
        <form ref={modalElementRef} id={id} className="modal fade" tabIndex={-1} role="dialog" aria-labelledby={id} aria-hidden="true" onSubmit={defaultOnSubmit}>
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalTitleId">{title}</h5>
                        <Button className="btn-close" data-bs-dismiss="modal" />
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer d-flex justify-content-center">
                        {footer}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default forwardRef(CustomModal);