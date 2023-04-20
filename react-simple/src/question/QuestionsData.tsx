import { http } from './http';

export interface QuestionData {
  questionid: number;
  title: string;
  content: string;
  username: string;
  created: Date;
  subject: string;
  answers: AnswerData[];
}
export interface AnswerData {
  answerid: number;
  content: string;
  username: string;
  created: Date;
}
export interface QuestionDataFromServer {
  questionid: number;
  title: string;
  content: string;
  username: string;
  created: string;
  subject: string;
  answers: Array<{
    answerid: number;
    content: string;
    username: string;
    created: string;
  }>;
}

const questions: QuestionData[] = [
  {
    questionid: 1,
    title: 'Why should I learn TypeScript?',
    content:
      'TypeScript seems to be getting popular so I wondered whether it is worth my time learning it? What benefits does it give over JavaScript?',
    username: 'Bob',
    subject: 'Maths',
    created: new Date(),
    answers: [
      {
        answerid: 1,
        content: 'To catch problems earlier speeding up your developments',
        username: 'Jane',
        created: new Date(),
      },
      {
        answerid: 2,
        content: 'So, that you can use the JavaScript features of tomorrow, today',
        username: 'Fred',
        created: new Date(),
      },
    ],
  },
  {
    questionid: 2,
    title: 'Which state management tool should I use?',
    content:
      'There seem to be a fair few state management tools around for React - React, Unstated, ... Which one should I use?',
    username: 'Bob',
    subject: 'Science',
    created: new Date(),
    answers: [],
  },
];

export const getUnansweredQuestions = async (): Promise<QuestionData[]> => {
  await wait(500);
  return questions.filter((q) => q.answers.length === 0);
};
export const mapQuestionFromServer = (question: QuestionDataFromServer): QuestionData => ({
  ...question,
  created: new Date(question.created),
  answers: question.answers
    ? question.answers.map((answer) => ({
        ...answer,
        created: new Date(answer.created),
      }))
    : [],
});
export const getUnansweredQuestions1 = async (): Promise<QuestionData[]> => {
  const result = await http<QuestionDataFromServer[]>({
    path: '/question/all',
  });
  if (result.ok && result.body) {
    return result.body.map(mapQuestionFromServer);
  } else {
    return [];
  }
};

const wait = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const getQuestion = async (questionid: number): Promise<QuestionData | null> => {
  await wait(500);
  const results = questions.filter((q) => q.questionid === questionid);
  return results.length === 0 ? null : results[0];
};

export const searchQuestions = async (criteria: string): Promise<QuestionData[]> => {
  await wait(500);
  return questions.filter(
    (q) =>
      q.title.toLowerCase().indexOf(criteria.toLowerCase()) >= 0 ||
      q.content.toLowerCase().indexOf(criteria.toLowerCase()) >= 0
  );
};

export interface PostQuestionData {
  title: string;
  content: string;
  username: string;
  subject: string;
  created: Date;
}

export const postQuestion = async (
  question: PostQuestionData
): Promise<QuestionData | undefined> => {
  await wait(500);
  const questionid = Math.max(...questions.map((q) => q.questionid)) + 1;
  const newQuestion: QuestionData = {
    ...question,
    questionid,
    answers: [],
  };
  questions.push(newQuestion);
  return newQuestion;
};

export interface PostAnswerData {
  questionid: number;
  content: string;
  username: string;
  created: Date;
}

export const postAnswer = async (answer: PostAnswerData): Promise<AnswerData | undefined> => {
  await wait(500);
  const question = questions.filter((q) => q.questionid === answer.questionid)[0];
  const answerInQuestion: AnswerData = {
    answerid: 99,
    ...answer,
  };
  question.answers.push(answerInQuestion);
  return answerInQuestion;
};
