import type {NextPage} from "next"
import Head from "next/head"
import Link from "next/link"

const Home: NextPage = () => {
    return <>
        <Head>
            <title>Home</title>
            <meta name="description" content="Home"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main>
            <h1>Home</h1>
            <Link href="/hello">hello</Link>
        </main>
    </>
}

export default Home
