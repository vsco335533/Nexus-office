// pages/_app.js
import '../styles/globals.css';
import { AppStateProvider } from '../context/AppState';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <AppStateProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppStateProvider>
  );
}

export default MyApp;