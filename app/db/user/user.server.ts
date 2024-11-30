import glossary from "~/lib/glossary";
import { client } from "../db-client.server";
import { UserCertificate } from "~/types/types";




const editUserRegisteration = (userId:string,status:"accepted"|"denied",dbUrl:string)=>{
    const db = client(dbUrl)

    return new Promise((resolve, reject) => {
        db.user.update({
            data: {acceptenceState:status},
            where: {id:userId}
        }).then(()=>{
            resolve({status:"success", message:glossary.status_response.success[status==="accepted"?"user_accepted":"user_denied"]})
        }).catch((error:any)=>{
            console.log("ERROR [toggleUserRegisterationAcceptence]: ", error);
            reject({status:"error", message:glossary.status_response.error[status==="accepted"?"user_accepted":"user_denied"]})
        })
      });
}


const getAllUsers = (dbUrl:string)=>{
    const db = client(dbUrl)

    return new Promise((resolve, reject) => {
        db.user.findMany({where:{emailVerified:true}}).then((res)=>{
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





const registerUserIntoProgram = (userID:string,dbUrl:string)=>{
    const db = client(dbUrl)
    return new Promise((resolve, reject) => {
        db.user.update({
            
            data: {acceptenceState:"pending"},
            where:{id:userID}}).then((res)=>{
            resolve({status:"success", data:res})
        }).catch((error:any)=>{
            console.log("ERROR [registerUserIntoProgram]: ", error);
            reject({status:"error", message:glossary.status_response.error.general})
        })
      });
}


const addCertificateToUser =(data:UserCertificate, dbUrl:string)=>{
    const db = client(dbUrl)
    return new Promise((resolve, reject) => {
        db.userCertificate.create({
            data,
     }).then((res)=>{
            resolve({status:"success", data:res})
        }).catch((error:any)=>{
            console.log("ERROR [addCertificateToUser]: ", error);
            reject({status:"error", message:glossary.status_response.error.general})
        })
      });

}


const getUserCertificates =(userId:string, dbUrl:string)=>{
    const db = client(dbUrl)
    return new Promise((resolve, reject) => {
        db.userCertificate.findMany({
            where: {userId},
     }).then((res)=>{
            resolve({status:"success", data:res})
        }).catch((error:any)=>{
            console.log("ERROR [getUserCertificates]: ", error);
            reject({status:"error", message:glossary.status_response.error.general})
        })
      });

}



const getUserWithCertificates = (userId:string, dbUrl:string)=>{
    const db = client(dbUrl)
    return new Promise((resolve, reject) => {
        db.user.findFirst({
            where: {id:userId},
            include:{
                UserCertificate:{
                    
                }
            }
     }).then((res)=>{
            resolve({status:"success", data:res})
        }).catch((error:any)=>{
            console.log("ERROR [getUserCertificates]: ", error);
            reject({status:"error", message:glossary.status_response.error.general})
        })
      });



}







export default ({
    registerUserIntoProgram,
    getAllUsers,
    getUser,
    editUserRegisteration,
    addCertificateToUser,
    getUserWithCertificates,
    getUserCertificates

})