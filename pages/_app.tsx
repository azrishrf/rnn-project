// pages/_app.tsx
import { AppProps } from "next/app";
import "../styles/globals.css"; // Import global CSS

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
