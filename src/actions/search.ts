'use server'
import exp from "constants"
import { redirect } from "next/navigation"  

export async function search(formData: FormData){
    const term = formData.get('term')?.toString()||""
    if (typeof term !== 'string' || term.length === 0){
        redirect('/')
    }

    redirect(`/search?term=${encodeURIComponent(term)}`)
}