
import { lazy } from 'react'


const Img = lazy(async () => {
  return { default: (await import("@react-email/components")).Img };
});

const Body = lazy(async () => {
  return { default: (await import("@react-email/components")).Body };
});

const Section = lazy(async () => {
  return { default: (await import("@react-email/components")).Section };
});

const Container = lazy(async () => {
  return { default: (await import("@react-email/components")).Container };
});

const Preview = lazy(async () => {
  return { default: (await import("@react-email/components")).Preview };
});

const Tailwind = lazy(async () => {
  return { default: (await import("@react-email/components")).Tailwind };
});

const Html = lazy(async () => {
  return { default: (await import("@react-email/components")).Html };
});
const Head = lazy(async () => {
  return { default: (await import("@react-email/components")).Head };
});
interface BaseEmailProps {
  preview?: string;
  children: React.ReactNode;
}

export default function BaseEmail({ preview, children }: BaseEmailProps) {
  return (
    <Html dir="rtl">
      <Head />

    <Container>
      <Container className='flex w-full justify-center border-2 border-black items-center'>
      <Img src="https://admin.qyam.org/images/pngLogo.png"/>

      </Container>
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
    </Container>

    </Html>
  );
}
