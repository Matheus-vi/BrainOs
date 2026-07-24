import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import StatusPanel from "./components/StatusPanel";
import Footer from "./components/Footer";

function App() {

  return (

    <div className="app">

      <Header />

      <main>

        <Dashboard />

        <StatusPanel />

      </main>

      <Footer />

    </div>

  );

}

export default App;