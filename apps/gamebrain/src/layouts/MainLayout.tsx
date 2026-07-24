import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

type MainLayoutProps = {
  children: React.ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />

      <div className="layout">
        <Sidebar />

        <main className="content">
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}

export default MainLayout;