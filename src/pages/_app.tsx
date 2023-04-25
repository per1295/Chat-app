import type { AppPropsWithLayout } from "src/types/global";

import { Poppins } from "next/font/google";
import { StrictMode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { IsBootstrapReadyContext } from "src/utils/contexts";
import store from "src/redux";
import axios from "axios";

import Title from "@components/global/Title";
import UseCookie from "@components/global/UseCookie";
import BeforeUnload from "@components/global/BeforeUnload";
import UserOnload from "@components/global/UserOnload";
import LoadingProgress from "@components/global/LoadingProgress";
import Alerts from "@components/global/Alerts";
import CookieAcception from "@components/global/CookieAcception";
import ConnectionStatus from "@components/global/ConnectionStatus";

import "../styles/index.scss";

axios.defaults.baseURL = "/api";

const poppins = Poppins({
    variable: "--poppins-font",
    subsets: ["latin"],
    weight: [
        "900",
        "800",
        "700",
        "600",
        "500",
        "400",
        "300",
        "200",
        "100"
    ]
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const [ isBootstrapReady, setIsBootstrapReady ] = useState(false);

    useEffect(() => {
        (async () => {
            if ( !globalThis.bootstrapPromise ) {
                globalThis.bootstrapPromise = import("bootstrap");
                globalThis.bootstrap = await bootstrapPromise;
                setIsBootstrapReady(true);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const registrations = await navigator.serviceWorker.getRegistrations();
            
            if ( !registrations.length ) {
                await navigator.serviceWorker.register("/serviceWorker.js", { scope: "/" });
            }
        })();
    }, []);

    const getLayout = Component.getLayout ?? (page => page);

    return (
        <StrictMode>
            <Provider store={store}>
                <Title />
                <UseCookie />
                <LoadingProgress />
                <Alerts />
                <BeforeUnload />
                <UserOnload />
                <CookieAcception />
                <ConnectionStatus />
                <IsBootstrapReadyContext.Provider value={isBootstrapReady}>
                    <main className={poppins.className}>
                        { getLayout(<Component {...pageProps} />) }
                    </main>
                </IsBootstrapReadyContext.Provider>
            </Provider>
        </StrictMode>
    )
}