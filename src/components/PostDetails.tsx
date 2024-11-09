import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import { Errors } from '../types/Errors';
import { getComments, deleteComment } from '../api/comments';

type Props = {
  post: Post;
  newCommentCreating: boolean;
  setNewCommentCreating: (value: boolean) => void;
};

export const PostDetails: React.FC<Props> = ({
  post,
  newCommentCreating,
  setNewCommentCreating,
}) => {
  const { id, title, body } = post;

  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [currentError, setCurrentError] = useState<Errors | null>(null);

  const handleDeleteComment = (comment: Comment) => {
    setComments(comments.filter(c => c.id !== comment.id));

    deleteComment(comment.id).catch(() => {
      setComments([...comments, comment]);
      setCurrentError(Errors.CommentDeleting);
    });
  };

  useEffect(() => {
    if (!post) {
      return;
    }

    setIsCommentsLoading(true);
    setComments([]);

    getComments(id)
      .then(setComments)
      .catch(() => setCurrentError(Errors.CommentsLoading))
      .finally(() => {
        setIsCommentsLoading(false);
      });
  }, [post]);

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">{`#${id}: ${title}`}</h2>

          <p data-cy="PostBody">{body}</p>
        </div>

        <div className="block">
          {isCommentsLoading && <Loader />}

          {currentError === Errors.CommentsLoading && !isCommentsLoading && (
            <div className="notification is-danger" data-cy="CommentsError">
              Something went wrong
            </div>
          )}

          {comments.length === 0 && !isCommentsLoading && (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          )}

          {!isCommentsLoading && comments.length > 0 && (
            <>
              <p className="title is-4">Comments:</p>

              {comments.map(comment => (
                <article
                  className="message is-small"
                  data-cy="Comment"
                  key={comment.id}
                >
                  <div className="message-header">
                    <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                      {comment.name}
                    </a>
                    <button
                      data-cy="CommentDelete"
                      type="button"
                      className="delete is-small"
                      aria-label="delete"
                      onClick={() => handleDeleteComment(comment)}
                    >
                      delete button
                    </button>
                  </div>

                  <div className="message-body" data-cy="CommentBody">
                    {comment.body}
                  </div>
                </article>
              ))}
            </>
          )}

          {!newCommentCreating && !isCommentsLoading && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              onClick={() => setNewCommentCreating(true)}
            >
              Write a comment
            </button>
          )}
        </div>

        {newCommentCreating && (
          <NewCommentForm postId={id} setComments={setComments} />
        )}
      </div>
    </div>
  );
};
