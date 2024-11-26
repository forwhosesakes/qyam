import React, { useEffect } from "react";
import partenersImg from "~/assets/images/parteners.png";
import TitleBlock from "~/components/ui/title-block";
import glossary from "../glossary";
import GradientEllipse from "~/components/ui/gradient-ellipse";
import Partner1 from "~/assets/images/partners/partner1.png"
import Partner2 from "~/assets/images/partners/partner2.png"
import Partner3 from "~/assets/images/partners/partner3.png"
import Partner4 from "~/assets/images/partners/partner4.png"
import Partner5 from "~/assets/images/partners/partner5.png"
import Partner6 from "~/assets/images/partners/partner6.png"
import {infiniteScroller} from "~/lib/animation"

const Partners = () => {
  useEffect(()=>{
    infiniteScroller()
  })
  return (
    <section id="parterns" className="relative min-h-[40vh]">
      <div className=" blur-[180px] inset-0 absolute">
        <GradientEllipse
          bgColor={"bg-[#B8ECFF]/70"}
          className={" top-1/4 -right-96"}
        />
      </div>

      <TitleBlock className="md:m-24 m-6" text={glossary.partners.title} />

<div className="flex w-full justify-center">

      <div className="scroller">
        <div className="scroller__inner">

              <img src={Partner1} alt="" />
              <img src={Partner2} alt="" />
              <img src={Partner3} alt="" />
              <img src={Partner4} alt="" />
              <img src={Partner5} alt="" />
              <img src={Partner6} alt="" />

              

        </div>
      </div>
</div>

    </section>
  );
};

export default Partners;
