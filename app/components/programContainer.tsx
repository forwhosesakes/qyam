import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";


import ImageZoom from "~/assets/images/zoom.png";
type Props = {
  programs: any[];
};

const ProgramContainer = ({
  programs,
}: Props) => {
  return (
    <div className="flex mx-auto  flex-wrap  gap-x-12 gap-y-6">
      {programs.length ? 
     
          programs.map((program: any) => (
            <Card key={program.id} className="max-w-[300px]">
              <CardHeader>
                <img
                  className="opacity-50"
                  src={program.image??ImageZoom}
                  alt="image-placeholder"
                />
                <CardTitle className="mt-2"> {program.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{program.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex w-full justify-end">
                <a target="_blank" rel="noopener noreferrer" className="text-blue-900" href={program.link}>
                  {"اضغط هنا"}
                </a>
              </CardFooter>
            </Card>
          ))
       
       : (
        <></>
      )}
    </div>
  );
};

export default ProgramContainer;
