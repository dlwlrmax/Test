export default function Paginate({ page, setPage, data }) {
  return (
    <div className="flex items-center justify-center space-x-1">
      {
       data?.last_page > 1 ? [...Array(data?.last_page)].map((x, i) => {
          return (
      <button key={i} className={`px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-400 hover:text-white ${page === i + 1 ? 'bg-blue-300' : ''}`} onClick={() => setPage(i + 1)}>
        {i + 1}
      </button>
          )
        }) : ''
      }
    </div>
  );
}
