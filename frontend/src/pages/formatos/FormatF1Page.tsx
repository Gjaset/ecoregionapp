import { FormatF1 } from '../../components/formatos/FormatF1';
import { Navbar } from '../../components/comunes/Navbar';
import { Footer } from '../../components/comunes/Footer';

export const FormatF1Page: React.FC = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="formato-page">
        <FormatF1 />
      </main>
      <Footer />
    </div>
  );
};

export default FormatF1Page;