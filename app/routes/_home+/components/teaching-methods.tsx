import TitleBlock from "~/components/ui/title-block";
import glossary from "../glossary";
import GradientEllipse from "~/components/ui/gradient-ellipse";
// Images
import TrainingWorkshopImg from "~/assets/images/teaching-methods/Training-workshops.png"
import EnrichmentReadingsImg from "~/assets/images/teaching-methods/Enrichment-readings.png"
import InstructionsAndGuidanceImg from "~/assets/images/teaching-methods/Instructions-and-guidance.png"
import ExpertInterviewsImg from "~/assets/images/teaching-methods/Expert-Interviews.png"
import ProjectsImg from "~/assets/images/teaching-methods/Projects.png";
import DistanceLearningImg from "~/assets/images/teaching-methods/Distance-learning.png"
import SelfEducation from "~/assets/images/teaching-methods/Self-education.png";

import FramedDrop from "~/components/ui/framed-drop";


const TeachingMethods = () => {

  const frames:{src:string,text:string}[] = [
    {src:TrainingWorkshopImg,text:glossary.teaching_methods.training_workshops},
    {src:EnrichmentReadingsImg,text:glossary.teaching_methods.enrichment_readings},
    {src:InstructionsAndGuidanceImg,text:glossary.teaching_methods.instructions_and_guidance},
    {src:ExpertInterviewsImg,text:glossary.teaching_methods.expert_intereviews},
    {src:ProjectsImg, text:glossary.teaching_methods.projects},
    {src:DistanceLearningImg, text:glossary.teaching_methods.distance_learning},
    {src:SelfEducation, text:glossary.teaching_methods.self_education}
  ]
  return (
    <section id="teaching-methods" className="relative min-h-screen flex flex-col px-12">
      <div className="blur-[180px] left-0">
        <GradientEllipse
          bgColor={"bg-[rgb(139,197,63)]/50"}
          className={" -top-1/2 -left-96"}
        />
      </div>
      <TitleBlock text={glossary.teaching_methods.title} />

      <div className="flex flex-wrap justify-center w-4/5 mx-auto mt-12">
       {
        frames.map((item)=>(
            <div key={item.src} className="flex flex-col w-fit  h-fit text-center ">
            <FramedDrop
              src={item.src}
            />
            <p className="font-medium text-2xl text-black ml-16">{item.text}</p>
          </div>
          ))
       }
       
      </div>
    </section>
  );
};

export default TeachingMethods;
