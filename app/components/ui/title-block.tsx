interface TitleBlockProps {
  text: string;
}

const TitleBlock = ({ text }:TitleBlockProps) => {
  return (
    <div className="relative w-fit h-fit pl-3">
    <div className="bg-secondary clip-path-angled-clip w-full h-full absolute inset-0">    </div>
    
    <div className="relative text-primary text-start text-4xl font-bold">
      {text}
    </div>
  </div>
  );
};

export default TitleBlock;
