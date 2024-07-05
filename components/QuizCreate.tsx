'use client'

import React, { useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card'
import { useForm } from 'react-hook-form'
import { quizFormSchema } from '@/schema/form/quiz'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { BookOpen, CopyCheck } from 'lucide-react'
import { Separator } from './ui/separator'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import LoadingQuestions from './LoadingQuestions'

type Props = {
	topicParam: string
}

type FormInput = z.infer<typeof quizFormSchema>

const QuizCreate = ({ topicParam}: Props) => {
	const router = useRouter()
	const [showLoader, setShowLoader] = useState(false)
	const [finishedLoading, setFinishedLoading] = useState(false)
	
	const { mutate: getQuestions, isPending } = useMutation({
		mutationFn: async ({ amount, topic, type }: FormInput) => {
			const response = await axios.post('/api/game', {
				amount,
				topic,
				type,
			})
			return response.data
		},
	})

	const form = useForm<FormInput>({
		resolver: zodResolver(quizFormSchema),
		defaultValues: {
			amount: 3,
			topic: topicParam,
			type: 'open_ended',
		},
	})

	function onSubmit(values: FormInput) {
		setShowLoader(true)
		getQuestions(
			{
				amount: values.amount,
				topic: values.topic,
				type: values.type,
			},
			{
				onSuccess: ({ gameId }: { gameId: string }) => {
					setFinishedLoading(true)
					setTimeout(() => {
						if (form.getValues('type') === 'open_ended') {
							router.push(`/play/open-ended/${gameId}`)
						} else {
							router.push(`/play/mcq/${gameId}`)
						}
					}, 1000)
				},
				onError: () => {
					setShowLoader(false)
				},
			}
		)
	}

	form.watch()

	if (showLoader) {
		return <LoadingQuestions finished={finishedLoading} />
	}

	return (
		<div className='absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
			<Card>
				<CardHeader>
					<CardTitle className='font-bold text-2xl'>Create your Quiz</CardTitle>
					<CardDescription>Personalize your Quiz</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-8'>
							<FormField
								control={form.control}
								name='topic'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Topic</FormLabel>
										<FormControl>
											<Input
												placeholder='Select a topic'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Enter a topic for the quiz.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='amount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Number of Questions</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter a number'
												type='number'
												min={1}
												max={10}
												{...field}
												onChange={(e) => {
													form.setValue('amount', parseInt(e.target.value))
												}}
											/>
										</FormControl>
										<FormDescription>
											Enter a topic for the quiz.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='flex justify-between'>
								<Button
									variant={
										form.getValues('type') === 'mcq' ? 'default' : 'secondary'
									}
									className='w-1/2 rounded-none rounded-l-lg'
									onClick={() => {
										form.setValue('type', 'mcq')
									}}
									type='button'>
									<CopyCheck className='w-8 h-8 mr-2' /> Multiple Choice
								</Button>
								<Separator orientation='vertical' />
								<Button
									variant={
										form.getValues('type') === 'open_ended'
											? 'default'
											: 'secondary'
									}
									className='w-1/2 rounded-none rounded-r-lg'
									onClick={() => form.setValue('type', 'open_ended')}
									type='button'>
									<BookOpen className='w-4 h-4 mr-2' /> Open Ended
								</Button>
							</div>

							<Button
								disabled={isPending}
								type='submit'>
								Submit
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}

export default QuizCreate
