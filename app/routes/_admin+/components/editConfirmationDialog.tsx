import glossary from "~/lib/glossary";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';

const EditConfirmationDialog = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    user 
  }:any) => {
    // Create a handleConfirm function to ensure the event is passed
    const handleConfirm = (e:any) => {
      e.preventDefault();
      onConfirm();
    };
  
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex  items-center gap-2">
             تغيير حالة القبول
            </AlertDialogTitle>
            <AlertDialogDescription  className="text-right">
              <span>
              هل انت متأكد من تغيير حالة المستخدم {user.name} إلى '{glossary.cp.user[user.acceptenceState]}'؟
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter dir="rtl" className=" gap-x-4  mr-auto">
            <AlertDialogCancel>الالغاء</AlertDialogCancel>
            <button
              onClick={(e)=>{
                handleConfirm(e)
                onClose(e)
              }}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2"
            >
              التأكيد
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };



  export default EditConfirmationDialog