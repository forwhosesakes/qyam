import BaseEmail from "./baseEmail";

import { Text } from "@react-email/text";




interface PasswordResetEmailProps {
  resetUrl: string;
}

export default function PasswordResetEmail({
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <BaseEmail preview="إعادة تعيين كلمة المرور">
    <div>
  <Text style={{
    fontSize: '1.5rem',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#0D3151',
    marginBottom: '1rem'
  }}>
    إعادة تعيين كلمة المرور
  </Text>
  
  <Text style={{
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: '1.5rem'
  }}>
    لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. اضغط على الزر
    أدناه لإعادة تعيينها.
  </Text>

  <a 
    style={{
      backgroundColor: '#0D3151',
      color: 'white',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      marginBottom: '3rem',
      borderRadius: '0.375rem'
    }}
    href={resetUrl}
  >
    إعادة تعيين كلمة المرور
  </a>
</div>
    </BaseEmail>
  );
}
