import fs from 'fs';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import md from 'markdown-it';
import gfm from 'remark-gfm'

export async function getStaticPaths() {
  const files = fs.readdirSync('posts');
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace('.md', ''),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const fileName = fs.readFileSync(`posts/${slug}.md`, 'utf-8');
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}

export default function PostPage({ frontmatter, content }) {
  return (
    
    <div className='prose mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 '>
        <header className="bg-white shadow">
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">{frontmatter.title}</h1>
    </div>
  </header>
    <main>
  
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <ReactMarkdown remarkPlugins={[gfm]}>{content}</ReactMarkdown>
    </div>

    </main>
    </div>
  );
}
