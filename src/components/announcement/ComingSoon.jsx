
const ComingSoon = (props) => {
  const feature = props.feature || "Ini";
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="bg-white shadow-lg rounded-2xl px-10 py-12 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-emerald-950 mb-4">
          Coming Soon 🚧
        </h1>
        <p className="text-gray-600 text-base mb-6">
          Fitur <span className="font-semibold text-emerald-700">
            {feature}
          </span> sedang dalam tahap pengembangan.
        </p>
        <div className="text-sm text-gray-500">
          Nantikan update selanjutnya.
        </div>
      </div>
    </div>
  )
}

export default ComingSoon