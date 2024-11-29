type NavElement = {
    id: string;
    arabicLabel: string;
    link:string,
    visibility: boolean;
    onClick?: () => void;
    children?: NavElement[];
  };
export const NavbarElements: NavElement[] = [
    { id: "about", arabicLabel: "حول البرنامج", 
      link:"/#about",
        
        visibility: true, onClick() {} },
    {
      id: "registeration",
      arabicLabel: "شروط التسجيل",
      link:"#",
      visibility: true,
      onClick() {},
    },
    {
      id: "levels",
      arabicLabel: "مستويات البرنامج",
      link:"/levels",

      visibility: true,
      onClick() {},
    },
  
    {
      id: "knowledge-center",
      arabicLabel: "مركز المعرفة",
      link:"center",
      visibility: true,
      onClick() {},
    },
    {
      id: "contact-us",
      arabicLabel: "تواصل معنا",
      link:"contact",
      visibility: true,
      onClick() {},
    },
  ];