import { Navbar } from '../components/comunes/Navbar';
import { Footer } from '../components/comunes/Footer';
import FormularioFUN from '../components/formulario/formularioFUN';

const FormularioFUNPage: React.FC = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <div className="form-shell" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
          <FormularioFUN />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FormularioFUNPage;