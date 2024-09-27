import { useTheme } from "@/components/theme-provider";
import { createSnippetStore } from "@/stores/snippets";
import { type LanguageName, langNames } from "@uiw/codemirror-extensions-langs";
import { vscodeDarkInit, vscodeLightInit } from "@uiw/codemirror-theme-vscode";
import type { CreateThemeOptions } from "@uiw/codemirror-themes";
import {
  type BasicSetupOptions,
  EditorView,
  type Extension,
  keymap,
} from "@uiw/react-codemirror";

const basicSetup: BasicSetupOptions = {
  searchKeymap: false,
  highlightActiveLineGutter: false,
  highlightActiveLine: false,
};

const themeExtension = (theme: string | undefined): Extension => {
  const settings: Partial<CreateThemeOptions> = {
    settings: {
      fontSize: "1em",
      background: "hsl(var(--background))",
      gutterBackground: "hsl(var(--background))",
      selection: "transparent",
      selectionMatch: "rgba(95, 154, 243, 0.4)",
    },
  };

  return [
    theme === "dark" ? vscodeDarkInit(settings) : vscodeLightInit(settings),
    EditorView.theme({
      "&": {
        height: "100%",
      },
    }),
  ];
};

const supportedLanguages = [
  "c",
  "csharp",
  "kotlin",
  "typescript",
  "html",
  "css",
  "python",
  "markdown",
  "sql",
  "rust",
  "java",
  "cpp",
  "go",
  "ruby",
  "php",
  "javascript",
  "dart",
];

const languageSupported = langNames
  .filter((lang) => supportedLanguages.includes(lang))
  .sort();

const capitalizeLangName = (lang: LanguageName): string => {
  const name = lang.charAt(0).toUpperCase() + lang.slice(1);
  const specialCases: { [key: string]: string } = {
    cpp: "C++",
    csharp: "C#",
    html: "HTML",
    javascript: "JavaScript",
    typescript: "TypeScript",
    css: "CSS",
    sql: "SQL",
    php: "PHP",
  };

  return specialCases[lang] || name;
};

const getSelection = (view: EditorView) => {
  const { state } = view;
  const range = state.selection.main;
  const startLine = state.doc.lineAt(range.from).number;
  const endLine = state.doc.lineAt(range.to).number;
  const selected = state.doc.sliceString(range.from, range.to);
  return { startLine, endLine, selected, isSelected: true };
};

const createSelection = (
  set: (value: {
    startLine: number;
    endLine: number;
    selected: string;
    isSelected: boolean;
  }) => void,
): Extension => {
  return keymap.of([
    {
      key: "Ctrl-k",
      run: (view: EditorView) => {
        const selected = getSelection(view);
        set(selected);
        return true;
      },
    },
  ]);
};

const useEditor = () => {
  const { theme } = useTheme();

  const { setSelection } = createSnippetStore((state) => state);

  const selectedWrap = (): Extension => createSelection(setSelection);

  return {
    basicSetup,
    theme: () => themeExtension(theme),
    languageSupported,
    capitalizeLangName,
    selectedWrap,
  };
};

export default useEditor;
