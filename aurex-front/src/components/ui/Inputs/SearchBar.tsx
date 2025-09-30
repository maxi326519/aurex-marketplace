import { Search } from "lucide-react";

interface InputProps {
  name: string;
  value: string | number | undefined;
  type?: string;
  formulated?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

/**
 * @prop { string } name - Input name and id
 * @prop { any } value - Input value
 * @prop { string | undefined } type - Input type
 * @prop { string | undefined} error - Error message to display
 * @prop { boolean | undefined} formulated - If input should be disabled
 * @prop { () => void } onChange - Function for onChange input
 * @prop { () => void } onSearch - Function for execute to search
 * @prop { string | undefined } placeholder - Input placeholder
 * @prop { boolean | undefined} disabled - If input should be disabled
 */
export default function SearchBar({
  name,
  value,
  type = "text",
  formulated = false,
  disabled = false,
  onChange,
  onSearch,
  placeholder,
}: InputProps) {
  return (
    <div className="flex rounded-lg bg-white overflow-hidden">
      <input
        id={name}
        name={name}
        className="flex-grow text-black p-2"
        value={value}
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        disabled={formulated || disabled}
      />
      <button className="px-2 p-2 hover:bg-gray-200" onClick={() => onSearch()}>
        <Search color="#444" />
      </button>
    </div>
  );
}
