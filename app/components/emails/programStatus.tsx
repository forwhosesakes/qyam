import BaseEmail from "./baseEmail";
import {Text} from "@react-email/components";


export default function ProgramStatus({name,status}:any) {
  return (
    <BaseEmail preview={status === "accepted" ? "قبول في برنامج هندسة القيم" : "حالة الطلب"}>
  <Text style={{
  fontSize: '1.5rem',
  textAlign: 'center',
  fontWeight: 'bold',
  color: '#0D3151',
  marginBottom: '1rem',
  display: status === "accepted" ? "none" : "block"
}}>
  بشأن طلب الالتحاق ببرنامج هندسة القيم
</Text>

<Text style={{
  fontSize: '1rem',
  textAlign: 'center',
  fontWeight: 'bold',
  color: 'black',
  marginBottom: '1rem'
}}>
  عزيزي/عزيزتي {name}،
</Text>

{status === "denied" ? (
  <>
    <Text style={{
      fontSize: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'black',
      marginBottom: '1rem'
    }}>
      نشكرك على اهتمامك ببرنامج هندسة القيم وتقديم طلب الالتحاق بنا. لقد تلقينا عددًا كبيرًا من الطلبـــات المؤهــلــة، ممــا جــعــل عملية الاختيار صعبة للغاية.
    </Text>

    <Text style={{
      fontSize: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'black',
      marginBottom: '1rem'
    }}>
      بعد دراسة طلبك بعناية، قررنا في هذه المرحلة عدم قبولك في البرنامج. ندرك أن هذا القرار قد يكون مخيباً للآمال، ونود أن نعبر عن تقديرنا لاهتمامك ببرنامجنا.
    </Text>

    <Text style={{
      fontSize: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'black'
    }}>
      نحن نؤمن بإمكاناتك ونتمنى لك كل التوفيق في مسيرتك المهنية.
    </Text>

    <Text style={{
      fontSize: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#8BC53F',
      marginBottom: '1rem'
    }}>
      مع خالص التحيات، برنامج هندسة القيم
    </Text>
  </>
) : (
  <>
    <Text style={{
      fontSize: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'black'
    }}>
      يسعدنا جدًا إخبارك بقبولك في برنامج هندسة القيم. لقد أظهرت سجلك الأكاديمي وخبرتك السابقة اهتمامًا قويًا بهذا المجال،
    </Text>

    <Text style={{
      fontSize: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'black'
    }}>
      ونحن على ثقة بأنك ستكون إضافة قيمة لبرنامجنا.
    </Text>

    <Text style={{
      fontSize: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'black'
    }}>
      يرجى الاطلاع على التفاصيل الإدارية المتعلقة بالتسجيل والدفع في المرفقات.
    </Text>

    <Text style={{
      fontSize: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'black'
    }}>
      نتطلع لرؤيتك بيننا.
    </Text>

    <Text style={{
      fontSize: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#8BC53F',
      marginBottom: '1rem'
    }}>
      مع خالص التحيات،
    </Text>

    <Text style={{
      fontSize: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#8BC53F',
      marginBottom: '1rem'
    }}>
      برنامج قيم
    </Text>
  </>
)}

     
    </BaseEmail>
  );
}
