export function Dialog({ children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {children}
    </div>
  );
}

export function DialogContent({ children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4 font-semibold text-lg">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold mb-2">{children}</h2>;
}

export function DialogTrigger({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      {children}
    </button>
  );
}

export function DialogClose({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
    >
      {children}
    </button>
  );
}
