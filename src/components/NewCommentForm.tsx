import React, { useEffect, useState } from 'react';
import { newComment } from '../api/newComment';
import { Comment } from '../types/Comment';
import classNames from 'classnames';

type Props = {
  postId: number;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

export const NewCommentForm: React.FC<Props> = ({ postId, setComments }) => {
  const [currentName, setCurrentName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentBody, setCurrentBody] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isBodyError, setIsBodyError] = useState(false);

  const resetForm = (reason: 'submit' | 'clear') => {
    if (reason === 'clear') {
      setCurrentName('');
      setCurrentEmail('');
    }

    setCurrentBody('');
    setIsNameError(false);
    setIsEmailError(false);
    setIsBodyError(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentName(event.target.value);
    if (isNameError) {
      setIsNameError(false);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEmail(event.target.value);
    if (isEmailError) {
      setIsEmailError(false);
    }
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentBody(event.target.value);
    if (isBodyError) {
      setIsBodyError(false);
    }
  };

  const validateName = (testedName: string) => {
    if (testedName.trim() === '') {
      setIsNameError(true);
    }

    return testedName.trim().length > 0;
  };

  const validateEmail = (testedEmail: string) => {
    if (!/\S+@\S+\.\S+/.test(testedEmail)) {
      setIsEmailError(true);
    }

    return /\S+@\S+\.\S+/.test(testedEmail);
  };

  const validateCommentBody = (testedBody: string) => {
    if (testedBody.trim() === '') {
      setIsBodyError(true);
    }

    return testedBody.trim().length > 0;
  };

  const validateForm = () => {
    validateName(currentName);
    validateEmail(currentEmail);
    validateCommentBody(currentBody);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    validateForm();

    if (
      validateName(currentName) &&
      validateEmail(currentEmail) &&
      validateCommentBody(currentBody)
    ) {
      setIsAddingComment(true);
    }
  };

  useEffect(() => {
    if (!isAddingComment || isNameError || isEmailError || isBodyError) {
      return;
    }

    newComment({
      name: currentName,
      email: currentEmail,
      body: currentBody,
      postId: postId,
    }).then((data: unknown) => {
      const dataAsComment = data as Comment;

      setComments(prevComments => [...prevComments, dataAsComment]);
      resetForm('submit');
      setIsAddingComment(false);
    });
  }, [isAddingComment]);

  return (
    <form data-cy="NewCommentForm" onSubmit={handleSubmit}>
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={classNames('input', {
              'is-danger': isNameError,
            })}
            value={currentName}
            onChange={event => handleNameChange(event)}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {isNameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {isNameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={classNames('input', {
              'is-danger': isEmailError,
            })}
            value={currentEmail}
            onChange={event => handleEmailChange(event)}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {isEmailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {isEmailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={classNames('textarea', {
              'is-danger': isBodyError,
            })}
            value={currentBody}
            onChange={event => handleBodyChange(event)}
          />
        </div>

        {isBodyError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button is-link', {
              'is-loading': isAddingComment,
            })}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="button is-link is-light"
            onClick={() => resetForm('clear')}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
