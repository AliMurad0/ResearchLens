import { useTheme } from "../../hooks/useTheme";
import { IconSun, IconMoon } from "../icons/icons";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full border border-paper-line text-ink-faint hover:text-lamp hover:border-lamp/40 transition-colors ${className}`}
    >
      {theme === "dark" ? <IconSun size={15} /> : <IconMoon size={15} />}
    </button>
  );
}
