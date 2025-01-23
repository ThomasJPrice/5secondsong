import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import ResultCard from './ResultCard'

const ResultsGrid = ({ results }) => {
  if (results.length === 0) return <div className='text-center mt-2 text-primary font-primary text-xl'>Nothing to see yet!</div>

  return (
    <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {results.map((result) => (
        <div key={result.id} className='flex justify-center'>
          <ResultCard artistInfo={result.artist_details} resultData={result} mode={result.mode} />
        </div>
      ))}
    </div>
  )
}

const UserResults = async ({ userId }) => {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: results } = await supabase.from('results').select().eq('user_id', userId).order('created_at', { ascending: false })

  return (
    <Tabs defaultValue="classic" className='mt-2'>
      <TabsList>
        <TabsTrigger value="classic">Classic</TabsTrigger>
        <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
      </TabsList>
      <TabsContent value="classic">
        <ResultsGrid results={results.filter((value) => value.mode === 'classic')} />
      </TabsContent>
      <TabsContent value="lyrics">
        <ResultsGrid results={results.filter((value) => value.mode === 'lyrics')} />
      </TabsContent>
    </Tabs>
  )
}

export default UserResults