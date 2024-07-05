import QuizCreate from '@/components/QuizCreate'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
	title: 'Quiz| Brainiac',
}

type Props = {
	searchParams: {
		topic?: string
	}
}

const QuizPage = async ({searchParams}: Props) => {
	const session = await auth()
	if (!session?.user) {
		redirect('/');
	}
	return <QuizCreate topicParam={searchParams.topic ?? ''} />
}

export default QuizPage
