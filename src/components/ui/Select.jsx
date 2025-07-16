export function Select({ children, className = "", ...props }) {
  return (
    <select
      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SelectValue({ value }) {
  return <span>{value}</span>;
}

export function SelectContent({ children }) {
  return (
    <div className="mt-1 border rounded shadow-sm bg-white">{children}</div>
  );
}

export function SelectItem({ value, children, ...props }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}
