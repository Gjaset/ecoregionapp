import { FormatF2 } from '../../components/formatos/FormatF2';
import { Navbar } from '../../components/comunes/Navbar';
import { Footer } from '../../components/comunes/Footer';

export const FormatF2Page: React.FC = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="formato-page">
        <FormatF2 />
      </main>
      <Footer />
    </div>
  );
};

export default FormatF2Page;