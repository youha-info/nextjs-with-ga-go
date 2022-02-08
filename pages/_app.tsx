import "../styles/globals.css"
import type {AppProps} from "next/app"
import Script from "next/script"
import {useRouter} from "next/router"
import {useEffect} from "react"
import Head from "next/head"

const GOOGLE_OPTIMIZE = "OPT-TFC4P8R"
const GOOGLE_ANALYTICS = "UA-199830780-2"

function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter()
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            // @ts-ignore
            window.gtag("config", GOOGLE_ANALYTICS, {page_path: url})
        }
        router.events.on("routeChangeComplete", handleRouteChange)
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange)
        }
    }, [router.events])

    return <>
        <Head>
            <title>nextjs-with-ga-go</title>
            <style dangerouslySetInnerHTML={{
                __html: ".async-hide{opacity: 0 !important}",
            }}/>
            <script dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GOOGLE_ANALYTICS}',{page_path:window.location.pathname});(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;})(window,document.documentElement,'async-hide','dataLayer',10000,{'${GOOGLE_OPTIMIZE}':true});`,
            }}/>
        </Head>
        <Script src={`https://www.googleoptimize.com/optimize.js?id=${GOOGLE_OPTIMIZE}`}/>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS}`}/>
        <Component {...pageProps} />
    </>
}

export default MyApp
