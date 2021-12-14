
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'


function MyApp({ Component, pageProps }: AppProps) {


  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
        <meta name="description" content="Welcome to mainshop" />
        <meta name="theme-color" content="#8387F3" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/LogoW.png" />
      </Head>
      <Script src="/assets/js/index.js" ></Script>
    
          <Component {...pageProps} />
     
    </>

  )
}

export default MyApp
