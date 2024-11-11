
import { Resend } from 'resend';


let resend: Resend|null = null

const getResendObject = (key:string)=>{
  console.log("key:  ", key);
  
  if (!resend) resend = new Resend(key)
   return resend
}

type EmailSendBody = {
    to:string, 
    subject:string,
    text:string
}


export const sendEmail = (body:EmailSendBody, apiKey:string, sourceEmail:string)=>{
  console.log("sending ematil to ", body.to);
  
// TODO: the html should have a defined template customized for this application
getResendObject(apiKey).emails.send({
    from: sourceEmail,
    to: body.to,
    subject: body.subject,
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>' + body.text
  }).then((res)=>{
    //todo: handle the errors here ( i know :/)
 console.log("   email sening result",res);
 
  }).catch((error)=>{
    console.log("error in sending email: ", error);
    
  })

}