import { Text, Button, Img } from "@react-email/components";
import BaseEmail from "./baseEmail";


interface PasswordResetEmailProps {
  resetUrl: string;
}

export default function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {


  return (
      
      <BaseEmail preview="إعادة تعيين كلمة المرور">
      <div>
        
<Img src="https://admin.qyam.org/images/pngLogo.png"/>
      <Text className="text-2xl font-bold text-primary mb-4">
        إعادة تعيين كلمة المرور
      </Text>
      <Text className="text-gray-600 mb-6">
        لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. اضغط على الزر أدناه لإعادة تعيينها.
      </Text>
      
        <Button className="bg-[#0D3151] text-white px-6 mb-12 py-3 rounded-md" href={resetUrl}>
        إعادة تعيين كلمة المرور

        </Button>
          </div>
    </BaseEmail>
  );
}