import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { FirearmApi } from "@/api"
import { Firearm, FirearmType } from "@/types"
import { setFirearmsPage } from "@/store/firearms-slice"
import { useAppDispatch, useAppSelector } from "@/store"

const firearmTypeText: Record<FirearmType, string> = {
  RIFLE: "步枪",
  SUB_MACHINE_GUN: "冲锋枪",
  SHOTGUN: "霰弹枪",
  LIGHT_MACHINE_GUN: "轻机枪",
  DESIGNATED_MARKSMAN_RIFLE: "射手步枪",
  SNIPER_RIFLE: "狙击步枪",
  PISTOL: "手枪",
  SPECIAL: "特殊",
}

export default function FirearmsPage() {
  const pageSize = 12
  const dispatch = useAppDispatch()
  const firearmsState = useAppSelector((state) => state.firearms)
  const firearms = firearmsState.items
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [keyword, setKeyword] = useState<string>("")
  const [activeType, setActiveType] = useState<"全部" | FirearmType>("全部")
  const [currentPage, setCurrentPage] = useState<number>(firearmsState.page)

  const fetchFirearms = (page: number, forceRefresh = false) => {
    if (!forceRefresh && firearms.length > 0 && page === firearmsState.page) {
      setIsLoading(false)
      setLoadError(null)
      return
    }

    setIsLoading(true)
    setLoadError(null)

    if (forceRefresh) {
      setIsRefreshing(true)
    }

    FirearmApi.getFirearms({
      page,
      size: pageSize,
      sortBy: "name",
      direction: "ASC",
    })
      .then((page) => {
        dispatch(setFirearmsPage(page))
      })
      .catch(() => {
        setLoadError("武器列表加载失败，请确认后端服务是否已启动。")
      })
      .finally(() => {
        setIsLoading(false)
        setIsRefreshing(false)
      })
  }

  useEffect(() => {
    fetchFirearms(currentPage, false)
  }, [currentPage, dispatch])

  useEffect(() => {
    if (firearmsState.page !== currentPage) {
      setCurrentPage(firearmsState.page)
    }
  }, [currentPage, firearmsState.page])

  const filteredFirearms = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase()
    return firearms.filter((item) => {
      const matchKeyword = !trimmed || item.name.toLowerCase().includes(trimmed)
      const matchType = activeType === "全部" || item.type === activeType
      return matchKeyword && matchType
    })
  }, [activeType, firearms, keyword])

  return (
    <section className="space-y-6">
      <div className="space-y-4 px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600">先选择武器，再进入该武器的改枪码列表。</p>
          <button
            type="button"
              onClick={() => fetchFirearms(currentPage, true)}
            disabled={isRefreshing}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRefreshing ? "刷新中..." : "强制刷新"}
          </button>
        </div>
        {isLoading ? <p className="text-sm text-gray-500">正在加载武器列表...</p> : null}
        {loadError ? <p className="text-sm text-red-600">{loadError}</p> : null}

        <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">按武器名称搜索</span>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="例如：M4A1"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">武器类别</span>
            <select
              value={activeType}
              onChange={(event) => setActiveType(event.target.value as "全部" | FirearmType)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="全部">全部</option>
              {Object.entries(firearmTypeText).map(([type, text]) => (
                <option key={type} value={type}>{text}</option>
              ))}
            </select>
          </label>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFirearms.map((item) => (
          <article key={item.id} className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
              <span className="text-xs rounded-full bg-gray-100 text-gray-700 px-2 py-1">
                {firearmTypeText[item.type]}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              {item.level ? (
                <span className="rounded-full bg-gray-100 px-2 py-1">{item.level}</span>
              ) : null}
            </div>

            {item.review ? (
              <p className="text-sm text-gray-600 whitespace-pre-line">{item.review}</p>
            ) : null}

            <Link
              to={`/mod-codes?firearmId=${encodeURIComponent(item.id)}`}
              className="inline-flex items-center justify-center rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
              查看改枪码
            </Link>
          </article>
        ))}
      </div>

      {!isLoading && filteredFirearms.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-center text-gray-600">
          未找到匹配的武器，请尝试其他关键字或类别。
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
        <p className="text-sm text-gray-600">
          第 {firearmsState.page + 1} / {Math.max(firearmsState.totalPages, 1)} 页，共 {firearmsState.totalElements} 条
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isLoading || currentPage <= 0}
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            上一页
          </button>
          <button
            type="button"
            disabled={isLoading || firearmsState.totalPages === 0 || currentPage >= firearmsState.totalPages - 1}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            下一页
          </button>
        </div>
      </div>
    </section>
  )
}
