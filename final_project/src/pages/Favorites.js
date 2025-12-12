import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MapPin, Building2, Zap, Tag, Trash2,
  Edit2, Plus, X, Search, StickyNote
} from "lucide-react";

const API_URL = "https://6936218cfa8e704dafbfb8ac.mockapi.io/favorites";


/* --------------------------------------------
   Basic UI Components (Tailwind Only)
---------------------------------------------*/

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={
        `px-3 py-2 rounded-lg text-sm font-medium transition 
         active:scale-[0.98] ${className}`
      }
    >
      {children}
    </button>
  );
}

function Badge({ children, className = "" }) {
  return (
    <span className={`px-2 py-1 text-xs rounded-md font-medium ${className}`}>
      {children}
    </span>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-slate-300 
        bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${props.className}`}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-slate-300 
      bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${props.className}`}
    />
  );
}

/* Modal (Dialog) */
function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}


/* --------------------------------------------
   Favorites Page
---------------------------------------------*/

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingFavorite, setEditingFavorite] = useState(null);
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(null);


  /* Fetch Favorites */
  const loadFavorites = async () => {
    const res = await fetch(API_URL);
    setFavorites(await res.json());
  };

  /* Update Favorite */
  const saveFavorite = async () => {
    await fetch(`${API_URL}/${editingFavorite.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editingFavorite,
        notes: editNotes,
        tags: editTags,
      }),
    });
    setEditingFavorite(null);
    loadFavorites();
  };

  /* Delete Favorite */
  const deleteFavorite = async () => {
    await fetch(`${API_URL}/${deleteConfirm.id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    loadFavorites();
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const filtered = favorites.filter(f =>
    f.station_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const startEdit = fav => {
    setEditingFavorite(fav);
    setEditNotes(fav.notes || "");
    setEditTags(fav.tags || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur sticky top-0 border-b border-slate-200 z-20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">즐겨찾기</h1>
              <p className="text-sm text-slate-500">저장한 충전소 목록</p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" />
            <Input
              placeholder="충전소 이름, 주소, 태그 검색..."
              className="pl-10 bg-slate-50 border-0"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>


      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence>
          {filtered.map((fav, index) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 mb-4 hover:shadow-md transition">
                
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-bold">{fav.station_name}</h2>
                    <div className="flex items-center text-sm text-slate-500 gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{fav.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      className="text-slate-500 hover:text-teal-600"
                      onClick={() => startEdit(fav)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>

                    <Button
                      className="text-slate-400 hover:text-red-600"
                      onClick={() => setDeleteConfirm(fav)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-slate-600 mt-3">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {fav.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-slate-400" />
                    {fav.charger_type}
                  </div>
                </div>

                {fav.notes && (
                  <div className="mt-4 bg-amber-50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-amber-700">
                      <StickyNote className="w-4 h-4" />
                      <span className="font-medium text-sm">메모</span>
                    </div>
                    <p className="text-sm mt-1 text-slate-700">{fav.notes}</p>
                  </div>
                )}

                {fav.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {fav.tags.map((tag, i) => (
                      <Badge key={i} className="bg-teal-50 text-teal-700 flex items-center">
                        <Tag className="w-3 h-3 mr-1" /> {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>


      {/* Edit Modal */}
      <Modal open={!!editingFavorite} onClose={() => setEditingFavorite(null)}>
        <h2 className="text-xl font-bold mb-4">즐겨찾기 편집</h2>

        <p className="font-medium">{editingFavorite?.station_name}</p>
        <p className="text-sm text-slate-500 mb-4">{editingFavorite?.address}</p>

        <label className="text-sm font-medium">메모</label>
        <Textarea
          rows={3}
          value={editNotes}
          onChange={e => setEditNotes(e.target.value)}
          className="mt-1 mb-4"
        />

        <label className="text-sm font-medium">태그</label>
        <div className="flex gap-2 mt-2 mb-3">
          <Input
            placeholder="태그 추가"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => e.key === "Enter" && setEditTags([...editTags, newTag])}
          />
          <Button
            className="bg-slate-200"
            onClick={() => {
              if (newTag.trim()) {
                setEditTags([...editTags, newTag.trim()]);
                setNewTag("");
              }
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {editTags.map((tag, i) => (
            <Badge
              key={i}
              className="bg-teal-100 text-teal-700 cursor-pointer"
              onClick={() => setEditTags(editTags.filter((_, idx) => idx !== i))}
            >
              {tag}
              <X className="w-3 h-3 inline-block ml-1" />
            </Badge>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button className="bg-slate-100" onClick={() => setEditingFavorite(null)}>
            취소
          </Button>
          <Button className="bg-teal-500 text-white" onClick={saveFavorite}>
            저장
          </Button>
        </div>
      </Modal>


      {/* Delete Modal */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <h2 className="text-xl font-semibold mb-4">즐겨찾기 삭제</h2>

        <p className="text-slate-600 mb-6">
          "{deleteConfirm?.station_name}" 을(를) 삭제하시겠습니까?
        </p>

        <div className="flex justify-end gap-2">
          <Button className="bg-slate-100" onClick={() => setDeleteConfirm(null)}>
            취소
          </Button>
          <Button className="bg-red-500 text-white" onClick={deleteFavorite}>
            삭제
          </Button>
        </div>
      </Modal>

    </div>
  );
}
