import { strict_output } from '@/lib/gemini'
import { quizFormSchema } from '@/schema/form/quiz'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

//POST api/questions
export const POST = async (req: Request, res: Response) => {
	try {
		console.log('POST request received')
		const body = await req.json()
		console.log('Body received: ', body)
		const { amount, topic, type } = quizFormSchema.parse(body)

		console.log('Parsed body: ', { amount, topic, type })

		let questions: any
		if (type === 'open_ended') {
			questions = await strict_output(
				'You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array with proper quote and key valuie format',
				new Array(amount).fill(
					`You are to generate a random hard open-ended questions about ${topic}`
				),
				{
					question: 'this is the gererated question',
					answer: 'answer with max length of about 15 words',
				}
			)
		} else if (type === 'mcq') {
			questions = await strict_output(
				'You are a helpful AI that is able to generate mcq questions and answers, questions should be unique and not asked recently and the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array with proper quote and key valuie format',
				new Array(amount).fill(
					`You are to generate a random hard mcq question about ${topic}`
				),
				{
					question: 'question',
					answer: 'answer with max length of 15 words',
					option1: 'option1 with max length of 15 words',
					option2: 'option2 with max length of 15 words',
					option3: 'option3 with max length of 15 words',
				}
			)
		}
		return NextResponse.json(
			{ questions },
			{
				status: 200,
			}
		)
	} catch (error) {
		console.log('Error occurred: ', error)
		if (error instanceof ZodError) {
			console.log('Error is a ZodError')
			return NextResponse.json(error.issues, { status: 400 })
		}
	}
}
