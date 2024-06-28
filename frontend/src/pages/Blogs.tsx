import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks/index";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return (
      <div>
        <Appbar />
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
      </div>
    );
  }

  return <div>
      <Appbar />

      <div className="flex justify-center">
        <div className="max-w-xl">
          {blogs.map((blog) => <BlogCard
              authorName={blog.author.name || "Anonymus"}
              publishedDate={"26th of June 2024"}
              id={blog.id}
              title={blog.title}
              content={blog.content}
            />
          )}
        </div>
      </div>
    </div>
  
};

// {blogs.map( blog=> <BlogCard
//     authorName={blog.author.name || "Anonymus"}
//     publishedDate={"22/6/24"}
//     id={blog.id}
//     title={blog.title}
//     content={blog.content}
//     />
// }
