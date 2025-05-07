"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WriteMemoForm() {
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async () => {

    const response = await fetch('/api/memo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, tags: tags.split(',').map(tag => tag.trim()) }),
    });

    if (response.ok) {
      router.push('/');
    } else {
      alert('Failed to create memo');
    }
  };

  return (
    <div className="memo-form p-10">
      <h1 className="text-xl font-bold mb-4">Create Memo</h1>
      <textarea
        className="w-full border p-2 mb-4"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button className="btn" onClick={handleSubmit}>Create</button>
    </div>
  );
}