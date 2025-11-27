import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function CreateAlbumForm({ onAlbumCreated }) {
  const [title, setTitle] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title) return;

    const { data, error } = await supabase
      .from("albums")
      .insert([{ title }])
      .select();

    if (error) alert("Ошибка: " + error.message);
    else { setTitle(""); onAlbumCreated(data[0]); }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Название альбома"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 px-3 py-2 border rounded-lg"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Создать
      </button>
    </form>
  );
}

export default function Dashboard() {
  const [albums, setAlbums] = useState([]);

  async function loadAlbums() {
    const { data, error } = await supabase.from("albums").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setAlbums(data);
  }

  useEffect(() => { loadAlbums(); }, []);

  function handleAlbumCreated(newAlbum) {
    setAlbums([newAlbum, ...albums]);
  }

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-4">Your Albums</h2>
      <CreateAlbumForm onAlbumCreated={handleAlbumCreated} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums.map((album) => (
          <div
            key={album.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => (window.location.href = `/album/${album.id}`)}
          >
            <h3 className="text-xl font-semibold">{album.title}</h3>
            <p className="text-gray-500 text-sm mt-1">
              {new Date(album.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
