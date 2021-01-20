import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import dotenv from 'dotenv'
dotenv.config()

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } catch(error){
      console.error(error)
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta property="og:site_name" content="구름이" />
          <meta name="description" content="하루에 한 번은 하늘을 올려다보세요, 구름 아카이빙, 구름이, 구름지도" />
          <meta property="og:url" content="https://kurum2.com" />
          <meta property="og:title" content="구름 아카이빙, 구름이" />
          <meta property="og:description" content="하루에 한 번은 하늘을 올려다보세요, 구름 아카이빙, 구름이, 구름지도" />
        </Head>
        
        
        <body>
          <Main />
          
          <NextScript />
          <script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />
          <script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>
          <script>
            Kakao.init(`d1d1666eac47faa6c1c3ec72b9114b8f`);
            console.log(Kakao.isInitialized());
          </script>
          </body>
      </Html>
    );
  }
}
