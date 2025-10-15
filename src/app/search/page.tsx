import { redirect } from "next/navigation";

interface SearchPageProps {
    searchParams: { term?: string };
}
export default function SearchPage({searchParams}:SearchPageProps){
    const {term} = searchParams;
    if (!term || term.length === 0){
        redirect('/')
    }

    return <div>{term}</div>

}