import Button from "../ui/Button";
import Title from "./Title";

const Newsletter = () => {
  return (
    <section className="py-8 bg-primary">
      <div className="flex justify-between mx-auto max-w-[1200px]">
        <Title
          className="grow"
          text="Recibí nuestras ofertas"
          type="secondary"
        />
        <div className="grow flex gap-4 my-auto w-full h-min">
          <input
            type="email"
            placeholder="Ingresa tu email"
            className="flex-1 py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="secondary" onClick={() => {}}>
            Suscribirme
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
