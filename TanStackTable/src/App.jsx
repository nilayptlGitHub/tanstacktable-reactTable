import React, { useEffect } from 'react';
import axios from 'axios';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable, getFilteredRowModel, getPaginationRowModel }from '@tanstack/react-table';
import { Hash, ListTree, NotepadText, IndianRupee, Star, Users, ArrowUpDown, Search, ChevronsLeft, ChevronLeft, ChevronsRight, ChevronRight } from 'lucide-react';

const client = axios.create({
  baseURL: 'https://fakestoreapi.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

const columnsHelper = createColumnHelper()


export default function App() {

  const [data, setData] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  useEffect(() => {
    client
      .get('/products', {
        params: {
          limit: 20,
        },
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data);

      });
  }, []);
  // colums = id , category , description , price , title , rating.rate , rating.count


  const columns = [
    columnsHelper.accessor('id', {
      cell: (value) => value.getValue(),
      header: () => (
        <span className='flex item-center'>
          <Hash className="mr-2" size={16} />ID
        </span>
      ),
    }),

    columnsHelper.accessor('category', {
      cell: (value) => value.getValue(),
      header: () => (
        <span className='flex item-center'>
          <ListTree className="mr-2" size={16} />Category
        </span>
      ),
    }),
    columnsHelper.accessor('price', {
      cell: (value) => value.getValue(),
      header: () => (
        <span className='flex item-center'>
          <IndianRupee className="mr-2" size={16} />Price
        </span>
      ),
    }),
    columnsHelper.accessor('title', {
      cell: (value) => value.getValue(),
      header: () => (
        <span className='flex item-center'>
          <NotepadText className="mr-2" size={16} />Title
        </span>
      ),
    }),
    columnsHelper.accessor('rating.rate', {
      cell: (value) => value.getValue(),
      header: () => (
        <span className='flex item-center'>
          <Star className="mr-2" size={16} />Rating
        </span>
      ),
    }),
    columnsHelper.accessor('rating.count', {
      cell: (value) => value.getValue(),
      header: () => (
        <span className='flex item-center'>
          <Users className="mr-2" size={18} />Rating Count
        </span>
      ),
    }),
    columnsHelper.accessor('description', {
      cell: (value) => value.getValue(),
      size: 200,
      header: () => (
        <span className='flex item-center'>
          <NotepadText className="mr-2" size={16} />Description
        </span>
      ),
    }),

  ]

  const table = useReactTable({
    columns: columns,
    data: data,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),

    getPaginationRowModel: getPaginationRowModel(), // Add this line

  });

  // console.log(table.getHeaderGroups());
  // console.log(table.getRowModel().rows);

  return (
    <div className="flex flex-col min-h-screen max-w-screen	 mx-16 py-12 px-4 sm:px-6 lg:px-8">
      <div className='mb-4 relative flex item-center w-2/3'>
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder='Search...'
          className='w-1/2 pl-10 pr-4 h-10 border border-blue-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-blue-500'
        />
        <Search
          className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400'
          size={20}
        />
      </div>
      <div className='overflow-x-auto bg-while shadow-md rounded-lg'>
        <table className='min-w-3/5 divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            {
              table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) =>
                    <th
                      key={header.id}
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      <div
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none flex item-center' : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown className='ml-2' size={16} />
                      </div>
                    </th>
                  )}
                </tr>
              ))
            }
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700'>
        <div className='flex items-center mb-4 sm:mb-0'>
          <span className='mr-2'>Items per page</span>
          <select
            className="border border-grey-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 15, 20, 25].map((pageSize) => (
              <option key={pageSize} value={pageSize}>{pageSize}</option>
            ))}
          </select>
        </div>

        <div className='flex items-center space-x-2'>
          <button
            className='p-2 rounded-md bg-gray-100 text-grey-600 hover:bg-gray-200 disabled:opacity-50'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            className='p-2 rounded-md bg-gray-100 text-grey-600 hover:bg-gray-200 disabled:opacity-50'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={20} />
          </button>

          <span className='flex items-center'>
            <input
              min={1}
              max={table.getPageCount()}
              type='number'
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0 ;
                table.setPageIndex(page);
              }}
              className='w-16 p-2 rounded-md border-grey-300 text-center'
            />
            <span className='mr-3 ml-1'> / </span>
            <span className='mr-2 ml-2'> {table.getPageCount()}</span>
          </span>


          <button
            className='p-2 rounded-md bg-gray-100 text-grey-600 hover:bg-gray-200 disabled:opacity-50'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={20} />
          </button>

          <button
            className='p-2 rounded-md bg-gray-100 text-grey-600 hover:bg-gray-200 disabled:opacity-50'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
