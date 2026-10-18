import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
    totalEntries,
    entriesPerPage,
    currentPage,
    onPageChange,
    onEntriesChange
}) => {
    const totalPages = Math.ceil(totalEntries / (entriesPerPage === 'All' ? totalEntries : entriesPerPage));

    // Handle "All" case
    const isAll = entriesPerPage === 'All';
    const startEntry = isAll ? 1 : (currentPage - 1) * entriesPerPage + 1;
    const endEntry = isAll ? totalEntries : Math.min(currentPage * entriesPerPage, totalEntries);

    if (totalEntries === 0) return null;

    return (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                    className="form-select text-sm py-1 px-2"
                    style={{ width: 'auto' }}
                    value={entriesPerPage}
                    onChange={(e) => {
                        const val = e.target.value === 'All' ? 'All' : Number(e.target.value);
                        onEntriesChange(val);
                        onPageChange(1); // Reset to first page
                    }}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value="All">All</option>
                </select>
                <span>entries</span>
                <span className="ml-4 text-gray-500">
                    Showing {startEntry} to {endEntry} of {totalEntries} entries
                </span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    className="btn btn-outline p-1.5"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isAll}
                >
                    <ChevronLeft size={16} />
                </button>

                <span className="px-3">
                    Page {currentPage} of {totalPages || 1}
                </span>

                <button
                    className="btn btn-outline p-1.5"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isAll}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
