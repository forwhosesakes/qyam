import React from "react";
import partenersImg from "~/assets/images/parteners.png";
import TitleBlock from "~/components/ui/title-block";
import glossary from "../../../lib/glossary";
import GradientEllipse from "~/components/ui/gradient-ellipse";
import Partner1 from "~/assets/images/partner1.png"
import Partner2 from "~/assets/images/partner2.png"
import Partner3 from "~/assets/images/partner3.png"
import Partner4 from "~/assets/images/partner4.png"
import Partner5 from "~/assets/images/partner5.png"

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


     <div className="flex flex-wrap md:gap-24 gap-16 mx-auto justify-center">
<img src={Partner1} className="w-20  h-auto md:w-auto" alt={"Partner1"}/>
<img src={Partner2} className="w-20  h-auto md:w-auto" alt={"Partner1"}/>
<img src={Partner3}  className="w-20 h-auto md:w-auto" alt={"Partner1"}/>
<img src={Partner4} className="w-20  h-auto md:w-auto" alt={"Partner1"}/>
<img src={Partner5}  className="w-20  h-auto md:w-auto" alt={"Partner1"}/>

     </div>
    </section>
  );
};

export default Partners;
