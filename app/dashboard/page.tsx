import HistoryCard from '@/components/dashboard/HistoryCard';
import HotTopicsCard from '@/components/dashboard/HotTopicsCard';
import QuizCard from '@/components/dashboard/QuizCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

export const metadata = {
  title: "Dashboard | Brainac",
};

const Dashboard = async (props: Props) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }
  return (
    <main className="pt-20 p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
        {/* <DetailsDialog /> */}
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizCard />
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentActivityCard />
      </div>
    </main>
  )
}

export default Dashboard