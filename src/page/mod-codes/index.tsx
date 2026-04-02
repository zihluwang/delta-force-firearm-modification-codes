import { useMemo, useState } from "react"
import rawModCodes from "@/data/modification-codes.json"

type ModCodeSource = {
  weapon: string
  "modification-code": string
  mode?: string
  tags?: string[]
  note?: string
}

type ModCode = {
  id: string
  weapon: string
  code: string
  mode?: string
  tags: string[]
  note?: string
}

const MOD_CODES: ModCode[] = (rawModCodes as ModCodeSource[]).map((item, index) => ({
  id: `mod-${index + 1}`,
  weapon: item.weapon,
  code: item["modification-code"],
  mode: item.mode,
  tags: item.tags ?? [],
  note: item.note,
}))

export default function ModCodes() {
  const [keyword, setKeyword] = useState("")
  const [activeTag, setActiveTag] = useState<string>("全部")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copyErrorId, setCopyErrorId] = useState<string | null>(null)

  const handleCopy = async (item: ModCode) => {
    try {
      await navigator.clipboard.writeText(item.code)
      setCopyErrorId(null)
      setCopiedId(item.id)
      window.setTimeout(() => {
        setCopiedId((current) => (current === item.id ? null : current))
      }, 1500)
    } catch {
      setCopiedId(null)
      setCopyErrorId(item.id)
      window.setTimeout(() => {
        setCopyErrorId((current) => (current === item.id ? null : current))
      }, 1500)
    }
  }

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    MOD_CODES.forEach((item) => {
      item.tags.forEach((tag) => tags.add(tag))
    })
    return ["全部", ...Array.from(tags)]
  }, [])

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    return MOD_CODES.filter((item) => {
      const matchTag = activeTag === "全部" || item.tags.includes(activeTag)
      const matchKeyword =
        q.length === 0 ||
        item.weapon.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.mode?.toLowerCase().includes(q) ?? false) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
      return matchTag && matchKeyword
    })
  }, [activeTag, keyword])

  return (
    <section className="space-y-6">
      <div className="space-y-4 px-1">
        <p className="text-sm text-gray-600">
          支持按 tag 与关键字筛选。关键字可匹配枪械名称、改枪码或 tag。
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">关键字查找</span>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="例如：M4、近战、DF-"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setKeyword("")
                setActiveTag("全部")
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              清空筛选
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const selected = tag === activeTag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full px-3 py-1 text-sm border transition ${
                  selected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                #{tag}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <article key={item.id} className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">{item.weapon}</h2>
              {item.mode ? (
                <span className="text-xs rounded-full bg-gray-100 text-gray-700 px-2 py-1">
                  {item.mode}
                </span>
              ) : (
                <span className="text-xs text-gray-500">ID: {item.id}</span>
              )}
            </div>
            <div className="rounded-lg bg-gray-900 text-green-300 px-3 py-2 font-mono text-sm break-all flex items-center justify-between gap-3">
              <span>{item.code}</span>
              <button
                type="button"
                onClick={() => handleCopy(item)}
                className="shrink-0 rounded-md bg-green-400/10 border border-green-400/40 text-green-200 px-2 py-1 text-xs hover:bg-green-400/20"
              >
                {copiedId === item.id ? "已复制" : "复制改枪码"}
              </button>
            </div>
            {copyErrorId === item.id ? (
              <p className="text-xs text-red-600">复制失败，请手动选中复制。</p>
            ) : null}
            {item.note ? <p className="text-sm text-gray-600">{item.note}</p> : null}
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <button
                  key={`${item.id}-${tag}`}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className="text-xs rounded-full bg-blue-50 text-blue-700 px-2 py-1 hover:bg-blue-100"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-center text-gray-600">
          未找到匹配的改枪码，请尝试其他 tag 或关键字。
        </div>
      ) : null}
    </section>
  )
}