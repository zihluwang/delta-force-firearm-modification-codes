import { useEffect, useState } from "react"
import { FirearmApi } from "@/api"
import { Firearm, FirearmType } from "@/types"
import { Card, Col, Pagination, Row, Select, Tag, Typography } from "antd"

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

const allTypeValue = "ALL"
type FirearmTypeFilter = FirearmType | typeof allTypeValue

export default function FirearmsPage() {
  const [page, setPage] = useState<number>(1)
  const [typeFilter, setTypeFilter] = useState<FirearmTypeFilter>(allTypeValue)
  const [firearms, setFirearms] = useState<Firearm[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    FirearmApi.getFirearms({
      page: page - 1,
      size: 12,
      sortBy: "id",
      direction: "ASC",
      type: typeFilter === allTypeValue ? undefined : typeFilter,
    }).then((pagedData) => {
      setFirearms(pagedData.items)
      setTotal(pagedData.totalElements)
    })
  }, [page, typeFilter])

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Select<FirearmTypeFilter>
          className="w-full sm:w-64"
          value={typeFilter}
          options={[
            { value: allTypeValue, label: "全部类型" },
            ...Object.entries(firearmTypeText).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
          onChange={(nextType) => {
            setPage(1)
            setTypeFilter(nextType)
          }}
        />
      </div>
      <div className="mb-6">
        <Row gutter={[16, 16]}>
          {firearms.map((firearm) => (
            <Col key={firearm.id} xs={24} md={12} lg={8}>
              <Card
                title={firearm.name}
                variant="outlined"
                styles={{
                  header: { minHeight: 56 },
                }}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Tag color="blue">{firearmTypeText[firearm.type]}</Tag>
                  </div>
                  <Typography.Text>
                    <strong>武器输出等级：</strong>
                    {firearm.level}
                  </Typography.Text>
                  <Typography.Paragraph style={{ marginBottom: 0 }} type="secondary" ellipsis={{ rows: 3 }}>
                    {firearm.review || "暂无描述"}
                  </Typography.Paragraph>
                </div>
              </Card>
            </Col>
          ))}
          {firearms.length === 0 && (
            <Col span={24}>
              <Card>
                <Typography.Text type="secondary">暂无武器数据</Typography.Text>
              </Card>
            </Col>
          )}
        </Row>
      </div>
      <div className="flex justify-end">
        <Pagination
          align="end"
          current={page}
          pageSize={12}
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
