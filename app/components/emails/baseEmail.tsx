import { lazy } from "react";

const Body = lazy(async () => {
  return { default: (await import("@react-email/components")).Body };
});

const Section = lazy(async () => {
  return { default: (await import("@react-email/components")).Section };
});

const Text = lazy(async () => {
  return { default: (await import("@react-email/components")).Text };
});

const Container = lazy(async () => {
  return { default: (await import("@react-email/components")).Container };
});
const Img = lazy(async () => {
  return { default: (await import("@react-email/components")).Img };
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
              'font-src': "data:";
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
        <Tailwind>
          {/* {preview && <Preview>{String(preview)}</Preview>} */}

          <Body className="bg-gray-100 font-sans">
            <Container className="mx-auto py-8 px-4">
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
              <Container className=" w-full  bg-[#0D3151] rounded-lg">
                <Text  className="text-[#8BC53F] text-center font-bold text-xl">
                  {preview}
                </Text>
              </Container>
              <Section className="bg-white rounded-lg shadow-lg p-8">
                {children}
              </Section>

              <table style={{ width: '100%'}}>
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
                <table style={{ width: '100%'}}>
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
                <div className="bg-white">

                <table style={{ width: '100%'}}>
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
<div className="h-[2px] w-full flex justify-between  bg-[#0D3151]"></div>
<span  className="text-[#0D3151] text-xs">© جميع الحقوق محفوظة لجمعية أفاق الخفجي.</span>

                </div>
            </Container>
          </Body>
        </Tailwind>
      </Container>
    </Html>
  );
}
