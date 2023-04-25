import style from "@styles/chats/chat/BottomIcons.module.scss";

import Icon from "@components/global/Icon";
import CustomModal from "@components/global/CustomModal";
import PurpleButton from "@components/global/PurpleButton";
import Portal from "@components/global/Portal";
import VoiceRecorder from "./VoiceRecorder";

import { useTypedDispatch, useTypedSelector } from "src/utils/hooks";
import { useState, useRef } from "react";
import { formToJSON } from "axios";
import { BlobMaxSizes } from "src/utils/enums";
import { postMessages } from "src/redux/chatData";
import { getChatsId } from "src/utils/functions";

import type { ChatModal, SendImage } from "src/types/chat";
import type { FormEventHandler } from "react";
import type { Modal } from "bootstrap";

const modalInitialState: ChatModal = {
    type: "image",
    title: "...",
    buttonContent: "...",
    body: <span />
}

export default function BottomIcons() {
    const [ modal, setModal ] = useState<ChatModal>(modalInitialState);
    const userData = useTypedSelector<"userData">(state => state.userData);
    const dispatch = useTypedDispatch();
    const modalRef = useRef<Modal | null>(null);

    const cameraHandler = () => {
        const bootstrapModal = modalRef.current;

        if ( bootstrapModal ) {
            setModal({
                type: "image",
                title: "Choose your image",
                buttonContent: "Send image",
                body: (
                    <input
                        type="file"
                        className="form-control"
                        name="chat_image"
                        id="chat_image"
                        placeholder="Choose image"
                        aria-describedby="chat_image"
                    />
                )
            });
            
            bootstrapModal.show();
        }
    }

    const fileHandler = () => {
        const bootstrapModal = modalRef.current;

        if ( bootstrapModal ) {
            setModal({
                type: "file",
                title: "Choose your file",
                buttonContent: "Send file",
                body: (
                    <input
                        type="file"
                        className="form-control"
                        name="chat_file"
                        id="chat_file"
                        placeholder="Choose file"
                        aria-describedby="chat_file"
                    />
                )
            });
            
            bootstrapModal.show();
        }
    }

    const audioHanler = () => {
        const bootstrapModal = modalRef.current;

        if ( bootstrapModal ) {
            setModal({
                type: "audio",
                title: "Record audio",
                buttonContent: "Send audio",
                body: <VoiceRecorder setModal={setModal} />
            });
            
            bootstrapModal.show();
        }
    }

    const modalHandler: FormEventHandler<HTMLFormElement> = async event => {
        const form = event.currentTarget;

        let blob: Blob | null = null;
        
        if ( modal.type === "image" || modal.type === "file" ) {
            const jsonForm = formToJSON(form) as SendImage;
            const file = modal.type === "image" ? "chat_image" : "chat_file";

            if ( jsonForm[file].size <= BlobMaxSizes.LONGBLOB ) {
                blob = jsonForm[file];
            }
        } else if ( modal.type === "audio" && modal.data && modal.data.size <= BlobMaxSizes.LONGBLOB ) {
            blob = modal.data;
        }

        if ( blob ) {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(blob);

            fileReader.addEventListener("load", async () => {
                const chatId = getChatsId();

                if ( chatId && userData?.id ) {
                    const thunkAction = await dispatch(
                        postMessages({
                            idOfChat: chatId,
                            idOfSender: userData.id,
                            content: fileReader.result as string,
                            type: modal.type
                        })
                    );

                    if ( thunkAction.meta.requestStatus === "fulfilled" ) {
                        const bootstrapModal = modalRef.current;
                        bootstrapModal?.hide();
                    }
                }
            });
        }
    }

    return(
        <>
            <div className="d-flex gap-3 gap-md-4 chat_bottom_icons">
                <Icon className={`bi-camera d-flex ${style.chat_bottom_icons_icon}`} onClick={cameraHandler} />
                <Icon className={`bi-three-dots d-flex ${style.chat_bottom_icons_icon}`} onClick={fileHandler} />
                <Icon className={`bi-mic d-flex ${style.chat_bottom_icons_icon}`} onClick={audioHanler} />
            </div>
            <Portal>
                <CustomModal
                    ref={modalRef}
                    title={modal.title}
                    footer={
                        <PurpleButton type="submit" className="px-5">
                            {modal.buttonContent}
                        </PurpleButton>
                    }
                    onSubmit={modalHandler}
                    cleaner={() => setModal(modalInitialState)}
                >
                    {modal.body}
                </CustomModal>
            </Portal>
        </>
    )
}