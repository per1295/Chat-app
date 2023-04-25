import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { capitalize } from "src/utils/functions";

export default function Title() {
    const [ title, setTitle ] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if ( router.isReady ) {
            const title = location.pathname
            .split("/")
            .filter(path => path)
            .map(path => capitalize(path))
            .join("-");

            setTitle(title);
        }
    }, [ router.pathname, router.isReady ]);

    return(
        <Head>
            <title>
                { title ?? "Waiting..." }
            </title>
        </Head>
    )
}