/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { gray2, gray3 } from './Styles';

import React from 'react';
import { QuestionData } from './QuestionsData';

import { Link } from 'react-router-dom';

interface Props {
  data: QuestionData;
  showContent?: boolean;
}

export const Question = ({ data, showContent = true }: Props) => (
  <div
    css={css`
      padding: 10px 0px;
    `}
  >
    <Link
      css={css`
        text-decoration: none;
        color: ${gray2};
      `}
      to={`/dashboard/questions/${data.questionid}`}
    >
      {data.title}
    </Link>
    {data.subject}
    {showContent && (
      <div
        css={css`
          padding-bottom: 10px;
          font-size: 15px;
          color: ${gray2};
        `}
      >
        {data.content.length > 50 ? `${data.content.substring(0, 50)}...` : data.content}
      </div>
    )}
    <div
      css={css`
        font-size: 12px;
        font-style: italic;
        color: ${gray3};
      `}
    >
      {`Asked by ${data.username} on
        ${data.created.toLocaleDateString()} ${data.created.toLocaleTimeString()}`}
    </div>
  </div>
);
