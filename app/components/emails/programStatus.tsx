import BaseEmail from "./baseEmail";
import { lazy } from "react";

const Text = lazy(async () => {
  return { default: (await import("@react-email/components")).Text };
});

const Button = lazy(async () => {
  return { default: (await import("@react-email/components")).Button };
});

const Img = lazy(async () => {
  return { default: (await import("@react-email/components")).Img };
});

const Container = lazy(async () => {
  return { default: (await import("@react-email/components")).Container };
});

export default function ProgramStatus({name,status}) {
  return (
    <BaseEmail preview={status === "accepted" ? "قبول في برنامج هندسة القيم" : "حالة الطلب"}>
      <Text className={`text-2xl text-center font-bold text-[#0D3151] mb-4 ${status === "accepted" ? "hidden" : ""}`}>
        بشأن طلب الالتحاق ببرنامج هندسة القيم
      </Text>


      <Text className="text-base text-center font-bold text-black mb-4">
        
      عزيزي/عزيزتي {name}،
      </Text>

{status === "denied" ? (
    <>
     <Text className="text-base text-center font-bold text-black mb-4">
      نشكرك على اهتمامك ببرنامج هندسة القيم وتقديم طلب الالتحاق بنا. لقد تلقينا عددًا كبيرًا من الطلبـــات المؤهــلــة، ممــا جــعــل عملية الاختيار صعبة للغاية.
      </Text>

      <Text className="text-base text-center font-bold text-black mb-4">
      بعد دراسة طلبك بعناية، قررنا في هذه المرحلة عدم قبولك في البرنامج. ندرك أن هذا القرار قد يكون مخيباً للآمال، ونود أن نعبر عن تقديرنا لاهتمامك ببرنامجنا.
      </Text>


      <Text className="text-base text-center font-bold text-black ">
      نحن نؤمن بإمكاناتك ونتمنى لك كل التوفيق في مسيرتك المهنية.
      </Text>

      <Text className="text-base text-center font-bold text-[#8BC53F] mb-4">
      مع خالص التحيات، برنامج هندسة القيم
      </Text>
    </>
):(
    <>
      <Text className="text-base text-center font-bold text-black ">
    
    يسعدنا جدًا إخبارك بقبولك في برنامج هندسة القيم. لقد أظهرت سجلك الأكاديمي وخبرتك السابقة اهتمامًا قويًا بهذا المجال، 
    </Text>

    <Text className="text-base text-center font-bold text-black ">
    ونحن على ثقة بأنك ستكون إضافة قيمة لبرنامجنا.
    </Text>

    <Text className="text-base text-center font-bold text-black ">
    [أضف هنا فقرة مختصرة تشرح مزايا البرنامج والفوائد التي سيحصل عليها المتقدم]
    </Text>


    <Text className="text-base text-center font-bold text-black ">
    يرجى الاطلاع على التفاصيل الإدارية المتعلقة بالتسجيل والدفع في المرفقات.
    </Text>

    <Text className="text-base text-center font-bold text-black ">
    نتطلع لرؤيتك بيننا. 
    </Text>

    <Text className="text-base text-center font-bold text-[#8BC53F] mb-4">
    مع خالص التحيات،
    </Text>

    <Text className="text-base text-center font-bold text-[#8BC53F] mb-4">
     [اسم القائم على البرنامج] [مسمى الوظيفة] [اسم المؤسسة]
    </Text>


   
    </>
)}

     
    </BaseEmail>
  );
}
