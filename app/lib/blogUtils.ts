import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  content: string;
  contentType: "markdown" | "html";
  htmlPath?: string;
}

//change this to blog-posts-mock to use the test blog posts
const postsDirectory = path.join(process.cwd(), "public", "blog-posts");

function getMarkdownPost(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  return {
    slug,
    title: matterResult.data.title || slug,
    date: matterResult.data.date || new Date().toISOString(),
    description: matterResult.data.description,
    content: matterResult.content,
    contentType: "markdown",
  };
}

function getHtmlNotebookPost(dirName: string): BlogPost | null {
  const dirPath = path.join(postsDirectory, dirName);
  const metadataPath = path.join(dirPath, "metadata.json");

  // Check if metadata.json exists
  if (!fs.existsSync(metadataPath)) {
    return null;
  }

  try {
    const metadataContents = fs.readFileSync(metadataPath, "utf8");
    const metadata = JSON.parse(metadataContents);

    // Verify the HTML file exists
    const htmlFile = metadata.htmlFile || `${dirName}.html`;
    const htmlPath = path.join(dirPath, htmlFile);
    if (!fs.existsSync(htmlPath)) {
      return null;
    }

    return {
      slug: dirName,
      title: metadata.title || dirName,
      date: metadata.date || new Date().toISOString(),
      description: metadata.description,
      content: "", // HTML notebooks don't have markdown content
      contentType: "html",
      htmlPath: `/blog-posts/${dirName}/${htmlFile}`,
    };
  } catch (error) {
    console.error(`Error reading notebook metadata for ${dirName}:`, error);
    return null;
  }
}

export function getAllBlogPosts(): BlogPost[] {
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
  const allPostsData: BlogPost[] = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      // Handle markdown files
      allPostsData.push(getMarkdownPost(entry.name));
    } else if (entry.isDirectory()) {
      // Check if this directory is a notebook post
      const notebookPost = getHtmlNotebookPost(entry.name);
      if (notebookPost) {
        allPostsData.push(notebookPost);
      }
    }
  }

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  // First try to find a markdown file
  const mdPath = path.join(postsDirectory, `${slug}.md`);
  if (fs.existsSync(mdPath)) {
    try {
      const fileContents = fs.readFileSync(mdPath, "utf8");
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title || slug,
        date: matterResult.data.date || new Date().toISOString(),
        description: matterResult.data.description,
        content: matterResult.content,
        contentType: "markdown",
      };
    } catch (error) {
      console.error(`Error reading markdown post ${slug}:`, error);
    }
  }

  // Then try to find a notebook directory
  const dirPath = path.join(postsDirectory, slug);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    const notebookPost = getHtmlNotebookPost(slug);
    if (notebookPost) {
      return notebookPost;
    }
  }

  return null;
}
