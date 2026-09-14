import { FormatFG1 } from '../../components/formatos/FormatFG1';
import { Navbar } from '../../components/comunes/Navbar';
import { Footer } from '../../components/comunes/Footer';

export const FormatFG1Page: React.FC = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="formato-page">
        <FormatFG1 />
      </main>
      <Footer />
    </div>
  );
};

export default FormatFG1Page;