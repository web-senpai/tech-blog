import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
const PostList = ({ posts }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 py-8 mx-2'>
      {posts.map(({ slug, frontmatter }) => (
        <div
          key={slug}
          className='border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col '
        >
          <Link href={`/post/${slug}`}>
            <a>
              <Image
                width={650}
                height={340}
                alt={frontmatter.title}
                src={`/${frontmatter.socialImage}`}
              />
              <h1 className='p-4'>{frontmatter.title}</h1>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostList;
