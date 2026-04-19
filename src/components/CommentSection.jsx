import { useEffect, useState } from "react";
import {
  getComments,
  addComment,
  deleteComment,
} from "../api/commentApi";
import CommentItem from "./CommentItem";

const CommentSection = ({ problemId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const fetchComments = async () => {
    try {
      const res = await getComments(problemId);
      setComments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [problemId]);

  const handleAdd = async () => {
    if (!content.trim()) return;

    try {
      await addComment(problemId, { content });
      setContent("");
      fetchComments();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding comment");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComment(id);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-6">

      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      {/* Add Comment */}
      <div className="flex gap-2 mb-4">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Post
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Comments List */}
      {comments.map((c) => (
        <CommentItem
          key={c.commentId}
          comment={c}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default CommentSection;