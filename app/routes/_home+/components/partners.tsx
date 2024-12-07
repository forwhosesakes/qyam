import React, { useEffect } from "react";
import TitleBlock from "~/components/ui/title-block";
import glossary from "../../../lib/glossary";
import GradientEllipse from "~/components/ui/gradient-ellipse";
import Partner1 from "~/assets/images/partners/partner1.png";
import Partner2 from "~/assets/images/partners/partner2.png";
import Partner3 from "~/assets/images/partners/partner3.png";
import Partner4 from "~/assets/images/partners/partner4.png";
import Partner5 from "~/assets/images/partners/partner5.png";
import Partner6 from "~/assets/images/partners/partner6.png";
import AllPartners from "~/assets/images/allPartners.png";
import ColoredDrop from "~/assets/images/coloreddrop.png";

import { infiniteScroller } from "~/lib/animation";

const Partners = () => {
  useEffect(() => {
    infiniteScroller();
  });
  return (
    <section id="parterns" className="relative md:mt-52 lg:mt-0 min-h-[40vh]">
      <div className=" blur-[180px] inset-0 absolute">
        <GradientEllipse
          bgColor={"bg-[#B8ECFF]/70"}
          className={" top-1/4 -right-96"}
        />
      </div>

      <TitleBlock className="md:m-24 m-6" text={glossary.partners.title} />

      <div className="flex flex-wrap gap-16 w-full justify-center sm:gap-4">
        <div className="flex flex-col w-4/12 gap-2 min-w-60 mr-6">
          <div className="relative">
            <img src={ColoredDrop} className="absolute w-12 -right-5" alt="" />
            <p className="text-primary mr-10 text-2xl">الشريك الراعي</p>
          </div>
          <div className="flex max-h-28   justify-center">
            <img src={Partner1}  className="w-3/12" alt="" />
            <img src={Partner2} className="w-8/12" alt="" />
          </div>
        </div>

        <div className="flex flex-col w-3/12 mr-6 min-w-60  gap-2 ">
          <div className="relative">
            <img src={ColoredDrop} className="absolute w-12  -right-5" alt="" />
            <p className="text-primary mr-10 text-2xl">الشريك العلمي</p>
          </div>
          <div className="flex max-h-32 gap-2 justify-center ">
          <img src={Partner3} className="w-8/12  max-h-28" alt="" />
          <img src={Partner4} className="w-3/12" alt="" />
          </div>
        </div>

        <div className="flex flex-col w-4/12 mr-6 min-w-60  gap-2">
          <div className="relative">
            <img src={ColoredDrop} className="absolute w-12 sm:right-6 -right-5" alt="" />
            <p className="text-primary sm:mr-20 mr-10 text-2xl">شركاء التنفيذ</p>
          </div>
          <div className="flex max-h-28 justify-center ">
          <img src={Partner5} className="w-7/12" alt="" />
          <img src={Partner6} className="w-3/12" alt="" />
          </div>
        </div>
        {/* <div className="flex gap-2 w-3/12 ">
          <img src={Partner3} alt="" />
          <img src={Partner4} alt="" />
        </div>
        <div className="flex gap-2 w-3/12 ">
          <img src={Partner5} alt="" />
          <img src={Partner6} alt="" />
        </div> */}
      </div>

      {/* <div className="scroller">
        <div className="scroller__inner">

              <img src={Partner1} alt="" />
              <img src={Partner2} alt="" />
              <img src={Partner3} alt="" />
              <img src={Partner4} alt="" />
              <img src={Partner5} alt="" />
              <img src={Partner6} alt="" />

              

        </div>
      </div> */}
      {/* <img src={AllPartners} alt="" /> */}
    </section>
  );
};

export default Partners;
