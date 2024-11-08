import { error } from 'better-auth/api';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API);

type EmailSendBody = {
    to:string, 
    subject:string,
    text:string
}


export const sendEmail = (body:EmailSendBody)=>{
  console.log("sending ematil to ", body.to);
  
// TODO: the html should have a defined template customized for this application
resend.emails.send({
    from: process.env.MAIN_EMAIL!,
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