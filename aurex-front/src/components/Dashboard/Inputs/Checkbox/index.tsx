interface CheckboxProps {
  name: string;
  value: boolean;
  label: string;
  onCheck: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * @prop { string } name - Input name and id
 * @prop { any } value - Input value
 * @prop { string } label - Input label
 * @prop { () => void } onCheck - Function for onChange input
 */
export default function Checkbox({
  name,
  value = false,
  label,
  onCheck,
}: CheckboxProps) {
  return (
    <div className="form-check flex flex-row items-center justify-start gap-1">
      <label htmlFor={name} className="form-check-label leading-[1.2]">
        <input
          id={name}
          name={name}
          className="mr-1 form-check-input"
          type="checkbox"
          checked={value}
          onChange={onCheck}
        />
        {label}
      </label>
    </div>
  );
}
