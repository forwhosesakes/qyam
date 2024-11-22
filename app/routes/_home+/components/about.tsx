import ColoredDrop from "~/components/ui/colored-drop";
import CurvedTriangle from "~/components/ui/curved-triangle";
import { Icon } from "~/components/icon";

const About = () => {
  return (
    <section id="about" className="relative h-[60vh] px-12 my-20 bg-[#F0F4F8] flex justify-center items-center">
      <div className="absolute -bottom-[60px] left-48 ">
        <CurvedTriangle color="#F0F4F8">
          <Icon size="sm" name="below-arrow" className="absolute top-10 left-[45%]" />
          <Icon size="sm"  name="below-arrow" className="absolute top-12 left-[45%]" />
        </CurvedTriangle>
      </div>

      <div className="text-right md:w-2/3 w-full md:px-12">
        <h3 className="font-bold mb-5">
          <span className="text-secondary">عن </span>
          <span className="text-primary">البرنامج</span>
        </h3>

        <p className="text-[#344054] leading-relaxed font-medium md:text-xl text-sm">
          برنامج "هندسة القيم" خطوة رائدة في هذا الاتجاه، حيث يسعى إلى إعداد
          مختصين وخبراء يمتلكون خلفيات نظرية واسعة حول القيم ويجيدون تطبيقها
          بمنهجيات عملية فعالة تؤثر في البيئات الشبابية والتربوية. بالشراكة
          العلمية مع بيت الخبرة المعتمد لدى جامعة الملك عبد العزيز (قيم)، يقدم
          البرنامج نموذجًا متكاملاً يجمع بين الجوانب النظرية والتطبيقية
          والتقويمية في مجال غرس القيم وتعزيزها، مما يسهم في بناء مجتمعات راسخة
          تقوم على مبادئ أصيلة
        </p>

        <div className="flex justify-end mt-12 gap-x-4">
          <button className="text-center text-xs md:text-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05) bg-white  text-primary border border-[#D0D5DD] px-5 py-2 rounded-lg hover:opacity-60 transition-opacity">
            المزيد
          </button>
          <button className="text-center text-xs md:text-lg  bg-primary text-white border border-tertiary px-5 py-2  rounded-lg  hover:opacity-80 transition-opacity">
            الانضمام للبرنامج{" "}
          </button>
        </div>
      </div>

      <div className="w-1/4  flex justify-center items-center h-full">
        <div className="relative  w-1/2 h-1/2">
          <ColoredDrop
            size="md"
            className={"absolute left-20  z-10"}
            color={"#0D3151"}
          />
          <ColoredDrop
            size="md"
            className={"absolute z-20"}
            color={"#8BC53F"}
          />
        </div>
      </div>
    </section>
  );
};

export default About;
