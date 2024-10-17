'use client'

import { log } from 'console'
import { useState, useEffect } from 'react'

class GetKBRsp {
  code!: number
  msg!: string
  kbs!: string[]
}

class GetDBRsp {
  code!: number
  msg!: string
  dbs!: string[]
}

export default function Page() {
  const [kbs, setKBs] = useState<string[]>([])  // KB 列表
  const [dbs, setDBs] = useState<string[]>([])  // DB 列表
  const [selectedKB, setSelectedKB] = useState(''); // 所选 KB
  const [selectedDB, setSelectedDB] = useState(''); // 所选 KB

  useEffect(() => {
    async function fetchKBs() {
      try {
        let res = await fetch('http://localhost:8080/api/kb', {
          method: 'GET'
        })

        if (res.ok) {
          let data: GetKBRsp = await res.json()
          setKBs(data.kbs)
        } else {
          console.error('Failed to fetch posts.')
        }
      } catch (error) {
        console.error('Error fetching kbs:', error)
      }
    }
    fetchKBs()
  }, [])

  async function fetchDBs() {
    try {
      let res = await fetch('http://localhost:8080/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          kb: selectedKB,
        })
      })

      if (res.ok) {
        let data: GetDBRsp = await res.json()
        setDBs(data.dbs)
      } else {
        console.error('Failed to fetch posts.')
      }
    } catch (error) {
      console.error('Error fetching dbs:', error)
    }
  }

  function handleSelectKB(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedKB(event.target.value)
    fetchDBs()
  }

  function handleSelectDB(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedDB(event.target.value)
  }

  return (
    <div className="flex">
      <div className="w-full h-full flex flex-col mx-10 my-10 gap-10">
        <div className="w-full flex flex-row gap-2">

          <div className="w-full flex flex-col">
            <label className="inline-block whitespace-nowrap">
              KB 知识库
            </label>
            <div>
              {kbs.length === 0 ?
                <select className="w-full h-10" disabled>
                  无
                </select>
                :
                <select className="w-full h-10" onChange={handleSelectKB}>
                  {kbs.map((kb: string) => (
                    <option className="" key={kb} value={kb}>
                      {kb}
                    </option>
                  ))}
                </select>
              }
            </div>
          </div>

          <div className="w-fit flex flex-col">
            <label className="inline-block whitespace-nowrap">
              操作
            </label>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="inline-block whitespace-nowrap">
            DB 数据库
          </label>
          {dbs.length === 0 ?
            <select className="w-full h-10" disabled>
              <option>无可用 DB</option>
            </select>
            :
            <select className="w-full h-10" onChange={handleSelectDB}>
              {dbs.map((db: string) => (
                <option className="" key={db} value={db}>
                  {db}
                </option>
              ))}
            </select>
          }
        </div>
      </div>
    </div >
  );
}
