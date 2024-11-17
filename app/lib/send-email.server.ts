
import { Resend } from 'resend';


let resend: Resend|null = null

const getResendObject = (key:string)=>{
  
  if (!resend) resend = new Resend(key)
   return resend
}

type EmailSendBody = {
    to:string, 
    subject:string,
    text:string
}


export const sendEmail = (body:EmailSendBody, apiKey:string, sourceEmail:string)=>{  
// TODO: the html should have a defined template customized for this application
getResendObject(apiKey).emails.send({
    from: sourceEmail,
    to: body.to,
    subject: body.subject,
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>' + body.text
  }).then((res)=>{
    //todo: handle the errors here ( i know :/)
 
  }).catch((error)=>{
    console.log("error in sending email: ", error);
    
  })

}