import { useBlog } from "../hooks/index"
import { useParams } from "../../node_modules/react-router-dom/dist/index";
import { FullBlog } from "../components/FullBlog";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Appbar } from "../components/Appbar";

export const Blog = ()=>{
    const { id } = useParams<{id: string}>();
    const cleanedId = id?.replace(':','')||"";
    const {loading, blog } = useBlog({
        id : cleanedId
    });
    
    if(loading || !blog){
        return <div>
            <Appbar/>
            <BlogSkeleton />
        </div>
    }

    return (
        <div>
            <FullBlog blog={blog}/>
        </div>
    )
}