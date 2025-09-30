import { ReactNode } from "react";

import Title from "./Title";

interface HorizontalScrollProps {
  title: string;
  children: ReactNode;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  title,
  children,
}) => {
  return (
    <section className="w-full max-w-[1200px] m-auto my-8">
      <div className="container mx-auto px-4">
        <Title text={title} className="mb-10" />
        <div className="relative">
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalScroll;
