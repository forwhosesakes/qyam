import GradientEllipse from "~/components/ui/gradient-ellipse";
import RectBlurry from "~/assets/images/rect-hero.png";
import Logo from "~/assets/images/logo.svg";
import WomenHand from "~/assets/images/womans-hand.png";
import HeroFlower from "~/assets/images/hero-flower.png";
import ColoredDrop from "~/components/ui/colored-drop";
import DropsGroup from "~/assets/images/drops-group.png";
import glossary from "../glossary";
import { Icon } from "~/components/icon";

const Hero = () => {
  return (
    <section
      id="hero"
      className=" flex lg:flex-row flex-col justify-between items-center w-full h-screen pt-48"
    >
      <img className="absolute right-1/3 top-24" src={RectBlurry} />
      <img className="absolute bottom-20 z-0" src={DropsGroup} />
      <div className="blur-[180px] inset-0 absolute">
        <div>
          <GradientEllipse
            bgColor={"bg-[rgb(139,197,63)]/50"}
            className={" md:top-24 md:right-24"}
          />

          <GradientEllipse
            bgColor={"bg-[#B8ECFF]"}
            className={"top-56  right-12"}
          />
          <GradientEllipse
            bgColor={"bg-[#B8ECFF]"}
            className={"top-4  left-12"}
          />
          <GradientEllipse
            bgColor={"bg-[rgb(3,102,15)]/50"}
            className={" md:top-56 md:bottom-auto bottom-12 left-12"}
          />
        </div>
      </div>

      <div className="h-3/4 lg:w-2/5 w-4/5 flex flex-col md:mr-32 gap-y-8  z-10">
        <img src={Logo} width={"180px"} height={"160px"} />
        <h1 className="text-primary">{glossary.hero.title}</h1>

        <div className="flex gap-x-4 ">
          <button className="text-center  bg-primary text-white border border-tertiary px-7 md:py-4 py-2 rounded-lg md:text-lg text-sm hover:opacity-80 transition-opacity">
            {glossary.hero.join}
          </button>
          <button className="text-center shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05) bg-white  text-primary border border-[#D0D5DD] px-7 md:py-4 py-2 rounded-lg md:text-lg text-sm hover:opacity-60 transition-opacity">
            {glossary.hero.profile}{" "}
            <Icon name="play" size="lg" className="mr-2" />
          </button>
        </div>
      </div>

      <div className="relative  h-3/4 lg:w-1/2 w-full  ">
        <img className={"absolute  left-0 z-40"} src={WomenHand} />
        <img
          className={
            "absolute mix-blend-color-dodge animate-spin-slow z-30 left-44 -top-8 "
          }
          width={"396px"}
          height={"396px"}
          src={HeroFlower}
        />
        <ColoredDrop
          className={"absolute md:block hidden left-12  z-20"}
          color={"#8BC53F"}
        />
        <ColoredDrop
          className={"absolute md:block  left-56 hidden z-10"}
          color={"#0D3151"}
        />
      </div>
    </section>
  );
};

export default Hero;
