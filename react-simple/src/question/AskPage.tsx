import React from 'react';
import {
  Fieldset,
  FieldContainer,
  FieldLabel,
  FieldInput,
  FieldTextArea,
  FormButtonContainer,
  PrimaryButton,
  FieldError,
  SubmissionSuccess,
} from './Styles';
import { useForm } from 'react-hook-form';
import { postQuestion } from './QuestionsData';
import Page from 'src/components/Page';

type FormData = {
  title: string;
  content: string;
};

export default function AskPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
  } = useForm<FormData>({
    mode: 'onBlur',
  });
  const [successfullySubmitted, setSuccessfullySubmitted] = React.useState(false);
  const submitForm = async (data: FormData) => {
    const result = await postQuestion({
      title: data.title,
      content: data.content,
      username: 'Fred',
      subject: 'Maths',
      created: new Date(),
    });
    setSuccessfullySubmitted(result ? true : false);
  };

  return (
    <Page title="Ask a question">
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit(submitForm)}>
        <Fieldset disabled={formState.isSubmitting || successfullySubmitted}>
          <FieldContainer>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <FieldInput
              id="title"
              name="title"
              type="text"
              ref={register({
                required: true,
                minLength: 10,
              })}
            />
            {errors.title && errors.title.type === 'required' && (
              <FieldError>You must enter the question title</FieldError>
            )}
            {errors.title && errors.title.type === 'minLength' && (
              <FieldError>The title must be at least 10 characters</FieldError>
            )}
          </FieldContainer>
          <FieldContainer>
            <FieldLabel htmlFor="subject">Subject</FieldLabel>
            <FieldInput
              id="subject"
              name="subject"
              type="text"
              ref={register({
                required: true,
                minLength: 10,
              })}
            />
            {errors.title && errors.title.type === 'required' && (
              <FieldError>You must enter the question subject</FieldError>
            )}
            {errors.title && errors.title.type === 'minLength' && (
              <FieldError>The title must be at least 10 characters</FieldError>
            )}
          </FieldContainer>
          <FieldContainer>
            <FieldLabel htmlFor="content">Content</FieldLabel>
            <FieldTextArea
              id="content"
              name="content"
              ref={register({
                required: true,
                minLength: 50,
              })}
            />
            {errors.content && errors.content.type === 'required' && (
              <FieldError>You must enter the question content</FieldError>
            )}
            {errors.content && errors.content.type === 'minLength' && (
              <FieldError>The content must be at least 50 characters</FieldError>
            )}
          </FieldContainer>
          <FormButtonContainer>
            <PrimaryButton type="submit">Submit Your Question</PrimaryButton>
          </FormButtonContainer>
          {successfullySubmitted && (
            <SubmissionSuccess>Your question was successfully submitted</SubmissionSuccess>
          )}
        </Fieldset>
      </form>
    </Page>
  );
}
