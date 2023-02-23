import fs from 'fs';
import matter from 'gray-matter';
import PostList from '../components/PostList';

export async function getStaticProps() {
  const files = fs.readdirSync('posts');

  const posts = files.map((fileName) => {
    const slug = fileName.replace('.md', '');
    const readFile = fs.readFileSync(`posts/${fileName}`, 'utf-8');
    const { data: frontmatter } = matter(readFile);
    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}

export default function Home({ posts }) {
  const data = posts.filter(({ frontmatter }) => frontmatter?.published);
  return <PostList posts={data} />;
}
