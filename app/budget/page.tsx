import { redirect } from 'next/navigation';
import React from 'react'

export default function page() {
    redirect('/transactions');
  return (
    <div>page</div>
  )
}
