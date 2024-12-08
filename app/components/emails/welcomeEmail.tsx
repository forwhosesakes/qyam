import { Text, Button, Hr } from "@react-email/components";
import BaseEmail from "./baseEmail";

interface WelcomeEmailProps {
  name: string;
  verificationUrl?: string;
}

export default function WelcomeEmail({ name, verificationUrl }: WelcomeEmailProps) {
  return (
    <BaseEmail preview="مرحباً بك في قيم">
      <Text className="text-2xl font-bold text-primary mb-4">
        مرحباً {name}!
      </Text>
      <Text className="text-gray-600 mb-6">
        شكراً لانضمامك إلى برنامج قيم. نحن سعداء بوجودك معنا.
      </Text>
      {verificationUrl && (
        <>
          <Hr className="my-4" />
          <Button
            className="bg-primary text-white px-6 py-3 rounded-md"
            href={verificationUrl}
          >
            تأكيد البريد الإلكتروني
          </Button>
        </>
      )}
    </BaseEmail>
  );
}