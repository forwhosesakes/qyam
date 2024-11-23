import React from "react";
import partenersImg from "~/assets/images/parteners.png";
import TitleBlock from "~/components/ui/title-block";
import glossary from "../glossary";
import GradientEllipse from "~/components/ui/gradient-ellipse";

const Partners = () => {
  return (
    <section id="parterns" className="relative min-h-[40vh]">
      <div className=" blur-[180px] inset-0 absolute">
        <GradientEllipse
          bgColor={"bg-[#B8ECFF]/70"}
          className={" top-1/4 -right-96"}
        />
      </div>

      <TitleBlock className="md:m-24 m-6" text={glossary.partners.title} />

      <img className="mx-auto" src={partenersImg} />
    </section>
  );
};

export default Partners;
