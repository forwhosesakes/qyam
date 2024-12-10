// import { lazy } from "react";

// import { Container, Head, Html ,Body,Text,Section} from "@react-email/components";

import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
// import { Tailwind } from "@react-email/tailwind";
import { Body } from "@react-email/body";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";

// const Body = lazy(async () => {
//   return { default: (await import("@react-email/components")).Body };
// });

// const Section = lazy(async () => {
//   return { default: (await import("@react-email/components")).Section };
// });

// const Text = lazy(async () => {
//   return { default: (await import("@react-email/components")).Text };
// });

// const Container = lazy(async () => {
//   return { default: (await import("@react-email/components")).Container };
// });


// const Tailwind = lazy(async () => {
//   return { default: (await import("@react-email/components")).Tailwind };
// });

// const Html = lazy(async () => {
//   return { default: (await import("@react-email/components")).Html };
// });
// const Head = lazy(async () => {
//   return { default: (await import("@react-email/components")).Head };
// });


const Font = ({ 
  webFont,
  fontStyle = 'normal',
  fontFamily,
  fontWeight = 400,
  fallbackFontFamily,
}:any) => {
  const src = webFont ? `src: url(${webFont.url}) format(${webFont.format});` : "";

  return (
      <style>
      {
          `
          @font-face {
              font-style: ${fontStyle};
              font-family: ${fontFamily};
              font-weight: ${fontWeight};
              mso-font-alt: ${Array.isArray(fallbackFontFamily) ? fallbackFontFamily[0] : fallbackFontFamily};
              ${src}
          }

          * {
              font-family: ${fontFamily}, ${Array.isArray(fallbackFontFamily) ? fallbackFontFamily.join(", ") : fallbackFontFamily};
          }
          `
      }
      </style>
  )
}
interface BaseEmailProps {
  preview?: string;
  children: React.ReactNode;
}

export default function BaseEmail({ preview, children }: BaseEmailProps) {
  return (
    <Html dir="rtl">
      <Head >
      <meta name="x-apple-disable-message-reformatting" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <Font
          fontFamily="notosansarabic"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/notosansarabic/v28/nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj4wv4rqxzLI.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Container>
      <Body style={{ backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
  <Container style={{ margin: '0 auto', padding: '2rem 1rem' }}>
    <Container>
      <table style={{ width: "100%" }}>
        <tr>
          <td style={{ textAlign: "center", padding: "16px" }}>
            <img
              style={{
                width: "176px",
                height: "176px",
              }}
              src="https://admin.qyam.org/images/pngLogo.png"
              alt=""
            />
          </td>
        </tr>
      </table>
    </Container>
    <Container style={{ 
      width: '100%', 
      backgroundColor: '#0D3151', 
      borderRadius: '0.5rem' 
    }}>
      <Text style={{ 
        color: '#8BC53F', 
        textAlign: 'center', 
        fontWeight: 'bold', 
        fontSize: '1.25rem' 
      }}>
        {preview}
      </Text>
    </Container>
    <Section style={{ 
      backgroundColor: 'white', 
      borderRadius: '0.5rem', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
      padding: '2rem' 
    }}>
      {children}
    </Section>

    <table style={{ width: '100%' }}>
      <tr>
        <td style={{ textAlign: 'center', padding: '16px' }}>
          <img 
            style={{
              width: '112px',
              height: '73px'
            }} 
            src="https://admin.qyam.org/images/coloreddrop.png" 
            alt="" 
          />
        </td>
      </tr>
    </table>
    <table style={{ width: '100%' }}>
      <tr>
        <td style={{ textAlign: 'center', padding: '16px' }}>
          <img 
            style={{
              width: '100%',
              height: '100px'
            }} 
            src="https://admin.qyam.org/images/clipPath.png" 
            alt="" 
          />
        </td>
      </tr>
    </table>
    <div style={{ backgroundColor: 'white' }}>
      <table style={{ width: '100%' }}>
        <tr>
          <td style={{ textAlign: 'center', padding: '16px' }}>
            <img 
              style={{
                width: '100%',
                height: '70px'
              }} 
              src="https://admin.qyam.org/images/allPartners.png" 
              alt="" 
            />
          </td>
        </tr>
      </table>
      <div style={{ 
        height: '2px', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        backgroundColor: '#0D3151' 
      }}></div>
      <span style={{ 
        color: '#0D3151', 
        fontSize: '0.75rem' 
      }}>© جميع الحقوق محفوظة لجمعية أفاق الخفجي.</span>
    </div>
  </Container>
</Body>
      </Container>
    </Html>
  );
}
