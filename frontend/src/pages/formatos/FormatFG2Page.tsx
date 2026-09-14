import { FormatFG2 } from '../../components/formatos/FormatFG2';
import { Navbar } from '../../components/comunes/Navbar';
import { Footer } from '../../components/comunes/Footer';

export const FormatFG2Page: React.FC = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="formato-page">
        <FormatFG2 />
      </main>
      <Footer />
    </div>
  );
};

export default FormatFG2Page;