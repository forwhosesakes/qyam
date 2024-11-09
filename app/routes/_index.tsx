
export default function Index() {
  return (
    <div className="flex flex-col relative  h-screen items-center justify-center">
      <div className="loader">
  <div className="hour-top"></div>
  <div className="hour-bottom"></div>
  <div className="hour-line"></div>
</div>
      
          
            <img
              src="/images/noisy-gradients.png"
              alt="bg"
              className="absolute blur-3xl  w-screen h-screen opacity-45"
            />
          <h1 className="text-6xl font-noto-sans mt-56 opacity-50"> ..قريبًا</h1>
       
    
    </div>
  );
}

