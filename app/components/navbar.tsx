
import { User } from "better-auth/types"
import { Icon } from "./icon"
import { useNavigate } from "@remix-run/react"


type NavElement = {
    id:string,
    arabicLabel:string,
    visibility:boolean,
    onClick?:()=>void,
    children?:NavElement[]
}



type TProps = {
    // navElements: NavElement[],
    user: User|null
}


const navElements: NavElement[]=[
    {id:"about",arabicLabel:"حول البرنامج", visibility:true , onClick() {},},
    {id:"registeration",arabicLabel:"شروط التسجيل", visibility:true , onClick() {},},
    {id:"levels",arabicLabel:"مستويات البرنامج", visibility:true , onClick() {},},
    {id:"certificates",arabicLabel:"شهادات البرنامج", visibility:true , onClick() {},},
    {id:"knowledge-center",arabicLabel:"مركز المعرفة", visibility:true , onClick() {},},
    {id:"contact-us",arabicLabel:"تواصل معنا", visibility:true , onClick() {},},




]


const Navbar = (props:TProps)=>{

    const navigate = useNavigate()

    const expandElement = ()=>{}
    const scrollToSection = ()=>{}

    return <nav className="w-4/5 mx-auto justify-center flex items-center gap-x-8 py-5" >

       {props.user?<div>
        <button className="button text-center p-3 rounded-lg text-gray-700 hover:bg-black/5 transition-all">تسجيل الخروج</button>
       </div> :
       <div className="visitors flex gap-x-4">
            <button 
            
            onClick={()=>navigate("/login")}
            className="button text-center p-3 rounded-lg text-gray-700 hover:bg-black/5 transition-all">دخول</button>
            <button 
              onClick={()=>navigate("/signup")}
            className="button text-center p-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"> تسجيل جديد</button>
        </div>}

        <ul className="flex gap-x-4">
            {navElements.map((el)=><li className="flex cursor-pointer  text-gray-700" >
                <span>
                {el.arabicLabel}
                </span>
            {el.children&&el.children.length&&<Icon name="below-arrow" size="sm"/>}

            </li>)}

        </ul>


        <img src="/app/assets/images/logo.svg"/>



    </nav>
}


export default Navbar