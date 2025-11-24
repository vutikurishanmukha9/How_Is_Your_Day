import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string; // e.g., "/" or "/tags/react"
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const getPageUrl = (page: number) => {
        return `${basePath}${basePath.includes('?') ? '&' : '?'}page=${page}`;
    };

    return (
        <nav className="flex justify-center items-center space-x-2 mt-8">
            {/* Previous Button */}
            {currentPage > 1 ? (
                <Link
                    href={getPageUrl(currentPage - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Previous
                </Link>
            ) : (
                <span className="px-4 py-2 border border-gray-200 rounded-md text-gray-400 cursor-not-allowed">
                    Previous
                </span>
            )}

            {/* Page Numbers */}
            {startPage > 1 && (
                <>
                    <Link
                        href={getPageUrl(1)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        1
                    </Link>
                    {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
                </>
            )}

            {pages.map((page) => (
                <Link
                    key={page}
                    href={getPageUrl(page)}
                    className={`px-4 py-2 border rounded-md transition-colors ${page === currentPage
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    {page}
                </Link>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
                    <Link
                        href={getPageUrl(totalPages)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        {totalPages}
                    </Link>
                </>
            )}

            {/* Next Button */}
            {currentPage < totalPages ? (
                <Link
                    href={getPageUrl(currentPage + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Next
                </Link>
            ) : (
                <span className="px-4 py-2 border border-gray-200 rounded-md text-gray-400 cursor-not-allowed">
                    Next
                </span>
            )}
        </nav>
    );
}
