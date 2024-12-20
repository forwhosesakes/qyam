import TitleBlock from "~/components/ui/title-block";
import glossary from "../../../lib/glossary";
import { Icon } from "~/components/icon";

const EvaluationMethods = () => {
  const methods = [
    { name: "applied_projects", icon: "settings" },
    { name: "performative_tasks", icon: "task" },
    { name: "knowledge_tests", icon: "knowledge" },
    { name: "education_situation", icon: "graduate" },
  ];
  return (
    <section id="evaluation-methods" className="mb-12 flex flex-col md:pr-6">
      <div className="mx-6 sm:mx-16  self-start">
        <TitleBlock text={glossary.evaluation_methods.title} />
        <p className="py-4 text-2xl">{glossary.evaluation_methods.description}</p>
      </div>

      <div className="relative mx-6  w-5/6  sm:mx-24   xl:w-3/4   h-[180px] md:h-[266px]   ">
      <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1217 266"
  fill="none"
  width={"100%"}
>
  <path
    d="M1178.02 0H33.7321C15.1023 0 0 15.0562 0 33.6182V38.8604C14.3527 147.309 108.902 225.601 234.736 225.59L1178.02 266C1199.55 266 1217 248.603 1217 227.14V38.8604C1217 17.397 1199.55 0 1178.02 0Z"
    fill="#0D3151"
  />
</svg>
        <svg
          className="lg:block hidden absolute top-4 right-1"
          xmlns="http://www.w3.org/2000/svg"
          width="104"
          height="208"
          viewBox="0 0 104 208"
          fill="none"
        >
          <path
            d="M140.615 146.526L124.372 135.171C114.821 128.498 106.977 123.719 99.8159 122.994C95.5799 122.562 91.4171 123.597 87.041 126.58C85.5112 127.622 83.9509 128.906 82.3541 130.447C81.1656 131.585 79.9649 132.876 78.7276 134.319L62.2837 153.528L86.3828 177.559L90.5882 181.754L105.027 196.147C115.291 206.424 126.761 207.654 136.19 203.702C140.932 201.711 145.192 198.43 148.556 194.326C151.933 190.21 154.401 185.291 155.541 180.043C157.979 168.864 154.34 156.128 140.603 146.526H140.615Z"
            stroke="#8BC53F"
            strokeWidth="3"
            strokeMiterlimit="10"
          />
          <path
            d="M99.7122 159.902L96.2686 140.401C94.239 128.937 92.0753 120.017 87.5286 114.446C84.8346 111.146 81.1594 108.942 75.9605 107.956C74.1382 107.609 72.1268 107.414 69.9083 107.384C68.2627 107.353 66.4952 107.414 64.6058 107.56L39.3792 109.527L39.4096 143.543V149.479L39.434 169.857C39.4157 184.372 46.6564 193.346 56.1217 197.212C60.8818 199.154 66.2209 199.842 71.5052 199.319C76.8077 198.795 82.031 197.054 86.5534 194.156C96.1894 187.976 102.632 176.396 99.7122 159.908V159.902Z"
            stroke="#8BC53F"
            strokeWidth="3"
            strokeMiterlimit="10"
          />
          <path
            d="M61.3207 140.468L72.6876 124.243C79.3676 114.702 84.1521 106.866 84.8774 99.7124C85.3101 95.4809 84.274 91.3226 81.2875 86.9511C80.2453 85.4229 78.9592 83.8643 77.4172 82.2691C76.2775 81.0819 74.9854 79.8824 73.5409 78.6465L54.3116 62.22L30.2552 86.2935L26.0558 90.4945L11.6476 104.918C1.35944 115.171 0.128279 126.629 4.08384 136.054C6.07687 140.791 9.362 145.047 13.4699 148.407C17.5901 151.78 22.5147 154.246 27.7685 155.385C38.9587 157.82 51.7091 154.185 61.3207 140.462V140.468Z"
            stroke="#8BC53F"
            strokeWidth="3"
            strokeMiterlimit="10"
          />
          <path
            d="M47.9303 99.6092L67.4522 96.1693C78.9288 94.1418 87.8578 91.9805 93.4346 87.4385C96.738 84.7474 98.9444 81.0761 99.9317 75.8827C100.279 74.0623 100.474 72.0531 100.505 69.8369C100.535 68.1931 100.474 66.4274 100.328 64.54L98.3593 39.3401L64.3072 39.3705H58.3648L37.9652 39.3949C23.4351 39.3766 14.4513 46.6096 10.581 56.0649C8.63676 60.82 7.94804 66.1534 8.4722 71.4321C8.99636 76.729 10.7395 81.9468 13.6406 86.4644C19.8269 96.0901 31.4194 102.526 47.9243 99.6092H47.9303Z"
            stroke="#8BC53F"
            strokeWidth="3"
            strokeMiterlimit="10"
          />
          <path
            d="M67.3852 61.2579L83.628 72.6128C93.1786 79.2856 101.023 84.065 108.184 84.7896C112.42 85.2218 116.583 84.1868 120.959 81.2035C122.489 80.1624 124.049 78.8777 125.646 77.3374C126.834 76.1988 128.035 74.9081 129.272 73.4651L145.716 54.2562L121.617 30.2253L117.412 26.0303L102.973 11.6374C92.7032 1.36012 81.2327 0.130261 71.7978 4.08164C67.056 6.07255 62.7957 9.3542 59.4314 13.4578C56.0548 17.5735 53.5864 22.493 52.4466 27.7412C50.0087 38.9195 53.6473 51.6565 67.3852 61.2579Z"
            stroke="#8BC53F"
            strokeWidth="3"
            strokeMiterlimit="10"
          />
          <path
            d="M108.288 47.8815L111.731 67.3827C113.761 78.8472 115.925 87.7667 120.471 93.3376C123.165 96.6375 126.841 98.8415 132.039 99.8278C133.862 100.175 135.873 100.37 138.092 100.4C139.737 100.431 141.505 100.37 143.394 100.224L168.621 98.257L168.59 64.2411V58.3049L168.566 37.927C168.584 23.4122 161.344 14.4379 151.878 10.5718C147.118 8.62957 141.779 7.94158 136.495 8.46518C131.192 8.98878 125.969 10.7301 121.447 13.6282C111.811 19.8079 105.368 31.388 108.288 47.8755V47.8815Z"
            stroke="#8BC53F"
            strokeWidth="3"
            strokeMiterlimit="10"
          />
        </svg>
        <div className="absolute right-2 md:right-10 lg:right-36 top-2 lg:top-12  flex  flex-wrap 2xl:gap-x-36 lg:gap-x-32 sm:gap-x-16 gap-x-8 justify-center items-center">
          {methods.map((method: any) => (
            <div
              key={method.name}
              className="flex z-20 flex-col md:gap-y-4 w-min"
            >
              <Icon size="xl7" name={method.icon} />
              <h5 className="text-white  lg:text-wrap">
                {
                  glossary.evaluation_methods[
                    method.name as keyof typeof glossary.evaluation_methods
                  ]
                }
              </h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EvaluationMethods;
