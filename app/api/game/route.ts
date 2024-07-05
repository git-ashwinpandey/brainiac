import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { quizFormSchema } from '@/schema/form/quiz'
import { NextResponse } from 'next/server'
import axios from 'axios'
import { ZodError } from 'zod'

export async function POST(req: Request, res: Response) {
	try {
		const session = await auth()
		
		if (!session) {
			throw new Error('Session is null')
		}
		// if (!session?.user) {
		// 	return NextResponse.json(
		// 		{ error: 'You must be logged in to access this resource' },
		// 		{ status: 401 }
		// 	)
		// }

		const body = await req.json()
		const { topic, type, amount } = quizFormSchema.parse(body)

		const game = await prisma.game.create({
			data: {
				gameType: type,
				timeStarted: new Date(),
				userId: session?.user.id,
				topic: topic,
			},
		})

		await prisma.topic_count.upsert({
			where: {
				topic,
			},
			create: {
				topic,
				count: 1,
			},
			update: {
				count: {
					increment: 1,
				},
			},
		})

		const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
			amount,
			topic,
			type,
		})

		if (type === 'mcq') {
			type mcqQuestion = {
				question: string
				answer: string
				option1: string
				option2: string
				option3: string
			}

			let manyData = data.questions.map((question: mcqQuestion) => {
				let options = [
					question.answer,
					question.option1,
					question.option2,
					question.option3,
				]
				options = options.sort(() => Math.random() - 0.5)
				return {
					question: question.question,
					answer: question.answer,
					options: JSON.stringify(options),
					gameId: game.id,
					questionType: 'mcq',
				}
			})
			await prisma.question.createMany({
				data: manyData,
			})
		} else if (type === 'open_ended') {
			type openQuestion = {
				question: string
				answer: string
			}
			await prisma.question.createMany({
				data: data.questions.map((question: openQuestion) => {
					return {
						question: question.question,
						answer: question.answer,
						gameId: game.id,
						questionType: 'open_ended',
					}
				}),
			})
		}

		return NextResponse.json({ gameId: game.id }, { status: 200 })
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json({ error: error.issues }, { status: 400 })
		} else {
			return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
		}
	}
}
