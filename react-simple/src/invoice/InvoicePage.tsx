/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  gray3,
  gray6,
  Fieldset,
  FieldContainer,
  FieldLabel,
  FieldTextArea,
  FormButtonContainer,
  PrimaryButton,
  FieldError,
  SubmissionSuccess,
} from './Styles';

import React from 'react';

import { useParams } from 'react-router-dom';
import { getInvoiceData } from './InvoiceData';

import { useForm } from 'react-hook-form';

import { useSelector, useDispatch } from 'react-redux';

import Page from 'src/components/Page';

type FormData = {
  content: string;
};

export default function InvoicePage() {
  return (
    <Page title="Invoice">
      <h2>Invoice</h2>
    </Page>
  );
}
