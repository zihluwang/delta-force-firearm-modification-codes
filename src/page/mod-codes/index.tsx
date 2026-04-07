import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button, Card, Col, Pagination, Row, Select, Space, Tag, Typography } from "antd"
import { ModificationApi, TagApi } from "@/api"
import { Modification } from "@/types"

const pageSize = 12

export default function ModCodesPage() {
  const [searchParams] = useSearchParams()
  const firearmId = useMemo(() => searchParams.get("firearmId") || undefined, [searchParams])

  const [page, setPage] = useState<number>(1)
  const [modifications, setModifications] = useState<Modification[]>([])
  const [tagOptions, setTagOptions] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const _firearmId = firearmId ? +firearmId : (void 0)
    TagApi.getTags(_firearmId).then((tags) => {
      setTagOptions(tags)
    })
  }, [])

  useEffect(() => {
    ModificationApi.getModifications({
      page: page - 1,
      size: pageSize,
      sortBy: "id",
      direction: "ASC",
      firearmId,
      tags: selectedTags,
    }).then((pagedData) => {
      setModifications(pagedData.items)
      setTotal(pagedData.totalElements)
    })
  }, [page, firearmId, selectedTags])

  useEffect(() => {
    setPage(1)
  }, [firearmId])

  useEffect(() => {
    setPage(1)
  }, [selectedTags])

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Typography.Title level={4} className="mb-0!">
          改枪码列表
        </Typography.Title>
        <Space wrap>
          <span>标签：</span>
          <Select<string[]>
            mode="multiple"
            allowClear
            placeholder="请选择标签"
            className="w-64"
            value={selectedTags}
            options={tagOptions.map((tag) => ({ value: tag, label: tag }))}
            onChange={(values) => {
              setSelectedTags(values)
            }}
          />
          {firearmId && <Tag color="geekblue">武器 ID: {firearmId}</Tag>}
          {(firearmId || selectedTags.length > 0) && (
            <Link to="/mod-codes">
              <Button
                type="link"
                onClick={() => {
                  setSelectedTags([])
                  setPage(1)
                }}
              >
                清除筛选
              </Button>
            </Link>
          )}
        </Space>
      </div>

      <div className="mb-6">
        <Row gutter={[16, 16]}>
          {modifications.map((modification) => (
            <Col key={modification.id} xs={24} md={12} lg={8}>
              <Card
                title={modification.name}
                variant="outlined"
                styles={{
                  header: { minHeight: 56 },
                }}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      <strong>改枪码：</strong>
                      <code className="bg-gray-400 px-2 py-1 rounded text-sm text-white">
                        {modification.code}
                      </code>
                    </span>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => navigator.clipboard.writeText(modification.code)}>
                      复制
                    </Button>
                  </div>

                  <Typography.Text>
                    <strong>作者：</strong>
                    {modification.author || "未知"}
                  </Typography.Text>

                  {modification.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {modification.tags.map((tag) => (
                        <Tag key={`${modification.id}-${tag}`}>{tag}</Tag>
                      ))}
                    </div>
                  )}

                  <Typography.Paragraph
                    style={{ marginBottom: 0 }}
                    type="secondary"
                    ellipsis={{ rows: 3 }}>
                    {modification.note || "暂无备注"}
                  </Typography.Paragraph>

                  {modification.videoUrl && (
                    <div>
                      <a href={modification.videoUrl} target="_blank" rel="noopener noreferrer">
                        查看视频
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}

          {modifications.length === 0 && (
            <Col span={24}>
              <Card>
                <Typography.Text type="secondary">暂无改枪码数据</Typography.Text>
              </Card>
            </Col>
          )}
        </Row>
      </div>

      <div className="flex justify-end">
        <Pagination
          align="end"
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(nextPage) => {
            setPage(nextPage)
          }}
          showSizeChanger={false}
        />
      </div>
    </>
  )
}
