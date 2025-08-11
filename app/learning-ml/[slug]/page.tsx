import React from "react";
import { getBlogPostBySlug, getAllBlogPosts } from "@/app/lib/blogUtils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";
  return !inline ? (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={language}
      PreTag="div"
      className="rounded-lg my-6 shadow-lg border border-gray-600"
      showLineNumbers={true}
      lineNumberStyle={{ color: "#6b7280", fontSize: "0.875rem" }}
      customStyle={{
        margin: 0,
        borderRadius: "0.5rem",
        background: "#111827",
        fontSize: "0.875rem",
        lineHeight: "1.5",
      }}
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 text-amber-50">
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
          prose-a:text-NaplesYellow hover:prose-a:text-TiffanyBlue
          prose-code:text-NaplesYellow prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-blockquote:border-l-NaplesYellow
        "
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeBlock,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
