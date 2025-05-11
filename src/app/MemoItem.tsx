"use client";

import { useState } from "react";

export default function MemoItem({ id, content, tags, onDelete }: { id: string; content: string; tags: string[]; onDelete: () => void }) {
  const [showDialog, setShowDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(false);

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

  const handleOtpChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOtp(value);

    try {

      let port = 9999;

      if(window.location.hostname === "192.168.219.113") {
        port = 3333;
      }

      const api = `${window.location.protocol}//${window.location.hostname}:${port}/api/auth`;

      const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });

      if (response.status === 200) {
        setIsOtpValid(true);
      } else {
        setIsOtpValid(false);
      }
    } catch (error) {
      console.error("Error validating OTP:", error);
      setIsOtpValid(false);
    }
  };

  return (
    <div className="memo">
      <div className="memo-header flex justify-end space-x-2">
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
            <p className="mb-4">Enter OTP to confirm deletion:</p>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              className="border border-gray-300 rounded p-2 w-full mb-4"
              placeholder="Enter OTP"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
              >
                NO
              </button>
              <button
                onClick={handleDelete}
                className={`py-2 px-4 rounded text-white ${isOtpValid ? "bg-red-500 hover:bg-red-600" : "bg-gray-300 cursor-not-allowed"}`}
                disabled={!isOtpValid}
              >
                YES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}