import PostList from "@/components/posts/post-list";
import { redirect } from "next/navigation";
import { fetchPostsBySearchTerm } from "../db/queries/posts";

interface SearchPageProps {
    searchParams: { term?: string };
}
export default function SearchPage({searchParams}:SearchPageProps){
    const {term} = searchParams;
    if (!term || term.length === 0){
        redirect('/')
    }

    return <div><PostList fetchData={()=>fetchPostsBySearchTerm(term)}/></div>

}