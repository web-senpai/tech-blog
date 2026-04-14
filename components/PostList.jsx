import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const POSTS_PER_PAGE = 4;

const SIDEBAR_SECTIONS = [
  {
    label: 'Frameworks',
    tags: ['React Native', 'Flutter', 'Jetpack Compose', 'SwiftUI', 'React', 'Redux'],
  },
  {
    label: 'Tools',
    tags: ['Firebase', 'Sequelize', 'VSCode'],
  },
  {
    label: 'Architecture',
    tags: ['Architecture', 'MVVM', 'MVI', 'Repository Pattern', 'Clean Architecture'],
  },
];

const truncate = (text, len = 110) =>
  text && text.length > len ? text.slice(0, len) + '\u2026' : text || '';

// Normalise tags — handles arrays, space-delimited strings, and malformed YAML
const getTags = (frontmatter) => {
  if (!frontmatter.tags) return [];
  if (Array.isArray(frontmatter.tags)) return frontmatter.tags;
  return String(frontmatter.tags).split(/[\s,]+/).filter(Boolean);
};

const PostList = ({ posts }) => {
  const [activeTag, setActiveTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getTagCount = (tag) =>
    posts.filter(({ frontmatter }) =>
      getTags(frontmatter).some((t) => t.toLowerCase() === tag.toLowerCase())
    ).length;

  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter(({ frontmatter }) =>
      getTags(frontmatter).some((t) => t.toLowerCase() === activeTag.toLowerCase())
    );
  }, [posts, activeTag]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleTagClick = (tag) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3)
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="flex gap-8 py-8 px-4 max-w-screen-xl mx-auto">

      {/* ── Sidebar ── */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-20 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Browse</p>
          </div>

          <div className="p-3 space-y-5">
            {/* All posts */}
            <button
              onClick={() => { setActiveTag(null); setCurrentPage(1); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                !activeTag
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>All Posts</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  !activeTag ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {posts.length}
              </span>
            </button>

            {/* Sections */}
            {SIDEBAR_SECTIONS.map((section) => {
              const available = section.tags.filter((t) => getTagCount(t) > 0);
              if (available.length === 0) return null;
              return (
                <div key={section.label}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">
                    {section.label}
                  </p>
                  <ul className="space-y-0.5">
                    {available.map((tag) => (
                      <li key={tag}>
                        <button
                          onClick={() => handleTagClick(tag)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
                            activeTag === tag
                              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                              : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                          }`}
                        >
                          <span>{tag}</span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                              activeTag === tag
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {getTagCount(tag)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">

        {/* Results bar */}
        <div className="flex items-center justify-between mb-6 min-h-7">
          <p className="text-sm text-gray-500">
            {activeTag ? (
              <>
                <span className="font-semibold text-gray-800">{filteredPosts.length}</span>
                {' '}post{filteredPosts.length !== 1 ? 's' : ''} tagged{' '}
                <span className="font-semibold text-indigo-600">&ldquo;{activeTag}&rdquo;</span>
              </>
            ) : (
              <>
                Showing all{' '}
                <span className="font-semibold text-gray-800">{filteredPosts.length}</span>{' '}
                posts
              </>
            )}
          </p>
          {activeTag && (
            <button
              onClick={() => { setActiveTag(null); setCurrentPage(1); }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Post grid */}
        {paginatedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 space-y-3">
            <div className="text-5xl">&#128240;</div>
            <p className="text-sm font-medium">No posts found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {paginatedPosts.map(({ slug, frontmatter }) => (
              <Link
                href={`/post/${slug}`}
                key={slug}
                className="group flex flex-col rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Banner image */}
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    fill
                    style={{ objectFit: 'cover' }}
                    alt={frontmatter.title}
                    src={`/${frontmatter.socialImage}`}
                  />
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h2 className="text-base font-semibold leading-snug text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {frontmatter.title}
                  </h2>
                  {frontmatter.metaDesc && (
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {truncate(frontmatter.metaDesc)}
                    </p>
                  )}
                  {getTags(frontmatter).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                      {getTags(frontmatter).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-1.5 mt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
            >
              &larr; Prev
            </button>

            {pageNumbers().map((page, i) =>
              page === '...' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none"
                >
                  &hellip;
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
            >
              Next &rarr;
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default PostList;
