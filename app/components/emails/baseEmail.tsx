
import { Section } from '@react-email/section'
import { Body } from '@react-email/body'
import { Container } from '@react-email/container'
import { Head } from '@react-email/head'
import { Preview } from '@react-email/preview'
import { Tailwind } from '@react-email/tailwind'
import { Html } from '@react-email/html'

interface BaseEmailProps {
  preview?: string;
  children: React.ReactNode;
}

export default function BaseEmail({ preview, children }: BaseEmailProps) {
  return (
    <Html dir="rtl">
      <Head />
      {preview && <Preview>{String(preview)}</Preview>}
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-8 px-4">

            <Section className="bg-white rounded-lg shadow-lg p-8">
              {children}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
