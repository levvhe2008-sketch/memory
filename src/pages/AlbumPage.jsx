import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Modal from "react-modal";
import { supabase } from "../lib/supabase";

Modal.setAppElement("#root");

export default function AlbumPage() {
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [modalPhoto, setModalPhoto] = useState(null);

  async function loadPhotos() {
    const { data, error } = await supabase.from("media").select("*").eq("album_id", id).order("created_at", { ascending: false });
    if (error) console.error(error);
    else setPhotos(data);
  }

  useEffect(() => { loadPhotos(); }, [id]);

  async function uploadFile(file) {
    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { error: storageError } = await supabase.storage.from("albums").upload(fileName, file);
    if (storageError) { alert("Ошибка загрузки: " + storageError.message); setUploading(false); return; }
    const { publicURL } = supabase.storage.from("albums").getPublicUrl(fileName);
    const { data: dbData, error: dbError } = await supabase.from("media").insert([{ album_id: id, file_url: publicURL }]).select();
    if (dbError) alert("Ошибка сохранения: " + dbError.message);
    else setPhotos([dbData[0], ...photos]);
    setUploading(false);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files.forEach(uploadFile),
    multiple: true,
    accept: { "image/*": [] },
  });

  async function deletePhoto(photo) {
    if (!confirm("Удалить фото?")) return;
    const path = photo.file_url.split("/").pop();
    await supabase.storage.from("albums").remove([path]);
    await supabase.from("media").delete().eq("id", photo.id);
    setPhotos(photos.filter((p) => p.id !== photo.id));
  }

  return (
    <div className="mt-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Album</h2>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p className="text-blue-600">Отпустите файлы для загрузки</p> : <p>Перетащите фото сюда или кликните для выбора</p>}
        {uploading && <p className="text-gray-500 mt-2">Загрузка...</p>}
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-6">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="break-inside-avoid relative mb-4 overflow-hidden rounded-lg shadow-lg cursor-pointer opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <img
              src={photo.file_url}
              alt="photo"
              className="w-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              onClick={() => setModalPhoto(photo.file_url)}
            />
            <button
              onClick={() => deletePhoto(photo)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
              title="Удалить"
            >×</button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!modalPhoto}
        onRequestClose={() => setModalPhoto(null)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-70"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <img src={modalPhoto} alt="Preview" className="max-h-[90vh] max-w-full rounded-lg" />
      </Modal>
    </div>
  );
}
