import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return(
        <Html lang="en" translate="no">
            <Head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="shortcut icon" href="/icons/icon_2.png" type="image/png" />
                <meta name="theme-color" content="#771F98" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}