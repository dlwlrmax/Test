export default function Input({ type, value, title, placeholder, onChange, errors, name }) {
  return (
    <div className="mb-4">
      <label
        htmlFor="name"
        className="block font-medium text-gray-700 mb-2"
      >
        {title}
      </label>
      <input
        type={type}
        name={name}
        className="shadow-sm text-gray-900 rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={placeholder}
        onChange={onChange}
      />
      {errors?.hasOwnProperty(name) ? (
        <div className="text-red-400 text-sm red">{errors[name]}</div>
      ) : (
        ""
      )}
    </div>
  );
}
