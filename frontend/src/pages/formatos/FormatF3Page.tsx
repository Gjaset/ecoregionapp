import { FormatF3 } from '../../components/formatos/FormatF3';
import { Navbar } from '../../components/comunes/Navbar';
import { Footer } from '../../components/comunes/Footer';

export const FormatF3Page: React.FC = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="formato-page">
        <FormatF3 />
      </main>
      <Footer />
    </div>
  );
};

export default FormatF3Page;