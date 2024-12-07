const login = {
    title:"تسجيل الدخول",
    email:"البريد الإلكتروني",
    password:"كلمة المرور",
    login:"دخول",
    forgot_password:"نسيت كلمة السر؟",

    errors: {
        email: {
            required: "البريد الإلكتروني مطلوب",
            invalid: "صيغة البريد الإلكتروني غير صحيحة"
        },
        password: {
            required: "كلمة المرور مطلوبة"
        },
        unverified: "الرجاء تفعيل البريد الإلكتروني للمتابعة",
        invalid: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        generic: "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى"
    }
}



const signup={
    newSignup:{
        title:"تسجيل جديد",
        fullName:"الاسم الرباعي",
        fullNamePlaceholder:"أحمد حسين علي السقاف",
        phoneNumber:"رقم الجوال",
        email:"البريد الإلكتروني",
        cv:"السيرة الذاتية",
        selfIntroduction:"نبذة تعريفية عن نفسك واهتمامك بالبرنامج",
        selfIntrodutionPlaceholder:"تحدث عن نفسك",
        password:"كلمة المرور",
        confirmPassword:"تأكيد كلمة المرور",
        confirmationButton:"تأكيد وإرسال"
    },
    registrationTerms:{
        title:"شروط التسجيل",
        first:"أن يكون حاصلاً على شهادة جامعية (بكالوريوس كحد أدنى).",
        second:"تقديم بحث من 5 صفحات في مجال القيم وأثرها على الفرد.",
        third:"أن يكون قد حصل على 11 ساعة تطوعية كحد أدنى.",
        forth:"اجتياز المقابلة الشخصية.",
        notice:"تنويه:",
        noticeText:"في حال تم القبول، سيتم التوجيه لاستكمال شروط القبول ودفع الرسوم."
    },
    admissionCriteria:{
        title:"معايير القبول",
        description:"الترشيح للبرنامج متاح لجميع من تنطبق عليه شروطه ويمكنه الالتزام بمتطلباته، ويتم قبول المرشحين للالتحاق بالبرنامج وفقا للمعايير التالية :",
        first:"التخصص ومستوى التأهيل الجامعي.",
        second:"عدد سنوات الخبرة الوظيفية ومجالها.",
        third:"الدارسة المجتمعية والإنجازات الشخصية.",
        forth:"نتيجة تقييم المقابلة الشخصية.",
        fifth:"تمنح الأولوية للعاملين في المجال التربوي."

    },
    validationErrors: {
        name: "الاسم الرباعي مطلوب",
        email: {
          required: "البريد الإلكتروني مطلوب",
          invalid: "صيغة البريد الإلكتروني غير صحيحة"
        },
        password: {
          required: "كلمة المرور مطلوبة",
          length: "كلمة المرور يجب أن تكون ٨ أحرف على الأقل"
        },
        passwordConfirmation: "كلمة المرور غير متطابقة",
        phone: {
          required: "رقم الجوال مطلوب",
          length: "رقم الجوال يجب أن يكون ١٢ رقم او ١٠ ارقام" ,
          saudi: "يجب أن يكون رقم جوال سعودي",
          notValid:"رقم هاتف غير صحيح"
        },
        cv: {
          required: "السيرة الذاتية مطلوبة",
          type: "الرجاء رفع ملف PDF أو Word",
          size: "حجم الملف يجب أن يكون أقل من ٥ ميجابايت"
        },
        bio: "النبذة التعريفية مطلوبة"
      },
      toasts: {
        verifyEmail: {
          title: "تم التسجيل بنجاح",
          description: "تم إرسال رابط التحقق إلى بريدك الإلكتروني",
           error: "خطأ في إرسال البريد",
          errorDescription: "لم نتمكن من إرسال بريد التحقق. الرجاء المحاولة مرة أخرى"
        },
        signupError: {
          title: "فشل التسجيل",
          generalDescription: "حدث خطأ أثناء التسجيل. الرجاء المحاولة مرة أخرى",
          emailExist:"البريد الالكتروني مستخدم سابقا",
          error: "خطأ في إرسال البريد",
          errorDescription: "لم نتمكن من إرسال بريد التحقق. الرجاء المحاولة مرة أخرى"
      
        }
      }


}


const forgotPassword={
    title:"نسيت كلمة المرور",
    yourEmail:"أدخل البريد الالكتروني",
    resetPassword:"إستعد كلمة المرور",
    toast:{
        success:"تم إرسال بريدإلكتروني للعنوان المدرج بإرشادات الإستعادة",
        errorNoEmail:"لايوجد حساب بهذا البريد الالكتروني",
        error:"حدث خطأ حاول مرة اخرى"
    }
}


const resetPassword = {
    title: "تغيير كلمة المرور",
    newPassword: "كلمة المرور الجديدة",
    enterPassword: "أدخل كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    confirmPasswordPlaceholder: "أدخل تأكيد كلمة المرور",
    submit: "تغيير كلمة المرور",
    toast: {
        success: "تم تغيير كلمة المرور بنجاح",
        error: "حدث خطأ أثناء تغيير كلمة المرور",
        passwordMismatch: "كلمة المرور غير متطابقة"
    }
}

export default {
    login,
    signup,
    forgotPassword,
    resetPassword

}