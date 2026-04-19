import { timeAgo } from "../utils/timeAgo";

const CommentItem = ({ comment, onDelete }) => {
  return (
    <div className="border-b py-3">

      <div className="flex justify-between text-sm text-gray-600">
        <span className="font-semibold">{comment.username}</span>
        <span>{timeAgo(comment.createdAt)}</span>
      </div>

      <p className="mt-1">{comment.content}</p>

      {comment.isMyComment && (
        <button
          onClick={() => onDelete(comment.commentId)}
          className="text-red-500 text-xs mt-1"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default CommentItem;