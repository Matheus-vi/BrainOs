import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import StatusPanel from "./components/StatusPanel";
import TranslationPanel from "./components/TranslationPanel";
import Footer from "./components/Footer";

function App() {

  return (

    <div className="app">

      <Header />

      <main>

        <Dashboard />

        <StatusPanel />

        <TranslationPanel />

      </main>

      <Footer />

    </div>

  );

}

export default App;
