'use client';
import React, { Suspense } from 'react';
import ResetPassword from './ResetPassword';

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
};

export default ResetPasswordPage;