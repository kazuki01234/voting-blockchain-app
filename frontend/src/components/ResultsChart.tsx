'use client'

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { useEffect, useState } from 'react'

type ResultItem = {
  name: string
  votes: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384']

export default function ResultsChart() {
  const [data, setData] = useState<ResultItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:5000/chain/results')
      const json = await res.json()

      // サーバーのレスポンスに応じてデータ整形
      // 例えば { "Alice": 3, "Bob": 5 } → [{ name: "Alice", votes: 3 }, ...]
      const formatted: ResultItem[] = Object.entries(json).map(([name, votes]) => ({
        name,
        votes: Number(votes),
      }))
      setData(formatted)
    }

    fetchData()
  }, [])

  return (
    <div className="flex justify-center items-center w-full">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="votes"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={140}
          fill="#8884d8"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  )
}
