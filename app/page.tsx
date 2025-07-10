import { promises as fs } from "fs"
import path from "path"
import Dashboard from "@/components/Dashboard"

async function getData() {
  const filePath = path.join(process.cwd(), "data.json")
  const fileContents = await fs.readFile(filePath, "utf8")
  return JSON.parse(fileContents)
}

export default async function Home() {
  const data = await getData()

  return (
    <main className="min-h-screen bg-gray-50">
      <Dashboard data={data} />
    </main>
  )
}
