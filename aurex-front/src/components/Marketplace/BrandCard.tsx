import React from "react";
import Button from "../../components/ui/Button";

interface BrandCardProps {
  name: string;
  logo: string;
}

const BrandCard: React.FC<BrandCardProps> = ({ name, logo }) => {
  return (
    <div className="flex flex-col items-center mx-2 p-8 pb-0 rounded-[20px] shadow-md bg-primary overflow-hidden">
      <div className="max-w-[500px] flex">
        <img src={logo} alt={name} className="w-full rounded-[15px]" />
      </div>
      <Button
        type="secondary"
        className="relative bottom-8 w-full p-4 text-xl font-bold shadow-xl"
        onClick={() => {}}
      >
        Ver productos
      </Button>
    </div>
  );
};

export default BrandCard;
