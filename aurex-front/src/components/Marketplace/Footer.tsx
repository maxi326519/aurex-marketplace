import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="text-white bg-primary-900">
      <div className="mx-auto px-4 py-8 max-w-[1200px]">
        <div className="flex flex-col md:flex-row gap-8 justify-between">
          {/* Column 1 */}
          <div>
            <h3 className="font-bold mb-4">Compra Online</h3>
            <ul className="space-y-2">
              <li>Registrate</li>
              <li>Nuevos locales</li>
              <li>Medios de pago</li>
              <li>Promociones</li>
              <li>Garantía de precios</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold mb-4">Eventos</h3>
            <ul className="space-y-2">
              <li>Regalos día del padre</li>
              <li>Regalos día de la madre</li>
              <li>Regalos día de la niñez</li>
              <li>Ofertas Black Friday</li>
              <li>Ofertas de Hot Sale</li>
              <li>Ofertas de Cyber Monday</li>
              <li>Regalos de Navidad</li>
              <li>Ofertas en electrodomésticos</li>
              <li>Outlet en electrodomésticos</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>Todos los productos</li>
              <li>Notebooks</li>
              <li>Drones</li>
              <li>Cámaras de Seguridad</li>
              <li>Aspiradoras Robot</li>
              <li>Impresoras</li>
              <li>Celulares</li>
              <li>Aire Acondicionado</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-bold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>Trabajá con Nosotros</li>
              <li>Quiénes Somos</li>
              <li>Términos y Condiciones</li>
              <li>Políticas de Garantía</li>
              <li>Políticas de Privacidad</li>
              <li>Noticias</li>
            </ul>
          </div>

          {/* Column 5 - Extra */}
          <div className="flex flex-col gap-6 max-w-[200px]">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold">Seguinos en</h3>
              <div className="flex mt-2 gap-3">
                <Facebook className="w-5 h-5 cursor-pointer hover:text-gray-300" />
                <Instagram className="w-5 h-5 cursor-pointer hover:text-gray-300" />
                <Twitter className="w-5 h-5 cursor-pointer hover:text-gray-300" />
                <Youtube className="w-5 h-5 cursor-pointer hover:text-gray-300" />
                <Linkedin className="w-5 h-5 cursor-pointer hover:text-gray-300" />
              </div>
            </div>

            <div className="mb-4 md:mb-0">
              <h3 className="font-bold">Medios de pago</h3>
              <div className="grid grid-cols-2 mt-2 gap-1">
                <span>Cencosud</span>
                <span>MasterCard</span>
                <span>Visa</span>
                <span>Diners Club</span>
                <span>American Express</span>
              </div>
            </div>

            <div className="text-start">
              <p>Atención al cliente:</p>
              <p>0800-555-AUREX</p>
              <p>0800-999-AUREX</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 border-t border-gray-600">
          <p className="text-sm mt-2">
            © 2023 Aurex - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
