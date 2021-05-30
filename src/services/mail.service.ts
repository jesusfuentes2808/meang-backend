import {IEmailOptions} from "../interfaces/email.interface";
import {transport} from "../config/mailer";

class  MailService{
    send(mail: IEmailOptions){
        return new Promise((resolve, reject)=>{
            transport.sendMail({
                from: '"Jesus Fuentes 👻" <jesusfuentes2808aws@gmail.com>', // sender address
                to: mail.to, // list of receivers
                subject: mail.subject, // Subject line
                text: "Hello world?", // plain text body
                html: mail.html, // html body
            }, (error,_) => {
                (error) ? reject({
                    status: false,
                    message: error
                }) : resolve({
                    status: true,
                    message: 'email correctamente enviado',
                    mail
                });
            });
        });
    }
}

export default MailService;