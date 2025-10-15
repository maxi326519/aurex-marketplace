interface TextAreaInputData {
  name: string;
  value: string;
  label: string;
  className?: string;
  formulated?: boolean;
  error?: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

/**
 * @prop { string } name - Textarea name and id
 * @prop { string } value - Textarea value
 * @prop { string } label - Textarea label
 * @prop { string | undefined} className - Textarea class name
 * @prop { string | undefined} error - Error message to display
 * @prop { boolean | undefined} formulated - If textarea should be disabled
 * @prop { boolean | undefined} disabled - If textarea should be disabled
 * @prop { () => void } onChange - Function for onChange textarea
 */
export default function TextAreaInput({
  name,
  value,
  label,
  className = "",
  error = "",
  formulated = false,
  disabled = false,
  onChange,
}: TextAreaInputData) {
  return (
    <div>
      <label className="block">
        <span className="block text-sm font-medium text-slate-700">
          {label}
        </span>
        <textarea
          className={`
            mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm placeholder-slate-400
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
            invalid:border-pink-500 invalid:text-pink-600
            focus:invalid:border-pink-500 focus:invalid:ring-pink-500
            h-48
            ${formulated ? 'bg-gray-100' : ''}
            ${className}`}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={formulated || disabled}
        />
      </label>
      <small>{error}</small>
    </div>
  );
}
