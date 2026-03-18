"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditDateButton({
    id,
    currentDate,
}: {
    id: number;
    currentDate: string;
}) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [date, setDate] = useState(currentDate);

    async function handleSave() {
        await fetch(`/api/comics/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publishedAt: new Date(date).toISOString() }),
        });
        setEditing(false);
        router.refresh();
    }

    if (editing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-gray-700 bg-gray-800 text-gray-100 rounded px-2 py-1 text-sm"
                />
                <button
                    onClick={handleSave}
                    className="text-green-400 hover:underline text-sm"
                >
                    Save
                </button>
                <button
                    onClick={() => {
                        setDate(currentDate);
                        setEditing(false);
                    }}
                    className="text-gray-400 hover:underline text-sm"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setEditing(true)}
            className="hover:underline text-gray-400"
            title="Click to edit date"
        >
            {new Date(currentDate).toLocaleDateString()}
        </button>
    );
}
