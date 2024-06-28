import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog{
        "title":  string,
        "content": string,
        "id": number
        "author": {
            "name": string
        }
}


export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        console.log("Retrieved token:", storedToken);
        if (storedToken) {
            axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                headers: {
                    authorization: `${storedToken}`,
                },
            })
            .then(response => {
                console.log("from useEffect of useBlog",response.data.res);
                setBlog(response.data.res);  // Ensure the correct data property is accessed
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);  // Ensure loading is set to false even if there is an error
            });
        } else {
            console.error("Token not found");
        }
    }, [id]);

    return {
        loading,
        blog
    }

}



export const useBlogs = ()=>{
    const [loading,setLoading] = useState(true);
    const [blogs,setBlogs] = useState<Blog[]>([]);

    const token = localStorage.getItem("token");
    console.log(token);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        console.log("Retrieved token:", storedToken);
        if (storedToken) {
            axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
                headers: {
                    authorization: `${storedToken}`,
                },
            })
            .then(response => {
                console.log("from useEffect",response.data.res);
                setBlogs(response.data.res);  // Ensure the correct data property is accessed
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);  // Ensure loading is set to false even if there is an error
            });
        } else {
            console.error("Token not found");
        }
    }, []);
    
    

    return {
        loading,
        blogs
    }
}