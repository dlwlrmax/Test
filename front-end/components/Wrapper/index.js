export default function Wrapper({ children }) {
  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-900">
      {children}
    </div>
  );
}
