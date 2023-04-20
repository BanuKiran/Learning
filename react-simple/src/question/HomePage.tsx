/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { QuestionList } from './QuestionList';
import { getUnansweredQuestions } from './QuestionsData';
import { PrimaryButton } from './Styles';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { gettingUnansweredQuestionsAction, gotUnansweredQuestionsAction, AppState } from './Store';
import Page from 'src/components/Page';

export default function HomePage() {
  const dispatch = useDispatch();
  const questions = useSelector((state: AppState) => state.questions.unanswered);
  const questionsLoading = useSelector((state: AppState) => state.questions.loading);

  React.useEffect(() => {
    const doGetUnansweredQuestions = async () => {
      dispatch(gettingUnansweredQuestionsAction());
      const unansweredQuestions = await getUnansweredQuestions();
      dispatch(gotUnansweredQuestionsAction(unansweredQuestions));
    };
    doGetUnansweredQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  const handleAskQuestionClick = () => {
    navigate('ask');
  };

  return (
    <Page title="Unanswered Questions">
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <PrimaryButton onClick={handleAskQuestionClick}>Ask a question</PrimaryButton>
      </div>
      {questionsLoading ? <div>Loading...</div> : <QuestionList data={questions} />}
    </Page>
  );
}
