import React from "react";
import { getBlogPostBySlug, getAllBlogPosts } from "@/app/lib/blogUtils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/learning-ml"
        className="inline-flex items-center text-TiffanyBlue hover:text-NaplesYellow transition-colors duration-200 mb-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back to all posts
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-TiffanyBlue mb-4">
            {post.title}
          </h1>

          <time className="text-gray-400">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>

          {post.description && (
            <p className="mt-4 text-xl text-amber-50">{post.description}</p>
          )}
        </header>

        <div
          className="prose prose-invert prose-lg max-w-none
          prose-headings:text-TiffanyBlue
          prose-h1:text-3xl
          prose-h2:text-2xl
          prose-h3:text-xl
          prose-p:text-amber-50
          prose-a:text-NaplesYellow hover:prose-a:text-TiffanyBlue
          prose-strong:text-amber-50
          prose-code:text-NaplesYellow prose-code:bg-Onyx prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-pre:bg-Onyx prose-pre:border prose-pre:border-gray-700
          prose-blockquote:border-l-NaplesYellow prose-blockquote:text-gray-300
          prose-ul:text-amber-50
          prose-ol:text-amber-50
          prose-li:text-amber-50
        "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
