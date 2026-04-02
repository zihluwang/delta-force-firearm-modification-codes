import { useMemo, useState, useEffect, useLayoutEffect, useRef } from "react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import rawModCodes from "@/data/modification-codes.json"

function useColumnCount() {
  const getCount = () => {
    if (window.innerWidth >= 1024) return 4
    if (window.innerWidth >= 768) return 3
    if (window.innerWidth >= 640) return 2
    return 1
  }
  const [cols, setCols] = useState(getCount)
  useEffect(() => {
    const handler = () => setCols(getCount())
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return cols
}

type ModCodeSource = {
  weapon: string
  "modification-code": string
  mode?: string
  tags?: string[]
  note?: string
  price?: number
}

type ModCode = {
  id: string
  weapon: string
  code: string
  mode?: string
  tags: string[]
  note?: string
  price?: number
}

const MOD_CODES: ModCode[] = (rawModCodes as ModCodeSource[]).map((item, index) => ({
  id: `mod-${index + 1}`,
  weapon: item.weapon,
  code: item["modification-code"],
  mode: item.mode,
  tags: item.tags ?? [],
  note: item.note,
  price: item.price,
}))

export default function ModCodes() {
  const [keyword, setKeyword] = useState("")
  const [activeTag, setActiveTag] = useState<string>("全部")
  const [activeWeapon, setActiveWeapon] = useState<string>("全部")
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

  const allWeapons = useMemo(() => {
    const weapons = new Set<string>()
    MOD_CODES.forEach((item) => weapons.add(item.weapon))
    return ["全部", ...Array.from(weapons)]
  }, [])

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
      const matchWeapon = activeWeapon === "全部" || item.weapon === activeWeapon
      const matchTag = activeTag === "全部" || item.tags.includes(activeTag)
      const matchKeyword =
        q.length === 0 ||
        item.weapon.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.mode?.toLowerCase().includes(q) ?? false) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
      return matchWeapon && matchTag && matchKeyword
    })
  }, [activeWeapon, activeTag, keyword])

  const colCount = useColumnCount()

  const rows = useMemo<ModCode[][]>(() => {
    const result: ModCode[][] = []
    for (let i = 0; i < filtered.length; i += colCount) {
      result.push(filtered.slice(i, i + colCount))
    }
    return result
  }, [filtered, colCount])

  const listRef = useRef<HTMLDivElement>(null)
  const scrollMarginRef = useRef(0)
  useLayoutEffect(() => {
    scrollMarginRef.current = listRef.current?.offsetTop ?? 0
  })

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 220,
    overscan: 3,
    scrollMargin: scrollMarginRef.current,
  })

  return (
    <section className="space-y-6">
      <div className="space-y-4 px-1">
        <p className="text-sm text-gray-600">
          支持按武器、tag 与关键字筛选。关键字可匹配枪械名称、改枪码或 tag。
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">武器筛选</span>
            <select
              value={activeWeapon}
              onChange={(event) => setActiveWeapon(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            >
              {allWeapons.map((weapon) => (
                <option key={weapon} value={weapon}>{weapon}</option>
              ))}
            </select>
          </label>
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
                setActiveWeapon("全部")
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

      <div
        ref={listRef}
        style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
              {rows[virtualRow.index].map((item) => (
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
                  {item.price ? <p className="text-sm text-gray-900 font-medium">$ {item.price.toLocaleString()}</p> : null}
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
          </div>
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