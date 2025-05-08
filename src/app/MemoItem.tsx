"use client";

import { useState } from "react";

export default function MemoItem({ id, content, tags, onDelete }: { id: string; content: string; tags: string[]; onDelete: () => void }) {
  const [showDialog, setShowDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
    setShowDialog(false); // Close the dialog after deletion
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

      // Show Toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1000); // Hide Toast after 1 second
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
        <button onClick={() => setShowDialog(true)} className="text-red-500 hover:text-red-700 cursor-pointer">
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

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to delete this memo?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
              >
                NO
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                YES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
          Content copied to clipboard!
        </div>
      )}
    </div>
  );
}