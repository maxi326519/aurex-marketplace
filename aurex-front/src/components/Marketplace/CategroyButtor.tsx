import React from "react";

interface CategoryButtonProps {
  name: string;
  icon: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ name, icon }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 p-2 rounded-full border-8 border-primary flex items-center justify-center mb-2 overflow-x-auto">
        <img src={icon} alt={name} className="w-full h-full object-contain" />
      </div>
      <span className="text-sm text-center">{name}</span>
    </div>
  );
};

export default CategoryButton;
