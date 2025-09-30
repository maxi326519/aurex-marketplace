interface SelectProps {
  name: string;
  value: string;
  label: string;
  list: Array<string | number>;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * @prop { string } name - Input name and id
 * @prop { any } value - Input value
 * @prop { string } label - Input label
 * @prop { Array<string> } list - Items to drop down list
 * @prop { string | undefined} error - Error message to display
 * @prop { () => void } onChange - Function for onChange input
 */
export default function SelectInput({
  name,
  value,
  label,
  list,
  error,
  onChange,
}: SelectProps) {
  return (
    <div>
      <label className="block">
        <span className="block text-sm font-medium text-slate-700">
          {label}
        </span>
        <select
          id={name}
          name={name}
          className="
            rounded-md mt-1 block w-full px-3 py-2 bg-white border border-slate-300 text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
            invalid:border-pink-500 invalid:text-pink-600
            focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
          value={value}
          onChange={onChange}
        >
          <option value="">Seleccionar</option>
          {list &&
            list.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
        </select>
      </label>
      <small>{error}</small>
    </div>
  );
}
