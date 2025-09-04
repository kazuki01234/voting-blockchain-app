import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { useEffect, useState } from 'react'

type ResultItem = {
  name: string
  votes: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384']

export default function ResultsChart() {
  const [data, setData] = useState<ResultItem[]>([])
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${BACKEND_URL}/chain/results`)
      const json = await res.json()

      const formatted: ResultItem[] = Object.entries(json).map(([name, votes]) => ({
        name,
        votes: Number(votes),
      }))
      setData(formatted)
    }

    fetchData()
  }, [BACKEND_URL])

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
