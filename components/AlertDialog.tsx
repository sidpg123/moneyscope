import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

import React from 'react'
interface alertDialog {
    text: string,
    subText: string,
    alertText: string,
    _id?: string
    onSubmit: (id: string) => void
}
export default function AlertDialogComponent({ text, alertText, subText, onSubmit, _id }: alertDialog) {

    async function handleClick(_id: string) {
        onSubmit(_id);
    }

    return (
        <div className=" w-[98%] my-3 p-2 border border-input bg-background rounded-sm text-sm text-center  shadow-sm hover:bg-destructive/90">
            <AlertDialog>
                <AlertDialogTrigger>{text}</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertText}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {subText}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button variant={"destructive"} onClick={() => handleClick(_id as string)}>Delete</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
