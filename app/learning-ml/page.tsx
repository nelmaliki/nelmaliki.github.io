import React from "react";
import Link from "next/link";
import { getAllBlogPosts } from "@/app/lib/blogUtils";

export default function LearningMLPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-TiffanyBlue mb-8">
        Learning Machine Learning
      </h1>

      <p className="text-xl text-amber-50 mb-8">
        Follow my journey as I explore the fascinating world of machine
        learning.
      </p>

      {posts.length === 0 ? (
        <div className="bg-Onyx rounded-lg p-8 text-center">
          <p className="text-amber-50 text-lg">
            No blog posts yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-Onyx rounded-lg p-6 hover:bg-opacity-80 transition-all duration-200"
            >
              <Link href={`/learning-ml/${post.slug}`}>
                <h2 className="text-2xl font-semibold text-NaplesYellow hover:text-TiffanyBlue transition-colors duration-200 mb-2">
                  {post.title}
                </h2>
              </Link>

              <time className="text-sm text-gray-400">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>

              {post.description && (
                <p className="mt-3 text-amber-50 line-clamp-3">
                  {post.description}
                </p>
              )}

              <Link
                href={`/learning-ml/${post.slug}`}
                className="inline-block mt-4 text-TiffanyBlue hover:text-NaplesYellow transition-colors duration-200"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
