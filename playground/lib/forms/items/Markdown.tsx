import ReactMarkdown from "react-markdown";
import { FormItemConfig } from "../type";

export const Markdown = ({ tip }: FormItemConfig) => {
  return (
    <div className="prose prose-base max-w-none prose-pre:bg-white prose-pre:text-black border rounded-sm">
      <ReactMarkdown>{tip}</ReactMarkdown>
    </div>
  )
}