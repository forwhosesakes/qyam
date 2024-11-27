import glossary from "~/lib/glossary";
import { client } from "../db-client.server";




const acceptUserRegisteration = (userId:string,dbUrl:string)=>{
    const db = client(dbUrl)

    return new Promise((resolve, reject) => {
        db.user.update({
            data: {acceptenceState:"accepted"},
            where: {id:userId}
        }).then(()=>{
            resolve({status:"success", message:glossary.status_response.success.user_accepted})
        }).catch((error:any)=>{
            console.log("ERROR [toggleUserRegisterationAcceptence]: ", error);
            reject({status:"error", message:glossary.status_response.error.user_accepted})
        })
      });
}

const denyUserRegisteration = (userId:string,dbUrl:string)=>{
    const db = client(dbUrl)

    return new Promise((resolve, reject) => {
        db.user.update({
            data: {acceptenceState:"not_accepted"},
            where: {id:userId}
        }).then(()=>{
            resolve({status:"success", message:glossary.status_response.success.user_accepted})
        }).catch((error:any)=>{
            console.log("ERROR [toggleUserRegisterationAcceptence]: ", error);
            reject({status:"error", message:glossary.status_response.error.user_accepted})
        })
      });
}




const getAllUsers = (dbUrl:string)=>{
    const db = client(dbUrl)

    return new Promise((resolve, reject) => {
        db.user.findMany().then((res)=>{
            resolve({status:"success", data:res})
        }).catch((error:any)=>{
            console.log("ERROR [getAllUsers]: ", error);
            reject({status:"error", message:glossary.status_response.error.general})
        })
      });

}
const getUser = (userID:string,dbUrl:string)=>{
    const db = client(dbUrl)

    return new Promise((resolve, reject) => {
        db.user.findFirstOrThrow({where:{id:userID}}).then((res)=>{
            resolve({status:"success", data:res})
        }).catch((error:any)=>{
            console.log("ERROR [getUser]: ", error);
            reject({status:"error", message:glossary.status_response.error.general})
        })
      });
    
}


export default ({
    getAllUsers,
    getUser

})