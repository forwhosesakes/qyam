import { User } from "better-auth";



export type Material = {
    id?: string;
    storageKey: string;
    title: string;
    categoryId: string;
    published: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}



export type Category {
    id?: string;
    title: string;
    icon: string;

}

export type AcceptenceState = "accepted" |"denied" |"pending" |"idle"
export type QUser = User&  {
    acceptenceState:AcceptenceState
    cvKey:string
    bio:string 
    phone:number
    role:"user"|"admin"
     
}




export type StatusResponse<T>= {
    status: "success" | "error" | "warning",
    message?:string,
    data?:T|T[]
}
 