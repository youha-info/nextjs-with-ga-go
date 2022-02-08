import type {NextPage} from "next"
import Head from "next/head"
import Link from "next/link"

const Hello: NextPage = () => {
    return <>
        <Head>
            <title>Hello</title>
            <meta name="description" content="Hello"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main>
            <h1>Hello</h1>
            <Link href="/">home</Link>
        </main>
    </>
}

export default Hello
