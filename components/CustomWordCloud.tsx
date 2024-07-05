'use client'

import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import React from 'react'
import D3WordCloud from 'react-d3-cloud'

type Props = {
	formattedTopics: { text: string; value: number }[]
}

const CustomWordCloud = ({ formattedTopics }: Props) => {
	const theme = useTheme()
	const router = useRouter()
	return (
		<>
			<D3WordCloud
				height={550}
				font='Times'
				data={formattedTopics}
				fontSize={(word) => Math.log2(word.value) * 5}
				fontWeight='bold'
				rotate={0}
				padding={10}
				fill={theme.theme == 'dark' ? 'white' : 'black'}
				random={Math.random}
				onWordClick={(e, d) => {
					router.push('/quiz?topic=' + d.text)
				}}
			/>
		</>
	)
}

export default CustomWordCloud
