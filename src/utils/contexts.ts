import { createContext } from "react";

import type { IOffcanvasContext, IChatDataContext, IHeadingInputContext } from "src/types/contexts";

export const IsBootstrapReadyContext = createContext(false);

export const OffcanvasContext = createContext<IOffcanvasContext>(null);

export const ChatDataContext = createContext<IChatDataContext>(null);

export const HeadingInputContext = createContext<IHeadingInputContext>({} as IHeadingInputContext);