import { useState } from "react";
import { toast } from "react-toastify";

export default function FavoriteButton({ productId, isFavoriteInit }) {
  const [isFav, setIsFav] = useState(isFavoriteInit);

  const toggleFavorite = async () => {
    try {
      const url = isFav ? "/favorite/remove" : "/favorite/add";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });

      const data = await res.json();

      if (data.EC === 0) {
        toast.success(data.EM || "Thành công!");
        setIsFav(!isFav);
      } else {
        toast.error(data.EM || "Lỗi!");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống!");
    }
  };

  return <button onClick={toggleFavorite}>{isFav ? "❤️" : "🤍"}</button>;
}
