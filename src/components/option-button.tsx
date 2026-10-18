export function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className={selected ? "option-button option-button-active" : "option-button"}>
      {label}
    </button>
  );
}
