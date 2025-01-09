import { SignUpForm } from '@/components/auth/sign-up/sign-up.form';
import React from 'react';

export default function SignUp() {
  return (
    <div className='page-container flex flex-col justify-center items-center'>
      <SignUpForm />
    </div>
  );
}
