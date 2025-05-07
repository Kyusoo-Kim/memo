"use client";

import { useRouter } from "next/navigation";

export default function MemoItem({ id, content, tags, onDelete }: { id: string; content: string; tags: string[]; onDelete: () => void }) {
  const handleDelete = async () => {
    const response = await fetch(`/api/memo`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      onDelete(); // Call the onDelete callback to refresh the data
    } else {
      alert("Failed to delete memo");
    }
  };

  const handleCopy = () => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed"; // Prevent scrolling to bottom of page
      textarea.style.opacity = "0"; // Make it invisible
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);      
    } catch (error) {
      console.error("Failed to copy content:", error);
      alert("Failed to copy content. Please try again.");
    }
  };

  return (
    <div className="memo">
      <div className="memo-header flex justify-end space-x-2">
        <button onClick={handleCopy} className="text-blue-500 hover:text-blue-700 cursor-pointer">
          📋
        </button>
        <button onClick={handleDelete} className="text-red-500 hover:text-red-700 cursor-pointer">
          ❌
        </button>
      </div>
      <div className="memo-content" style={{ whiteSpace: "pre-wrap" }}>{content}</div>
      <div className="memo-footer">
        <hr className="mt-5 mb-5" />
        <div className="memo-tags">
          TAG : {tags.map((tag) => `#${tag}`).join(" ")}
        </div>
      </div>
    </div>
  );
}