import NavComp from './components/NavComp';
import HiPage from './components/HiPage';
import Overview from './components/Overview';
import MarketMovers from './components/MarketMovers';
import CryptoTable from './components/CryptoTable';
import Footer from './components/Footer';
export default function Home() {
  return (
    <>
      {/* <NavComp></NavComp> */}
      <HiPage></HiPage>
      <Overview></Overview>
      <MarketMovers></MarketMovers>
      <CryptoTable></CryptoTable>
      <Footer></Footer>
    </>
  );
}
