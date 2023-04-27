import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        style={{
          backgroundColor: '#000',
          color: '#fff',
          fontSize: 32,
          margin: 'auto',
          maxWidth: 1200,
          padding: 16
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
